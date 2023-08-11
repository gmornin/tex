use actix_files::NamedFile;
use actix_web::{http::StatusCode, HttpRequest, HttpResponse};
use goodmorning_bindings::{services::v1::V1Error, traits::ErrorTrait};
use std::{error::Error, path::Path};

use crate::BEEN_LOGGEDOUT;

use super::internalserver_error;

pub async fn from_res(
    res: Result<HttpResponse, Box<dyn Error>>,
    req: &HttpRequest,
) -> HttpResponse {
    let err = match res {
        Ok(res) => return res,
        Err(e) => e,
    };

    let v1e = match err.downcast_ref::<V1Error>() {
        Some(v1e) => v1e,
        _ => return internalserver_error(err),
    };

    let path = match v1e {
        V1Error::InvalidToken => BEEN_LOGGEDOUT.get().unwrap(),
        _ => return internalserver_error(err),
    };

    file(path, req, v1e.status_code()).await
}

pub async fn file(path: &Path, req: &HttpRequest, code: u16) -> HttpResponse {
    match NamedFile::open_async(path).await {
        Ok(file) => {
            let mut res = file.into_response(req);
            *res.status_mut() = match StatusCode::from_u16(code) {
                Ok(code) => code,
                Err(e) => return internalserver_error(e.into()),
            };
            res
        }
        Err(e) => internalserver_error(e.into()),
    }
}
