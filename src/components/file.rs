use mime::Mime;
use yew::{function_component, html, Html, Properties};

#[derive(PartialEq, Properties)]
pub struct ImgProp {
    pub url: String,
}

#[function_component]
pub fn Img(prop: &ImgProp) -> Html {
    html! {
        <img src={prop.url.clone()} id="img" />
    }
}

pub fn audio(mime: &Mime, url: &str) -> String {
    dbg!(url);
    format!(
        r#"<audio controls autoplay id="audio">
  <source src="{}" type="{}">
Your browser does not support the audio element.
</audio>"#,
        html_escape::encode_safe(url),
        html_escape::encode_safe(&mime.to_string())
    )
}
