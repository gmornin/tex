use std::error::Error;

use actix_files::NamedFile;
use actix_web::http::header::{ContentType, HeaderValue, LOCATION};
use actix_web::web::{Path, Query};
use actix_web::{get, HttpRequest, HttpResponse};
use goodmorning_services::structs::Account;
use goodmorning_services::traits::CollectionItem;
use goodmorning_services::ACCOUNTS;
use serde::Deserialize;

use crate::components::{topbar_from_req, PublishesInfo, PublishesInfoProp};
use crate::functions::internalserver_error;
use crate::structs::TexPublish;
use crate::{CSP_BASE, NOT_FOUND};

#[derive(Deserialize)]
struct Params {
    pub size: Option<u32>,
    pub page: Option<u32>,
}

#[get("/publish/{id}")]
pub async fn publish(path: Path<i64>, params: Query<Params>, req: HttpRequest) -> HttpResponse {
    match publish_task(path, params, req).await {
        Ok(res) => res,
        Err(e) => internalserver_error(e),
    }
}

async fn publish_task(
    id: Path<i64>,
    params: Query<Params>,
    req: HttpRequest,
) -> Result<HttpResponse, Box<dyn Error>> {
    let (topbar, account) = match topbar_from_req(&req).await? {
        Ok(stuff) => stuff,
        Err(res) => return Ok(res),
    };

    let account = if account.as_ref().is_some_and(|account| account.id == *id) {
        account.unwrap()
    } else {
        match Account::find_by_id(*id, ACCOUNTS.get().unwrap()).await? {
            Some(account) => account,
            None => {
                return Ok(NamedFile::open_async(NOT_FOUND.get().unwrap())
                    .await?
                    .into_response(&req))
            }
        }
    };

    if !account
        .services
        .contains(&goodmorning_services::structs::GMServices::Tex)
    {
        return Ok(NamedFile::open_async(NOT_FOUND.get().unwrap())
            .await?
            .into_response(&req));
    }

    let size = params.size.unwrap_or(10).min(50).max(1) as u64;
    let page = params.page.unwrap_or(1) as u64;
    let total = TexPublish::total(account.id).await?;
    let max_page = (total as f32 / size as f32).ceil() as u64;

    let name = html_escape::encode_text(&account.username);

    if max_page == 0 {
        let html = format!(
            r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/publishes.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/dark/publishes.css" />
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>{name}'s publishes</title>
  </head>
  <body>
    {topbar}
    <main>
      <center>
        <a href="/user/{id}">
          <img
            src="/api/generic/v1/pfp/id/{id}"
            id="pfp"
            width="60"
            height="60"
          />
        </a>
        <h1>{name}'s publishes</h1>
        <p>{name} has not published anything yet.</p>
      </center>
    </main>
  </body>
</html>"#
        );

        return Ok(HttpResponse::Ok()
            .content_type(ContentType::html())
            .insert_header(("Content-Security-Policy", CSP_BASE.get().unwrap().as_str()))
            .body(html));
    }

    let (items, continuation) =
        TexPublish::list_prop(account.id, page, std::cmp::min(size, 50)).await?;

    if items.is_empty() {
        return Ok(HttpResponse::TemporaryRedirect()
            .append_header((
                LOCATION,
                HeaderValue::from_str(&format!(
                    "/publish/{}?page={max_page}&size={size}",
                    account.id,
                ))?,
            ))
            .await?);
    }

    let list =
        yew::ServerRenderer::<PublishesInfo>::with_props(move || PublishesInfoProp { items })
            .render()
            .await;

    let id = account.id;

    let url_gen =
        |page: u64| -> String { format!("/publish/{}?page={page}&size={size}", account.id) };

    let flipper = format!(
        r#"<center class="page-flipper">
    <a href="{}" style="opacity: 0.3">{}</a>
    <a href="{}" style="opacity: 0.6">{}</a>
    <a href="{}" style="opacity: 0.9">{}</a>
    <span style="opacity: 1" id="selected">{}</span>
    <a href="{}" style="opacity: 0.9">{}</a>
    <a href="{}" style="opacity: 0.6">{}</a>
    <a href="{}" style="opacity: 0.3">{}</a>
</center>"#,
        url_gen(page.saturating_sub(3)),
        if page > 3 {
            (page - 3).to_string()
        } else {
            String::new()
        },
        url_gen(page.saturating_sub(2)),
        if page > 2 {
            (page - 2).to_string()
        } else {
            String::new()
        },
        url_gen(page.saturating_sub(1)),
        if page > 1 {
            (page - 1).to_string()
        } else {
            String::new()
        },
        page,
        url_gen(page + 1),
        if continuation && max_page > page {
            (page + 1).to_string()
        } else {
            String::new()
        },
        url_gen(page + 2),
        if continuation && max_page > page + 1 {
            (page + 2).to_string()
        } else {
            String::new()
        },
        url_gen(page + 3),
        if continuation && max_page > page + 2 {
            (page + 3).to_string()
        } else {
            String::new()
        },
    );

    let html = format!(
        r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/publishes.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/dark/publishes.css" />
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>{name}'s publishes</title>
  </head>
  <body>
    {topbar}
    <main>
      <center>
        <a href="/user/{id}">
          <img
            src="/api/generic/v1/pfp/id/{id}"
            id="pfp"
            width="60"
            height="60"
          />
        </a>
        <h1>{name}'s publishes</h1>
      </center>
      {list}
      {flipper}
    </main>
  </body>
</html>"#
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", CSP_BASE.get().unwrap().as_str()))
        .body(html))
}
