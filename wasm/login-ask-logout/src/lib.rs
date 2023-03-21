mod utils;

use wasm_bindgen::prelude::*;
use web_sys::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn logout() -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let doc = window.document().unwrap();
    let html_doc = doc.dyn_ref::<HtmlDocument>().unwrap();
    html_doc.set_cookie(&format!("token=expired; path=/; Secure; expires=Thu, 01 Jan 1970 00:00:01 GMT"))?;

    doc.location().unwrap().reload()?;
    Ok(())
}
