use std::{borrow::Cow, error::Error, ffi::OsStr, path::PathBuf};

use actix_files::NamedFile;
use actix_web::{
    get,
    http::header::{ContentType, HeaderValue},
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
    components::{self, html_friendly_mime, topbar_from_req, FsItem, FsItemProp, PathProp},
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

    let mut account = if let Some(account) = account
        && account.id == id
    {
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

    let mut preview_path = PathBuf::from(&path);

    if let ["Shared", user, ..] = preview_path
        .iter()
        .map(|s| s.to_str().unwrap())
        .collect::<Vec<_>>()
        .as_slice()
    {
        account = if let Some(account) = Account::find_by_username(user.to_string()).await? {
            account.v1_restrict_verified()?
        } else {
            return Err(V1Error::FileNotFound.into());
        };
        preview_path = preview_path.iter().skip(2).collect();
    }

    // get_user_dir(account.id, None).join(&path);
    let pathbuf = get_user_dir(account.id, Some(GMServices::Tex)).join(&preview_path);

    if matches!(path.as_str(), "Shared" | "Shared/") {
        return dir(id, path, topbar, is_owner).await
    }

    if !fs::try_exists(&pathbuf).await? {
        return Err(V1Error::FileNotFound.into());
    }

    let metadata = fs::metadata(&pathbuf).await?;

    if metadata.is_dir() {
        dir(id, path, topbar, is_owner).await
    } else {
        file(account, id, pathbuf, path, topbar, is_owner, metadata.len()).await
    }
}

async fn dir(
    id: i64,
    path: String,
    topbar: Cow<'_, str>,
    is_owner: bool,
) -> Result<HttpResponse, Box<dyn Error>> {
    let pathbuf = std::path::Path::new("tex").join(&path);
    dbg!(&path);
    let items = dir_items(id, &pathbuf, is_owner, false).await?;
    let nonce = gen_nonce();
    let csp_header = format!("{} 'nonce-{nonce}'", CSP_BASE.get().unwrap());
    let items_props = FsItemProp {
        nonce,
        id,
        items: items.into_iter().map(FsItem::from).collect(),
        path: path.clone(),
    };
    let items_display = yew::ServerRenderer::<components::FsItems>::with_props(|| items_props)
        .render()
        .await;
    let path_props = PathProp {
        path: path.trim_end_matches('/').to_string(),
        id,
    };
    let path_display = yew::ServerRenderer::<components::Path>::with_props(|| path_props)
        .render()
        .await;
    let upload = if path.starts_with(".system") || !is_owner {
        r#"<img src="/static/icons/fileadd.svg" alt="" width="20px" height="20px" id="create" style="display: none;" /><img src="/static/icons/upload.svg" width="20px" height="20px" id="upload" style="display: none;" />"#
    } else {
        r#"<img src="/static/icons/fileadd.svg" width="20px" height="20px" id="create" /><img src="/static/icons/upload.svg" width="20px" height="20px" id="upload" />"#
    };
    let pathbuf_safe = html_escape::encode_safe(pathbuf.to_str().unwrap());

    let html = format!(
        r#"<!-- {{ "path": "{pathbuf_safe}", "id": {id} }} -->
<!DOCTYPE html>
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
          <input type="file" directory webkitdirectory multiple />
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
    <dialog id="moved">
      <div class="x">&#x2715;</div>
      <h2>Move item</h2>
      <center><img src="/static/icons/folder-tree.svg" height="50px" /></center>
      <p id="move-from">Move from: <span></span></p>
      <input type="text" id="movetarget" placeholder="Move to" />
      <button id="movebut" class="submitbut">Move</button>
    </dialog>
    <dialog id="restored">
      <div class="x">&#x2715;</div>
      <h2>Head up!</h2>
      <center><img src="/static/icons/warn.svg" height="50px" /></center>
      <center><p>There is a file at target location</p></center>
      <button id="restorebut" class="dangerbut">Overwrite file</button>
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
        html_escape::encode_safe(&format!("{}/{path}", id))
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", csp_header))
        .body(html))
}

async fn file(
    account: Account,
    id: i64,
    pathbuf: PathBuf,
    path: String,
    topbar: Cow<'_, str>,
    is_owner: bool,
    size: u64,
) -> Result<HttpResponse, Box<dyn Error>> {
    let visibility = Visibilities::visibility(&pathbuf).await?;

    let mut csp_header = Cow::from(CSP_BASE.get().unwrap());
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
    let mut is_text = false;

    let (display, css, source) = match pathbuf
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_str()
        .unwrap()
    {
        "html" => {
            csp_header =
                format!("{} blob: data: 'wasm-unsafe-eval'", CSP_BASE.get().unwrap()).into();
            is_text = true;
            components::html(&pathbuf, &path).await?
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
                csp_header = format!("{} 'nonce-{nonce}'", CSP_BASE.get().unwrap()).into();
                (
                    components::pdf(&url, &nonce),
                    r#"<link rel="stylesheet" href="/static/scripts/pdfjs/web/viewer.css" />
                <link rel="stylesheet" href="/static/css/pdf.css" />"#,
                    fs::try_exists(pathbuf.with_extension("tex"))
                        .await?
                        .then(|| {
                            PathBuf::from(&path)
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

    let path_escaped = html_escape::encode_safe(&path).to_string();
    let mut footurls = format!(
        r#"{}{}<a class="linklike" href="{url}" download>Download</a>"#,
        if is_owner && is_text {
            format!(r#"<a class="linklike" id="footurls" href="/edit/{path_escaped}">Edit</a>"#)
        } else {
            String::new()
        },
        if is_text {
            format!(r#"<a class="linklike" href="{url}?display=text">Raw</a>"#)
        } else {
            String::new()
        },
    );

    if let Some(source) = source {
        println!("path buf: {pathbuf:?}");
        println!("source: {source:?}");
        if is_owner
            || Visibilities::visibility(&get_user_dir(id, Some(GMServices::Tex)).join(&source))
                .await
                .is_ok_and(|res| res.visibility != ItemVisibility::Private)
        {
            footurls.push_str(&format!(
                r#"<a class="linklike" href="/fs/{id}/{}">Source</a>"#,
                html_escape::encode_text(&source)
            ));
        }
    }

    let path_display = yew::ServerRenderer::<components::Path>::with_props(move || PathProp {
        id,
        path: path.trim_end_matches('/').to_string(),
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
    <link rel="stylesheet" href="/static/css/file-previews.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/path.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    {}
    <script src="/static/scripts/file.js" defer></script>
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>{id}/{path_escaped}</title>
  </head>
  <body>
    {topbar}
<div id="path-display">
    {path_display}
</div>
    <div id="display">
        {display}
        <br />
    </div>
    <center id="footurls"><code id="info">{info}</code><br /><code id="footurls">{footurls}</code></center>
  </body>
  {css}
</html>"#,
        if mime.type_() == mime::TEXT {
            r#"<link rel="stylesheet" href="/static/css/textpreview.css" />"#
        } else {
            ""
        }
    );

    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", csp_header.as_ref()))
        .body(html))
}
