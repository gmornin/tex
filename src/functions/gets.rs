use crate::{
    structs::{TexProfile, TexPublish},
    *,
};
use mongodb::Collection;

pub fn get_tex_userpublishes(id: i64) -> Collection<TexPublish> {
    PUBLISHES_DB
        .get()
        .unwrap()
        .collection(&format!("publishes-{id}"))
}

pub fn get_tex_profiles() -> Collection<TexProfile> {
    TEX_DB.get().unwrap().collection("profiles")
}
