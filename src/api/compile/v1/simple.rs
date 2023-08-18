use std::{error::Error, path::PathBuf};

use actix_web::{
    post,
    web::{self, Json},
    HttpResponse,
};
use goodmorning_services::bindings::{services::v1::*, structs::ApiVer};
use goodmorning_services::{functions::*, structs::*, *};

use crate::structs::CompileTask;

#[post("/simple")]
async fn simple(post: Json<V1Compile>, jobs: web::Data<Jobs>) -> HttpResponse {
    from_res(simple_task(post, jobs).await)
}

async fn simple_task(
    post: Json<V1Compile>,
    jobs: web::Data<Jobs>,
) -> Result<V1Response, Box<dyn Error>> {
    let account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    let restrict_path = get_user_dir(account.id, Some(GMServices::Tex));
    let user_path = PathBuf::from(post.path.trim_start_matches('/'));
    let source = restrict_path.join(&user_path);

    if has_dotdot(&user_path) && !is_bson(&user_path) {
        return Err(V1Error::PermissionDenied.into());
    }

    Ok(jobs
        .run_with_limit(
            account.id,
            Box::new(CompileTask {
                from: post.from,
                to: post.to,
                compiler: post.compiler.unwrap_or_default(),
                source,
                user_path,
                restrict_path,
            }),
            *MAX_CONCURRENT.get().unwrap(),
            ApiVer::V1,
        )
        .await
        .as_v1()?)
}
