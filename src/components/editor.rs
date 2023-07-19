use std::borrow::Cow;

pub fn editor(
    topbar: &str,
    content: &str,
    ext: &str,
    path: &str,
    nonce: &str,
    preview_sources: &[String],
    target_exts: &[&str],
    source_fmt: &str,
) -> String {
    let compile = if target_exts.is_empty() {
        Cow::Borrowed("")
    } else {
        Cow::Owned(format!(
            r#"
      <div class="menubar-item" id="compile-menu">
        <span id="compile">Compile</span>
        <div class="dropdown-content hide">
        {}
        </div>
      </div>
                "#,
            target_exts
                .iter()
                .map(|ext| format!(r#"<span class="dropdown-item" target="{ext}">To {ext}</span>"#))
                .collect::<String>()
        ))
    };

    format!(
        r#"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/editor.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/dark/editor.css" />
    <script src="/static/scripts/src-min-noconflict/ace.js"></script>
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />
    <title>Editing /{}</title>
  </head>
  <body>
    {topbar}
    <div id="menubar">
      <div class="menubar-item" id="file-menu">
        <span id="file">File</span>
        <div class="dropdown-content hide">
          <span class="dropdown-item" id="save">Save</span>
        </div>
      </div>
      <div class="menubar-item" id="edit-menu">
        <span id="edit">Edit</span>
        <div class="dropdown-content hide">
          <span class="dropdown-item" id="undo">Undo</span
          ><span class="dropdown-item" id="redo">Redo</span>
        </div>
      </div>
      <div class="menubar-item" id="view-menu">
        <span id="view">View</span>
        <div class="dropdown-content hide">
          <span class="dropdown-item" mode="vim">Vim</span
          ><span class="dropdown-item" mode="emacs">Emacs</span>
          <span class="dropdown-item" mode="sublime">Sublime</span
          ><span class="dropdown-item" mode="vscode">Vscode</span>
        </div>
      </div>
      {compile}
    </div>
    <div id="bottom">
      <div id="editor">{}</div>
    <script nonce="{nonce}">
var thisFormat = "{source_fmt}";
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/{}");
var previews = {};
    </script>
    <script src="/static/scripts/editor.js" defer></script>
       <div id="preview">
        <center id="no-preview" class="hide">
          <h2>Cannot find previews for this file</h2>
          <p>Try compiling this file to a previewable format.</p>
        </center>
        <div id="html-preview" class="hide"></div>
        <iframe id="pdf-preview" class="hide" type="application/pdf"></iframe>
       </div>
    </div>
  </body>
</html>
            "#,
        html_escape::encode_safe(path),
        html_escape::encode_safe(content),
        ext_to_mode(&ext.to_lowercase()),
        serde_json::to_string(preview_sources).unwrap()
    )
}

pub fn ext_to_mode(ext: &str) -> &'static str {
    match ext {
        "abap" => "abap",
        "abc" => "abc",
        "as" => "actionscript",
        "ada" | "adb" => "ada",
        "alda" => "alda",
        "htaccess" | "htgroups" | "htpasswd" => "apache_conf",
        "apex" | "cls" | "trigger" | "tgr" => "apex",
        "aql" => "aql",
        "asciidoc" | "adoc" => "asciidoc",
        "dsl" | "asl" | "asl.json" => "asl",
        "asm" | "a" => "assembly_x86",
        "ahk" => "autohotkey",
        "bat" | "cmd" => "batchfile",
        "bib" => "bibtex",
        "cpp" | "c" | "cc" | "cxx" | "h" | "hh" | "hpp" | "ino" => "c_cpp",
        "c9search_results" => "c9search",
        "cirru" => "cirru",
        "clj" | "cljs" => "clojure",
        "cbl" | "cob" => "cobol",
        "coffee" | "cf" | "cson" | "cakefile" => "coffee",
        "cfm" | "cfc" => "coldfusion",
        "cr" => "crystal",
        "cs" => "csharp",
        "csd" => "csound_document",
        "orc" => "csound_orchestra",
        "sco" => "csound_score",
        "css" => "css",
        "curly" => "curly",
        "d" | "di" => "d",
        "dart" => "dart",
        "diff" | "patch" => "diff",
        "dockerfile" => "dockerfile",
        "dot" => "dot",
        "drl" => "drools",
        "edi" => "edifact",
        "e" | "ge" => "eiffel",
        "ejs" => "ejs",
        "ex" | "exs" => "elixir",
        "elm" => "elm",
        "erl" | "hrl" => "erlang",
        "frt" | "ldr" | "fth" | "4th" => "forth",
        "f" | "f90" => "fortran",
        "fsi" | "fs" | "fsx" | "fsscript" => "fsharp",
        "fsl" => "fsl",
        "ftl" => "ftl",
        "gcode" => "gcode",
        "feature" => "gherkin",
        ".gitignore" => "gitignore",
        "glsl" | "frag" | "vert" => "glsl",
        "gbs" => "gobstones",
        "go" => "golang",
        "gql" => "graphqlschema",
        "groovy" => "groovy",
        "haml" => "haml",
        "hbs" | "handlebars" | "mustache" => "handlebars",
        "hs" => "haskell",
        "cabal" => "haskell_cabal",
        "hx" => "haxe",
        "hjson" => "hjson",
        "html" | "htm" | "xhtml" | "vue" | "we" | "wpy" => "html",
        "eex" | "html.eex" => "html_elixir",
        "erb" | "html.erb" => "html_ruby",
        "ini" | "cfg" | "prefs" => "ini",
        "io" => "io",
        "ion" => "ion",
        "jack" => "jack",
        "jade" | "pug" => "jade",
        "java" => "java",
        "js" | "jsm" | "cjs" | "mjs" => "javascript",
        "jexl" => "jexl",
        "json" => "json",
        "json5" => "json5",
        "jq" => "jsoniq",
        "jsp" => "jsp",
        "jssm" | "jssm_state" => "jssm",
        "jsx" => "jsx",
        "jl" => "julia",
        "kt" | "kts" => "kotlin",
        "tex" | "latex" | "ltx" => "latex",
        "latte" => "latte",
        "less" => "less",
        "liquid" => "liquid",
        "lisp" => "lisp",
        "ls" => "livescript",
        "log" => "log",
        "logic" | "lql" => "logiql",
        "lgt" => "logtalk",
        "lsl" => "lsl",
        "lua" => "lua",
        "lp" => "luapage",
        "lucene" => "lucene",
        "makefile" | "gnumakefile" | "ocamlmakefile" | "make" => "makefile",
        "md" | "markdown" => "markdown",
        "mask" => "mask",
        "matlab" => "matlab",
        "mz" => "maze",
        "wiki" | "mediawiki" => "mediawiki",
        "mel" => "mel",
        "s" => "mips",
        "mixal" => "mixal",
        "mc" | "mush" => "mushcode",
        "mysql" => "mysql",
        "nginx" | "conf" => "nginx",
        "nim" => "nim",
        "nix" => "nix",
        "nsi" | "nsh" => "nsis",
        "nunjucks" | "nunjs" | "nj" | "njk" => "nunjucks",
        "m" | "mm" => "objectivec",
        "ml" | "mli" => "ocaml",
        "odin" => "odin",
        "partiql" | "pql" => "partiql",
        "pas" | "p" => "pascal",
        "pl" | "pm" => "perl",
        "pgsql" => "pgsql",
        "php" | "inc" | "phtml" | "shtml" | "php3" | "php4" | "php5" | "phps" | "phpt" | "aw"
        | "ctp" | "module" => "php",
        "blade.php" => "php_laravel_blade",
        "pig" => "pig",
        "plsql" => "plsql",
        "ps1" => "powershell",
        "praat" | "praatscript" | "psc" | "proc" => "praat",
        "prisma" => "prisma",
        "plg" | "prolog" => "prolog",
        "properties" => "properties",
        "proto" => "protobuf",
        "epp" | "pp" => "puppet",
        "py" => "python",
        "qml" => "qml",
        "r" => "r",
        "raku" | "rakumod" | "rakutest" | "p6" | "pl6" | "pm6" => "raku",
        "cshtml" | "asp" => "razor",
        "rd" => "rdoc",
        "red" | "reds" => "red",
        "rhtml" => "rhtml",
        "robot" | "resource" => "robot",
        "rst" => "rst",
        "rb" | "ru" | "gemspec" | "rake" | "guardfile" | "rakefile" | "gemfile" => "ruby",
        "rs" => "rust",
        "sac" => "sac",
        "sass" => "sass",
        "scad" => "scad",
        "scala" | "sbt" => "scala",
        "scm" | "sm" | "rkt" | "oak" | "scheme" => "scheme",
        "scrypt" => "scrypt",
        "scss" => "scss",
        "sh" | "bash" | ".bashrc" => "sh",
        "sjs" => "sjs",
        "slim" | "skim" => "slim",
        "smarty" | "tpl" => "smarty",
        "smithy" => "smithy",
        "snippets" => "snippets",
        "soy" => "soy_template",
        "space" => "space",
        "rq" => "sparql",
        "sql" => "sql",
        "sqlserver" => "sqlserver",
        "styl" | "stylus" => "stylus",
        "svg" => "svg",
        "swift" => "swift",
        "tcl" => "tcl",
        "tf" | "tfvars" | "terragrunt" => "terraform",
        "txt" => "text",
        "textile" => "textile",
        "toml" => "toml",
        "tsx" => "tsx",
        "ttl" => "turtle",
        "twig" | "swig" => "twig",
        "ts" | "typescript" | "str" => "typescript",
        "vala" => "vala",
        "vbs" | "vb" => "vbscript",
        "vm" => "velocity",
        "v" | "vh" | "sv" | "svh" => "verilog",
        "vhd" | "vhdl" => "vhdl",
        "vfp" | "component" | "page" => "visualforce",
        "wlk" | "wpgm" | "wtest" => "wollok",
        "xml" | "rdf" | "rss" | "wsdl" | "xslt" | "atom" | "mathml" | "mml" | "xul" | "xbl"
        | "xaml" => "xml",
        "xq" => "xquery",
        "yaml" | "yml" => "yaml",
        "zeek" | "bro" => "zeek",
        _ => "text",
    }
}

pub fn available_targets(name: &str) -> &'static [&'static str] {
    match name {
        "markdown" => &["html"],
        "latex" => &["pdf"],
        _ => &[],
    }
}
