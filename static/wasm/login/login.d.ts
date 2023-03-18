/* tslint:disable */
/* eslint-disable */
/**
*/
export function main(): void;
/**
*/
export function update(): void;
/**
* @param {string} t
*/
export function change_state(t: string): void;
/**
*/
export function signin(): void;
/**
* @param {Document} doc
* @param {string} id
* @returns {string}
*/
export function get_value(doc: Document, id: string): string;
/**
* @param {Document} doc
* @param {boolean} val
*/
export function disable_buttons(doc: Document, val: boolean): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly change_state: (a: number, b: number) => void;
  readonly signin: () => void;
  readonly get_value: (a: number, b: number, c: number, d: number) => void;
  readonly disable_buttons: (a: number, b: number) => void;
  readonly main: () => void;
  readonly update: () => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h88e346c869f55beb: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
