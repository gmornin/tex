mod utils;

use js_sys::{RegExp, JSON};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::*;

const GMT: &str = " - GMT";

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn main() {
    update();
}

#[wasm_bindgen]
pub fn update() {
    let window = web_sys::window().unwrap();
    let doc = window.document().unwrap();
    let params_string = window.location().search().unwrap();
    let params =
        UrlSearchParams::new_with_str(&params_string).unwrap_or(UrlSearchParams::new().unwrap());
    let r#type = params.get("type").unwrap_or_default();

    let (hide, show, title) = match r#type.as_str() {
        "new" => ("signin", "signup", "Create account"),
        _ => ("signup", "signin", "Sign in"),
    };

    doc.set_title(&format!("{title}{GMT}"));

    let hide = doc.get_elements_by_class_name(hide);
    (0..hide.length()).for_each(|i| {
        let element = hide.get_with_index(i).unwrap();
        element.class_list().add_1("hide").unwrap();
    });

    let show = doc.get_elements_by_class_name(show);
    (0..show.length()).for_each(|i| {
        let element = show.get_with_index(i).unwrap();
        element.class_list().remove_1("hide").unwrap();
    });
}

#[wasm_bindgen]
pub fn change_state(t: &str) {
    let window = web_sys::window().unwrap();
    let history = window.history().unwrap();

    let new_url = format!(
        "{}{}",
        window.location().pathname().unwrap(),
        if t == "signup" { "?type=new" } else { "" }
    );

    history
        .push_state_with_url(&JsValue::UNDEFINED, "", Some(&new_url))
        .unwrap();

    update();
}

#[wasm_bindgen]
pub async fn signup() -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let doc = window.document().unwrap();
    let username = get_value(&doc, "username");
    let email = get_value(&doc, "email");
    let password1 = get_value(&doc, "password1");
    let password2 = get_value(&doc, "password2");
    let error_display = doc.get_element_by_id("error-display").unwrap();

    let error = if username.is_empty()
        || email.is_empty()
        || password1.is_empty()
        || password2.is_empty()
    {
        Some("One or more fields are empty")
    } else if RegExp::new(".+@.+\\..+", "").exec(&email).is_none() {
        Some("Invalid email address")
    } else if password1 != password2 {
        Some("Password mismatch")
    } else {
        None
    };

    if error.is_some() {
        update_error(&error_display, error)?;
        return Ok(());
    }

    let req = CreateAccount {
        username,
        email,
        password: password1,
    };

    let headers = Headers::new()?;
    headers.append("content-type", "application/json")?;

    disable_buttons(&doc, true);

    let res = JsFuture::from(
        window.fetch_with_str_and_init(
            "/api/v1/account/create",
            &RequestInit::new()
                .method("POST")
                .headers(&headers)
                .body(Some(&JsValue::from(JSON::stringify(
                    &serde_wasm_bindgen::to_value(&req)?,
                )?))),
        ),
    )
    .await?;

    let json = JsFuture::from(res.dyn_ref::<Response>().unwrap().json()?).await?;
    let res: Responses = serde_wasm_bindgen::from_value(json)?;

    let error = match res {
        Responses::Created { token, id: _id } => {
            let html_doc = doc.dyn_ref::<HtmlDocument>().unwrap();
            html_doc.set_cookie(&format!(
                "token={token}; path=/; max-age=31536000; same-site=lax; Secure"
            ))?;
            doc.location().unwrap().set_href("/verify-reminder")?;
            return Ok(());
        }
        Responses::Error { kind } => Some(match kind {
            ErrorKind::UsernameTaken => "The username you entered is already in use",
            ErrorKind::EmailTaken => "The email you entered is already in use",
            ErrorKind::External(e) => external_error(e),
            _ => unreachable!(),
        }),
        _ => unreachable!(),
    };

    update_error(&error_display, error)?;

    disable_buttons(&doc, false);

    Ok(())
}

#[wasm_bindgen]
pub async fn signin() -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let doc = window.document().unwrap();
    let identifier = get_value(&doc, "identifier");
    let password = get_value(&doc, "password");
    let error_display = doc.get_element_by_id("error-display").unwrap();

    let mut error = match (identifier.is_empty(), password.is_empty()) {
        (true, true) => Some("Identifier and password cannt be blank"),
        (true, false) => Some("Identifier cannot be blank"),
        (false, true) => Some("Password cannot be blank"),
        (false, false) => None,
    };

    let identifier_type = match (
        identifier.contains("@"),
        RegExp::new(".+@.+\\..+", "").exec(&identifier).is_some(),
    ) {
        (_, true) => IdentifierType::Email,
        (true, false) => {
            error = Some("Invalid email address");
            IdentifierType::Username
        }
        _ => IdentifierType::Username,
    };

    if error.is_some() {
        update_error(&error_display, error)?;
        return Ok(());
    }

    let req = GetToken {
        identifier,
        identifier_type,
        password,
    };

    let headers = Headers::new()?;
    headers.append("content-type", "application/json")?;

    disable_buttons(&doc, true);

    let res = JsFuture::from(
        window.fetch_with_str_and_init(
            "/api/v1/account/gettoken",
            &RequestInit::new()
                .method("POST")
                .headers(&headers)
                .body(Some(&JsValue::from(JSON::stringify(
                    &serde_wasm_bindgen::to_value(&req)?,
                )?))),
        ),
    )
    .await?;

    let json = JsFuture::from(res.dyn_ref::<Response>().unwrap().json()?).await?;
    let res: Responses = serde_wasm_bindgen::from_value(json)?;

    let error = match res {
        Responses::GetToken { token } => {
            let html_doc = doc.dyn_ref::<HtmlDocument>().unwrap();
            html_doc.set_cookie(&format!(
                "token={token}; path=/; max-age=31536000; same-site=lax; Secure"
            ))?;
            doc.location().unwrap().set_href("/")?;
            return Ok(());
        }
        Responses::Error { kind } => Some(match kind {
            ErrorKind::NoSuchUser => "No user with that name or email address",
            ErrorKind::PasswordIncorrect => "Incorrect password",
            ErrorKind::External(e) => external_error(e),
            _ => unreachable!(),
        }),
        _ => unreachable!(),
    };

    update_error(&error_display, error)?;

    disable_buttons(&doc, false);

    Ok(())
}

#[wasm_bindgen]
pub async fn handle_enter() -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let params_string = window.location().search().unwrap();
    let params =
        UrlSearchParams::new_with_str(&params_string).unwrap_or(UrlSearchParams::new().unwrap());
    let r#type = params.get("type").unwrap_or_default();

    match r#type.as_str() {
        "new" => signup().await,
        _ => signin().await,
    }
}

fn external_error(e: String) -> &'static str {
    web_sys::console::error_1(&JsValue::from_str(&e));
    "An external error occured (check console for more info)"
}

fn update_error(disp: &Element, error: Option<&str>) -> Result<(), JsValue> {
    disp.set_text_content(error);
    if error.is_some() {
        disp.class_list().remove_1("hide")?;
    } else {
        disp.class_list().add_1("hide")?;
    }

    Ok(())
}

fn get_value(doc: &Document, id: &str) -> String {
    doc.get_element_by_id(id)
        .unwrap()
        .dyn_ref::<HtmlInputElement>()
        .unwrap()
        .value()
}

fn disable_buttons(doc: &Document, val: bool) {
    let signin = doc.get_element_by_id("submit-signin").unwrap();
    let signup = doc.get_element_by_id("submit-create").unwrap();
    signin
        .dyn_ref::<HtmlButtonElement>()
        .unwrap()
        .set_disabled(val);
    signup
        .dyn_ref::<HtmlButtonElement>()
        .unwrap()
        .set_disabled(val);

    if val {
        signin.set_text_content(Some("Signing in..."));
        signup.set_text_content(Some("Creating account..."))
    } else {
        signin.set_text_content(Some("Sign in"));
        signup.set_text_content(Some("Create account"))
    }
}

#[derive(Deserialize)]
#[serde(tag = "type")]
enum Responses {
    #[serde(rename = "error")]
    Error { kind: ErrorKind },
    #[serde(rename = "token")]
    GetToken { token: String },
    #[serde(rename = "created")]
    Created { id: String, token: String },
}

#[derive(Deserialize)]
enum ErrorKind {
    #[serde(rename = "no such user")]
    NoSuchUser,
    #[serde(rename = "password incorrect")]
    PasswordIncorrect,
    #[serde(rename = "username taken")]
    UsernameTaken,
    #[serde(rename = "email taken")]
    EmailTaken,
    #[serde(rename = "external")]
    External(String),
}

#[derive(Serialize)]
struct GetToken {
    pub identifier: String,
    pub identifier_type: IdentifierType,
    pub password: String,
}

#[derive(Serialize, PartialEq, Eq, Clone, Copy)]
enum IdentifierType {
    #[serde(rename = "email")]
    Email,
    // #[serde(rename = "id")]
    // Id,
    #[serde(rename = "username")]
    Username,
}

#[derive(Serialize)]
struct CreateAccount {
    pub username: String,
    pub email: String,
    pub password: String,
}
