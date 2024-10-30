use std::error::Error;

use actix_multipart::Multipart;
use actix_web::{post, web::Path, HttpRequest, HttpResponse};
use goodmorning_services::bindings::services::v1::{V1Error, V1Response};
use goodmorning_services::{functions::*, structs::*, *};
use tokio::{fs::OpenOptions, io::AsyncWriteExt};

#[post("/set-pfp/{token}")]
pub async fn set_pfp(token: Path<String>, payload: Multipart, req: HttpRequest) -> HttpResponse {
    from_res(set_pfp_task(token, payload, req).await)
}

async fn set_pfp_task(
    token: Path<String>,
    payload: Multipart,
    req: HttpRequest,
) -> Result<V1Response, Box<dyn Error>> {
    let account = Account::v1_get_by_token(&token)
        .await?
        .v1_restrict_verified()?
        .v1_contains(&GMServices::Tex)?;

    if *PFP_LIMIT.get().unwrap()
        < req
            .headers()
            .get("content-length")
            .unwrap()
            .to_str()?
            .parse::<u64>()?
    {
        return Err(V1Error::FileTooLarge.into());
    }

    let path = get_usersys_dir(account.id, Some(GMServices::Tex)).join("pfp.png");

    let mut file = OpenOptions::new()
        .create(true)
        .truncate(true)
        .write(true)
        .open(&path)
        .await?;

    let data = bytes_from_multipart(payload).await?;

    match MIME_DB.get().unwrap().get_mime_type_for_data(&data) {
        Some((mime, _)) if mime != mime::IMAGE_PNG => {
            return Err(V1Error::FileTypeMismatch {
                expected: mime::IMAGE_PNG.to_string(),
                got: mime.to_string(),
            }
            .into());
        }
        Some(_) => file.write_all(&data).await?,
        _ => {
            return Err(V1Error::FileTypeMismatch {
                expected: mime::IMAGE_PNG.to_string(),
                got: String::from("unknown"),
            }
            .into());
        }
    }

    Ok(V1Response::ProfileUpdated)
}
