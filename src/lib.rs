#![allow(private_in_public)]
#![feature(iter_intersperse)]
#![allow(hidden_glob_reexports)]
#![allow(clippy::too_many_arguments)]

mod r#static;
pub use r#static::*;

pub mod components;
pub mod functions;
pub mod pages;

mod values;
pub use values::*;
