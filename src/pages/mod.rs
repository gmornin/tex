mod edit;
mod fs;
mod hard_links;
mod home;
mod login;
mod publish;
mod settings;
mod user;
use actix_web::Scope;
pub use home::*;

use crate::r#static;

pub fn scope() -> Scope {
    Scope::new("")
        .service(fs::root)
        .service(home::home)
        .service(login::login)
        .service(r#static::static_services)
        .service(r#static::r#static)
        .service(hard_links::remindverify)
        .service(user::profile)
        .service(fs::fspath)
        .service(edit::edit)
        .service(settings::scope())
        .service(publish::publish)
        .service(goodmorning_services::pages::scope())
}

#[actix_web::get("/test")]
async fn test() -> String {
    "boop".to_string()
}
