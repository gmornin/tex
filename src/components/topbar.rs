// use yew::prelude::*;
//
// #[function_component]
// fn TopBar() -> Html {
//     html! {
//
//     }
// }

use std::borrow::Cow;
use std::error::Error;

use actix_files::NamedFile;
use actix_web::{HttpRequest, HttpResponse};
use goodmorning_services::structs::Account;
use yew::{function_component, html, Html, Properties};

use crate::{BEEN_LOGGEDOUT, TOPBAR_LOGGEDOUT, TOPBAR_URLS};

// pub const TOPBAR_LOGGEDOUT: &str = r#"
//     <div id="top-bar">
//       <div id="top-bar-left">
// 	<a href="/" id="top-bar-icon"><img src="/static/images/favicon-dark.svg" alt="" width="30"></a>
// 	<a href="/docs" class="top-bar-link">API</a>
// 	<a href="" class="top-bar-link">Blog</a>
//       </div>
//       <div id="top-bar-right">
//         <a href="/login" class="buttonlike buttonlike-hover" id="signin">Sign in</a>
//         <a href="/login?type=new" class="buttonlike hover-dropshadow" id="top-bar-register"
//           >Register</a
//         >
//       </div>
//     </div>"#;

#[function_component]
pub fn TopbarLoggedin(props: &TopbarLoggedinProps) -> Html {
    html! {
    <div id="top-bar">
      <div id="top-bar-left">
    <a href="/" id="top-bar-icon"><img src="/static/images/favicon-dark.svg" alt="" width="30"/></a>
        {Html::from_html_unchecked(implicit_clone::unsync::IString::Static(TOPBAR_URLS.get().unwrap()))}
      </div>
      <div id="top-bar-right">
        <img src="/static/icons/bell.svg" id="notif-bell" alt="" width="15" />
        <a href={format!("/user/{}", props.id)}> <img src={format!("/api/generic/v1/pfp/id/{}", props.id)} id="topbar-pfp" alt="" width="30" height="30" /></a>
      </div>
    </div>
    }
}

pub async fn topbar_from_req(
    req: &HttpRequest,
) -> Result<Result<(Cow<'static, str>, Option<Account>), HttpResponse>, Box<dyn Error>> {
    let token = req.cookie("token");

    match token {
        Some(token) => topbar_from_token(Some(token.value()), req).await,
        None => topbar_from_token(None, req).await,
    }
}

pub async fn topbar_option_from_req(
    req: &HttpRequest,
) -> Result<Result<Option<(Cow<'static, str>, Account)>, HttpResponse>, Box<dyn Error>> {
    let token = req.cookie("token");

    match token {
        Some(token) => topbar_option_from_token(Some(token.value()), req).await,
        None => topbar_option_from_token(None, req).await,
    }
}

pub async fn topbar_from_token(
    token: Option<&str>,
    req: &HttpRequest,
) -> Result<Result<(Cow<'static, str>, Option<Account>), HttpResponse>, Box<dyn Error>> {
    match match topbar_option_from_token(token, req).await? {
        Ok(stuff) => stuff,
        Err(res) => return Ok(Err(res)),
    } {
        Some((topbar, account)) => Ok(Ok((topbar, Some(account)))),
        None => Ok(Ok((Cow::Borrowed(TOPBAR_LOGGEDOUT.get().unwrap()), None))),
    }
}

pub async fn topbar_option_from_token(
    token: Option<&str>,
    req: &HttpRequest,
) -> Result<Result<Option<(Cow<'static, str>, Account)>, HttpResponse>, Box<dyn Error>> {
    Ok(Ok(match token {
        Some(token) => {
            let account = match Account::find_by_token(token).await? {
                Some(account) => account,
                None => {
                    return Ok(Err(NamedFile::open_async(BEEN_LOGGEDOUT.get().unwrap())
                        .await?
                        .into_response(req)))
                }
            };

            if !account
                .services
                .contains(&goodmorning_services::structs::GMServices::Tex)
            {
                return Ok(Ok(None));
            }

            Some((
                Cow::Owned(
                    yew::ServerRenderer::<TopbarLoggedin>::with_props(move || {
                        TopbarLoggedinProps { id: account.id }
                    })
                    .render()
                    .await,
                ),
                account,
            ))
        }
        None => None,
    }))
}

#[derive(Properties, PartialEq)]
pub struct TopbarLoggedinProps {
    pub id: i64,
}
