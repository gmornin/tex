use actix_files::NamedFile;
use actix_web::{get, web::Path, Result};

use serde::Deserialize;

#[derive(Deserialize)]
struct StaticPath {
    path: String,
}

#[get("/static/{path:.*}")]
pub async fn r#static(params: Path<StaticPath>) -> Result<NamedFile> {
    let params = params.into_inner();
    Ok(NamedFile::open_async(format!("static/{}", params.path)).await?)
}
