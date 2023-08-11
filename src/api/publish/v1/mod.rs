use actix_web::Scope;

mod createcoll;
mod publish;
mod publishes;

pub fn scope() -> Scope {
    Scope::new("/v1")
        .service(publish::publish)
        .service(publishes::publishes)
        .service(publishes::publishes_username)
}
