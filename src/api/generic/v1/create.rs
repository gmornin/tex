use std::error::Error;

use actix_web::{post, web::Json, HttpResponse};
use goodmorning_bindings::services::v1::{V1Response, V1TokenOnly};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem, *};
use tokio::fs;

#[post("/create")]
async fn create(post: Json<V1TokenOnly>) -> HttpResponse {
    from_res(create_task(post).await)
}

async fn create_task(post: Json<V1TokenOnly>) -> Result<V1Response, Box<dyn Error>> {
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
