use std::error::Error;

use actix_files::NamedFile;
use actix_web::get;

use crate::REMIND_VERIFY;

#[get("/remindverify")]
pub async fn remindverify() -> Result<NamedFile, Box<dyn Error>> {
    Ok(NamedFile::open_async(REMIND_VERIFY.get().unwrap()).await?)
}
