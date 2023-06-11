use actix_web::{middleware::Logger, web::Data, App, HttpServer};
use dotenv::dotenv;
use gmt_server::pages;
use goodmorning_services::{
    functions::{get_client, get_prod_database},
    init as valinit, *,
};
use rustls::{Certificate, PrivateKey, ServerConfig};
use rustls_pemfile::{certs, pkcs8_private_keys};
use simplelog::*;
use std::fs::OpenOptions;
use std::{
    env,
    fs::{self, File},
    io::BufReader,
    path::PathBuf,
};

#[tokio::main]
async fn main() {
    sudo::escalate_if_needed().unwrap();

    dotenv().ok();
    valinit().await;
    init();

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
                .open(format!(
                    "{}/logs/gmt-{}.log",
                    STORAGE.get().unwrap().as_str(),
                    chrono::Utc::now()
                ))
                .unwrap(),
        ),
    ])
    .unwrap();

    let config = load_rustls_config();

    let db = get_prod_database(&get_client().await);

    // let storage_limits = StorageLimits {
    //     _1: env::var("STORAGE_LIMIT_1")
    //         .expect("cannot find `STORAGE_LIMIT_1` in env")
    //         .parse()
    //         .expect("cannot parse STORAGE_LIMIT_1 to u64"),
    // };

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
            .app_data(Data::new(db.clone()))
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
    let cert_file = &mut BufReader::new(File::open(env::var("CERT_CHAIN").unwrap()).unwrap());
    let key_file = &mut BufReader::new(File::open(env::var("CERT_KEY").unwrap()).unwrap());

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
    let path = PathBuf::from(STORAGE.get().unwrap().as_str()).join("logs");
    if !path.exists() {
        fs::create_dir_all(path).unwrap();
    }
}
