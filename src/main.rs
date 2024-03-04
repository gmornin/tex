use actix_web::web::Data;
use actix_web::{middleware::Logger, App, HttpServer};
use gmt_server::{api, pages, LOGOPTIONS, OUTBOUND};
use goodmorning_services::structs::Jobs;
use goodmorning_services::{init, logs_init, FORWARDED};

#[tokio::main]
async fn main() {
    init().await;
    gmt_server::gmtvalinit().await;
    logs_init(LOGOPTIONS.get().unwrap());

    let outbounds = OUTBOUND.get().unwrap().clone();
    let jobs: Data<Jobs> = Data::new(Jobs::default());

    let server = HttpServer::new(move || {
        // let backend = InMemoryBackend::builder().build();
        // let input = SimpleInputFunctionBuilder::new(Duration::from_secs(60), 5)
        //     .real_ip_key()
        //     .build();
        // let middleware = RateLimiter::builder(backend, input).add_headers().build();
        App::new()
            .service(api::scope())
            .service(pages::scope())
            .wrap(if *FORWARDED.get().unwrap() {
                Logger::new(r#"%{Forwarded}i "%r" %s %b "%{Referer}i" "%{User-Agent}i" %T"#)
            } else {
                Logger::default()
            })
            .app_data(jobs.clone())
        // .app_data(Data::new(EMAIL_VERIFICATION_DURATION))
        // .app_data(Data::new(storage_limits))
        // .wrap(middleware)
    })
    .bind(("0.0.0.0", outbounds.http_port))
    .expect("cannot bind to port");

    println!("Server started");
    server.run().await.unwrap()
}
