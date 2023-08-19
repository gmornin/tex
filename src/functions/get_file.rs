use actix_files::NamedFile;
use actix_web::{
    http::header::{self, HeaderValue},
    HttpRequest, HttpResponse,
};
use goodmorning_services::{
    functions::{get_user_dir, is_bson},
    structs::{Account, GMServices, ItemVisibility, Visibilities},
};
use tokio::fs;

use crate::{intererr, CSP_BASE, IMG_NOT_FOUND, NOT_FOUND};

pub async fn get_file(id: i64, path: &str, req: &HttpRequest) -> HttpResponse {
    let pathbuf = get_user_dir(id, Some(GMServices::Tex)).join(path);

    if is_bson(&pathbuf) {
        return intererr!(NamedFile::open_async(NOT_FOUND.get().unwrap()).await).into_response(req);
    }

    let mut res = match req.cookie("token") {
        Some(c) if let Some(account) = intererr!(Account::find_by_token(c.value()).await) && account.id == id => {
            match NamedFile::open_async(pathbuf).await {
                Ok(file) => file,
                Err(_e) => return intererr!(NamedFile::open_async(IMG_NOT_FOUND.get().unwrap()).await).into_response(req)
            }
        },
        _ => {
            if intererr!(Visibilities::visibility(&pathbuf).await).visibility == ItemVisibility::Private || !intererr!(fs::try_exists(&pathbuf).await) {
                return intererr!(NamedFile::open_async(IMG_NOT_FOUND.get().unwrap()).await).into_response(req);
            } else {
                intererr!(NamedFile::open_async(pathbuf).await)
            }
        }
    }.into_response(req);

    res.headers_mut().append(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(CSP_BASE.get().unwrap().as_str()),
    );
    res
}

pub async fn get_file_noid(path: &str, req: &HttpRequest) -> HttpResponse {
    let account = match match req.cookie("token") {
        Some(c) => intererr!(Account::find_by_token(c.value()).await),
        None => {
            return intererr!(NamedFile::open_async(NOT_FOUND.get().unwrap()).await)
                .into_response(req)
        }
    } {
        Some(acc) => acc,
        None => {
            return intererr!(NamedFile::open_async(NOT_FOUND.get().unwrap()).await)
                .into_response(req)
        }
    };
    let pathbuf = get_user_dir(account.id, Some(GMServices::Tex)).join(path);

    if is_bson(&pathbuf) {
        return intererr!(NamedFile::open_async(IMG_NOT_FOUND.get().unwrap()).await)
            .into_response(req);
    }

    let mut res = match NamedFile::open_async(pathbuf).await {
        Ok(file) => file,
        Err(_e) => {
            return intererr!(NamedFile::open_async(IMG_NOT_FOUND.get().unwrap()).await)
                .into_response(req)
        }
    }
    .into_response(req);

    res.headers_mut().append(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(CSP_BASE.get().unwrap().as_str()),
    );
    res
}
