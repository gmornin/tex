use actix_web::Scope;

mod createcoll;
mod publish;
mod published_file;
mod published_info;
mod publishes;
mod update_publish;

pub fn scope() -> Scope {
    Scope::new("/v1")
        .service(publish::publish)
        .service(publishes::publishes)
        .service(publishes::publishes_username)
        .service(published_file::published_file)
        .service(published_info::publish_info)
        .service(update_publish::update_publish)
}
