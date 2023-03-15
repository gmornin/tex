mod home;
use actix_web::Scope;
pub use home::*;

pub fn scope() -> Scope {
    Scope::new("")
        .service(home::home)
}
