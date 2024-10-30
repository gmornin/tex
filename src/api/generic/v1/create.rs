use std::error::Error;

use actix_web::HttpRequest;
use actix_web::{post, web::Json, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Response, V1TokenOnly};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem, *};
use tokio::fs;

use crate::ALLOW_CREATE;

#[post("/create")]
pub async fn create(post: Json<V1TokenOnly>, req: HttpRequest) -> HttpResponse {
    from_res(create_task(post, req).await)
}

async fn create_task(
    post: Json<V1TokenOnly>,
    req: HttpRequest,
) -> Result<V1Response, Box<dyn Error>> {
    if !ALLOW_CREATE.get().unwrap()
        && !CREATE_WHITELIST
            .get()
            .unwrap()
            .contains(&if *FORWARDED.get().unwrap() {
                req.connection_info()
                    .realip_remote_addr()
                    .unwrap()
                    .to_string()
            } else {
                req.connection_info().peer_addr().unwrap().to_string()
            })
    {
        return Err(V1Error::FeatureDisabled.into());
    }

    let mut account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_not_contains(&GMServices::Tex)?;

    let path = get_usersys_dir(account.id, Some(GMServices::Tex));
    fs::create_dir_all(&path).await?;

    account.services.push(GMServices::Tex);
    account.save_replace(ACCOUNTS.get().unwrap()).await?;

    Ok(V1Response::ServiceCreated)
}
