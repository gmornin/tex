use std::error::Error;

use actix_files::NamedFile;
use actix_web::http::header::{self, ContentDisposition, HeaderValue};
use actix_web::web::Path;
use actix_web::HttpRequest;
use actix_web::{get, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Response};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem};

use crate::functions::get_tex_userpublishes;
use crate::structs::TexPublish;
use crate::CSP_BASE;

#[get("/published-file/id/{userid}/{publishid}")]
async fn published_file(path: Path<(i64, i64)>, req: HttpRequest) -> HttpResponse {
    match published_file_task(path, req).await {
        Ok(res) => res,
        Err(e) => from_res::<V1Response>(Err(e)),
    }
}

async fn published_file_task(
    path: Path<(i64, i64)>,
    req: HttpRequest,
) -> Result<HttpResponse, Box<dyn Error>> {
    let (userid, publish_id) = path.into_inner();

    let publish = match TexPublish::find_by_id(publish_id, &get_tex_userpublishes(userid)).await? {
        Some(publish) => publish,
        None => return Err(V1Error::EntryNotFound.into()),
    };

    let mut file = NamedFile::open_async(
        get_usersys_dir(userid, Some(GMServices::Tex))
            .join("publishes")
            .join(format!("{publish_id}.{}", publish.ext)),
    )
    .await?
    .set_content_disposition(ContentDisposition {
        disposition: actix_web::http::header::DispositionType::Inline,
        parameters: Vec::new(),
    })
    .into_response(&req);
    file.headers_mut().insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(CSP_BASE.get().unwrap()),
    );
    Ok(file)
}
