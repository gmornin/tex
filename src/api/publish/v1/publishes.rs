use std::error::Error;

use actix_web::{
    get,
    web::{Path, Query},
    HttpResponse,
};
use goodmorning_services::{functions::*, structs::*};

use goodmorning_services::bindings::services::v1::V1Response;
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
    let (items, continuation) = TexPublish::list(
        *path,
        query.page.unwrap_or(1) as u64,
        std::cmp::min(query.page_size.unwrap_or(10) as u64, 50),
    )
    .await?;
    Ok(V1Response::TexUserPublishes {
        items: items.into_iter().map(TexPublish::into).collect(),
        continuation,
        total: TexPublish::total(*path).await?,
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
    let (items, continuation) = TexPublish::list(
        account.id,
        query.page.unwrap_or(1) as u64,
        std::cmp::min(query.page_size.unwrap_or(10) as u64, 50),
    )
    .await?;
    Ok(V1Response::TexUserPublishes {
        items: items.into_iter().map(TexPublish::into).collect(),
        continuation,
        total: TexPublish::total(account.id).await?,
    })
}
