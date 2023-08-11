use actix_web::Scope;

pub mod v1;

pub fn scope() -> Scope {
    Scope::new("generic").service(v1::scope())
}
