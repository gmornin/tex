use actix_web::Scope;

mod profile;

pub fn scope() -> Scope {
    Scope::new("/account").service(profile::profile)
}
