use actix_web::{get, HttpRequest, HttpResponse};
use goodmorning_services::functions::*;
use crate::components::*;

#[get("/")]
async fn home(req: HttpRequest) -> HttpResponse {
    let token_cookie = req.cookie("token");
    let token = cookie_to_str(&token_cookie);

    // if token.is_none() {
        return HttpResponse::Ok().body(format!(r#"<!DOCTYPE html>
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
</html>"#, TOPBAR_LOGGEDOUT));
    // }

    todo!()
}
