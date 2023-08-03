use goodmorning_bindings::structs::{BirthDayDetail, CakeDayDetail, ContactDetail, ProfileDetail};
use yew::{function_component, html, Html, Properties};

#[derive(PartialEq, Properties)]
pub struct DetailsProp {
    pub details: Vec<ProfileDetail>,
}

#[function_component]
pub fn ProfileEditBadges(props: &DetailsProp) -> Html {
    html! {
        {for props.details.iter().map(|detail|{
            let (img, field, value): (&str, &str, String) = match detail {
                ProfileDetail::CakeDay { value: CakeDayDetail { day, month }} => ("/static/icons/cake.svg", "cake day", format!("{day}/{month}")),
                ProfileDetail::BirthDay { value: BirthDayDetail { day, month, year }} => ("/static/icons/cake.svg", "birthday", format!("{day}/{month}/{year}")),
                ProfileDetail::Location { value } => ("/static/icons/location.svg", "location", value.to_string()),
                ProfileDetail::Occupation { value } => ("/static/icons/suitcase.svg", "occupation", value.to_string()),
                ProfileDetail::Company { value } => ("/static/icons/business.svg", "company", value.to_string()),
                ProfileDetail::School { value } => ("/static/icons/school.svg", "school", value.to_string()),
                ProfileDetail::EducationLevel { value } => ("/static/icons/education.svg", "education", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Email { name, instance }} => ("/static/icons/envolope.svg", "email", format!("{name}@{instance}")),
                ProfileDetail::Contact { value: ContactDetail::Matrix { name, instance }} => ("/static/icons/matrix.svg", "matrix", format!("{name}:{instance}")),
                ProfileDetail::Contact { value: ContactDetail::Mastodon { name, instance }} => ("/static/icons/mastodon.svg", "mastodon", format!("{name}:{instance}")),
                ProfileDetail::Contact { value: ContactDetail::Lemmy { name, instance }} => ("/static/icons/lemmy.svg", "lemmy", format!("{name}:{instance}")),
                ProfileDetail::Contact { value: ContactDetail::Github { value }} => ("/static/icons/github.svg", "github", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Gitlab { value }} => ("/static/icons/gitlab.svg", "gitlab", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Bitbucket { value }} => ("/static/icons/bitbucket.svg", "bitbucket", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Reddit { value }} => ("/static/icons/reddit.svg", "reddit", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Discord { value }} => ("/static/icons/discord.svg", "discord", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Twitter { value }} => ("/static/icons/twitter.svg", "twitter", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Youtube { value }} => ("/static/icons/youtube.svg", "youtube", value.to_string()),
                ProfileDetail::Contact { value: ContactDetail::Odysee { name, discriminator }} => ("/static/icons/odysee.svg", "odysee", format!("{name}:{discriminator}")),
                ProfileDetail::Contact { value: ContactDetail::Website { value }} => ("/static/icons/link.svg", "website", value.to_string()),
            };

            html! {
                <li class="badge" field={field}>
                    <img src={img} />
                    <input type="text" class="badge-value" value={value} />
                </li>
            }
        })}
    }
}
