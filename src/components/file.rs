use std::error::Error;

use tokio::fs;

pub fn img(url: &str) -> String {
    format!(
        r#"<img src="{}" id="img" />"#,
        html_escape::encode_safe(url)
    )
}

pub fn audio(url: &str) -> String {
    format!(
        r#"<audio controls autoplay id="audio">
  <source src="{}">
Your browser does not support the audio element.
</audio>"#,
        html_escape::encode_safe(url),
    )
}

pub fn video(url: &str) -> String {
    format!(
        r#"<video id="player" controls>
    <source src="{}">
Your browser does not support the video tag.
</video> "#,
        html_escape::encode_safe(url)
    )
}

pub fn html_friendly_mime(mime: &str) -> &str {
    match mime {
        "audio/x-opus+ogg" => "audio/ogg",
        _ => mime,
    }
}

pub fn ext_lang(ext: &str) -> &str {
    match ext {
        "asp" => "aspnet",
        "bat" => "batch",
        "ex" | "exs" => "elixir",
        "erl" => "erlang",
        "gd" => "gdscript",
        "rs" => "rust",
        s => s,
    }
}

pub async fn text(path: &std::path::Path) -> Result<(String, &'static str), Box<dyn Error>> {
    let content = fs::read_to_string(path).await?;

    let content_safe = html_escape::encode_safe(&content);
    let lang = ext_lang(
        path.file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .split('.')
            .last()
            .unwrap(),
    );

    let display = format!("<pre id=\"display\" class=\"line-numbers\"><code class=\"language-{lang}\">{content_safe}</code></pre>");

    Ok((display, "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism.js\"></script>"))
}

pub async fn html(path: &std::path::Path) -> Result<(String, &'static str), Box<dyn Error>> {
    let content = fs::read_to_string(path).await?;
    Ok((
        content,
        "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/html.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism.js\"></script>",
    ))
}
