use serde::{Deserialize, Serialize};

use goodmorning_services::{traits::ConfigTrait, LogOptions};

#[derive(Serialize, Deserialize, Clone)]
pub struct TexConfig {
    #[serde(default = "pfp_default_default")]
    pub pfp_default: String,
    #[serde(default = "generic_db_default")]
    pub generic_db: String,
    #[serde(default = "publishes_db_default")]
    pub publishes_db: String,
    #[serde(default = "static_path_default")]
    pub static_path: String,
    #[serde(default)]
    pub firejail_behavior: FirejailBehavior,
    #[serde(default)]
    pub locations: TexLocations,
    #[serde(default = "log_default")]
    pub log: LogOptions,
    #[serde(default)]
    pub outbound: OutboundOptions,
    #[serde(default = "allow_create_default")]
    pub allow_create: bool,
    #[serde(default = "topbar_urls_default")]
    pub topbar_urls: Vec<UrlItem>,
}

fn allow_create_default() -> bool {
    true
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct OutboundOptions {
    #[serde(default = "http_port_default")]
    pub http_port: u16,
    #[serde(default = "https_port_default")]
    pub https_port: u16,
    #[serde(default = "enable_http_default")]
    pub enable_http: bool,
    #[serde(default = "enable_https_default")]
    pub enable_https: bool,
    #[serde(default = "chain_default")]
    pub ssl_chain_path: String,
    #[serde(default = "key_default")]
    pub ssl_key_path: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UrlItem {
    pub label: String,
    pub url: String,
}

impl Default for OutboundOptions {
    fn default() -> Self {
        Self {
            http_port: http_port_default(),
            https_port: https_port_default(),
            enable_http: enable_http_default(),
            enable_https: enable_https_default(),
            ssl_chain_path: chain_default(),
            ssl_key_path: key_default(),
        }
    }
}

fn https_port_default() -> u16 {
    443
}

fn http_port_default() -> u16 {
    80
}

fn enable_http_default() -> bool {
    false
}

fn enable_https_default() -> bool {
    true
}

fn chain_default() -> String {
    "change me path to chain file /etc/letsencrypt/live/yourdomain.com/fullchain.pem".to_string()
}

fn key_default() -> String {
    "change me path to private key /etc/letsencrypt/live/yourdomain.com/privkey.pem".to_string()
}

impl Default for TexConfig {
    fn default() -> Self {
        Self {
            publishes_db: publishes_db_default(),
            generic_db: generic_db_default(),
            static_path: static_path_default(),
            pfp_default: pfp_default_default(),
            firejail_behavior: Default::default(),
            locations: Default::default(),
            log: log_default(),
            outbound: OutboundOptions::default(),
            allow_create: allow_create_default(),
            topbar_urls: topbar_urls_default(),
        }
    }
}

impl ConfigTrait for TexConfig {
    const LABEL: &'static str = "tex";
}

fn publishes_db_default() -> String {
    "gmtex_publishes".to_string()
}

fn generic_db_default() -> String {
    "gmtex".to_string()
}

fn static_path_default() -> String {
    "static".to_string()
}

fn pfp_default_default() -> String {
    "assets/pfp-default.svg".to_string()
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum FirejailBehavior {
    #[serde(rename = "arch")]
    Arch,
    #[serde(rename = "debian")]
    Debian,
}

impl Default for FirejailBehavior {
    fn default() -> Self {
        Self::Arch
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TexLocations {
    #[serde(default = "pdflatex_default")]
    pub pdflatex: String,
}

fn pdflatex_default() -> String {
    "pdflatex".to_string()
}

impl Default for TexLocations {
    fn default() -> Self {
        Self {
            pdflatex: pdflatex_default(),
        }
    }
}

fn log_default() -> LogOptions {
    LogOptions {
        loglabel: "gmtex".to_string(),
        termlogging: true,
        writelogging: true,
        term_log_level: goodmorning_services::LevelFilterSerde::Error,
        write_log_level: goodmorning_services::LevelFilterSerde::Debug,
    }
}

fn topbar_urls_default() -> Vec<UrlItem> {
    vec![
        UrlItem {
            url: "https://siriusmart.github.io/gm-services".to_string(),
            label: "API".to_string(),
        },
        UrlItem {
            url: "https://github.com/gmornin/gmt-server".to_string(),
            label: "Source code".to_string(),
        },
    ]
}
