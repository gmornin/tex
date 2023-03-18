mod home;
mod login;
use actix_web::Scope;
pub use home::*;

use crate::r#static;

pub fn scope() -> Scope {
    Scope::new("")
        .service(home::home)
        .service(login::login)
        .service(r#static::r#static)
}
