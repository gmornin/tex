use std::{borrow::Cow, error::Error, ffi::OsStr, path::PathBuf};

use actix_files::NamedFile;
use actix_web::{
    get,
    http::header::{ContentDisposition, ContentType, HeaderValue},
    web::Path,
    HttpRequest, HttpResponse,
};
use goodmorning_services::bindings::services::v1::V1Error;
use goodmorning_services::{
    functions::{dir_items, get_user_dir},
    structs::{Account, GMServices, ItemVisibility, Visibilities},
    traits::CollectionItem,
    ACCOUNTS, MIME_DB,
};
use tokio::fs;

use crate::{
    components::{
        self, html_friendly_mime, topbar_from_req, FsItem, FsItemProp, Img, ImgProp, PathProp,
    },
    functions::{from_res, gen_nonce, get_file},
    intererr, CSP_BASE, IMG_NOT_FOUND, NOT_FOUND,
};

#[get("/fs/{id}/{path:.*}")]
pub async fn fspath(path: Path<(i64, String)>, req: HttpRequest) -> HttpResponse {
    if !req
        .headers()
        .get("accept")
        .unwrap_or(&HeaderValue::from_str("html").unwrap())
        .to_str()
        .unwrap()
        .contains("html")
    {
        let (id, path) = path.into_inner();
        return get_file(id, &path, &req).await;
    }
    from_res(fs_task(path, &req).await, &req).await
}

#[get("/fs/{id}")]
pub async fn root(path: Path<i64>, req: HttpRequest) -> HttpResponse {
    if !req
        .headers()
        .get("accept")
        .unwrap_or(&HeaderValue::from_str("html").unwrap())
        .to_str()
        .unwrap()
        .contains("html")
    {
        return intererr!(NamedFile::open_async(IMG_NOT_FOUND.get().unwrap()).await)
            .into_response(&req);
    }
    from_res(
        fs_task(Path::from((path.into_inner(), String::new())), &req).await,
        &req,
    )
    .await
}

async fn fs_task(
    path: Path<(i64, String)>,
    req: &HttpRequest,
) -> Result<HttpResponse, Box<dyn Error>> {
    let (id, path) = path.into_inner();

    let (topbar, account) = match topbar_from_req(req).await? {
        Ok(stuff) => stuff,
        Err(res) => return Ok(res),
    };

    let is_owner = account.as_ref().is_some_and(|account| account.id == id);

    let account = if let Some(account) = account && account.id == id {
        account
    } else {
        match Account::find_by_id(id, ACCOUNTS.get().unwrap()).await? {
            Some(account) => account,
            None => {
                return Ok(NamedFile::open_async(NOT_FOUND.get().unwrap())
                    .await?
                    .into_response(req))
            }
        }
    };

    // get_user_dir(account.id, None).join(&path);
    let pathbuf = get_user_dir(account.id, Some(GMServices::Tex)).join(&path);

    if !fs::try_exists(&pathbuf).await? {
        return Err(V1Error::FileNotFound.into());
    }

    let metadata = fs::metadata(&pathbuf).await?;

    if metadata.is_dir() {
        dir(account, path, topbar, is_owner).await
    } else {
        file(
            account,
            pathbuf,
            path,
            topbar,
            is_owner,
            metadata.len(),
            req,
        )
        .await
    }
}

async fn dir(
    account: Account,
    path: String,
    topbar: Cow<'_, str>,
    is_owner: bool,
) -> Result<HttpResponse, Box<dyn Error>> {
    let items = dir_items(
        account.id,
        &std::path::Path::new("tex").join(&path),
        is_owner,
        false,
    )
    .await?;
    let nonce = gen_nonce();
    let csp_heaher = format!("{} 'nonce-{nonce}'", CSP_BASE.get().unwrap());
    let items_props = FsItemProp {
        nonce,
        id: account.id,
        items: items.into_iter().map(FsItem::from).collect(),
        path: path.clone(),
    };
    let items_display = yew::ServerRenderer::<components::FsItems>::with_props(|| items_props)
        .render()
        .await;
    let path_props = PathProp {
        path: path.clone(),
        id: account.id,
    };
    let path_display = yew::ServerRenderer::<components::Path>::with_props(|| path_props)
        .render()
        .await;
    let upload = if path.starts_with(".system") || !is_owner {
        r#"<img src="/static/icons/fileadd.svg" alt="" width="20px" height="20px" id="create" style="display: none;" /><img src="/static/icons/upload.svg" width="20px" height="20px" id="upload" style="display: none;" />"#
    } else {
        r#"<img src="/static/icons/fileadd.svg" width="20px" height="20px" id="create" /><img src="/static/icons/upload.svg" width="20px" height="20px" id="upload" />"#
    };

    let html = format!(
        r#"<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/fs.css" />
    <link rel="stylesheet" href="/static/css/path.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/fs.css" />
    <link rel="stylesheet" href="/static/css/dark/path.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>{}</title>
  </head>
  <body>
    <dialog id="uploadd">
      <div class="x">&#x2715;</div>
      <h2>Upload a file or folder</h2>
      <div id="upload-types">
        <label id="fileupload">
          <img src="/static/icons/fileup.svg" height="50px" id="upload-file" />
          <input type="file" />
        </label>
        <label id="folderupload">
          <img
            src="/static/icons/folderup.svg"
            id="upload-folder"
            height="50px"
          />
          <input type="file" directory />
        </label>
      </div>
      <p id="upload-from">Source: <span>select a source</span></p>
      <input type="text" id="target" placeholder="Upload target" />
      <button id="uploadbut" disabled class="submitbut">Upload</button>
    </dialog>
    <dialog id="touchd">
      <div class="x">&#x2715;</div>
      <h2>Create a file or folder</h2>
      <div id="create-types">
        <img src="/static/icons/fileadd.svg" height="50px" id="create-file" />
        <img
          src="/static/icons/folderadd.svg"
          height="50px"
          id="create-folder"
        />
      </div>
      <p id="create-tip">End path with <code>/</code> to create a directory.</p>
      <input type="text" id="createtarget" placeholder="Create path" />
      <button id="createbut" disabled class="submitbut">Create</button>
    </dialog>
    <dialog id="copyd">
      <div class="x">&#x2715;</div>
      <h2>Copy item</h2>
      <center><img src="/static/icons/copy.svg" height="50px" /></center>
      <p id="copy-from">Copy from: <span></span></p>
      <input type="text" id="copytarget" placeholder="Copy target" />
      <button id="copybut" class="submitbut">Copy</button>
    </dialog>
  {topbar}
<div id="path-display">
  {path_display}
  <div id="pathitems">{upload}</div>
</div>
  {items_display}
  <script src="/static/scripts/fs.js" defer></script>
  <script src="/static/scripts/upload.js" defer></script>
  </body>
</html>"#,
        html_escape::encode_safe(&format!("{}/{path}", account.id))
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", csp_heaher))
        .body(html))
}

async fn file(
    account: Account,
    pathbuf: PathBuf,
    path: String,
    topbar: Cow<'_, str>,
    is_owner: bool,
    size: u64,
    req: &HttpRequest,
) -> Result<HttpResponse, Box<dyn Error>> {
    let visibility = Visibilities::visibility(&pathbuf).await?;

    if visibility.visibility == ItemVisibility::Private && !is_owner {
        return Err(V1Error::FileNotFound.into());
    }

    let url = if is_owner {
        format!("/api/storage/v1/file/{}/tex/{}", account.token, path)
    } else {
        format!("/api/usercontent/v1/file/id/{}/tex/{}", account.id, path)
    };

    let mimes = MIME_DB
        .get()
        .unwrap()
        .get_mime_types_from_file_name(pathbuf.file_name().unwrap().to_str().unwrap());

    let mime = match mimes.first() {
        Some(mime) => mime.clone(),
        None => mime::TEXT_PLAIN,
    };

    let mime_str = html_friendly_mime(mime.essence_str());

    let (display, css) = match pathbuf
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_str()
        .unwrap()
    {
        "html" => components::html(&pathbuf).await?,
        _ => match (mime.type_(), mime.subtype()) {
            (mime::IMAGE, _) => (
                yew::ServerRenderer::<Img>::with_props(move || ImgProp { url })
                    .render()
                    .await,
                "<link rel=\"stylesheet\" href=\"/static/css/img.css\" />",
            ),
            (mime::AUDIO, _) => (
                components::audio(&url),
                "<link rel=\"stylesheet\" href=\"/static/css/audio.css\" />",
            ),
            (mime::VIDEO, _) => (
                components::video(&url),
                "<link rel=\"stylesheet\" href=\"/static/css/video.css\" />",
            ),
            (_, mime::PDF) => {
                return Ok(NamedFile::open_async(&pathbuf)
                    .await?
                    .set_content_disposition(ContentDisposition {
                        disposition: actix_web::http::header::DispositionType::Inline,
                        parameters: Vec::new(),
                    })
                    .into_response(req))
            }
            (mime::TEXT, _) | (mime::APPLICATION, _) => components::text(&pathbuf).await?,
            _ => todo!("{mimes:?}"),
        },
    };

    let path_display = yew::ServerRenderer::<components::Path>::with_props(move || PathProp {
        id: account.id,
        path,
    })
    .render()
    .await;
    let info_unsafe = format!("{} {}", mime_str, crate::functions::size(size));
    let info = html_escape::encode_safe(&info_unsafe);

    let html = format!(
        r#"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/path.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/path.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    {css}
    {}
    <script src="/static/scripts/file.js" defer></script>
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>Usercontent - GoodMorning Tex</title>
  </head>
  <body>
    {topbar}
<div id="path-display">
    {path_display}
</div>
    <div id="display">
        {display}
        <br />
        <center><code id="info">{info}</code></center>
    </div>
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
        .insert_header(("Content-Security-Policy", CSP_BASE.get().unwrap().as_str()))
        .body(html))
}
