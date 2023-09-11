use actix_web::Scope;

mod account;
mod profile;

pub fn scope() -> Scope {
    Scope::new("/settings")
        .service(profile::profile)
        .service(account::account)
}
