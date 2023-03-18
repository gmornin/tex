// use yew::prelude::*;
//
// #[function_component]
// fn TopBar() -> Html {
//     html! {
//
//     }
// }

pub const TOPBAR_LOGGEDOUT: &str = r#"
    <div id="top-bar">
      <div id="top-bar-left">
        <a href="/" id="top-bar-icon">Icon</a>
	<a href="/docs" class="top-bar-link">API</a>
	<a href="" class="top-bar-link">Blog</a>
      </div>
      <div id="top-bar-right">
        <a href="/login" class="buttonlike buttonlike-hover" id="signin">Sign in</a>
        <a href="/login?type=new" class="buttonlike hover-dropshadow" id="top-bar-register"
          >Register</a
        >
      </div>
    </div>"#;
