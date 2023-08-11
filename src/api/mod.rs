use actix_web::Scope;
use goodmorning_services::api::{accounts, jobs, storage, triggers, usercontent};

pub mod compile;
pub mod generic;
pub mod publish;

pub fn scope() -> Scope {
    Scope::new("api")
        .service(generic::scope())
        .service(compile::scope())
        .service(publish::scope())
        .service(accounts::scope())
        .service(jobs::scope())
        .service(storage::scope())
        .service(triggers::scope())
        .service(usercontent::scope())
}
