use std::error::Error;

use actix_web::HttpResponse;
use log::*;

pub fn internalserver_error(e: Box<dyn Error>) -> HttpResponse {
    error!("{e}");
    let body = format!(
        r#"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/login-ask-logout.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/login-ask-logout.css" />
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>Something went wrong</title>
  </head>
  <body>
    <center>
      <a href="/">
        <img src="/static/images/icon-dark.svg" alt="" width="100" id="icon" />
      </a>
      <br />
      I think the server broke,
      <br />
      don't worry it's not your fault.
      <br />
      <code>{}</code>
    </center>
  </body>
</html>"#,
        e
    );
    HttpResponse::InternalServerError().body(body)
}

#[macro_export]
macro_rules! intererr {
    ($res: expr) => {
        match $res {
            Ok(r) => r,
            Err(e) => return $crate::functions::internalserver_error(e.into()),
        }
    };
}
