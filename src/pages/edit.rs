use std::{error::Error, ffi::OsStr, path::PathBuf};

use actix_files::NamedFile;
use actix_web::http::header::HeaderValue;
use actix_web::{get, http::header::ContentType, web::Path, HttpRequest, HttpResponse};
use goodmorning_services::bindings::services::v1::V1Error;
use goodmorning_services::{functions::get_user_dir, structs::GMServices};
use tokio::fs;

use crate::functions::get_file_noid;
use crate::{
    components::{self, available_targets, ext_to_mode, topbar_option_from_req},
    functions::{from_res, gen_nonce},
    CREATE_ACC, CSP_BASE, NOT_TXT,
};

#[get("/edit/{path:.*}")]
pub async fn edit(path: Path<String>, req: HttpRequest) -> HttpResponse {
    if !req
        .headers()
        .get("accept")
        .unwrap_or(&HeaderValue::from_str("html").unwrap())
        .to_str()
        .unwrap()
        .contains("html")
    {
        return get_file_noid(&path, &req).await;
    }

    from_res(edit_task(path, &req).await, &req).await
}

async fn edit_task(path: Path<String>, req: &HttpRequest) -> Result<HttpResponse, Box<dyn Error>> {
    let (topbar, account) = match topbar_option_from_req(req).await? {
        Ok(Some(stuff)) => stuff,
        Ok(None) => {
            return Ok(NamedFile::open_async(CREATE_ACC.get().unwrap())
                .await?
                .into_response(req))
        }
        Err(res) => return Ok(res),
    };

    let usr_dir = get_user_dir(account.id, Some(GMServices::Tex));
    let mut previews = Vec::new();
    let mut target_exts = Vec::new();
    let mut preview_path = PathBuf::from(path.as_ref());

    let pathbuf = usr_dir.join(path.as_ref());
    let ext = pathbuf
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_str()
        .unwrap();
    let source_fmt = ext_to_mode(ext);
    let available_targets = available_targets(source_fmt);
    for ext in available_targets {
        target_exts.push(*ext);
        preview_path.set_extension(ext.0);
        if fs::try_exists(usr_dir.join(&preview_path)).await? {
            previews.push(preview_path.to_string_lossy().to_string());
        }
    }

    if !fs::try_exists(&pathbuf).await? {
        return Err(V1Error::FileNotFound.into());
    }

    let buf = fs::read(&pathbuf).await?;

    let content = match std::str::from_utf8(&buf) {
        Ok(s) => s,
        Err(_) => {
            return Ok(NamedFile::open_async(NOT_TXT.get().unwrap())
                .await?
                .into_response(req))
        }
    };

    let nonce = gen_nonce();

    let html = components::editor(
        &topbar,
        content,
        ext,
        &path,
        &nonce,
        &previews,
        &target_exts,
        source_fmt,
    );

    let csp_heaher = format!(
        "{} blob: data: 'wasm-unsafe-eval' 'nonce-{nonce}'",
        CSP_BASE.get().unwrap()
    );
    Ok(HttpResponse::Ok()
        .content_type(ContentType::html())
        .insert_header(("Content-Security-Policy", csp_heaher))
        .body(html))
}
