use std::error::Error;

use actix_files::NamedFile;
use actix_web::http::header::ContentType;
use actix_web::web::Path;
use actix_web::{get, HttpRequest, HttpResponse};
use goodmorning_services::functions::{read_profile, to_profile_acccount};
use goodmorning_services::structs::Account;
use goodmorning_services::traits::CollectionItem;
use goodmorning_services::ACCOUNTS;

use crate::components::{
    ProfileInfo, ProfileInfoProp, TopbarLoggedin, TopbarLoggedinProps, TOPBAR_LOGGEDOUT,
};
use crate::functions::internalserver_error;

#[get("/user/{id}")]
pub async fn profile(path: Path<i64>, req: HttpRequest) -> HttpResponse {
    match profile_task(path, req).await {
        Ok(res) => res,
        Err(e) => internalserver_error(e),
    }
}

async fn profile_task(id: Path<i64>, req: HttpRequest) -> Result<HttpResponse, Box<dyn Error>> {
    let token = req.cookie("token");

    let topbar = match token {
        Some(token) => {
            let account =
                match Account::find_by_token(token.value(), ACCOUNTS.get().unwrap()).await? {
                    Some(account) => account,
                    None => {
                        return Ok(NamedFile::open_async("static/htmls/been-loggedout.html")
                            .await?
                            .into_response(&req))
                    }
                };
            yew::ServerRenderer::<TopbarLoggedin>::with_props(move || TopbarLoggedinProps {
                id: account.id,
            })
            .render()
            .await
        }
        None => TOPBAR_LOGGEDOUT.to_string(),
    };

    let account = match Account::find_by_id(*id, ACCOUNTS.get().unwrap()).await? {
        Some(account) => account,
        None => {
            return Ok(NamedFile::open_async("static/htmls/notfound.html")
                .await?
                .into_response(&req))
        }
    };

    if !account
        .services
        .contains(&goodmorning_services::structs::GMServices::Tex)
    {
        return Ok(NamedFile::open_async("static/htmls/notfound.html")
            .await?
            .into_response(&req));
    }
    let pf = read_profile(account.id, "tex").await?;
    let pf = yew::ServerRenderer::<ProfileInfo>::with_props(move || ProfileInfoProp {
        account: to_profile_acccount(account),
        profile: pf,
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
    <title>User profile - GoodMorning Tex</title>
  </head>
  <body>
    {topbar}
    {pf}
  </body>
</html>
"#
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", "default-src 'self';"))
        .body(html))
}
