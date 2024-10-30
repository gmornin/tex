use std::error::Error;

use actix_web::{post, web::Json, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Response, V1TokenOnly};
use goodmorning_services::{functions::*, structs::*};
use tokio::fs;

#[post("/reset-pfp")]
pub async fn reset_pfp(post: Json<V1TokenOnly>) -> HttpResponse {
    from_res(reset_pfp_task(post).await)
}

async fn reset_pfp_task(post: Json<V1TokenOnly>) -> Result<V1Response, Box<dyn Error>> {
    let account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    let path = get_usersys_dir(account.id, Some(GMServices::Tex)).join("pfp.png");

    if fs::try_exists(&path).await? {
        fs::remove_file(path).await?;
    }
    Ok(V1Response::PfpReset)
}
