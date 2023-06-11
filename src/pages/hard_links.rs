use std::error::Error;

use actix_files::NamedFile;
use actix_web::get;

#[get("/remindverify")]
pub async fn remindverify() -> Result<NamedFile, Box<dyn Error>> {
    Ok(NamedFile::open_async("static/htmls/remindverify.html").await?)
}
