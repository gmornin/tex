use std::ffi::OsStr;
use std::path::{Path, PathBuf};

use goodmorning_services::bindings::services::v1::*;
use goodmorning_services::bindings::structs::*;
use goodmorning_services::bindings::*;
use goodmorning_services::traits::*;
use pulldown_cmark::*;
use scraper::{Html, Selector};
use tokio::fs;
use tokio::io::AsyncWriteExt;
use tokio::process::Command;

use crate::{DISTDIR, LUALATEX, PDFLATEX, TEXDIR, XELATEX};

#[derive(Clone, Debug)]
pub struct CompileTask {
    pub from: FromFormat,
    pub compiler: Compiler,
    pub to: ToFormat,
    pub source: PathBuf,
    pub user_path: PathBuf,
    pub restrict_path: PathBuf,
}

impl CompileTask {
    pub fn to_display(&self) -> TexCompileDisplay {
        TexCompileDisplay {
            from: self.from,
            to: self.to,
            compiler: self.compiler,
            path: self.user_path.to_str().unwrap().to_string(),
        }
    }
}

#[async_trait::async_trait]
impl TaskItem for CompileTask {
    fn to(&self, _ver: &ApiVer) -> Box<dyn goodmorning_services::bindings::traits::SerdeAny> {
        Box::new(self.to_display())
    }

    async fn run(&self, ver: &ApiVer, id: u64) -> CommonRes {
        match fs::try_exists(&self.source).await {
            Err(e) => return CommonRes::external(e.to_string(), &ApiVer::V1),
            Ok(false) => {
                return match ver {
                    ApiVer::V1 => CommonRes::V1(Err(V1Error::FileNotFound)),
                }
            }
            _ => {}
        }

        match (
            self.from,
            self.to,
            self.compiler,
            self.user_path
                .extension()
                .unwrap_or(OsStr::new(""))
                .to_str()
                .unwrap(),
        ) {
            (
                FromFormat::Markdown,
                ToFormat::Html,
                Compiler::Default | Compiler::PulldownCmark,
                "md",
            ) => pulldown_cmark_md2html(&self.source, &self.user_path, ver, id).await,
            (FromFormat::Latex, ToFormat::Pdf, Compiler::Default | Compiler::Pdflatex, "tex") => {
                texlive_latex2pdf(
                    PDFLATEX.get().unwrap(),
                    id,
                    &self.user_path,
                    &self.source,
                    &self.restrict_path,
                    ver,
                )
                .await
            }
            (FromFormat::Latex, ToFormat::Pdf, Compiler::Xelatex, "tex") => {
                texlive_latex2pdf(
                    XELATEX.get().unwrap(),
                    id,
                    &self.user_path,
                    &self.source,
                    &self.restrict_path,
                    ver,
                )
                .await
            }
            (FromFormat::Latex, ToFormat::Pdf, Compiler::Lualatex, "tex") => {
                texlive_latex2pdf(
                    LUALATEX.get().unwrap(),
                    id,
                    &self.user_path,
                    &self.source,
                    &self.restrict_path,
                    ver,
                )
                .await
            }
            _ => CommonRes::any_err(Box::new(TexCompileError::InvalidCompileRequest), ver),
        }
    }
}

// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub struct TexCompileDisplay {
//     from: FromFormat,
//     to: ToFormat,
//     compiler: Compiler,
//     path: String,
// }
//
// #[typetag::serde(name = "tex compile")]
// impl SerdeAny for TexCompileDisplay {
//     fn exit_status(&self) -> u16 {
//         200
//     }
// }
//
// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub enum TexCompileError {
//     InvalidCompileRequest
// }
//
// #[typetag::serde(name = "tex compile error")]
// impl SerdeAny for TexCompileError {
//     fn exit_status(&self) -> u16 {
//         500
//     }
// }
//
// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub struct TexCompileRes {
//     pub newpath: String,
//     pub id: u64
// }
//
// #[typetag::serde(name = "tex compiled")]
// impl SerdeAny for TexCompileRes {
//     fn exit_status(&self) -> u16 {
//         200
//     }
// }

pub async fn pulldown_cmark_md2html(
    source: &Path,
    user_path: &Path,
    ver: &ApiVer,
    id: u64,
) -> CommonRes {
    let md = catch!(fs::read_to_string(source).await, ver);
    let mut buf = String::new();
    html::push_html(&mut buf, Parser::new_ext(&md, Options::all()));
    let html = buf.clone();

    let modules =
        tokio::task::spawn_blocking(move || {
            let doc = Html::parse_fragment(&html);
            doc.select(&Selector::parse(r#"script[type="modules"]"#).unwrap())
                .flat_map(|elem| {
                    let inner = elem.inner_html().replace([' ', '\n'], "");
                    inner.split(',').map(|module| match module {
                "prism" => r#"<link href="/static/css/prism.css" rel="stylesheet" defer />
<script src="/static/scripts/prism.js" defer></script>"#,
                "katex" => r#"<link rel="stylesheet" href="/static/scripts/katex/katex.min.css">
<script defer src="/static/scripts/katex/katex.min.js"></script>
<script defer src="/static/scripts/katex/contrib/auto-render.min.js"></script>"#,
                "tikzjax" => r#"<script src="/static/scripts/tikzjax/tikzjax.js" defer></script>
<script src="/static/scripts/tikzjax/script.js" defer></script>
<link rel="stylesheet" href="/static/css/tikzjax/fonts.css" defer>
<link rel="stylesheet" href="/static/css/tikzjax/style.css" defer>"#,
                _ => ""
            }).collect::<Vec<_>>()
                })
                .collect::<Vec<&str>>()
        })
        .await
        .unwrap();

    if !modules.is_empty() {
        buf.push('\n');
        buf.push_str(&modules.join("\n"));
    }

    let newfile = source.with_extension("html");
    let mut file = catch!(
        fs::OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open(&newfile)
            .await,
        ver
    );
    catch!(file.write_all(buf.as_bytes()).await, ver);

    match ver {
        ApiVer::V1 => CommonRes::V1(Ok(V1Response::TexCompiled {
            id,
            newpath: user_path
                .with_extension("html")
                .to_str()
                .unwrap()
                .to_string(),
        })),
    }
}

pub async fn texlive_latex2pdf(
    // source: &Path,
    bin: &str,
    taskid: u64,
    user_path: &Path,
    source: &Path,
    restrict_path: &Path,
    ver: &ApiVer,
) -> CommonRes {
    let parent = source.parent().unwrap().to_string_lossy();

    // println!(
    //     "{}",
    //     shlex::try_join(
    //         [
    //             "firejail",
    //             &format!(
    //                 "--whitelist={}",
    //                 shlex::try_quote(restrict_path.to_string_lossy().as_ref()).unwrap()
    //             ),
    //             &format!(
    //                 "--whitelist={}",
    //                 shlex::try_quote(TEXDIR.get().unwrap()).unwrap()
    //             ),
    //             "--noprofile",
    //             "sh",
    //             "-c",
    //             &format!(
    //                 "cd {} && {} -interaction nonstopmode -halt-on-error -file-line-error {}",
    //                 shlex::try_quote(parent.as_ref()).unwrap(),
    //                 shlex::try_quote(bin).unwrap(),
    //                 shlex::try_quote(source.to_string_lossy().as_ref()).unwrap()
    //             ),
    //         ]
    //         .into_iter()
    //     )
    //     .unwrap()
    // );

    let output = catch!(
        Command::new("firejail")
            .arg(format!(
                "--whitelist={}",
                shlex::try_quote(restrict_path.to_string_lossy().as_ref()).unwrap()
            ))
            .arg(format!(
                "--whitelist={}",
                shlex::try_quote(TEXDIR.get().unwrap()).unwrap()
            ))
            .arg(format!(
                "--whitelist={}",
                shlex::try_quote(DISTDIR.get().unwrap()).unwrap()
            ))
            .arg("--noprofile")
            .arg("sh")
            .arg("-c")
            .arg(&format!(
                "cd {} && {} -interaction nonstopmode -halt-on-error -file-line-error {}",
                shlex::try_quote(parent.as_ref()).unwrap(),
                shlex::try_quote(bin).unwrap(),
                shlex::try_quote(source.to_string_lossy().as_ref()).unwrap()
            ),)
            .output()
            .await,
        ver
    );

    if output.status.code() != Some(0) {
        return match ver {
            ApiVer::V1 => CommonRes::V1(Err(V1Error::CompileError {
                content: catch!(String::from_utf8(output.stdout), ver), // .lines()
                                                                        // .rev()
                                                                        // .skip(2)
                                                                        // .step_by(2)
                                                                        // .take(2)
                                                                        // .collect::<Vec<_>>()
                                                                        // .join("\n"),
            })),
        };
    }

    CommonRes::V1(Ok(V1Response::TexCompiled {
        id: taskid,
        newpath: user_path
            .with_extension("pdf")
            .to_str()
            .unwrap()
            .to_string(),
    }))
}
