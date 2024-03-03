use std::{path::PathBuf, sync::OnceLock};

use goodmorning_services::{
    functions::{get_client, get_database, parse_path},
    traits::ConfigTrait,
    LogOptions, SELF_ADDR,
};
use mongodb::{Collection, Database};

use crate::{
    functions::get_tex_profiles,
    structs::{OutboundOptions, TexConfig, TexProfile},
};

pub static CSP_BASE: OnceLock<String> = OnceLock::new();
pub static CSP_VAL: OnceLock<String> = OnceLock::new();

pub static PUBLISHES_DB: OnceLock<Database> = OnceLock::new();
pub static TEX_DB: OnceLock<Database> = OnceLock::new();
pub static STATIC_PATH: OnceLock<PathBuf> = OnceLock::new();
pub static STATIC_PATH_STR: OnceLock<String> = OnceLock::new();
pub static PFP_DEFAULT: OnceLock<PathBuf> = OnceLock::new();
// pub static FIREJAIL_BEHAVIOR: OnceLock<FirejailBehavior> = OnceLock::new();
pub static PDFLATEX: OnceLock<String> = OnceLock::new();
pub static XELATEX: OnceLock<String> = OnceLock::new();
pub static LUALATEX: OnceLock<String> = OnceLock::new();
pub static TEXDIR: OnceLock<String> = OnceLock::new();
pub static DISTDIR: OnceLock<String> = OnceLock::new();
pub static LOGOPTIONS: OnceLock<LogOptions> = OnceLock::new();
pub static OUTBOUND: OnceLock<OutboundOptions> = OnceLock::new();
pub static ALLOW_CREATE: OnceLock<bool> = OnceLock::new();

// paths
pub static BEEN_LOGGEDOUT: OnceLock<PathBuf> = OnceLock::new();
pub static CREATE_ACC: OnceLock<PathBuf> = OnceLock::new();
pub static NOT_TXT: OnceLock<PathBuf> = OnceLock::new();
pub static NOT_FOUND: OnceLock<PathBuf> = OnceLock::new();
pub static REMIND_VERIFY: OnceLock<PathBuf> = OnceLock::new();
pub static FINISH_SETUP: OnceLock<PathBuf> = OnceLock::new();
pub static LOGIN_ASK_LOGOUT: OnceLock<PathBuf> = OnceLock::new();
pub static REGISTER: OnceLock<PathBuf> = OnceLock::new();
pub static LOGIN: OnceLock<PathBuf> = OnceLock::new();
pub static IMG_NOT_FOUND: OnceLock<PathBuf> = OnceLock::new();

// generated htmls
pub static TOPBAR_URLS: OnceLock<String> = OnceLock::new();
pub static TOPBAR_LOGGEDOUT: OnceLock<String> = OnceLock::new();
// pub static REGISTER: OnceLock<PathBuf> = OnceLock::new();

pub static PROFILES: OnceLock<Collection<TexProfile>> = OnceLock::new();

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
    PFP_DEFAULT.set(parse_path(tex_config.pfp_default)).unwrap();
    // FIREJAIL_BEHAVIOR.set(tex_config.firejail_behavior).unwrap();
    PDFLATEX.set(tex_config.locations.pdflatex).unwrap();
    XELATEX.set(tex_config.locations.xelatex).unwrap();
    LUALATEX.set(tex_config.locations.lualatex).unwrap();
    TEXDIR.set(tex_config.locations.texdir).unwrap();
    DISTDIR.set(tex_config.locations.distdir).unwrap();
    LOGOPTIONS.set(tex_config.log).unwrap();
    OUTBOUND.set(tex_config.outbound).unwrap();
    ALLOW_CREATE.set(tex_config.allow_create).unwrap();

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
    IMG_NOT_FOUND
        .set(STATIC_PATH.get().unwrap().join("icons/notfound.svg"))
        .unwrap();

    TOPBAR_URLS
        .set(
            tex_config
                .topbar_urls
                .iter()
                .map(|item| {
                    format!(
                        r#"<a href="{}" class="top-bar-link">{}</a>"#,
                        html_escape::encode_safe(&item.url),
                        html_escape::encode_safe(&item.label)
                    )
                })
                .collect::<Vec<_>>()
                .join(""),
        )
        .unwrap();
    TOPBAR_LOGGEDOUT
        .set(format!(
            r#"<div id="top-bar">
      <div id="top-bar-left">
	<a href="/" id="top-bar-icon"><img src="/static/images/favicon-dark.svg" alt="" width="30"></a>
    {}
      </div>
      <div id="top-bar-right">
        <a href="/login" class="buttonlike buttonlike-hover" id="signin">Sign in</a>
        <a href="/login?type=new" class="buttonlike hover-dropshadow" id="top-bar-register"
          >Register</a
        >
      </div>
    </div>"#,
            TOPBAR_URLS.get().unwrap()
        ))
        .unwrap();

    PROFILES.set(get_tex_profiles()).unwrap();
}
