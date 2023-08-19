use std::{error::Error, ffi::OsStr};

use log::*;
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

pub async fn text(path: &std::path::Path) -> Result<(String, &'static str), Box<dyn Error>> {
    let content = fs::read_to_string(path).await?;
    let (class, css) = match path.extension().unwrap_or(OsStr::new("")).to_str().unwrap() {
        "tex" => ("latex", "<link href=\"/static/css/prism/tex.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/tex.js\"></script>"),
        "rs" => ("rust", "<link href=\"/static/css/prism/rust.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/rust.js\"></script>"),
        "md" => ("markdown", "<link href=\"/static/css/prism/md.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/md.js\"></script>"),
        "toml" => ("toml", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/toml.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/toml.js\"></script>"),
        "cr" => ("crystal", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/crystal.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/crystal.js\"></script>"),
        "html" | "css" | "xml" | "rss" => ("markup", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/markup.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/markup.js\"></script>"),
        "asm" => ("asm", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/asm.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/asm.js\"></script>"),
        "sh" => ("sh", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/sh.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/sh.js\"></script>"),
        "js" => ("js", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/js.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/js.js\"></script>"),
        "c" => ("c", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/c.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/c.js\"></script>"),
        "cpp" => ("cpp", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/cpp.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/cpp.js\"></script>"),
        "cs" => ("cs", "<link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><link href=\"/static/css/prism/cs.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/cs.js\"></script>"),
        ext => {
            if !ext.is_empty() {warn!("no highlighter for {ext}")};
            ("text", "<link href=\"/static/css/prism/plain.css\" rel=\"stylesheet\" /><link href=\"/static/css/textpreview.css\" rel=\"stylesheet\" /><script src=\"/static/scripts/prism/plain.js\"></script>")
        }
    };

    let content_safe = html_escape::encode_safe(&content);

    let display = format!("<pre id=\"display\" class=\"line-numbers\"><code class=\"language-{class}\">{content_safe}</code></pre>");

    Ok((display, css))
}

pub async fn html(path: &std::path::Path) -> Result<(String, &'static str), Box<dyn Error>> {
    let content = fs::read_to_string(path).await?;
    Ok((
        content,
        "<link href=\"/static/css/html.css\" rel=\"stylesheet\" />",
    ))
}
