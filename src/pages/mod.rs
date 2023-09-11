mod edit;
mod fs;
mod hard_links;
mod home;
mod login;
mod settings;
mod user;
use actix_web::Scope;
pub use home::*;

use crate::r#static;

pub fn scope() -> Scope {
    Scope::new("")
        .service(home::home)
        .service(login::login)
        .service(r#static::r#static)
        .service(hard_links::remindverify)
        .service(user::profile)
        .service(fs::fspath)
        .service(fs::root)
        .service(edit::edit)
        .service(settings::scope())
}
