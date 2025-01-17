function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

let compilePath = decodeURIComponent(
    window.location.pathname.split("/").slice(2).join("/"),
);
let savePath = `tex/${compilePath}`;

document.getElementById("undo").onclick = () => editor.undo();
document.getElementById("redo").onclick = () => editor.redo();

let htmlPreview = document.getElementById("html-preview");
let preview = document.getElementById("display");
let token = getCookie("token");
let noPreview = document.getElementById("no-preview");
let pdfPreview = document.getElementById("pdf-preview");
let editorElem = document.getElementById("editor");
let previewPath;
let lastSave = editor.getValue();
let lastCompile;

let fullyLoaded = false;

document.addEventListener("DOMContentLoaded", function () {
    fullyLoaded = true;
});

try {
    if (localStorage.getItem("aceOptions") == null) {
        throw new Error("no");
    }
    let options = JSON.parse(localStorage.getItem("aceOptions"));
    delete options.mode;
    editor.setOptions(options);
} catch (_) {
    editor.setTheme("ace/theme/monokai");
    editor.setOption("wrap", true);
    editor.setShowPrintMargin(false);
}

let previewHidden = localStorage.getItem("previewHidden") == "true";
let editorHidden = localStorage.getItem("editorHidden") == "true";
let previewOutdated = true;

previewsHideExcept(noPreview);

function updateLayout() {
    localStorage.setItem("previewHidden", previewHidden);
    localStorage.setItem("editorHidden", editorHidden);
    if (previewHidden) {
        preview.classList.add("hide");
    } else {
        preview.classList.remove("hide");
    }

    if (editorHidden) {
        editorElem.classList.add("hide");
    } else {
        editorElem.classList.remove("hide");
    }

    if (editorHidden != previewHidden) {
        if (editorHidden) {
            preview.classList.add("fullscreen");
        } else {
            editorElem.classList.add("fullscreen");
        }
    } else {
        preview.classList.remove("fullscreen");
        editorElem.classList.remove("fullscreen");
    }
}

updateLayout();

function openOptions() {
    var commands = editor.commands.byName;
    var command = commands["showSettingsMenu"];
    if (command && command.exec) {
        command.exec(editor);
    }
}

function previewsHideExcept(except) {
    for (let i = 0; i < preview.children.length; i++) {
        if (preview.children[i] == except) {
            preview.children[i].classList.remove("hide");
        } else {
            preview.children[i].classList.add("hide");
        }
    }
}

function previewHtml(content) {
    let contentElem = document.createElement("div");
    contentElem.id = "html-preview";
    contentElem.innerHTML = content;
    htmlPreview.remove();
    document.getElementById("display").appendChild(contentElem);
    htmlPreview = contentElem;

    let scriptsToLoad = Array.from(
        htmlPreview.getElementsByTagName("script"),
    ).filter((script) => script.getAttribute("type") === null);
    let cssToLoad = Array.from(htmlPreview.getElementsByTagName("link")).filter(
        (css) => css.getAttribute("rel") == "stylesheet",
    );

    let loadedScriptsCount = 0;

    function onload() {
        loadedScriptsCount++;

        if (loadedScriptsCount === scriptsToLoad.length + cssToLoad.length) {
            try {
                Prism.highlightAll();
            } catch (_) {}
            previewOutdated = false;

            function renderStuff() {
                try {
                    renderMathInElement(document.getElementById("display"));
                } catch (_) {}
                try {
                    renderTikzjax();
                } catch (_) {}
            }

            if (fullyLoaded) {
                renderStuff();
            } else {
                document.addEventListener("DOMContentLoaded", function () {
                    renderStuff();
                });
            }
        }
    }

    for (const script of scriptsToLoad) {
        let tag = document.createElement("script");
        tag.src = script.src;
        tag.onload = onload;
        document.head.appendChild(tag);
    }
    for (const css of cssToLoad) {
        let tag = document.createElement("link");
        tag.setAttribute("rel", "stylesheet");
        tag.href = css.href;
        tag.onload = onload;
        htmlPreview.appendChild(tag);
    }

    htmlPreview.onload = () => console.log(1);
    previewsHideExcept(htmlPreview);
}

function preview_url(path) {
    previewPath = path;
    if (path == undefined) {
        previewsHideExcept(noPreview);
        return;
    }
    if (!previewOutdated || previewHidden) return;
    noPreview.classList.add("hide");
    let url = `/api/storage/v1/file/${token}/tex/${path}?time=${Date.now()}`;
    let ext = path.split(".").pop();
    switch (ext) {
        case "html":
            fetch(url)
                .then(function (response) {
                    return response.text();
                })
                .then(previewHtml)
                .catch(function (err) {
                    alert("Fetch Error :-S", err);
                });
            break;
        case "pdf":
            if (fullyLoaded) {
                PDFViewerApplication.open({ url });
            } else {
                document.addEventListener("DOMContentLoaded", function () {
                    PDFViewerApplication.open({ url });
                });
            }
            previewsHideExcept(pdfPreview);
            previewOutdated = false;
            break;
        default:
            alert(`Cannot preview files with extension ${ext}`);
    }
}

if (previews.length !== 0) {
    preview_url(previews[0]);
} else if (window.location.pathname.split(".").pop() === "html") {
    previewHtml(editor.getValue());
}

let file = document.getElementById("file-menu");
let edit = document.getElementById("edit-menu");
let view = document.getElementById("view-menu");
let compile = document.getElementById("compile-menu");

let saveBtn = document.getElementById("save");

function hideAllDropdowns(except) {
    let dropdowns = document.getElementsByClassName("dropdown-content");

    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i] != except) {
            dropdowns[i].classList.add("hide");
        }
    }
}

document.addEventListener("click", function (event) {
    if (
        event.target.parentNode == undefined ||
        !event.target.parentNode.classList
    ) {
        return;
    }
    if (event.target.parentNode.classList.contains("menubar-item")) {
        hideAllDropdowns(
            event.target.parentNode.getElementsByClassName(
                "dropdown-content",
            )[0],
        );
    }
    hideAllDropdowns(
        event.target.parentNode.getElementsByClassName("dropdown-content")[0],
    );
});

function showFile() {
    file.getElementsByClassName("dropdown-content")[0].classList.remove("hide");
}
function showEdit() {
    edit.getElementsByClassName("dropdown-content")[0].classList.remove("hide");
}
function showView() {
    view.getElementsByClassName("dropdown-content")[0].classList.remove("hide");
}
function showCompile() {
    compile
        .getElementsByClassName("dropdown-content")[0]
        .classList.remove("hide");
}
function toggleEditor() {
    editorHidden = !editorHidden;
    updateLayout();
}

function togglePreview() {
    previewHidden = !previewHidden;
    updateLayout();
    preview_url(previewPath);
}
document.getElementById("file").onclick = showFile;
document.getElementById("edit").onclick = showEdit;
document.getElementById("view").onclick = showView;
{
    let compile = document.getElementById("compile");
    if (compile) {
        compile.onclick = showCompile;
    }
}

document.getElementById("toggleEditor").onclick = toggleEditor;
document.getElementById("togglePreview").onclick = togglePreview;
document.getElementById("openOptions").onclick = openOptions;

window.addEventListener("beforeunload", function (e) {
    localStorage.setItem("aceOptions", JSON.stringify(editor.getOptions()));
    if (lastSave != editor.getValue()) {
        e.preventDefault();
        e.returnValue = "";
    }
});

function addRunning(element) {
    element.classList.add("running");
    element.parentNode.parentNode.classList.add("running");
}

function addDone(element) {
    element.classList.add("done");
    element.parentNode.parentNode.classList.add("done");
}

function removeRunning(element) {
    element.classList.remove("running");
    if (element.parentNode.getElementsByClassName("running").length !== 0) {
        return;
    }

    element.parentNode.parentNode.classList.remove("running");
}

function removeDone(element) {
    element.classList.remove("done");
    if (element.parentNode.getElementsByClassName("done").length !== 0) {
        return;
    }

    element.parentNode.parentNode.classList.remove("done");
}

let coutd = document.getElementById("coutd");
let backdrop = document.getElementById("backdrop");

function closeCoutd() {
    backdrop.classList.add("hide");
    coutd.open = false;
}

coutd.addEventListener("close", closeCoutd);

function openCoutd() {
    backdrop.classList.remove("hide");
    coutd.open = true;
}

function setCoutd(msg) {
    document.getElementById("ccontent").innerText = msg;
}

function closeAllDialogs() {
    closeCoutd();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeAllDialogs();
    }
});

coutd.getElementsByClassName("x")[0].onclick = closeCoutd;
document.getElementById("coutToggle").onclick = openCoutd;

backdrop.onclick = closeAllDialogs;

function save(f) {
    if (saveBtn.classList.contains("running")) {
        return;
    }
    if (lastSave == editor.getValue()) {
        addDone(saveBtn);
        setTimeout(() => removeDone(saveBtn), 500);
    }
    if (window.location.pathname.split(".").pop() === "html") {
        previewHtml(editor.getValue());
    }
    addRunning(saveBtn);
    const data = new FormData();
    const blob = new Blob([editor.getValue()], {
        type: "text/plain",
    });
    data.append("file", blob);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `/api/storage/v1/upload-overwrite/${token}/${savePath}`);
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            try {
                let res = JSON.parse(xhr.responseText);
                if (res.type === "error") {
                    alert(
                        `There was an error saving this file: ${JSON.stringify(res.kind)}`,
                    );
                }
            } catch (_) {}
            removeRunning(saveBtn);
            addDone(saveBtn);
            setTimeout(() => removeDone(saveBtn), 500);
            lastSave = editor.getValue();
            if (typeof f == "function") {
                f();
            }
        }
    };
    localStorage.setItem("aceOptions", JSON.stringify(editor.getOptions()));
}

saveBtn.onclick = save;

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        let got = sessionStorage.getItem(`compiler-${compilePath}`);
        if (got === null) {
            alert("Compile the file once before using this shortcut.");
        } else {
            got = JSON.parse(got);

            compileFile(
                got.target,
                got.compiler,
                document.querySelector(
                    `[compiler="${got.compiler}"][target="${got.target}"]`,
                ),
            );
        }
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        openOptions();
    }
    // if (e.shiftKey && e.ctrlKey && e.key === "c") {
    //   e.preventDefault();
    // }
});

function compileFile(target, compiler, btn) {
    if (btn.classList.contains("running")) {
        return;
    }
    addRunning(btn);
    function reallyCompile() {
        if (lastCompile == editor.getValue()) {
            removeRunning(btn);
            addDone(btn);
            setTimeout(() => removeDone(btn), 500);
            return;
        }
        let url = "/api/compile/v1/simple";
        sessionStorage.setItem(
            `compiler-${compilePath}`,
            JSON.stringify({ target, compiler }),
        );
        let data = {
            token,
            path: compilePath,
            from: thisFormat,
            to: target,
            compiler,
        };
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                removeRunning(btn);
                addDone(btn);
                setTimeout(() => removeDone(btn), 500);
                if (data.type == "error") {
                    if (data.kind.type == "compile error") {
                        lastCompile = editor.getValue();
                        setCoutd(data.kind.content);
                        openCoutd();
                    } else {
                        alert(`Error compiling: ${JSON.stringify(data.kind)}`);
                    }
                    return;
                }
                previewOutdated = true;
                lastCompile = editor.getValue();
                preview_url(data.newpath);
            })
            .catch((error) => console.error(error));
    }

    if (lastSave != editor.getValue()) {
        save(reallyCompile);
    } else {
        reallyCompile();
    }
}

let compiles = document.querySelectorAll("#compile-menu .dropdown-item");
for (let i = 0; i < compiles.length; i++) {
    compiles[i].onclick = () =>
        compileFile(
            compiles[i].getAttribute("target", compiles[i]),
            compiles[i].getAttribute("compiler", compiles[i]),
            compiles[i],
        );
}
