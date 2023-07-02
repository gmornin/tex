pub fn gen_nonce() -> String {
    hex::encode(fastrand::u128(..).to_be_bytes())
}
