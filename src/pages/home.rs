use crate::{
    components::*, functions::internalserver_error, BEEN_LOGGEDOUT, CSP_BASE, FINISH_SETUP,
};
use actix_files::NamedFile;
use actix_web::{get, http::header::ContentType, HttpRequest, HttpResponse};
use goodmorning_services::{
    functions::*,
    structs::{Account, GMServices},
};

#[get("/")]
async fn home(req: HttpRequest) -> HttpResponse {
    let token_cookie = req.cookie("token");
    let token = cookie_to_str(&token_cookie);

    if token.is_none() {
        return HttpResponse::Ok()
            .content_type(ContentType::html())
            .insert_header(("Content-Security-Policy", "default-src 'self';"))
            .body(format!(
                r#"<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link rel="shortcut icon" href="/static/images/favicon-dark.svg" type="image/x-icon" />
    <title>Home - GoodMorning Tex</title>
  </head>
  <body>
  {}
  </body>
</html>"#,
                TOPBAR_LOGGEDOUT
            ));
    }

    let account = match Account::find_by_token(token.unwrap()).await {
        Ok(Some(account)) => account,
        Ok(None) => {
            return match NamedFile::open_async(BEEN_LOGGEDOUT.get().unwrap()).await {
                Ok(file) => file.into_response(&req),
                Err(e) => internalserver_error(e.into()),
            }
        }
        Err(e) => {
            return internalserver_error(e.into());
        }
    };

    if !account.services.contains(&GMServices::Tex) {
        return match NamedFile::open_async(FINISH_SETUP.get().unwrap()).await {
            Ok(file) => file.into_response(&req),
            Err(e) => internalserver_error(e.into()),
        };
    }

    let renderer = yew::ServerRenderer::<TopbarLoggedin>::with_props(move || TopbarLoggedinProps {
        id: account.id,
    });

    HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", CSP_BASE.get().unwrap().as_str()))
        .body(format!(
            r#"<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link rel="shortcut icon" href="/static/images/favicon-dark.svg" type="image/x-icon" />
    <title>Home - GoodMorning Tex</title>
  </head>
  <body>
  {}
  </body>
</html>"#,
            renderer.render().await
        ))
}
