use std::error::Error;

use actix_files::NamedFile;
use actix_web::{get, http::header::ContentType, HttpRequest, HttpResponse};

use crate::{components::topbar_option_from_req, functions::from_res, CREATE_ACC, CSP_BASE};

#[get("/account")]
pub async fn account(req: HttpRequest) -> HttpResponse {
    from_res(account_task(&req).await, &req).await
}

async fn account_task(req: &HttpRequest) -> Result<HttpResponse, Box<dyn Error>> {
    let (topbar, acc) = match topbar_option_from_req(req).await? {
        Ok(Some(stuff)) => stuff,
        Ok(None) => {
            return Ok(NamedFile::open_async(CREATE_ACC.get().unwrap())
                .await?
                .into_response(req))
        }
        Err(res) => return Ok(res),
    };

    let email = html_escape::encode_safe(&acc.email);
    let verified = if acc.verified {
        r#"
            <div id="unverified" class="verification hide">
              <img src="/static/icons/unverified.svg" />
              <span>Your account is not verified</span>
              <button id="resend" class="ghbutton">
                <img src="/static/icons/refresh.svg" /> Resend verification
              </button>
            </div>
            <div id="verified" class="verification">
              <img src="/static/icons/verified.svg" />
              <span>Your account is verified</span>
              <button class="ghbutton not-allowed" disabled>
                <img src="/static/icons/refresh.svg" />
                Resend verification
              </button>
            </div>"#
    } else {
        r#"
            <div id="unverified" class="verification">
              <img src="/static/icons/unverified.svg" />
              <span>Your account is not verified</span>
              <button id="resend" class="ghbutton">
                <img src="/static/icons/refresh.svg" /> Resend verification
              </button>
            </div>
            <div id="verified" class="verification hide">
              <img src="/static/icons/verified.svg" />
              <span>Your account is verified</span>
              <button class="ghbutton not-allowed" disabled>
                <img src="/static/icons/refresh.svg" />
                Resend verification
              </button>
            </div>"#
    };

    let html = format!(
        r#"<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/settings.css" />
    <link rel="stylesheet" href="/static/css/saccount.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/settings.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/saccount.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>Account - Settings</title>
  </head>
  <body>
    <dialog id="confirmd">
      <div class="x">&#x2715;</div>
      <h2>Are you sure?</h2>
      <center><img src="/static/icons/warn.svg" height="50px" /></center>
      <p>
        You are about to perform an irreversible action, are you sure that's
        what you want?
      </p>
      <center>
        <button id="confirm" class="ghbutton dangerbut">
          Yes, bring it on!
        </button>
      </center>
    </dialog>
    <dialog id="sudod">
      <div class="x">&#x2715;</div>
      <h2>Superuser mode</h2>
      <center><img src="/static/icons/lock.svg" height="50px" /></center>
      <p>
        You are about to enter superuser mode, you will not be prompted again
        this session.
      </p>
      <center>
        <input type="password" id="su" />
        <button id="pwset" class="ghbutton">Enter</button>
      </center>
    </dialog>
    {topbar}
    <div id="bottom">
      <div id="pages">
        <div><img src="/static/icons/user.svg" /><a href="/settings/profile">Public profile</a></div>
        <div class="selected"><img src="/static/icons/settings.svg" />Account</div>
      </div>
      <div id="containers">
        <div class="container">
          <center>{verified}</center>
          <br />

          <label>Email</label>
          <input type="text" id="email" value="{email}" /><img
            class="save"
            field="email"
            src="/static/icons/save.svg"
          />
        </div>
        <div class="container">
          <h2>Security</h2>
          <label>Change password</label>
          <input type="password" id="pw1" value="" />
          <label>Retype password</label>
          <input type="password" id="pw2" value="" /><img
            class="save"
            src="/static/icons/save.svg"
            field="password"
          />
          <button id="regen" class="ghbutton warnbut">Regenerate token</button>
          <sub>This will invalidate all other sessions.</sub>
          <button id="logout" class="ghbutton">Logout</button>
        </div>
        <div class="container">
          <h2>Danger zone</h2>
          <button id="delete" class="ghbutton dangerbut">Delete account</button>
          <sub>All data will be lost.</sub>
        </div>
      </div>
    </div>
    <div id="backdrop" style="display: none"></div>
  </body>
  <script src="/static/scripts/settings.js"></script>
  <script src="/static/scripts/saccount.js"></script>
</html>"#
    );
    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", CSP_BASE.get().unwrap().as_str()))
        .body(html))
}
