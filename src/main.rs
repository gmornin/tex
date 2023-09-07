use actix_web::web::Data;
use actix_web::{middleware::Logger, App, HttpServer};
use gmt_server::{api, pages, LOGOPTIONS, OUTBOUND};
use goodmorning_services::functions::parse_path;
use goodmorning_services::structs::Jobs;
use goodmorning_services::{init, load_rustls_config, logs_init};

#[tokio::main]
async fn main() {
    init().await;
    gmt_server::gmtvalinit().await;
    logs_init(LOGOPTIONS.get().unwrap());

    let outbounds = OUTBOUND.get().unwrap().clone();
    let config = load_rustls_config(
        &parse_path(outbounds.ssl_chain_path),
        &parse_path(outbounds.ssl_key_path),
    );
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
            .wrap(Logger::default())
            .app_data(jobs.clone())
        // .app_data(Data::new(EMAIL_VERIFICATION_DURATION))
        // .app_data(Data::new(storage_limits))
        // .wrap(middleware)
    });

    println!("Server started");
    match (outbounds.enable_http, outbounds.enable_https) {
        (true, true) => server
            .bind(("0.0.0.0", outbounds.http_port))
            .expect("cannot bind to port")
            .bind_rustls(("0.0.0.0", outbounds.https_port), config)
            .unwrap()
            .run()
            .await
            .unwrap(),
        (true, false) => server
            .bind(("0.0.0.0", outbounds.http_port))
            .expect("cannot bind to port")
            .run()
            .await
            .unwrap(),
        (false, true) => server
            .bind_rustls(("0.0.0.0", outbounds.https_port), config)
            .unwrap()
            .run()
            .await
            .unwrap(),
        _ => panic!("enabled either http or https bro"),
    }
}
