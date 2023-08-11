use std::error::Error;

use actix_web::{post, web::Json, HttpResponse};
use goodmorning_bindings::{
    services::v1::{V1Error, V1ProfileOnly, V1Response},
    structs::ProfileDetail,
};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem};
use mongodb::{
    bson::{self, doc},
    options::UpdateOptions,
};

use crate::{structs::TexProfile, PROFILES};

#[post("/set-profile")]
async fn set_profile(post: Json<V1ProfileOnly>) -> HttpResponse {
    from_res(set_profile_task(post).await)
}

async fn set_profile_task(post: Json<V1ProfileOnly>) -> Result<V1Response, Box<dyn Error>> {
    let account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    let profile = post.into_inner().profile;

    if profile.description.len() > 2000 {
        return Err(V1Error::ExceedsMaximumLength.into());
    }

    if profile.details.len() > 20 {
        return Err(V1Error::TooManyProfileDetails.into());
    }

    if profile
        .details
        .iter()
        .filter(|detail| {
            matches!(
                detail,
                ProfileDetail::CakeDay { .. } | ProfileDetail::BirthDay { .. }
            )
        })
        .count()
        > 1
    {
        return Err(V1Error::BirthCakeConflict.into());
    }

    for (i, detail) in profile.details.iter().enumerate() {
        if !detail.validate() {
            return Err(V1Error::InvalidDetail { index: i as u8 }.into());
        }
    }

    let filter = doc! { "_id": account.id };
    let update = doc! { "$set": {"profile": bson::to_bson(&profile)?} };
    let options = UpdateOptions::builder().upsert(false).build();
    if PROFILES
        .get()
        .unwrap()
        .update_one(filter, update, options)
        .await?
        .matched_count
        == 0
    {
        TexProfile {
            profile,
            ..TexProfile::default_with_id(account.id)
        }
        .save_create(PROFILES.get().unwrap())
        .await?
    };

    Ok(V1Response::ProfileUpdated)
}
