use std::{error::Error, ffi::OsStr, path::PathBuf};

use actix_web::{post, web::Json, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Response, V1UpdatePublish};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem, *};
use tokio::fs;

use crate::functions::get_tex_userpublishes;
use crate::structs::TexPublish;

#[post("/update-publish")]
async fn update_publish(post: Json<V1UpdatePublish>) -> HttpResponse {
    from_res(update_publish_task(post).await)
}

async fn update_publish_task(post: Json<V1UpdatePublish>) -> Result<V1Response, Box<dyn Error>> {
    let post = post.into_inner();
    let mut account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    let user_path = PathBuf::from(format!("tex/{}", post.path.trim_start_matches('/')));

    if !editable(&user_path, &account.services) {
        return Err(V1Error::PermissionDenied.into());
    }

    let publishes = get_tex_userpublishes(post.id);
    let published = match TexPublish::find_by_id(post.id, &publishes).await? {
        Some(p) => p,
        None => return Err(V1Error::EntryNotFound.into()),
    };

    let copy_from = get_user_dir(account.id, None).join(&user_path);

    if !fs::try_exists(&copy_from).await? {
        return Err(V1Error::FileNotFound.into());
    }

    let metadata = fs::metadata(&copy_from).await?;

    if !metadata.is_file() {
        return Err(V1Error::TypeMismatch.into());
    }

    let ext = user_path
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_str()
        .unwrap()
        .to_string();
    let copy_to = get_usersys_dir(account.id, Some(GMServices::Tex))
        .join("publishes")
        .join(format!("{}.{ext}", post.id));

    let to_meta = fs::metadata(&copy_to).await?;

    if account
        .exceeds_limit_nosave(
            STORAGE_LIMITS.get().unwrap(),
            Some(metadata.len()),
            Some(to_meta.len()),
        )
        .await?
    {
        return Err(V1Error::StorageFull.into());
    }

    let parent = copy_to.parent().unwrap();
    if !fs::try_exists(parent).await? {
        fs::create_dir_all(parent).await?;
    }

    fs::copy(copy_from, copy_to).await?;
    published.save_replace(&publishes).await?;

    let stored = account.stored.as_mut().unwrap();
    stored.value += metadata.len();
    stored.value = stored.value.saturating_sub(to_meta.len());
    account.save_replace(ACCOUNTS.get().unwrap()).await?;

    Ok(V1Response::TexPublishUpdated)
}
