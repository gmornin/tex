#![allow(private_in_public)]
#![feature(if_let_guard)]
#![feature(iter_intersperse)]
#![allow(hidden_glob_reexports)]
#![allow(clippy::too_many_arguments)]
#![feature(let_chains)]

mod r#static;
pub use r#static::*;

pub mod api;
pub mod components;
pub mod functions;
pub mod pages;
pub mod structs;

mod values;
pub use values::*;
