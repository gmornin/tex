use crate::{components::*, functions::internalserver_error};
use actix_files::NamedFile;
use actix_web::{get, HttpRequest, HttpResponse};
use goodmorning_services::{functions::*, structs::Account, DATABASE};

#[get("/")]
async fn home(req: HttpRequest) -> HttpResponse {
    let token_cookie = req.cookie("token");
    let token = cookie_to_str(&token_cookie);

    if token.is_none() {
        return HttpResponse::Ok().body(format!(
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

    let _account = match Account::find_by_token(
        token.unwrap(),
        &get_accounts(DATABASE.get().unwrap()),
    )
    .await
    {
        Ok(Some(account)) => account,
        Ok(None) => {
            return match NamedFile::open_async("static/htmls/been-loggedout.html").await {
                Ok(file) => file.into_response(&req),
                Err(e) => internalserver_error(e.into()),
            }
        }
        Err(e) => {
            return internalserver_error(e.into());
        }
    };

    todo!()
}
