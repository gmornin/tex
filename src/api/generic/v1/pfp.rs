use std::error::Error;

use actix_files::NamedFile;
use actix_web::http::header::{self, HeaderValue};
use actix_web::{get, web, HttpRequest, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Response};
use goodmorning_services::{
    functions::*,
    structs::{Account, GMServices},
};
use tokio::fs;

use crate::PFP_DEFAULT;

#[get("/pfp/id/{id}")]
pub async fn pfp(id: web::Path<i64>, req: HttpRequest) -> HttpResponse {
    match pfp_task(id, req).await {
        Ok(res) => res,
        Err(e) => from_res::<V1Response>(Err(e)),
    }
}

async fn pfp_task(id: web::Path<i64>, req: HttpRequest) -> Result<HttpResponse, Box<dyn Error>> {
    let path = get_usersys_dir(*id, Some(GMServices::Tex)).join("pfp.png");

    if !fs::try_exists(path.parent().unwrap()).await? {
        return Ok(from_res::<V1Response>(Err(V1Error::NotCreated.into())));
    }

    if !fs::try_exists(&path).await? {
        return Ok(NamedFile::open_async(PFP_DEFAULT.get().unwrap())
            .await?
            .into_response(&req));
    }

    Ok(NamedFile::open_async(path).await?.into_response(&req))
}

#[get("/pfp/name/{name}")]
pub async fn pfp_name(name: web::Path<String>, req: HttpRequest) -> HttpResponse {
    match pfp_name_task(name, req).await {
        Ok(res) => res,
        Err(e) => from_res::<V1Response>(Err(e)),
    }
}

async fn pfp_name_task(
    name: web::Path<String>,
    req: HttpRequest,
) -> Result<HttpResponse, Box<dyn Error>> {
    let account = match Account::find_by_username(name.to_string()).await? {
        Some(account) => account,
        None => return Err(V1Error::NoSuchUser.into()),
    };

    if !account
        .services
        .contains(&GMServices::Tex.as_str().to_string())
    {
        return Ok(from_res::<V1Response>(Err(V1Error::NotCreated.into())));
    }

    let path = get_usersys_dir(account.id, Some(GMServices::Tex)).join("pfp.png");

    if !fs::try_exists(&path).await? {
        return Ok(NamedFile::open_async(PFP_DEFAULT.get().unwrap())
            .await?
            .into_response(&req));
    }

    let mut res = NamedFile::open_async(path).await?.into_response(&req);
    res.headers_mut().insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("max-age=60"),
    );
    Ok(res)
}
