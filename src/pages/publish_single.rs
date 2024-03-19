use actix_files::NamedFile;
use actix_web::{get, http::header::ContentType, web::Path, HttpRequest, HttpResponse};
use goodmorning_services::{
    functions::get_usersys_dir,
    structs::{Account, GMServices},
    traits::CollectionItem,
    ACCOUNTS, MIME_DB,
};
use std::{borrow::Cow, error::Error, path::PathBuf};
use tokio::fs;

use crate::{
    components::{self, topbar_from_req},
    functions::{gen_nonce, get_tex_userpublishes, internalserver_error},
    structs::TexPublish,
    CSP_BASE, NOT_FOUND,
};

#[get("/publish/{id}/{publish_id}")]
pub async fn publish_single(path: Path<(i64, i64)>, req: HttpRequest) -> HttpResponse {
    match publish_single_task(path, req).await {
        Ok(res) => res,
        Err(e) => internalserver_error(e),
    }
}

async fn publish_single_task(
    path: Path<(i64, i64)>,
    req: HttpRequest,
) -> Result<HttpResponse, Box<dyn Error>> {
    let (topbar, account) = match topbar_from_req(&req).await? {
        Ok(stuff) => stuff,
        Err(res) => return Ok(res),
    };

    let (userid, publishid) = path.into_inner();

    let account = if account.as_ref().is_some_and(|account| account.id == userid) {
        account.unwrap()
    } else {
        match Account::find_by_id(userid, ACCOUNTS.get().unwrap()).await? {
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

    let publish = match TexPublish::find_by_id(publishid, &get_tex_userpublishes(userid)).await? {
        Some(publish) => publish,
        None => todo!("publish not found sceen not implemented"),
    };

    let mut csp_heaher = Cow::from(CSP_BASE.get().unwrap());

    let userpath = PathBuf::from("publishes").join(format!("{publishid}.{}", publish.ext));
    let pathbuf = get_usersys_dir(userid, Some(GMServices::Tex)).join(&userpath);

    let url = format!("/api/publish/v1/published-file/id/{}/{}", userid, publishid);

    let mimes = MIME_DB
        .get()
        .unwrap()
        .get_mime_types_from_file_name(pathbuf.file_name().unwrap().to_str().unwrap());

    let mime = match mimes.first() {
        Some(mime) => mime.clone(),
        None => mime::TEXT_PLAIN,
    };

    let mut is_text = false;

    let (display, css, source) = match publish.ext.as_str() {
        "html" => {
            is_text = true;
            components::html(&pathbuf, userpath.to_string_lossy().as_ref()).await?
        }
        _ => match (mime.type_(), mime.subtype()) {
            (mime::IMAGE, _) => (
                components::img(&url),
                "<link rel=\"stylesheet\" href=\"/static/css/img.css\" />",
                None,
            ),
            (mime::AUDIO, _) => (
                components::audio(&url),
                "<link rel=\"stylesheet\" href=\"/static/css/audio.css\" />",
                None,
            ),
            (mime::VIDEO, _) => (
                components::video(&url),
                "<link rel=\"stylesheet\" href=\"/static/css/video.css\" />",
                None,
            ),
            (_, mime::PDF) => {
                let nonce = gen_nonce();
                csp_heaher = format!("{} 'nonce-{nonce}'", CSP_BASE.get().unwrap()).into();
                (
                    components::pdf(&url, &nonce),
                    r#"<link rel="stylesheet" href="/static/scripts/pdfjs/web/viewer.css" />
                <link rel="stylesheet" href="/static/css/pdf.css" />"#,
                    fs::try_exists(pathbuf.with_extension("tex"))
                        .await?
                        .then(|| {
                            PathBuf::from(&userpath)
                                .with_extension("tex")
                                .to_string_lossy()
                                .to_string()
                        }),
                )
            }
            (mime::TEXT, _) | (mime::APPLICATION, _) => {
                is_text = true;
                components::text(&pathbuf).await?
            }
            _ => todo!("{mimes:?}"),
        },
    };

    let html = format!(
        r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {css}
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/publish.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    {}
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>Home - GM Tex</title>
  </head>
  <body>
    {topbar}
    <main>
      <div id="info">
        <h1 id="title">Chemistry Openstax 1e</h1>
        <img
          src="/api/generic/v1/pfp/id/15"
          width="50"
          height="50"
          id="author-pfp"
        />
        <div id="meta">
          <a id="author-name" href="/user/15" class="linklike">Siriusmart</a>
          <span id="time">Published 2 days ago</span>
        </div>
        <p id="desc">
          Concise notes for Openstax 1e textbook available on Libretexts
        </p>
        <hr />
      </div>
      <div id="display">
          {display}
          <br />
      </div>
    </main>
  </body>
</html>"#,
        if mime.type_() == mime::TEXT {
            r#"<link rel="stylesheet" href="/static/css/textpreview.css" />"#
        } else {
            ""
        }
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", csp_heaher.as_ref()))
        .body(html))
}
