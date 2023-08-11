use std::error::Error;

use actix_web::{post, web::Json, HttpResponse};
use goodmorning_bindings::services::v1::{V1Response, V1TokenOnly};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem};

use crate::{structs::TexProfile, PROFILES};

#[post("/reset-profile")]
async fn reset_pf(post: Json<V1TokenOnly>) -> HttpResponse {
    from_res(reset_profile_task(post).await)
}

async fn reset_profile_task(post: Json<V1TokenOnly>) -> Result<V1Response, Box<dyn Error>> {
    let account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    TexProfile::default_with_id(account.id)
        .save_replace(PROFILES.get().unwrap())
        .await?;

    Ok(V1Response::ProfileUpdated)
}
