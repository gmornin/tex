use std::borrow::Cow;
use std::fmt::Write;

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
            target_exts.iter().fold(String::new(), |mut s, ext| {
                let _ = write!(
                    s,
                    r#"<span class="dropdown-item" target="{ext}">To {ext}</span>"#
                );
                s
            })
        ))
    };

    format!(
        r#"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/static/scripts/pdfjs/web/viewer.css" />
    <link rel="stylesheet" href="/static/css/main.css" />
    <link rel="stylesheet" href="/static/css/topbar.css" />
    <link rel="stylesheet" href="/static/css/editor.css" />
    <link rel="stylesheet" href="/static/css/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/topbar-loggedin.css" />
    <link rel="stylesheet" href="/static/css/dark/main.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar.css" />
    <link rel="stylesheet" href="/static/css/dark/topbar-signedout.css" />
    <link rel="stylesheet" href="/static/css/dark/editor.css" />
    <script src="/static/scripts/ace/ace.js"></script>
    <script src="/static/scripts/ace/ext-language_tools.js"></script>
    <link href="/static/css/textpreview.css" rel="stylesheet" /><link href="/static/css/html.css" rel="stylesheet" /><link href="/static/css/prism.css" rel="stylesheet" /><script src="/static/scripts/prism.js"></script>
    <link
      rel="shortcut icon"
      href="/static/images/favicon-dark.svg"
      type="image/x-icon"
    />

    <link rel="stylesheet" href="/static/scripts/katex/katex.min.css">
    <script defer src="/static/scripts/katex/katex.min.js"></script>
    <script defer src="/static/scripts/katex/contrib/auto-render.min.js"></script>
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
          <span class="dropdown-item" id="toggleEditor">Toggle editor</span
          ><span class="dropdown-item" id="togglePreview">Toggle preview</span>
          <span class="dropdown-item" id="openOptions">Editor options</span>
        </div>
      </div>
      {compile}
    </div>
    <div id="bottom">
      <div id="editor">{}</div>
    <script nonce="{nonce}">
var thisFormat = "{source_fmt}";
var langTools = ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/{}");
editor.setShowPrintMargin(false);
editor.setOptions({{
    enableSnippets: true,
    enableLiveAutocompletion: true,
    enableBasicAutocompletion: true
}})
var previews = {};
var pdfFilePath = "";
    </script>
    <script src="/static/scripts/editor.js" defer></script>
       <div id="display">
        <center id="no-preview" class="hide">
          <h2>Cannot find previews for this file</h2>
          <p>Try compiling this file to a previewable format.</p>
        </center>
        <div id="html-preview" class="hide"></div>
    <!--
Copyright 2012 Mozilla Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Adobe CMap resources are covered by their own copyright but the same license:

    Copyright 1990-2015 Adobe Systems Incorporated.

See https://github.com/adobe-type-tools/cmap-resources
-->
<div class="hide" id="pdf-preview">
<html dir="ltr" mozdisallowselectionprint>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta name="google" content="notranslate" />

    <!-- This snippet is used in production (included from viewer.html) -->
    <link
      rel="resource"
      type="application/l10n"
      href="/static/scripts/pdfjs/web/locale/locale.json"
    />
    <script
      src="/static/scripts/pdfjs/build/pdf.mjs"
      type="module"
    ></script>

    <script
      src="/static/scripts/pdfjs/web/viewer.mjs"
      type="module"
    ></script>
  </head>

  <body tabindex="1">
    <div id="outerContainer">
      <div id="sidebarContainer">
        <div id="toolbarSidebar">
          <div id="toolbarSidebarLeft">
            <div
              id="sidebarViewButtons"
              class="splitToolbarButton toggled"
              role="radiogroup"
            >
              <button
                id="viewThumbnail"
                class="toolbarButton toggled"
                title="Show Thumbnails"
                tabindex="2"
                data-l10n-id="pdfjs-thumbs-button"
                role="radio"
                aria-checked="true"
                aria-controls="thumbnailView"
              >
                <span data-l10n-id="pdfjs-thumbs-button-label"
                  >Thumbnails</span
                >
              </button>
              <button
                id="viewOutline"
                class="toolbarButton"
                title="Show Document Outline (double-click to expand/collapse all items)"
                tabindex="3"
                data-l10n-id="pdfjs-document-outline-button"
                role="radio"
                aria-checked="false"
                aria-controls="outlineView"
              >
                <span data-l10n-id="pdfjs-document-outline-button-label"
                  >Document Outline</span
                >
              </button>
              <button
                id="viewAttachments"
                class="toolbarButton"
                title="Show Attachments"
                tabindex="4"
                data-l10n-id="pdfjs-attachments-button"
                role="radio"
                aria-checked="false"
                aria-controls="attachmentsView"
              >
                <span data-l10n-id="pdfjs-attachments-button-label"
                  >Attachments</span
                >
              </button>
              <button
                id="viewLayers"
                class="toolbarButton"
                title="Show Layers (double-click to reset all layers to the default state)"
                tabindex="5"
                data-l10n-id="pdfjs-layers-button"
                role="radio"
                aria-checked="false"
                aria-controls="layersView"
              >
                <span data-l10n-id="pdfjs-layers-button-label">Layers</span>
              </button>
            </div>
          </div>

          <div id="toolbarSidebarRight">
            <div id="outlineOptionsContainer" class="hidden">
              <div class="verticalToolbarSeparator"></div>

              <button
                id="currentOutlineItem"
                class="toolbarButton"
                disabled="disabled"
                title="Find Current Outline Item"
                tabindex="6"
                data-l10n-id="pdfjs-current-outline-item-button"
              >
                <span data-l10n-id="pdfjs-current-outline-item-button-label"
                  >Current Outline Item</span
                >
              </button>
            </div>
          </div>
        </div>
        <div id="sidebarContent">
          <div id="thumbnailView"></div>
          <div id="outlineView" class="hidden"></div>
          <div id="attachmentsView" class="hidden"></div>
          <div id="layersView" class="hidden"></div>
        </div>
        <div id="sidebarResizer"></div>
      </div>
      <!-- sidebarContainer -->

      <div id="mainContainer">
        <div class="findbar hidden doorHanger" id="findbar">
          <div id="findbarInputContainer">
            <span class="loadingInput end">
              <input
                id="findInput"
                class="toolbarField"
                title="Find"
                placeholder="Find in document…"
                tabindex="91"
                data-l10n-id="pdfjs-find-input"
                aria-invalid="false"
              />
            </span>
            <div class="splitToolbarButton">
              <button
                id="findPrevious"
                class="toolbarButton"
                title="Find the previous occurrence of the phrase"
                tabindex="92"
                data-l10n-id="pdfjs-find-previous-button"
              >
                <span data-l10n-id="pdfjs-find-previous-button-label"
                  >Previous</span
                >
              </button>
              <div class="splitToolbarButtonSeparator"></div>
              <button
                id="findNext"
                class="toolbarButton"
                title="Find the next occurrence of the phrase"
                tabindex="93"
                data-l10n-id="pdfjs-find-next-button"
              >
                <span data-l10n-id="pdfjs-find-next-button-label"
                  >Next</span
                >
              </button>
            </div>
          </div>

          <div id="findbarOptionsOneContainer">
            <input
              type="checkbox"
              id="findHighlightAll"
              class="toolbarField"
              tabindex="94"
            />
            <label
              for="findHighlightAll"
              class="toolbarLabel"
              data-l10n-id="pdfjs-find-highlight-checkbox"
              >Highlight All</label
            >
            <input
              type="checkbox"
              id="findMatchCase"
              class="toolbarField"
              tabindex="95"
            />
            <label
              for="findMatchCase"
              class="toolbarLabel"
              data-l10n-id="pdfjs-find-match-case-checkbox-label"
              >Match Case</label
            >
          </div>
          <div id="findbarOptionsTwoContainer">
            <input
              type="checkbox"
              id="findMatchDiacritics"
              class="toolbarField"
              tabindex="96"
            />
            <label
              for="findMatchDiacritics"
              class="toolbarLabel"
              data-l10n-id="pdfjs-find-match-diacritics-checkbox-label"
              >Match Diacritics</label
            >
            <input
              type="checkbox"
              id="findEntireWord"
              class="toolbarField"
              tabindex="97"
            />
            <label
              for="findEntireWord"
              class="toolbarLabel"
              data-l10n-id="pdfjs-find-entire-word-checkbox-label"
              >Whole Words</label
            >
          </div>

          <div id="findbarMessageContainer" aria-live="polite">
            <span id="findResultsCount" class="toolbarLabel"></span>
            <span id="findMsg" class="toolbarLabel"></span>
          </div>
        </div>
        <!-- findbar -->

        <div
          class="editorParamsToolbar hidden doorHangerRight"
          id="editorFreeTextParamsToolbar"
        >
          <div class="editorParamsToolbarContainer">
            <div class="editorParamsSetter">
              <label
                for="editorFreeTextColor"
                class="editorParamsLabel"
                data-l10n-id="pdfjs-editor-free-text-color-input"
                >Color</label
              >
              <input
                type="color"
                id="editorFreeTextColor"
                class="editorParamsColor"
                tabindex="100"
              />
            </div>
            <div class="editorParamsSetter">
              <label
                for="editorFreeTextFontSize"
                class="editorParamsLabel"
                data-l10n-id="pdfjs-editor-free-text-size-input"
                >Size</label
              >
              <input
                type="range"
                id="editorFreeTextFontSize"
                class="editorParamsSlider"
                value="10"
                min="5"
                max="100"
                step="1"
                tabindex="101"
              />
            </div>
          </div>
        </div>

        <div
          class="editorParamsToolbar hidden doorHangerRight"
          id="editorInkParamsToolbar"
        >
          <div class="editorParamsToolbarContainer">
            <div class="editorParamsSetter">
              <label
                for="editorInkColor"
                class="editorParamsLabel"
                data-l10n-id="pdfjs-editor-ink-color-input"
                >Color</label
              >
              <input
                type="color"
                id="editorInkColor"
                class="editorParamsColor"
                tabindex="102"
              />
            </div>
            <div class="editorParamsSetter">
              <label
                for="editorInkThickness"
                class="editorParamsLabel"
                data-l10n-id="pdfjs-editor-ink-thickness-input"
                >Thickness</label
              >
              <input
                type="range"
                id="editorInkThickness"
                class="editorParamsSlider"
                value="1"
                min="1"
                max="20"
                step="1"
                tabindex="103"
              />
            </div>
            <div class="editorParamsSetter">
              <label
                for="editorInkOpacity"
                class="editorParamsLabel"
                data-l10n-id="pdfjs-editor-ink-opacity-input"
                >Opacity</label
              >
              <input
                type="range"
                id="editorInkOpacity"
                class="editorParamsSlider"
                value="100"
                min="1"
                max="100"
                step="1"
                tabindex="104"
              />
            </div>
          </div>
        </div>

        <div
          class="editorParamsToolbar hidden doorHangerRight"
          id="editorStampParamsToolbar"
        >
          <div class="editorParamsToolbarContainer">
            <button
              id="editorStampAddImage"
              class="secondaryToolbarButton"
              title="Add image"
              tabindex="105"
              data-l10n-id="pdfjs-editor-stamp-add-image-button"
            >
              <span data-l10n-id="pdfjs-editor-stamp-add-image-button-label"
                >Add image</span
              >
            </button>
          </div>
        </div>

        <div
          id="secondaryToolbar"
          class="secondaryToolbar hidden doorHangerRight"
        >
          <div id="secondaryToolbarButtonContainer">
            <button
              id="secondaryOpenFile"
              class="secondaryToolbarButton"
              title="Open File"
              tabindex="51"
              data-l10n-id="pdfjs-open-file-button"
            >
              <span data-l10n-id="pdfjs-open-file-button-label">Open</span>
            </button>

            <button
              id="secondaryPrint"
              class="secondaryToolbarButton visibleMediumView"
              title="Print"
              tabindex="52"
              data-l10n-id="pdfjs-print-button"
            >
              <span data-l10n-id="pdfjs-print-button-label">Print</span>
            </button>

            <button
              id="secondaryDownload"
              class="secondaryToolbarButton visibleMediumView"
              title="Save"
              tabindex="53"
              data-l10n-id="pdfjs-save-button"
            >
              <span data-l10n-id="pdfjs-save-button-label">Save</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button
              id="presentationMode"
              class="secondaryToolbarButton"
              title="Switch to Presentation Mode"
              tabindex="54"
              data-l10n-id="pdfjs-presentation-mode-button"
            >
              <span data-l10n-id="pdfjs-presentation-mode-button-label"
                >Presentation Mode</span
              >
            </button>

            <a
              href="\#"
              id="viewBookmark"
              class="secondaryToolbarButton"
              title="Current Page (View URL from Current Page)"
              tabindex="55"
              data-l10n-id="pdfjs-bookmark-button"
            >
              <span data-l10n-id="pdfjs-bookmark-button-label"
                >Current Page</span
              >
            </a>

            <div
              id="viewBookmarkSeparator"
              class="horizontalToolbarSeparator"
            ></div>

            <button
              id="firstPage"
              class="secondaryToolbarButton"
              title="Go to First Page"
              tabindex="56"
              data-l10n-id="pdfjs-first-page-button"
            >
              <span data-l10n-id="pdfjs-first-page-button-label"
                >Go to First Page</span
              >
            </button>
            <button
              id="lastPage"
              class="secondaryToolbarButton"
              title="Go to Last Page"
              tabindex="57"
              data-l10n-id="pdfjs-last-page-button"
            >
              <span data-l10n-id="pdfjs-last-page-button-label"
                >Go to Last Page</span
              >
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button
              id="pageRotateCw"
              class="secondaryToolbarButton"
              title="Rotate Clockwise"
              tabindex="58"
              data-l10n-id="pdfjs-page-rotate-cw-button"
            >
              <span data-l10n-id="pdfjs-page-rotate-cw-button-label"
                >Rotate Clockwise</span
              >
            </button>
            <button
              id="pageRotateCcw"
              class="secondaryToolbarButton"
              title="Rotate Counterclockwise"
              tabindex="59"
              data-l10n-id="pdfjs-page-rotate-ccw-button"
            >
              <span data-l10n-id="pdfjs-page-rotate-ccw-button-label"
                >Rotate Counterclockwise</span
              >
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <div id="cursorToolButtons" role="radiogroup">
              <button
                id="cursorSelectTool"
                class="secondaryToolbarButton toggled"
                title="Enable Text Selection Tool"
                tabindex="60"
                data-l10n-id="pdfjs-cursor-text-select-tool-button"
                role="radio"
                aria-checked="true"
              >
                <span
                  data-l10n-id="pdfjs-cursor-text-select-tool-button-label"
                  >Text Selection Tool</span
                >
              </button>
              <button
                id="cursorHandTool"
                class="secondaryToolbarButton"
                title="Enable Hand Tool"
                tabindex="61"
                data-l10n-id="pdfjs-cursor-hand-tool-button"
                role="radio"
                aria-checked="false"
              >
                <span data-l10n-id="pdfjs-cursor-hand-tool-button-label"
                  >Hand Tool</span
                >
              </button>
            </div>

            <div class="horizontalToolbarSeparator"></div>

            <div id="scrollModeButtons" role="radiogroup">
              <button
                id="scrollPage"
                class="secondaryToolbarButton"
                title="Use Page Scrolling"
                tabindex="62"
                data-l10n-id="pdfjs-scroll-page-button"
                role="radio"
                aria-checked="false"
              >
                <span data-l10n-id="pdfjs-scroll-page-button-label"
                  >Page Scrolling</span
                >
              </button>
              <button
                id="scrollVertical"
                class="secondaryToolbarButton toggled"
                title="Use Vertical Scrolling"
                tabindex="63"
                data-l10n-id="pdfjs-scroll-vertical-button"
                role="radio"
                aria-checked="true"
              >
                <span data-l10n-id="pdfjs-scroll-vertical-button-label"
                  >Vertical Scrolling</span
                >
              </button>
              <button
                id="scrollHorizontal"
                class="secondaryToolbarButton"
                title="Use Horizontal Scrolling"
                tabindex="64"
                data-l10n-id="pdfjs-scroll-horizontal-button"
                role="radio"
                aria-checked="false"
              >
                <span data-l10n-id="pdfjs-scroll-horizontal-button-label"
                  >Horizontal Scrolling</span
                >
              </button>
              <button
                id="scrollWrapped"
                class="secondaryToolbarButton"
                title="Use Wrapped Scrolling"
                tabindex="65"
                data-l10n-id="pdfjs-scroll-wrapped-button"
                role="radio"
                aria-checked="false"
              >
                <span data-l10n-id="pdfjs-scroll-wrapped-button-label"
                  >Wrapped Scrolling</span
                >
              </button>
            </div>

            <div class="horizontalToolbarSeparator"></div>

            <div id="spreadModeButtons" role="radiogroup">
              <button
                id="spreadNone"
                class="secondaryToolbarButton toggled"
                title="Do not join page spreads"
                tabindex="66"
                data-l10n-id="pdfjs-spread-none-button"
                role="radio"
                aria-checked="true"
              >
                <span data-l10n-id="pdfjs-spread-none-button-label"
                  >No Spreads</span
                >
              </button>
              <button
                id="spreadOdd"
                class="secondaryToolbarButton"
                title="Join page spreads starting with odd-numbered pages"
                tabindex="67"
                data-l10n-id="pdfjs-spread-odd-button"
                role="radio"
                aria-checked="false"
              >
                <span data-l10n-id="pdfjs-spread-odd-button-label"
                  >Odd Spreads</span
                >
              </button>
              <button
                id="spreadEven"
                class="secondaryToolbarButton"
                title="Join page spreads starting with even-numbered pages"
                tabindex="68"
                data-l10n-id="pdfjs-spread-even-button"
                role="radio"
                aria-checked="false"
              >
                <span data-l10n-id="pdfjs-spread-even-button-label"
                  >Even Spreads</span
                >
              </button>
            </div>

            <div class="horizontalToolbarSeparator"></div>

            <button
              id="documentProperties"
              class="secondaryToolbarButton"
              title="Document Properties…"
              tabindex="69"
              data-l10n-id="pdfjs-document-properties-button"
              aria-controls="documentPropertiesDialog"
            >
              <span data-l10n-id="pdfjs-document-properties-button-label"
                >Document Properties…</span
              >
            </button>
          </div>
        </div>
        <!-- secondaryToolbar -->

        <div class="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer">
              <div id="toolbarViewerLeft">
                <button
                  id="sidebarToggle"
                  class="toolbarButton"
                  title="Toggle Sidebar"
                  tabindex="11"
                  data-l10n-id="pdfjs-toggle-sidebar-button"
                  aria-expanded="false"
                  aria-controls="sidebarContainer"
                >
                  <span data-l10n-id="pdfjs-toggle-sidebar-button-label"
                    >Toggle Sidebar</span
                  >
                </button>
                <div class="toolbarButtonSpacer"></div>
                <button
                  id="viewFind"
                  class="toolbarButton"
                  title="Find in Document"
                  tabindex="12"
                  data-l10n-id="pdfjs-findbar-button"
                  aria-expanded="false"
                  aria-controls="findbar"
                >
                  <span data-l10n-id="pdfjs-findbar-button-label"
                    >Find</span
                  >
                </button>
                <div class="splitToolbarButton hiddenSmallView">
                  <button
                    class="toolbarButton"
                    title="Previous Page"
                    id="previous"
                    tabindex="13"
                    data-l10n-id="pdfjs-previous-button"
                  >
                    <span data-l10n-id="pdfjs-previous-button-label"
                      >Previous</span
                    >
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button
                    class="toolbarButton"
                    title="Next Page"
                    id="next"
                    tabindex="14"
                    data-l10n-id="pdfjs-next-button"
                  >
                    <span data-l10n-id="pdfjs-next-button-label">Next</span>
                  </button>
                </div>
                <span class="loadingInput start">
                  <input
                    type="number"
                    id="pageNumber"
                    class="toolbarField"
                    title="Page"
                    value="1"
                    min="1"
                    tabindex="15"
                    data-l10n-id="pdfjs-page-input"
                    autocomplete="off"
                  />
                </span>
                <span id="numPages" class="toolbarLabel"></span>
              </div>
              <div id="toolbarViewerRight">
                <div
                  id="editorModeButtons"
                  class="splitToolbarButton toggled"
                  role="radiogroup"
                >
                  <button
                    id="editorFreeText"
                    class="toolbarButton"
                    disabled="disabled"
                    title="Text"
                    role="radio"
                    aria-checked="false"
                    aria-controls="editorFreeTextParamsToolbar"
                    tabindex="31"
                    data-l10n-id="pdfjs-editor-free-text-button"
                  >
                    <span data-l10n-id="pdfjs-editor-free-text-button-label"
                      >Text</span
                    >
                  </button>
                  <button
                    id="editorInk"
                    class="toolbarButton"
                    disabled="disabled"
                    title="Draw"
                    role="radio"
                    aria-checked="false"
                    aria-controls="editorInkParamsToolbar"
                    tabindex="32"
                    data-l10n-id="pdfjs-editor-ink-button"
                  >
                    <span data-l10n-id="pdfjs-editor-ink-button-label"
                      >Draw</span
                    >
                  </button>
                  <button
                    id="editorStamp"
                    class="toolbarButton"
                    disabled="disabled"
                    title="Add or edit images"
                    role="radio"
                    aria-checked="false"
                    aria-controls="editorStampParamsToolbar"
                    tabindex="33"
                    data-l10n-id="pdfjs-editor-stamp-button"
                  >
                    <span data-l10n-id="pdfjs-editor-stamp-button-label"
                      >Add or edit images</span
                    >
                  </button>
                </div>

                <div
                  id="editorModeSeparator"
                  class="verticalToolbarSeparator"
                ></div>

                <button
                  id="print"
                  class="toolbarButton hiddenMediumView"
                  title="Print"
                  tabindex="41"
                  data-l10n-id="pdfjs-print-button"
                >
                  <span data-l10n-id="pdfjs-print-button-label">Print</span>
                </button>

                <button
                  id="download"
                  class="toolbarButton hiddenMediumView"
                  title="Save"
                  tabindex="42"
                  data-l10n-id="pdfjs-save-button"
                >
                  <span data-l10n-id="pdfjs-save-button-label">Save</span>
                </button>

                <div
                  class="verticalToolbarSeparator hiddenMediumView"
                ></div>

                <button
                  id="secondaryToolbarToggle"
                  class="toolbarButton"
                  title="Tools"
                  tabindex="43"
                  data-l10n-id="pdfjs-tools-button"
                  aria-expanded="false"
                  aria-controls="secondaryToolbar"
                >
                  <span data-l10n-id="pdfjs-tools-button-label">Tools</span>
                </button>
              </div>
              <div id="toolbarViewerMiddle">
                <div class="splitToolbarButton">
                  <button
                    id="zoomOut"
                    class="toolbarButton"
                    title="Zoom Out"
                    tabindex="21"
                    data-l10n-id="pdfjs-zoom-out-button"
                  >
                    <span data-l10n-id="pdfjs-zoom-out-button-label"
                      >Zoom Out</span
                    >
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button
                    id="zoomIn"
                    class="toolbarButton"
                    title="Zoom In"
                    tabindex="22"
                    data-l10n-id="pdfjs-zoom-in-button"
                  >
                    <span data-l10n-id="pdfjs-zoom-in-button-label"
                      >Zoom In</span
                    >
                  </button>
                </div>
                <span
                  id="scaleSelectContainer"
                  class="dropdownToolbarButton"
                >
                  <select
                    id="scaleSelect"
                    title="Zoom"
                    tabindex="23"
                    data-l10n-id="pdfjs-zoom-select"
                  >
                    <option
                      id="pageAutoOption"
                      title=""
                      value="auto"
                      selected="selected"
                      data-l10n-id="pdfjs-page-scale-auto"
                    >
                      Automatic Zoom
                    </option>
                    <option
                      id="pageActualOption"
                      title=""
                      value="page-actual"
                      data-l10n-id="pdfjs-page-scale-actual"
                    >
                      Actual Size
                    </option>
                    <option
                      id="pageFitOption"
                      title=""
                      value="page-fit"
                      data-l10n-id="pdfjs-page-scale-fit"
                    >
                      Page Fit
                    </option>
                    <option
                      id="pageWidthOption"
                      title=""
                      value="page-width"
                      data-l10n-id="pdfjs-page-scale-width"
                    >
                      Page Width
                    </option>
                    <option
                      id="customScaleOption"
                      title=""
                      value="custom"
                      disabled="disabled"
                      hidden="true"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 0 }}'
                    >
                      0%
                    </option>
                    <option
                      title=""
                      value="0.5"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 50 }}'
                    >
                      50%
                    </option>
                    <option
                      title=""
                      value="0.75"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 75 }}'
                    >
                      75%
                    </option>
                    <option
                      title=""
                      value="1"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 100 }}'
                    >
                      100%
                    </option>
                    <option
                      title=""
                      value="1.25"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 125 }}'
                    >
                      125%
                    </option>
                    <option
                      title=""
                      value="1.5"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 150 }}'
                    >
                      150%
                    </option>
                    <option
                      title=""
                      value="2"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 200 }}'
                    >
                      200%
                    </option>
                    <option
                      title=""
                      value="3"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 300 }}'
                    >
                      300%
                    </option>
                    <option
                      title=""
                      value="4"
                      data-l10n-id="pdfjs-page-scale-percent"
                      data-l10n-args='{{ "scale": 400 }}'
                    >
                      400%
                    </option>
                  </select>
                </span>
              </div>
            </div>
            <div id="loadingBar">
              <div class="progress">
                <div class="glimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="viewerContainer" tabindex="0">
          <div id="viewer" class="pdfViewer"></div>
        </div>
      </div>
      <!-- mainContainer -->

      <div id="dialogContainer">
        <dialog id="passwordDialog">
          <div class="row">
            <label
              for="password"
              id="passwordText"
              data-l10n-id="pdfjs-password-label"
              >Enter the password to open this PDF file:</label
            >
          </div>
          <div class="row">
            <input type="password" id="password" class="toolbarField" />
          </div>
          <div class="buttonRow">
            <button id="passwordCancel" class="dialogButton">
              <span data-l10n-id="pdfjs-password-cancel-button"
                >Cancel</span
              >
            </button>
            <button id="passwordSubmit" class="dialogButton">
              <span data-l10n-id="pdfjs-password-ok-button">OK</span>
            </button>
          </div>
        </dialog>
        <dialog id="documentPropertiesDialog">
          <div class="row">
            <span
              id="fileNameLabel"
              data-l10n-id="pdfjs-document-properties-file-name"
              >File name:</span
            >
            <p id="fileNameField" aria-labelledby="fileNameLabel">-</p>
          </div>
          <div class="row">
            <span
              id="fileSizeLabel"
              data-l10n-id="pdfjs-document-properties-file-size"
              >File size:</span
            >
            <p id="fileSizeField" aria-labelledby="fileSizeLabel">-</p>
          </div>
          <div class="separator"></div>
          <div class="row">
            <span
              id="titleLabel"
              data-l10n-id="pdfjs-document-properties-title"
              >Title:</span
            >
            <p id="titleField" aria-labelledby="titleLabel">-</p>
          </div>
          <div class="row">
            <span
              id="authorLabel"
              data-l10n-id="pdfjs-document-properties-author"
              >Author:</span
            >
            <p id="authorField" aria-labelledby="authorLabel">-</p>
          </div>
          <div class="row">
            <span
              id="subjectLabel"
              data-l10n-id="pdfjs-document-properties-subject"
              >Subject:</span
            >
            <p id="subjectField" aria-labelledby="subjectLabel">-</p>
          </div>
          <div class="row">
            <span
              id="keywordsLabel"
              data-l10n-id="pdfjs-document-properties-keywords"
              >Keywords:</span
            >
            <p id="keywordsField" aria-labelledby="keywordsLabel">-</p>
          </div>
          <div class="row">
            <span
              id="creationDateLabel"
              data-l10n-id="pdfjs-document-properties-creation-date"
              >Creation Date:</span
            >
            <p id="creationDateField" aria-labelledby="creationDateLabel">
              -
            </p>
          </div>
          <div class="row">
            <span
              id="modificationDateLabel"
              data-l10n-id="pdfjs-document-properties-modification-date"
              >Modification Date:</span
            >
            <p
              id="modificationDateField"
              aria-labelledby="modificationDateLabel"
            >
              -
            </p>
          </div>
          <div class="row">
            <span
              id="creatorLabel"
              data-l10n-id="pdfjs-document-properties-creator"
              >Creator:</span
            >
            <p id="creatorField" aria-labelledby="creatorLabel">-</p>
          </div>
          <div class="separator"></div>
          <div class="row">
            <span
              id="producerLabel"
              data-l10n-id="pdfjs-document-properties-producer"
              >PDF Producer:</span
            >
            <p id="producerField" aria-labelledby="producerLabel">-</p>
          </div>
          <div class="row">
            <span
              id="versionLabel"
              data-l10n-id="pdfjs-document-properties-version"
              >PDF Version:</span
            >
            <p id="versionField" aria-labelledby="versionLabel">-</p>
          </div>
          <div class="row">
            <span
              id="pageCountLabel"
              data-l10n-id="pdfjs-document-properties-page-count"
              >Page Count:</span
            >
            <p id="pageCountField" aria-labelledby="pageCountLabel">-</p>
          </div>
          <div class="row">
            <span
              id="pageSizeLabel"
              data-l10n-id="pdfjs-document-properties-page-size"
              >Page Size:</span
            >
            <p id="pageSizeField" aria-labelledby="pageSizeLabel">-</p>
          </div>
          <div class="separator"></div>
          <div class="row">
            <span
              id="linearizedLabel"
              data-l10n-id="pdfjs-document-properties-linearized"
              >Fast Web View:</span
            >
            <p id="linearizedField" aria-labelledby="linearizedLabel">-</p>
          </div>
          <div class="buttonRow">
            <button id="documentPropertiesClose" class="dialogButton">
              <span data-l10n-id="pdfjs-document-properties-close-button"
                >Close</span
              >
            </button>
          </div>
        </dialog>
        <dialog
          id="altTextDialog"
          aria-labelledby="dialogLabel"
          aria-describedby="dialogDescription"
        >
          <div id="altTextContainer">
            <div id="overallDescription">
              <span
                id="dialogLabel"
                data-l10n-id="pdfjs-editor-alt-text-dialog-label"
                class="title"
                >Choose an option</span
              >
              <span
                id="dialogDescription"
                data-l10n-id="pdfjs-editor-alt-text-dialog-description"
              >
                Alt text (alternative text) helps when people can’t see the
                image or when it doesn’t load.
              </span>
            </div>
            <div id="addDescription">
              <div class="radio">
                <div class="radioButton">
                  <input
                    type="radio"
                    id="descriptionButton"
                    name="altTextOption"
                    tabindex="0"
                    aria-describedby="descriptionAreaLabel"
                    checked
                  />
                  <label
                    for="descriptionButton"
                    data-l10n-id="pdfjs-editor-alt-text-add-description-label"
                    >Add a description</label
                  >
                </div>
                <div class="radioLabel">
                  <span
                    id="descriptionAreaLabel"
                    data-l10n-id="pdfjs-editor-alt-text-add-description-description"
                  >
                    Aim for 1-2 sentences that describe the subject,
                    setting, or actions.
                  </span>
                </div>
              </div>
              <div class="descriptionArea">
                <textarea
                  id="descriptionTextarea"
                  placeholder="For example, “A young man sits down at a table to eat a meal”"
                  aria-labelledby="descriptionAreaLabel"
                  data-l10n-id="pdfjs-editor-alt-text-textarea"
                  tabindex="0"
                ></textarea>
              </div>
            </div>
            <div id="markAsDecorative">
              <div class="radio">
                <div class="radioButton">
                  <input
                    type="radio"
                    id="decorativeButton"
                    name="altTextOption"
                    aria-describedby="decorativeLabel"
                  />
                  <label
                    for="decorativeButton"
                    data-l10n-id="pdfjs-editor-alt-text-mark-decorative-label"
                    >Mark as decorative</label
                  >
                </div>
                <div class="radioLabel">
                  <span
                    id="decorativeLabel"
                    data-l10n-id="pdfjs-editor-alt-text-mark-decorative-description"
                  >
                    This is used for ornamental images, like borders or
                    watermarks.
                  </span>
                </div>
              </div>
            </div>
            <div id="buttons">
              <button id="altTextCancel" tabindex="0">
                <span data-l10n-id="pdfjs-editor-alt-text-cancel-button"
                  >Cancel</span
                >
              </button>
              <button id="altTextSave" tabindex="0">
                <span data-l10n-id="pdfjs-editor-alt-text-save-button"
                  >Save</span
                >
              </button>
            </div>
          </div>
        </dialog>
        <dialog id="printServiceDialog" style="min-width: 200px">
          <div class="row">
            <span data-l10n-id="pdfjs-print-progress-message"
              >Preparing document for printing…</span
            >
          </div>
          <div class="row">
            <progress value="0" max="100"></progress>
            <span
              data-l10n-id="pdfjs-print-progress-percent"
              data-l10n-args='{{ "progress": 0 }}'
              class="relative-progress"
              >0%</span
            >
          </div>
          <div class="buttonRow">
            <button id="printCancel" class="dialogButton">
              <span data-l10n-id="pdfjs-print-progress-close-button"
                >Cancel</span
              >
            </button>
          </div>
        </dialog>
      </div>
      <!-- dialogContainer -->
    </div>
    <!-- outerContainer -->
    <div id="printContainer"></div>

    <input type="file" id="fileInput" class="hidden" />
  </body>
</html>
</div>
       </div>
    </div>
  </body>
</html>
            "#,
        html_escape::encode_safe(path),
        html_escape::encode_safe(content),
        ext_to_mode(&ext.to_lowercase()),
        serde_json::to_string(preview_sources).unwrap(),
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
