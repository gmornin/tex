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
    // #[serde(default)]
    // pub firejail_behavior: FirejailBehavior,
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
    #[serde(default)]
    pub limits: TexLimits,
}

fn allow_create_default() -> bool {
    true
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct OutboundOptions {
    #[serde(default = "http_port_default")]
    pub http_port: u16,
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
        }
    }
}

fn http_port_default() -> u16 {
    8080
}

impl Default for TexConfig {
    fn default() -> Self {
        Self {
            publishes_db: publishes_db_default(),
            generic_db: generic_db_default(),
            static_path: static_path_default(),
            pfp_default: pfp_default_default(),
            // firejail_behavior: Default::default(),
            locations: Default::default(),
            log: log_default(),
            outbound: OutboundOptions::default(),
            allow_create: allow_create_default(),
            topbar_urls: topbar_urls_default(),
            limits: Default::default(),
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

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub enum FirejailBehavior {
//     #[serde(rename = "arch")]
//     Arch,
//     #[serde(rename = "debian")]
//     Debian,
// }
//
// impl Default for FirejailBehavior {
//     fn default() -> Self {
//         Self::Arch
//     }
// }

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TexLocations {
    #[serde(default = "pdflatex_default")]
    pub pdflatex: String,
    #[serde(default = "lualatex_default")]
    pub lualatex: String,
    #[serde(default = "xelatex_default")]
    pub xelatex: String,
    #[serde(default = "texdir_default")]
    pub texdir: String,
    #[serde(default = "distdir_default")]
    pub distdir: String,
}

fn pdflatex_default() -> String {
    "pdflatex".to_string()
}

fn xelatex_default() -> String {
    "xelatex".to_string()
}

fn lualatex_default() -> String {
    "lualatex".to_string()
}

fn texdir_default() -> String {
    "~/.texlive2023".to_string()
}

fn distdir_default() -> String {
    "/usr/local/texlive".to_string()
}

impl Default for TexLocations {
    fn default() -> Self {
        Self {
            pdflatex: pdflatex_default(),
            xelatex: xelatex_default(),
            lualatex: lualatex_default(),
            texdir: texdir_default(),
            distdir: distdir_default(),
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

fn compile_latex_timeout_default() -> u64 {
    20000
}

fn compile_markdown_timeout_default() -> u64 {
    2000
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TexLimits {
    #[serde(default = "compile_markdown_timeout_default")]
    pub compile_markdown_timeout: u64,
    #[serde(default = "compile_latex_timeout_default")]
    pub compile_latex_timeout: u64,
}

impl Default for TexLimits {
    fn default() -> Self {
        Self {
            compile_markdown_timeout: compile_markdown_timeout_default(),
            compile_latex_timeout: compile_latex_timeout_default(),
        }
    }
}
