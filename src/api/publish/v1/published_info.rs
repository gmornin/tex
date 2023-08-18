use std::error::Error;

use actix_web::web::Path;
use actix_web::{get, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Response};
use goodmorning_services::{functions::*, traits::CollectionItem};

use crate::functions::get_tex_userpublishes;
use crate::structs::TexPublish;

#[get("/publish/id/{userid}/{publishid}")]
async fn publish_info(path: Path<(i64, i64)>) -> HttpResponse {
    from_res(publish_info_task(path).await)
}

async fn publish_info_task(path: Path<(i64, i64)>) -> Result<V1Response, Box<dyn Error>> {
    let (userid, publish_id) = path.into_inner();

    let publish = match TexPublish::find_by_id(publish_id, &get_tex_userpublishes(userid)).await? {
        Some(publish) => publish,
        None => return Err(V1Error::EntryNotFound.into()),
    };

    Ok(V1Response::TexUserPublish {
        value: publish.into(),
    })
}
