use actix_files::NamedFile;
use actix_web::{get, web::Query, Result};
use serde::Deserialize;

#[derive(Deserialize)]
struct Type {
    r#type: Option<String>,
}

#[get("/login")]
pub async fn login(query: Query<Type>) -> Result<NamedFile> {
    if query.r#type.as_deref().unwrap_or_default() == "new" {
        todo!()
    } else {
        Ok(NamedFile::open_async("static_hidden/login.html").await?)
    }
}
