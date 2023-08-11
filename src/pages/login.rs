use actix_files::NamedFile;
use actix_web::{get, web::Query, HttpRequest};
use goodmorning_services::structs::Account;
use serde::Deserialize;
use std::error::Error;

use crate::{BEEN_LOGGEDOUT, LOGIN, LOGIN_ASK_LOGOUT, REGISTER};

#[derive(Deserialize)]
struct Type {
    r#type: Option<String>,
}

#[get("/login")]
pub async fn login(req: HttpRequest, query: Query<Type>) -> Result<NamedFile, Box<dyn Error>> {
    if let Some(token) = req.cookie("token") {
        if Account::find_by_token(token.value()).await?.is_some() {
            Ok(NamedFile::open_async(LOGIN_ASK_LOGOUT.get().unwrap()).await?)
        } else {
            Ok(NamedFile::open_async(BEEN_LOGGEDOUT.get().unwrap()).await?)
        }
    } else if query.r#type.as_deref().unwrap_or_default() == "new" {
        Ok(NamedFile::open_async(REGISTER.get().unwrap()).await?)
    } else {
        Ok(NamedFile::open_async(LOGIN.get().unwrap()).await?)
    }
}
