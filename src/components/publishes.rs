use yew::{function_component, html, Html, Properties};

use crate::{functions::humantime, structs::TexPublish};

#[derive(PartialEq)]
pub struct TexPublishProp {
    pub base: TexPublish,
    pub userid: i64,
    // pub username: String,
}

#[derive(Properties, PartialEq)]
pub struct PublishesInfoProp {
    pub items: Vec<TexPublishProp>,
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

pub fn publish_info(prop: &TexPublishProp, now: u64) -> Html {
    html! {
        <li>
          <a href={format!("/publish/{}/{}", prop.userid, prop.base.id)}>
            <h3 class="title">
              <img src={format!("/static/icons/filetypes/{}.svg", ext_icon(&prop.base.ext))} class="icon" />
              {&prop.base.title}
            </h3>
            <span class="desc">{&prop.base.desc}</span>
            <span class="published">{format!("Published {}.", humantime(now - prop.base.published))}</span>
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
