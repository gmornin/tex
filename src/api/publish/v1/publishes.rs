use std::error::Error;

use actix_web::{
    get,
    web::{Path, Query},
    HttpResponse,
};
use goodmorning_services::{functions::*, structs::*};

use goodmorning_bindings::services::v1::V1Response;
use serde::Deserialize;

use crate::structs::TexPublish;

#[derive(Deserialize)]
struct PageQuery {
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}

#[get("/publishes/id/{id}")]
async fn publishes(path: Path<i64>, query: Query<PageQuery>) -> HttpResponse {
    from_res(publishes_task(path, query).await)
}

async fn publishes_task(
    path: Path<i64>,
    query: Query<PageQuery>,
) -> Result<V1Response, Box<dyn Error>> {
    Ok(V1Response::TexUserPublishes {
        items: TexPublish::list(
            *path,
            query.page.unwrap_or(1) as u64,
            query.page_size.unwrap_or(10) as u64,
        )
        .await?
        .into_iter()
        .map(TexPublish::into)
        .collect(),
    })
}

#[get("/publishes/name/{username}")]
async fn publishes_username(path: Path<String>, query: Query<PageQuery>) -> HttpResponse {
    from_res(publishes_username_task(path, query).await)
}

async fn publishes_username_task(
    path: Path<String>,
    query: Query<PageQuery>,
) -> Result<V1Response, Box<dyn Error>> {
    let account = Account::v1_get_by_username(path.into_inner()).await?;
    Ok(V1Response::TexUserPublishes {
        items: TexPublish::list(
            account.id,
            query.page.unwrap_or(0) as u64,
            query.page_size.unwrap_or(10) as u64,
        )
        .await?
        .into_iter()
        .map(TexPublish::into)
        .collect(),
    })
}
