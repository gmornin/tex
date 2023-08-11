use std::path::PathBuf;

use goodmorning_services::{
    functions::{get_client, get_database, parse_path},
    traits::ConfigTrait,
    SELF_ADDR,
};
use mongodb::{Collection, Database};
use once_cell::sync::OnceCell;

use crate::{
    functions::get_tex_profiles,
    structs::{TexConfig, TexProfile},
};

pub static CSP_BASE: OnceCell<String> = OnceCell::new();
pub static PUBLISHES_DB: OnceCell<Database> = OnceCell::new();
pub static TEX_DB: OnceCell<Database> = OnceCell::new();
pub static STATIC_PATH: OnceCell<PathBuf> = OnceCell::new();
pub static STATIC_PATH_STR: OnceCell<String> = OnceCell::new();

// paths
pub static BEEN_LOGGEDOUT: OnceCell<PathBuf> = OnceCell::new();
pub static CREATE_ACC: OnceCell<PathBuf> = OnceCell::new();
pub static NOT_TXT: OnceCell<PathBuf> = OnceCell::new();
pub static NOT_FOUND: OnceCell<PathBuf> = OnceCell::new();
pub static REMIND_VERIFY: OnceCell<PathBuf> = OnceCell::new();
pub static FINISH_SETUP: OnceCell<PathBuf> = OnceCell::new();
pub static LOGIN_ASK_LOGOUT: OnceCell<PathBuf> = OnceCell::new();
pub static REGISTER: OnceCell<PathBuf> = OnceCell::new();
pub static LOGIN: OnceCell<PathBuf> = OnceCell::new();
// pub static REGISTER: OnceCell<PathBuf> = OnceCell::new();

pub static PROFILES: OnceCell<Collection<TexProfile>> = OnceCell::new();

pub async fn gmtvalinit() {
    CSP_BASE
        .set(format!(
            "script-src {}/static/scripts/",
            SELF_ADDR.get().unwrap()
        ))
        .unwrap();

    let mongo = get_client().await;
    let tex_config = *TexConfig::load().unwrap();
    PUBLISHES_DB
        .set(get_database(&mongo, &tex_config.publishes_db))
        .unwrap();
    TEX_DB
        .set(get_database(&mongo, &tex_config.generic_db))
        .unwrap();
    STATIC_PATH.set(parse_path(tex_config.static_path)).unwrap();
    STATIC_PATH_STR
        .set(STATIC_PATH.get().unwrap().to_str().unwrap().to_string())
        .unwrap();

    BEEN_LOGGEDOUT
        .set(STATIC_PATH.get().unwrap().join("htmls/been-loggedout.html"))
        .unwrap();
    CREATE_ACC
        .set(STATIC_PATH.get().unwrap().join("htmls/create-acc.html"))
        .unwrap();
    NOT_TXT
        .set(STATIC_PATH.get().unwrap().join("htmls/not-txt.html"))
        .unwrap();
    NOT_FOUND
        .set(STATIC_PATH.get().unwrap().join("htmls/notfound.html"))
        .unwrap();
    REMIND_VERIFY
        .set(STATIC_PATH.get().unwrap().join("htmls/remindverify.html"))
        .unwrap();
    FINISH_SETUP
        .set(STATIC_PATH.get().unwrap().join("htmls/finish-setup.html"))
        .unwrap();
    LOGIN_ASK_LOGOUT
        .set(
            STATIC_PATH
                .get()
                .unwrap()
                .join("htmls/login-ask-logout.html"),
        )
        .unwrap();
    REGISTER
        .set(STATIC_PATH.get().unwrap().join("htmls/register.html"))
        .unwrap();
    LOGIN
        .set(STATIC_PATH.get().unwrap().join("htmls/login.html"))
        .unwrap();

    PROFILES.set(get_tex_profiles()).unwrap();
}
