use actix_web::Scope;

mod create;
mod pfp;
mod profile;
mod reset_pfp;
mod reset_profile;
mod set_pfp;
mod set_profile;

pub fn scope() -> Scope {
    Scope::new("v1")
        .service(create::create)
        .service(set_profile::set_profile)
        .service(set_pfp::set_pfp)
        .service(profile::profile)
        .service(profile::profile_by_name)
        .service(profile::profile_only)
        .service(pfp::pfp)
        .service(pfp::pfp_name)
        .service(reset_pfp::reset_pfp)
        .service(reset_profile::reset_pf)
}
