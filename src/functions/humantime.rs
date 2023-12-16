pub fn humantime(secs: u64) -> String {
    if secs < 60 {
        String::from("just now")
    } else if secs < 3600 {
        let min = secs / 60;
        let s = if min == 1 { "" } else { "s" };
        format!("{} minute{s} ago", min)
    } else if secs < 86400 {
        let hour = secs / 3600;
        let s = if hour == 1 { "" } else { "s" };
        format!("{} hour{s} ago", hour)
    } else if secs < 604800 {
        let day = secs / 86400;
        let s = if day == 1 { "" } else { "s" };
        format!("{} day{s} ago", day)
    } else if secs < 2592000 {
        let week = secs / 604800;
        let s = if week == 1 { "" } else { "s" };
        format!("{} week{s} ago", week)
    } else if secs < 31536000 {
        let month = secs / 2592000;
        let s = if month == 1 { "" } else { "s" };
        format!("{} month{s} ago", month)
    } else {
        let year = secs / 31536000;
        let s = if year == 1 { "" } else { "s" };
        format!("{} year{s} ago", year)
    }
}
