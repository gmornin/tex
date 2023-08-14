use goodmorning_services::bindings::structs::ProfileCustomisable;
use goodmorning_services::traits::CollectionItem;
use serde::{Deserialize, Serialize};
use std::error::Error;

use crate::PROFILES;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TexProfile {
    #[serde(rename = "_id")]
    pub id: i64,
    pub profile: ProfileCustomisable,
    pub counters: TexCounters,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TexCounters {
    #[serde(default = "publish_default")]
    pub publish: i64,
}

impl Default for TexCounters {
    fn default() -> Self {
        Self {
            publish: publish_default(),
        }
    }
}

fn publish_default() -> i64 {
    1
}

impl CollectionItem<i64> for TexProfile {
    fn id(&self) -> i64 {
        self.id
    }
}

impl TexProfile {
    pub fn default_with_id(id: i64) -> Self {
        Self {
            id,
            profile: ProfileCustomisable::default(),
            counters: TexCounters::default(),
        }
    }

    pub async fn find_default(id: i64) -> Result<Self, Box<dyn Error>> {
        Ok(Self::find_by_id(id, PROFILES.get().unwrap())
            .await?
            .unwrap_or(TexProfile::default_with_id(id)))
    }
}
