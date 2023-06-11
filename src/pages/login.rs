use actix_files::NamedFile;
use actix_web::{
    get,
    web::{Data, Query},
    HttpRequest,
};
use goodmorning_services::{functions::get_accounts, structs::Account};
use mongodb::Database;
use serde::Deserialize;
use std::error::Error;

#[derive(Deserialize)]
struct Type {
    r#type: Option<String>,
}

#[get("/login")]
pub async fn login(
    req: HttpRequest,
    query: Query<Type>,
    db: Data<Database>,
) -> Result<NamedFile, Box<dyn Error>> {
    if let Some(token) = req.cookie("token") {
        if Account::find_by_token(token.value(), &get_accounts(&db))
            .await?
            .is_some()
        {
            Ok(NamedFile::open_async("static/htmls/login-ask-logout.html").await?)
        } else {
            Ok(NamedFile::open_async("static/htmls/been-loggedout.html").await?)
        }
    } else if query.r#type.as_deref().unwrap_or_default() == "new" {
        Ok(NamedFile::open_async("static/htmls/register.html").await?)
    } else {
        Ok(NamedFile::open_async("static/htmls/login.html").await?)
    }
}
