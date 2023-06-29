// use yew::prelude::*;
//
// #[function_component]
// fn TopBar() -> Html {
//     html! {
//
//     }
// }

use yew::{function_component, html, Html, Properties};

pub const TOPBAR_LOGGEDOUT: &str = r#"
    <div id="top-bar">
      <div id="top-bar-left">
	<a href="/" id="top-bar-icon"><img src="/static/images/favicon-dark.svg" alt="" width="30"></a>
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

#[function_component]
pub fn TopbarLoggedin(props: &TopbarLoggedinProps) -> Html {
    html! {
    <div id="top-bar">
      <div id="top-bar-left">
    <a href="/" id="top-bar-icon"><img src="/static/images/favicon-dark.svg" alt="" width="30"/></a>
        <a href="/docs" class="top-bar-link">{"API"}</a>
        <a href="" class="top-bar-link">{"Blog"}</a>
      </div>
      <div id="top-bar-right">
        <img src="/static/icons/bell.svg" id="notif-bell" alt="" width="15" />
        <a href={format!("/user/{}", props.id)}> <img src={format!("/api/tex/generic/v1/pfp/id/{}", props.id)} id="topbar-pfp" alt="" width="30" height="30" /></a>
      </div>
    </div>
    }
}

#[derive(Properties, PartialEq)]
pub struct TopbarLoggedinProps {
    pub id: i64,
}
