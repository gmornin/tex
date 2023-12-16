use std::{error::Error, ffi::OsStr, path::PathBuf};

use actix_web::{post, web::Json, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Publish, V1Response};
use goodmorning_services::{functions::*, structs::*, traits::CollectionItem, *};
use tokio::fs;

use crate::structs::TexPublish;

#[post("/publish")]
async fn publish(post: Json<V1Publish>) -> HttpResponse {
    from_res(publish_task(post).await)
}

async fn publish_task(post: Json<V1Publish>) -> Result<V1Response, Box<dyn Error>> {
    let post = post.into_inner();
    let mut account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    let user_path = PathBuf::from(format!("tex/{}", post.path.trim_start_matches('/')));

    if !editable(&user_path, &account.services) {
        return Err(V1Error::PermissionDenied.into());
    }

    let copy_from = get_user_dir(account.id, None).join(&user_path);

    if !fs::try_exists(&copy_from).await? {
        return Err(V1Error::FileNotFound.into());
    }

    let metadata = fs::metadata(&copy_from).await?;

    if !metadata.is_file() {
        return Err(V1Error::TypeMismatch.into());
    }

    if account
        .exceeds_limit(STORAGE_LIMITS.get().unwrap(), Some(metadata.len()), None)
        .await?
    {
        return Err(V1Error::FileTooLarge.into());
    }

    let ext = user_path
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_str()
        .unwrap()
        .to_string();

    let copy_to = get_usersys_dir(account.id, Some(GMServices::Tex))
        .join("publishes")
        .join(format!("{}.{ext}", account.counters.tex_publishes));

    let parent = copy_to.parent().unwrap();
    if !fs::try_exists(parent).await? {
        fs::create_dir_all(parent).await?;
    }

    fs::copy(copy_from, copy_to).await?;

    let published = TexPublish::new(
        account.id,
        &mut account.counters.tex_publishes,
        post.title,
        post.desc,
        ext,
    )
    .await?;
    account.stored.as_mut().unwrap().value += metadata.len();
    account.save_replace(ACCOUNTS.get().unwrap()).await?;

    Ok(V1Response::TexPublished {
        id: published.id as u64,
    })
}
