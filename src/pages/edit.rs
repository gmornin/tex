use std::{error::Error, ffi::OsStr, path::PathBuf};

use actix_files::NamedFile;
use actix_web::{get, http::header::ContentType, web::Path, HttpRequest, HttpResponse};
use goodmorning_bindings::services::v1::V1Error;
use goodmorning_services::{functions::get_user_dir, structs::GMServices};
use tokio::fs;

use crate::{
    components::{self, available_targets, topbar_option_from_req},
    functions::{from_res, gen_nonce},
    CSP_BASE,
};

#[get("/edit/{path:.*}")]
pub async fn edit(path: Path<String>, req: HttpRequest) -> HttpResponse {
    from_res(edit_task(path, &req).await, &req).await
}

async fn edit_task(path: Path<String>, req: &HttpRequest) -> Result<HttpResponse, Box<dyn Error>> {
    let (topbar, account) = match topbar_option_from_req(req).await? {
        Ok(Some(stuff)) => stuff,
        Ok(None) => {
            return Ok(NamedFile::open_async("static/htmls/create-acc.html")
                .await?
                .into_response(req))
        }
        Err(res) => return Ok(res),
    };

    let usr_dir = get_user_dir(account.id, Some(GMServices::Tex));
    let mut previews = Vec::new();
    let mut target_exts = Vec::new();
    let mut preview_path = PathBuf::from(path.as_ref());
    let available_targets = available_targets(
        preview_path
            .extension()
            .unwrap_or(OsStr::new(""))
            .to_str()
            .unwrap(),
    );
    for ext in available_targets {
        target_exts.push(*ext);
        preview_path.set_extension(ext);
        if fs::try_exists(usr_dir.join(&preview_path)).await? {
            previews.push(preview_path.to_string_lossy().to_string());
        }
    }

    let pathbuf = usr_dir.join(path.as_ref());
    if !fs::try_exists(&pathbuf).await? {
        return Err(V1Error::FileNotFound.into());
    }

    let buf = fs::read(&pathbuf).await?;

    let content = match std::str::from_utf8(&buf) {
        Ok(s) => s,
        Err(_) => {
            return Ok(NamedFile::open_async("static/htmls/not-txt.html")
                .await?
                .into_response(req))
        }
    };

    let nonce = gen_nonce();

    let html = components::editor(
        &topbar,
        content,
        pathbuf
            .extension()
            .unwrap_or(OsStr::new(""))
            .to_str()
            .unwrap(),
        &path,
        &nonce,
        &previews,
        &target_exts,
    );

    let csp_heaher = format!("{} 'nonce-{nonce}'", CSP_BASE.get().unwrap());
    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", csp_heaher))
        .body(html))
}
