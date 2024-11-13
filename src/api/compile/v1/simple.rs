use std::{error::Error, path::PathBuf};

use actix_web::{
    post,
    web::{self, Json},
    HttpResponse,
};
use goodmorning_services::bindings::{services::v1::*, structs::ApiVer};
use goodmorning_services::{functions::*, structs::*, *};

use crate::{structs::CompileTask, COMPILE_LATEX_LIMIT, COMPILE_MARKDOWN_LIMIT};

#[post("/simple")]
pub async fn simple(post: Json<V1Compile>, jobs: web::Data<Jobs>) -> HttpResponse {
    from_res(simple_task(post, jobs).await)
}

async fn simple_task(
    post: Json<V1Compile>,
    jobs: web::Data<Jobs>,
) -> Result<V1Response, Box<dyn Error>> {
    let mut account = Account::v1_get_by_token(&post.token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    let mut symlinked_account = None;
    let mut user_path = PathBuf::from(post.path.trim_start_matches('/'));

    if let ["Shared", user, ..] = user_path
        .iter()
        .map(|s| s.to_str().unwrap())
        .collect::<Vec<_>>()
        .as_slice()
    {
        account = if let Some(account) = Account::find_by_username(user.to_string()).await? {
            account.v1_restrict_verified()?
        } else {
            return Err(V1Error::FileNotFound.into());
        };
        user_path = user_path.iter().skip(2).collect();
        symlinked_account = Some(account.id);
    }

    let restrict_path = get_user_dir(account.id, Some(GMServices::Tex));
    let source = restrict_path.join(&user_path);

    if has_dotdot(&user_path) && !is_bson(&user_path) {
        return Err(V1Error::PermissionDenied.into());
    }

    let mut res = jobs
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
            QUEUE_PRESETS
                .get()
                .unwrap()
                .get(&account.limit)
                .map(|c| c.max_concurrent)
                .unwrap_or(*MAX_CONCURRENT.get().unwrap()),
            QUEUE_PRESETS
                .get()
                .unwrap()
                .get(&account.limit)
                .map(|c| c.queue_limit)
                .unwrap_or(*QUEUE_LIMIT.get().unwrap()),
            ApiVer::V1,
            *if matches!(post.from, FromFormat::Markdown) {
                COMPILE_MARKDOWN_LIMIT.get().unwrap()
            } else {
                COMPILE_LATEX_LIMIT.get().unwrap()
            },
        )
        .await
        .as_v1()?;

    if let Some(user) = &mut symlinked_account {
        if let V1Response::TexCompiled { id: _, newpath } = &mut res {
            *newpath = format!("Shared/{user}/{newpath}")
        }
    }

    Ok(res)
}
