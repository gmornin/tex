use actix_web::web::Data;
use actix_web::{middleware::Logger, App, HttpServer};
use gmt_server::pages;
use goodmorning_services::structs::Jobs;
use goodmorning_services::{init as valinit, *};
use rustls::{Certificate, PrivateKey, ServerConfig};
use rustls_pemfile::{certs, pkcs8_private_keys};
use simplelog::*;
use std::fs::OpenOptions;
use std::{
    fs::{self, File},
    io::BufReader,
};

#[tokio::main]
async fn main() {
    sudo::escalate_if_needed().unwrap();

    valinit().await;
    init();
    gmt_server::gmtvalinit();

    CombinedLogger::init(vec![
        TermLogger::new(
            LevelFilter::Info,
            Config::default(),
            TerminalMode::Mixed,
            ColorChoice::Auto,
        ),
        WriteLogger::new(
            LevelFilter::Debug,
            Config::default(),
            OpenOptions::new()
                .create(true)
                .write(true)
                .truncate(true)
                .open(
                    LOGS_PATH
                        .get()
                        .unwrap()
                        .join(format!("gmt-{}.log", chrono::Utc::now())),
                )
                .unwrap(),
        ),
    ])
    .unwrap();

    let config = load_rustls_config();
    let jobs: Data<Jobs> = Data::new(Jobs::default());

    HttpServer::new(move || {
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
    })
    .bind(("0.0.0.0", 80))
    .expect("cannot bind to port")
    .bind_rustls(("0.0.0.0", 443), config)
    .unwrap()
    .run()
    .await
    .expect("server down");
}

fn load_rustls_config() -> rustls::ServerConfig {
    // init server config builder with safe defaults
    let config = ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth();

    // load TLS key/cert files
    let cert_file = &mut BufReader::new(File::open(CERT_CHAIN.get().unwrap()).unwrap());
    let key_file = &mut BufReader::new(File::open(CERT_KEY.get().unwrap()).unwrap());

    // convert files to key/cert objects
    let cert_chain = certs(cert_file)
        .unwrap()
        .into_iter()
        .map(Certificate)
        .collect();
    let mut keys: Vec<PrivateKey> = pkcs8_private_keys(key_file)
        .unwrap()
        .into_iter()
        .map(PrivateKey)
        .collect();

    // exit if no keys could be parsed
    if keys.is_empty() {
        eprintln!("Could not locate PKCS 8 private keys.");
        std::process::exit(1);
    }

    config.with_single_cert(cert_chain, keys.remove(0)).unwrap()
}

fn init() {
    let path = LOGS_PATH.get().unwrap();
    if !path.exists() {
        fs::create_dir_all(path).unwrap();
    }
}
