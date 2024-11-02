use std::error::Error;

use actix_files::NamedFile;
use actix_web::http::header::ContentType;
use actix_web::web::Path;
use actix_web::{get, HttpRequest, HttpResponse};
use goodmorning_services::functions::to_profile_acccount;
use goodmorning_services::structs::Account;
use goodmorning_services::traits::CollectionItem;
use goodmorning_services::ACCOUNTS;

use crate::components::{topbar_from_req, ProfileInfo, ProfileInfoProp};
use crate::functions::internalserver_error;
use crate::structs::TexProfile;
use crate::{CSP_BASE, NOT_FOUND};

#[get("/user/{id}")]
pub async fn profile(path: Path<i64>, req: HttpRequest) -> HttpResponse {
    match profile_task(path, req).await {
        Ok(res) => res,
        Err(e) => internalserver_error(e),
    }
}

async fn profile_task(id: Path<i64>, req: HttpRequest) -> Result<HttpResponse, Box<dyn Error>> {
    let (topbar, account) = match topbar_from_req(&req).await? {
        Ok(stuff) => stuff,
        Err(res) => return Ok(res),
    };

    let (account, is_owner) = if let Some(account) = account
        && account.id == *id
    {
        (account, true)
    } else {
        match Account::find_by_id(*id, ACCOUNTS.get().unwrap()).await? {
            Some(account) => (account, false),
            None => {
                return Ok(NamedFile::open_async(NOT_FOUND.get().unwrap())
                    .await?
                    .into_response(&req))
            }
        }
    };

    if !account.services.contains(
        &goodmorning_services::structs::GMServices::Tex
            .as_str()
            .to_string(),
    ) {
        return Ok(NamedFile::open_async(NOT_FOUND.get().unwrap())
            .await?
            .into_response(&req));
    }
    let username_safe = html_escape::encode_safe(&account.username).to_string();

    let pf = TexProfile::find_default(account.id).await?.profile;
    let pf = yew::ServerRenderer::<ProfileInfo>::with_props(move || ProfileInfoProp {
        account: to_profile_acccount(account),
        profile: pf,
        is_owner,
    })
    .render()
    .await;

    let html = format!(
        r#"<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/profile.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/profile.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <script src="/static/scripts/remindverify.js" defer></script>
    <title>{username_safe} - GM Tex</title>
  </head>
  <body>
    {topbar}
    {pf}
    <div class="container" id="places">
      <h2>Places</h2>
      <ul>
        <li><a class="linklike" href="/fs/{id}">User file system</a></li>
        <li><a class="linklike" href="/publish/{id}">User publishes</a></li>
      </ul>
    </div>
  </body>
</html>
"#
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", CSP_BASE.get().unwrap().as_str()))
        .body(html))
}
