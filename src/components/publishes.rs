use yew::{function_component, html, Html, Properties};

use crate::{functions::humantime, structs::TexPublish};

#[derive(Properties, PartialEq)]
pub struct PublishesInfoProp {
    pub items: Vec<TexPublish>,
}

#[function_component]
pub fn PublishesInfo(prop: &PublishesInfoProp) -> Html {
    let now = chrono::Utc::now().timestamp() as u64;
    html! {
        <ul id="publist">
        {
            for prop.items.iter().map(|item| publish_info(item, now))
        }
        </ul>
    }
}

pub fn publish_info(prop: &TexPublish, now: u64) -> Html {
    html! {
        <li>
          <a href="">
            <h3 class="title">
              <img src={format!("/static/icons/filetypes/{}.svg", ext_icon(&prop.ext))} class="icon" />
              {&prop.title}
            </h3>
            <span class="desc">{&prop.desc}</span>
            <span class="published">{format!("Published {}.", humantime(now - prop.published))}</span>
          </a>
        </li>
    }
}

fn ext_icon(ext: &str) -> &'static str {
    match ext {
        "pdf" => "pdf",
        _ => "unspecified",
    }
}
