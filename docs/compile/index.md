# Compile

`/api/tex/compile`

Compile related actions - compile files from a source format (such as latex/md) to a readable format (pdf or html).

---

Valid compilations:

|From|To|Compilers|
|---|---|---|
|`markdown`|`html`|`pulldown-cmark`|
|`latex`|`pdf`|`pdflatex`|

Leave the `compiler` field blank or set it as `default` to use the default compiler of the format.
