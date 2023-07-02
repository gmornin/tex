pub fn size(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    if bytes == 0 {
        return "0B".to_string();
    }
    let exp = (bytes as f64).log2().floor() as i32 / 10;
    let num = bytes as f64 / 2_f64.powi(exp * 10);
    format!("{:.1}{}", num, UNITS[exp as usize])
}
