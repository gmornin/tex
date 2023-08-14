use serde::{Deserialize, Serialize};

use goodmorning_services::traits::ConfigTrait;

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
}

impl Default for TexConfig {
    fn default() -> Self {
        Self {
            publishes_db: publishes_db_default(),
            generic_db: generic_db_default(),
            static_path: static_path_default(),
            pfp_default: pfp_default_default(),
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
