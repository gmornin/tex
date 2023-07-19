use goodmorning_services::SELF_ADDR;
use once_cell::sync::OnceCell;

pub static CSP_BASE: OnceCell<String> = OnceCell::new();
// pub static MAX_EDITABLE: OnceCell<u64> = OnceCell::new();

pub fn gmtvalinit() {
    CSP_BASE
        .set(format!(
            "script-src {}/static/scripts/",
            SELF_ADDR.get().unwrap()
        ))
        .unwrap();
    // MAX_EDITABLE
    //     .set(env::var("MAX_EDITABLE").unwrap().parse().unwrap()).unwrap();
}
