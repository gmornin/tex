use actix_files::NamedFile;
use actix_web::{get, web::Path, Result};
use goodmorning_services::SERVICES_STATIC;

use crate::STATIC_PATH;

#[get("/static/{path:.*}")]
pub async fn r#static(params: Path<String>) -> Result<NamedFile> {
    let params = params.into_inner();

    Ok(NamedFile::open_async(
        STATIC_PATH
            .get()
            .unwrap()
            .join(params.trim_start_matches('/')),
    )
    .await?)
}

#[get("/static/services/{path:.*}")]
pub async fn static_services(params: Path<String>) -> Result<NamedFile> {
    let params = params.into_inner();

    Ok(NamedFile::open_async(
        SERVICES_STATIC
            .get()
            .unwrap()
            .join(params.trim_start_matches('/')),
    )
    .await?)
}
