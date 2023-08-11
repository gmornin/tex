use actix_web::Scope;

mod simple;

pub fn scope() -> Scope {
    Scope::new("v1").service(simple::simple)
}
