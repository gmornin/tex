use goodmorning_services::bindings::structs::{
    BirthDayDetail, CakeDayDetail, ContactDetail, ProfileAccount, ProfileCustomisable,
    ProfileDetail,
};
pub use yew::function_component;
use yew::{html, Html, Properties};

#[function_component]
pub fn ProfileInfo(prop: &ProfileInfoProp) -> Html {
    html! {
    <div class="container">
      <div id="profile-top">
        <img src={format!("/api/generic/v1/pfp/id/{}", prop.account.id)} width="100" height="100" alt="" />
        <div id="profile-top-right">
          <span id="username">{&prop.account.username}</span>{if prop.is_owner{ html!{ <span id="icons"><a href="/settings/profile" id="edit"><img src="/static/icons/edit.svg"
          /></a></span>}} else {Html::default()}}
          <br />
          <span id="status">{&prop.account.status}</span>
        </div>
      </div>
      <div id="bio">
        <p>{&prop.profile.description}</p>
      </div>
      <div id="badges">
        {for prop.profile.details.iter().map(|detail| badge(detail.clone()))}
      </div>
    </div>
    }
}

#[derive(Properties, PartialEq)]
pub struct ProfileInfoProp {
    pub account: ProfileAccount,
    pub profile: ProfileCustomisable,
    pub is_owner: bool,
}

pub fn badge(detail: ProfileDetail) -> Html {
    // could be optimised using struct to take ownership so no cloning is needed, some one please do that
    let (img, url, value) = match detail {
        ProfileDetail::CakeDay {
            value: CakeDayDetail { day, month },
        } => ("/static/icons/cake.svg", None, format!("{day}/{month}")),
        ProfileDetail::BirthDay {
            value: BirthDayDetail { day, month, year },
        } => (
            "/static/icons/cake.svg",
            None,
            format!("{day}/{month}/{year}"),
        ),
        ProfileDetail::Location { value } => ("/static/icons/location.svg", None, value),
        ProfileDetail::Occupation { value } => ("/static/icons/suitcase.svg", None, value),
        ProfileDetail::Contact {
            value: ContactDetail::Email { name, instance },
        } => (
            "/static/icons/envolope.svg",
            Some(format!("mailto:{name}@{instance}")),
            format!("{name}@{instance}"),
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Matrix { name, instance },
        } => (
            "/static/icons/matrix.svg",
            Some(format!("https://matrix.to/#/@{name}:{instance}")),
            format!("{name}:{instance}"),
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Mastodon { name, instance },
        } => (
            "/static/icons/mastodon.svg",
            Some(format!("https://{instance}/@{name}")),
            format!("{name}:{instance}"),
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Github { value },
        } => (
            "/static/icons/github.svg",
            Some(format!("https://github.com/{value}")),
            value,
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Lemmy { name, instance },
        } => (
            "/static/icons/lemmy.svg",
            Some(format!("https://{instance}/u/{name}")),
            format!("{name}:{instance}"),
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Gitlab { value },
        } => (
            "/static/icons/gitlab.svg",
            Some(format!("https://gitlab.com/{value}")),
            value,
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Bitbucket { value },
        } => (
            "/static/icons/bitbucket.svg",
            Some(format!("https://bitbucket.com/{value}")),
            value,
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Reddit { value },
        } => (
            "/static/icons/reddit.svg",
            Some(format!("https://reddit.com/u/{value}")),
            value,
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Discord { value },
        } => ("/static/icons/discord.svg", None, value),
        ProfileDetail::Contact {
            value: ContactDetail::Twitter { value },
        } => (
            "/static/icons/twitter.svg",
            Some(format!("https://twitter.com/{value}")),
            value,
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Youtube { value },
        } => (
            "/static/icons/youtube.svg",
            Some(format!("https://youtube.com/@/{value}")),
            value,
        ),
        ProfileDetail::Contact {
            value:
                ContactDetail::Odysee {
                    name,
                    discriminator,
                },
        } => (
            "/static/icons/odysee.svg",
            Some(format!("https://odysee.com/@{name}:{discriminator}")),
            format!("{name}:{discriminator}"),
        ),
        ProfileDetail::Contact {
            value: ContactDetail::Website { value },
        } => (
            "/static/icons/link.svg",
            Some(format!("https://{value}")),
            value,
        ),
        ProfileDetail::Company { value } => ("/static/icons/business.svg", None, value),
        ProfileDetail::School { value } => ("/static/icons/school.svg", None, value),
        ProfileDetail::EducationLevel { value } => ("/static/icons/education.svg", None, value),
    };

    html! {
      <div class="badge">
        <img src={img} alt="" height="20" />
        {
          match url {
            Some(url) => html! {
              <a href={url} class="linklike" target="_blank">
                <span class="badge-value">{value}</span>
              </a>
            },
            None => html! {
              <span class="badge-value">{value}</span>
            }
          }
        }
      </div>
    }
}
