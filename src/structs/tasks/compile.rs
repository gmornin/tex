use std::ffi::OsStr;
use std::path::{Path, PathBuf};

use goodmorning_services::bindings::services::v1::*;
use goodmorning_services::bindings::structs::*;
use goodmorning_services::bindings::structs::{ApiVer, CommonRes};
use goodmorning_services::bindings::*;
use goodmorning_services::traits::*;
use pulldown_cmark::*;
use tokio::fs;
use tokio::io::AsyncWriteExt;
use tokio::process::Command;

use crate::structs::FirejailBehavior;
use crate::{FIREJAIL_BEHAVIOR, PDFLATEX};

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
                pdflatex_latex2pdf(id, &self.user_path, &self.source, &self.restrict_path, ver)
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

pub async fn pdflatex_latex2pdf(
    // source: &Path,
    taskid: u64,
    user_path: &Path,
    source: &Path,
    restrict_path: &Path,
    ver: &ApiVer,
) -> CommonRes {
    let output = catch!(
        match FIREJAIL_BEHAVIOR.get().unwrap() {
            FirejailBehavior::Arch =>
                Command::new("firejail")
                    .arg(format!("--private={}", restrict_path.to_str().unwrap()))
                    .arg("--noprofile")
                    .arg(PDFLATEX.get().unwrap())
                    .arg("-interaction")
                    .arg("nonstopmode")
                    .arg("-halt-on-error")
                    .arg("-file-line-error")
                    .arg(format!(
                        "-output-directory=./{}",
                        user_path
                            .parent()
                            .unwrap_or(Path::new(""))
                            .to_str()
                            .unwrap()
                            .trim_start_matches('/')
                    ))
                    .arg(user_path.to_str().unwrap())
                    .output()
                    .await,
            FirejailBehavior::Debian =>
                Command::new("firejail")
                    .arg(format!("--private={}", restrict_path.to_str().unwrap()))
                    .arg("--noprofile")
                    .arg(PDFLATEX.get().unwrap())
                    .arg("-interaction")
                    .arg("nonstopmode")
                    .arg("-halt-on-error")
                    .arg("-file-line-error")
                    .arg(format!(
                        "-output-directory={}",
                        source.parent().unwrap_or(Path::new("")).to_str().unwrap()
                    ))
                    .arg(source.to_str().unwrap())
                    .output()
                    .await,
        },
        ver
    );

    if output.status.code() != Some(0) {
        return match ver {
            ApiVer::V1 => CommonRes::V1(Err(V1Error::CompileError {
                content: catch!(String::from_utf8(output.stdout), ver)
                    // .lines()
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
