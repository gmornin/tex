use actix_web::{middleware::Logger, web::Data, App, HttpServer};
use dotenv::dotenv;
use goodmorning_services::{functions::*, *};
use std::env;

use gmt_server::{r#static, pages};

#[tokio::main]
async fn main() {
    dotenv().ok();
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let port = env::var("PORT")
        .expect("cannot find `PORT` in env")
        .parse::<u16>()
        .expect("cannot parse port to u16");
    let ip = env::var("IP").expect("cannot find `IP` in env");
    let db = get_prod_database(&get_client().await);

    println!("Starting server at {ip}:{port}");

    HttpServer::new(move || {
        App::new()
            .service(api::scope())
            // .service(pages::home)
            .service(pages::scope())
            .service(r#static)
            .wrap(Logger::default())
            .app_data(Data::new(db.clone()))
    })
    .bind((ip, port))
    .expect("cannot bind to port")
    .run()
    .await
    .expect("server down");
}
