use goodmorning_bindings::services::v1::V1DirItem;
use serde::Serialize;
use yew::{function_component, html, Html, Properties};

#[function_component]
pub fn Path(prop: &PathProp) -> Html {
    if prop.path.is_empty() {
        return html! {
              <span class="fragment">{prop.id}</span>
        };
    }
    let fragments = prop.path.split('/').collect::<Vec<_>>();
    html! {
      <><span class="fragment" path={prop.id.to_string()}>{prop.id}</span>
      <span class="connect">{">"}</span>
      {
          for fragments.iter().enumerate().map(|(i, fragment)| html! { <span class="fragment" path={format!("{}/{}", prop.id, fragments[0..i+1].join("/"))}>{fragment}</span> }).intersperse(html! {<span class="connect">{">"}</span>})
      }
    </>
    }
}

#[derive(Properties, PartialEq)]
pub struct PathProp {
    pub path: String,
    pub id: i64,
}

#[derive(PartialEq, Eq, Serialize)]
pub struct FsItem {
    pub name: String,
    pub is_file: bool,
    pub size: u64,
}

impl From<V1DirItem> for FsItem {
    fn from(value: V1DirItem) -> Self {
        Self {
            name: value.name,
            is_file: value.is_file,
            size: value.size,
        }
    }
}

#[function_component]
pub fn FsItems(prop: &FsItemProp) -> Html {
    let path_str = serde_json::to_string(
        &std::path::Path::new(&prop.id.to_string())
            .join(&prop.path)
            .to_str()
            .unwrap()
            .trim_matches('/'),
    )
    .unwrap();
    html! {
        <><ul id="fslist">
        {
            for prop.items.iter().map(|item| {
            let path = if prop.path.is_empty() { format!("{}/{}", prop.id, item.name)} else {format!("{}/{}/{}", prop.id, prop.path, item.name)};
                if item.is_file {
                if item.name.starts_with('.') {
                      html! {<li class="hidden-file" path={path} isFile="true">{&item.name}</li>}
                } else {
                      html! {<li class="file" path={path} isFile="true">{&item.name}</li>}
                }
            } else if item.name.starts_with('.') {
                  html! {<li class="hidden-dir" path={path}>{format!("{}/", item.name)}</li>}
            } else {
                  html! {<li class="dir" path={path}>{format!("{}/", item.name)}</li>}
            }})
        }
        </ul>
        <script nonce={prop.nonce.clone()}>{format!("var cache = {{{path_str}: {}}}; window.history.replaceState({{ path: {path_str}}}, '')", serde_json::to_string(&prop.items).unwrap())}</script></>
    }
}

#[derive(Properties, PartialEq)]
pub struct FsItemProp {
    pub id: i64,
    pub path: String,
    pub items: Vec<FsItem>,
    pub nonce: String,
}
