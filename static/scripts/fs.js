const isMobile = (() => {
    var match = window.matchMedia || window.msMatchMedia;
    if (match) {
        var mq = match("(pointer:coarse)");
        return mq.matches;
    }
    return false;
})();

if (isMobile) {
    document.body.id = "mobile";
}

function newTab(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    const e = new MouseEvent("click", {
        ctrlKey: true,
        metaKey: true,
    });
    a.dispatchEvent(e);
}

let closeBackdrop = true;
let removeEnterBehaviour = true;
let pathDisplay = document.getElementById("path-display");
let fslist = document.getElementById("fslist");
let moved = document.getElementById("moved");
let move_from = document.querySelector("#move-from span");
let move_target = document.getElementById("movetarget");
let movebut = document.getElementById("movebut");
let copyd = document.getElementById("copyd");
let copy_from = document.querySelector("#copy-from span");
let copy_target = document.getElementById("copytarget");
let copybut = document.getElementById("copybut");
let touchd = document.getElementById("touchd");
let create = document.getElementById("create");
let createbut = document.getElementById("createbut");
let folderadd = document.getElementById("create-folder");
let fileadd = document.getElementById("create-file");
let restored = document.getElementById("restored");
let restorebut = document.getElementById("restorebut");
let create_target = document.getElementById("createtarget");

let isFileAdd = true;

let enterBehaviour = () => {};

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") enterBehaviour();
});

function getFsPath() {
    return window.location.pathname.split("/").slice(2).join("/");
}

function getCurrentTime() {
    const now = new Date();

    const currentTime = `${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

    return currentTime;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function getToken() {
    return getCookie("token");
}

function go(path, skipCheck, dontpush) {
    if (!skipCheck && window.history.state.path === path) {
        return;
    }
    let token = getToken();

    if (cache[path]) {
        if (!dontpush)
            window.history.pushState({ path: path }, "", `/fs/${path}`);
        display(path, cache[path]);
        conditionallyAddDots();
        return;
    }

    let id = path.split("/")[0];

    if (id === localStorage.getItem("userid") && token) {
        fetch(
            `/api/storage/v1/diritems/${token}/tex/${path
                .split("/")
                .slice(1)
                .join("/")}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                }

                if (data.type !== "dir content") {
                    alert(
                        `Expected response type of "dir content", got ${data.type} instead`,
                    );
                    return;
                }
                if (!dontpush)
                    window.history.pushState({ path: path }, "", `/fs/${path}`);
                cache[path] = data.content;
                display(path, data.content);
                conditionallyAddDots();
            })
            .catch((error) => console.error(error));
    } else {
        fetch(
            `/api/usercontent/v1/diritems/id/${id}/tex/${path
                .split("/")
                .slice(1)
                .join("/")}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                }

                if (data.type !== "dir content") {
                    alert(
                        `Expected response type of "dir content", got ${data.type} instead`,
                    );
                    return;
                }
                if (!dontpush)
                    window.history.pushState({ path: path }, "", `/fs/${path}`);
                cache[path] = data.content;
                display(path, data.content);
                conditionallyAddDots();
            })
            .catch((error) => console.error(error));
    }
}

function refresh(path) {
    if (path === undefined) {
        path = window.history.state.path;
    }
    delete cache[path];
    go(path, true);
}

function display(path, content) {
    if (!path) {
        return;
    }
    document.title = path;
    let currentPath = trimPath(path);
    displayPath(currentPath);
    displayItems(content, currentPath);
    addListeners();
}

function trimPath(path) {
    return path.replace(/^\/|\/$/g, "");
}

function displayPath(path) {
    let spans = pathDisplay.getElementsByTagName("span");

    let create = document.getElementById("create");
    let uploadbut = document.getElementById("upload");
    let splitted = path.split("/");
    if (
        splitted[1] !== ".system" &&
        (splitted[1] !== "Shared" || splitted.length !== 2) &&
        (splitted[1] !== "Shared" || splitted[3] !== ".system")
    ) {
        uploadbut.style.display = "inline";
        create.style.display = "inline";
    } else {
        uploadbut.style.display = "none";
        create.style.display = "none";
    }

    for (let i = spans.length - 1; i >= 0; i--) {
        spans[i].parentNode.removeChild(spans[i]);
    }

    let fragments = path.split("/");

    for (let i = fragments.length - 1; i >= 0; i--) {
        addFragment(fragments[i], fragments.slice(0, i + 1).join("/"));

        if (i === 0) {
            break;
        }
        addConnect();
    }
}

function addFragment(s, fullpath) {
    let fragment = document.createElement("span");
    fragment.classList.add("fragment");
    fragment.innerText = s;
    fragment.setAttribute("path", fullpath);
    pathDisplay.insertBefore(fragment, pathDisplay.firstChild);
}

function addConnect() {
    let connect = document.createElement("span");
    connect.classList.add("connect");
    connect.innerText = ">";
    pathDisplay.insertBefore(connect, pathDisplay.firstChild);
}

function displayItems(items, currentPath) {
    fslist.innerHTML = "";
    items.forEach((item) => addItem(item, currentPath + "/" + item.name));
}

function addItem(item, fullpath) {
    let node = document.createElement("li");
    node.innerText = item.name;
    node.setAttribute("path", fullpath);
    if (item.is_file) {
        node.setAttribute("isFile", "true");
    }

    if (!item.is_file) {
        node.innerText += "/";
    }

    let classname = "";
    if (item.name.startsWith(".")) {
        classname += "hidden-";
    }

    if (item.is_file) {
        classname += "file";
    } else {
        classname += "dir";
    }

    node.classList.add(classname);

    let icon = `<img src="/static/icons/${
        item.visibility.visibility
    }.svg" class="${
        item.visibility.inherited ? "icon icon-inherit" : "icon"
    }" />`;
    node.innerHTML = `${icon}${node.innerHTML}`;
    fslist.appendChild(node);
}

function addListeners() {
    Array.from(document.getElementsByClassName("fragment")).forEach(
        (fragment) => {
            let path = fragment.getAttribute("path");
            if (path === null) return;
            fragment.addEventListener("click", (_ev) => go(path));
            fragment.addEventListener("auxclick", (_event) =>
                newTab(`/fs/${path}`),
            );
        },
    );
    if (!fslist) return;
    Array.from(fslist.children).forEach((fragment) => {
        let path = fragment.getAttribute("path");
        if (fragment.getAttribute("isFile")) {
            fragment.addEventListener("click", (event) => {
                if (
                    event.target.classList.contains("dots") ||
                    event.target.classList.contains("dropdown-item")
                )
                    return;
                window.location.pathname = `/fs/${fragment.getAttribute("path")}`;
            });
        } else {
            fragment.addEventListener("click", (event) => {
                if (
                    event.target.classList.contains("dots") ||
                    event.target.classList.contains("dropdown-item")
                )
                    return;
                go(fragment.getAttribute("path"));
            });
        }
        fragment.addEventListener("auxclick", (_event) =>
            newTab(`/fs/${path}`),
        );
    });
}

function trashTask(path) {
    let trashPath = path.split("/").slice(1).join("/");
    let body = {
        token: getToken(),
        // "from-userid": localStorage.getItem("userid"),
        from: `/tex/${trashPath}`,
        to: `/tex/.system/trash/${trashPath}`,
    };

    let splitted = trashPath.split("/");

    if (splitted[0] === "Shared") {
        body.to = `/tex/Shared/${splitted[1]}/.system/trash/${splitted.slice(2).join("/")}`;
    }

    let url = "/api/storage/v1/move-createdirs-overwrite";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.type == "error") {
                alert(
                    `Error moving to trash: ${JSON.stringify(data.kind)}\nConsider deleting the file at /.system/trash`,
                );
                return;
            }
            if (localStorage.getItem("trashNotif") === null) {
                alert(
                    "File has been moved to /.system/trash\nMake sure to empty trash once in a while.",
                );
                localStorage.setItem("trashNotif", true);
            }
            if (
                cache[`${getFsPath().split("/").shift()}/.system`] !==
                    undefined &&
                cache[`${getFsPath().split("/").shift()}/.system`].trash ===
                    undefined
            )
                delete cache[`${getFsPath().split("/").shift()}/.system`];
            delete cache[
                `${getFsPath().split("/").shift()}/.system/trash/${trashPath.split("/").slice(0, -1).join("/")}`.replace(
                    /\/+$/,
                    "",
                )
            ];
            refresh();
        })
        .catch((error) => console.error(error));
}

function restoreTask(path) {
    let trashPath = path.split("/").slice(1).join("/");
    let splitted = trashPath.split("/");

    let body = {
        token: getToken(),
        // "from-userid": localStorage.getItem("userid"),
        from: `/tex/${trashPath}`,
        to: `/tex/${splitted.slice(2)}`,
    };

    if (splitted[0] === "Shared") {
        body.to = `/tex/Shared/${splitted[1]}/${splitted.slice(4).join("/")}`;
    }

    let url = "/api/storage/v1/move-createdirs";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            let cCache = () => {
                delete cache[
                    `${getFsPath().split("/").shift()}/${trashPath.split("/").slice(0, -1).join("/")}`.replace(
                        /\/+$/,
                        "",
                    )
                ];
            };
            if (data.type == "error") {
                if (data.kind.type == "path occupied") {
                    backdrop.style.display = "block";
                    restored.showModal();

                    restorebut.onclick = () => {
                        restored.close();
                        url = "/api/storage/v1/move-createdirs-overwrite";

                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.type == "error") {
                                    alert(
                                        `Error restoring file: ${JSON.stringify(data.kind)}`,
                                    );
                                    return;
                                }
                                cCache();
                                refresh();
                            })
                            .catch((error) => console.error(error));
                    };
                }
                return;
            }
            cCache();
            refresh();
        })
        .catch((error) => console.error(error));
}

function moveOverwriteTask(body) {
    restored.close();
    url = "/api/storage/v1/move-overwrite";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.type == "error") {
                alert(`Error moving: ${JSON.stringify(data.kind)}`);
                return;
            }
            delete cache[
                `${localStorage.getItem("userid")}/${copy_target.value
                    .split("/")
                    .slice(1, -1)
                    .join("/")}`.replace(/\/+$/, "")
            ];
            refresh();
        })
        .catch((error) => console.error(error));
}

function moveTask() {
    if (movebut.disabled) {
        return;
    }

    movebut.disabled = true;
    movebut.innerText = "Moving...";
    if (!move_target.value.startsWith("/")) {
        move_target.value = "/" + move_target.value;
    }

    let from = movebut.getAttribute("path").split(/\/(.*)/s);
    let body = {
        token: getToken(),
        "from-userid": parseInt(from[0]),
        from: `/tex/${from[1]}`,
        to: `/tex${move_target.value}`,
    };

    let url = "/api/storage/v1/move";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.type == "error") {
                if (data.kind.type == "path occupied") {
                    closeBackdrop = false;
                    removeEnterBehaviour = false;
                    moved.close();
                    restored.showModal();
                    enterBehaviour = restorebut.onclick = () =>
                        moveOverwriteTask(body);
                    return;
                }
                movebut.removeAttribute("disabled");
                movebut.innerText = "Move failed";
                alert(`Error moving: ${JSON.stringify(data.kind)}`);
                return;
            }
            movebut.classList.add("not-allowed");
            movebut.innerText = "Moved!";
            delete cache[
                `${localStorage.getItem("userid")}/${move_target.value
                    .split("/")
                    .slice(1, -1)
                    .join("/")}`.replace(/\/+$/, "")
            ];
            refresh();
        })
        .catch((error) => console.error(error));
}

function copyOverwriteTask(body) {
    restored.close();
    url = "/api/storage/v1/copy-overwrite";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.type == "error") {
                alert(`Error copying: ${JSON.stringify(data.kind)}`);
                return;
            }
            delete cache[
                `${localStorage.getItem("userid")}/${copy_target.value
                    .split("/")
                    .slice(1, -1)
                    .join("/")}`.replace(/\/+$/, "")
            ];
            refresh();
        })
        .catch((error) => console.error(error));
}

function copyTask() {
    if (copybut.disabled) {
        return;
    }

    copybut.disabled = true;
    copybut.innerText = "Copying...";
    if (!copy_target.value.startsWith("/")) {
        copy_target.value = "/" + copy_target.value;
    }

    let from = copybut.getAttribute("path").split(/\/(.*)/s);
    let body = {
        token: getToken(),
        "from-userid": parseInt(from[0]),
        from: `/tex/${from[1]}`,
        to: `/tex${copy_target.value}`,
    };

    let url = "/api/storage/v1/copy";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.type == "error") {
                if (data.kind.type == "path occupied") {
                    closeBackdrop = false;
                    removeEnterBehaviour = false;
                    copyd.close();
                    restored.showModal();

                    enterBehaviour = restorebut.onclick = () =>
                        copyOverwriteTask(body);
                    return;
                }
                copybut.removeAttribute("disabled");
                copybut.innerText = "Copy failed";
                alert(`Error copying: ${JSON.stringify(data.kind)}`);
                return;
            }
            copybut.classList.add("not-allowed");
            copybut.innerText = "Copied!";
            delete cache[
                `${localStorage.getItem("userid")}/${copy_target.value
                    .split("/")
                    .slice(1, -1)
                    .join("/")}`.replace(/\/+$/, "")
            ];
            refresh();
        })
        .catch((error) => console.error(error));
}

function createTask() {
    if (create_target.value.length == 0) return;
    createbut.disabled = true;
    let splitted = window.history.state.path.trim().split("/");
    let path;

    if (splitted.length > 1) {
        path = `/tex/${splitted.slice(1).join("/")}/${create_target.value}`;
    } else {
        path = `/tex/${create_target.value}`;
    }
    let body = {
        token: getToken(),
        path,
    };

    let url;
    if (isFileAdd) {
        url = "/api/storage/v1/touch";
    } else {
        url = "/api/storage/v1/mkdir";
    }

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.type == "error") {
                alert(`Error creating file item: ${JSON.stringify(data.kind)}`);
                return;
            }
            createbut.classList.add("not-allowed");
            createbut.innerText = "Created!";
            refresh(
                `${localStorage.getItem("userid")}/${path
                    .replace(/^\/+|\/+$/g, "")
                    .split("/")
                    .slice(1, -1)
                    .join("/")}`,
            );
        })
        .catch((error) => console.error(error));
}

addListeners();

window.addEventListener("popstate", function (_event) {
    let path = window.history.state.path;
    go(path, true, true);
});

if (fslist) {
    touchd.onclose =
        copyd.onclose =
        moved.onclose =
        restored.onclose =
            () => {
                if (removeEnterBehaviour) {
                    enterBehaviour = () => {};
                } else {
                    removeEnterBehaviour = true;
                }
                if (closeBackdrop) {
                    backdrop.style.display = "none";
                } else {
                    closeBackdrop = true;
                }
                create_reset();
            };
    document.querySelector("#moved .x").onclick = () => moved.close();
    document.querySelector("#copyd .x").onclick = () => copyd.close();
    document.querySelector("#restored .x").onclick = () => restored.close();

    function addDots() {
        let items = fslist.children;
        for (const item of items) {
            let path = item.getAttribute("path").split("/");

            if (path.length <= 3 && path[1] === "Shared") continue;
            let id = window.history.state.path.split("/")[0];
            if (
                (path[1] === ".system" &&
                    id === localStorage.getItem("userid") &&
                    path[2] === "trash") ||
                (path[1] === "Shared" &&
                    path[3] === ".system" &&
                    path[4] === "trash")
            ) {
                if (path.length > 3) {
                    item.innerHTML += `<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="restore">Restore</span><span class="dropdown-item" action="delete">Delete</span></div></span></div></div></div>`;
                } else {
                    item.innerHTML += `<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="delete">Delete</span></div></div>`;
                }
            } else if (
                id === localStorage.getItem("userid") &&
                path[1] !== ".system" &&
                !(path[1] === "Shared" && path.length === 2) &&
                !(path[1] === "Shared" && path[3] === ".system")
            ) {
                if (
                    item.classList.contains("file") ||
                    item.classList.contains("hidden-file")
                ) {
                    item.innerHTML += `<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="edit">Edit</span><span class="dropdown-item" action="move">Move</span><span class="dropdown-item" action="copy">Copy</span><span class="dropdown-item" action="download">Download</span><span class="dropdown-item" action="trash">Trash</span><span class="dropdown-item" action="visibility">Visibility<div class="dropdown dropdown-fold"><div class="dropdown-content"><div class="dropdown-item" action="public">Public</div><div class="dropdown-item" action="hidden">Hidden</div><div class="dropdown-item" action="private">Private</div><div class="dropdown-item" action="inherit">Inherit</div></div></div></span></div></div></div>`;
                } else {
                    item.innerHTML += `<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="move">Move</span><span class="dropdown-item" action="copy">Copy</span><span class="dropdown-item" action="trash">Trash</span><span class="dropdown-item" action="visibility">Visibility<div class="dropdown dropdown-fold"><div class="dropdown-content"><div class="dropdown-item" action="public">Public</div><div class="dropdown-item" action="hidden">Hidden</div><div class="dropdown-item" action="private">Private</div><div class="dropdown-item" action="inherit">Inherit</div></div></div></span></div></div></div>`;
                }
            } else {
                item.innerHTML += `<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="copy">Copy</span></div></div>`;
            }
            item.getElementsByClassName("dots")[0].addEventListener(
                "click",
                () => clickDots(item.getElementsByClassName("ellipsis")[0]),
            );

            let options = item.getElementsByClassName("dropdown-item");
            for (const option of options) {
                option.addEventListener("click", (event) => {
                    if (event.target != option) {
                        return;
                    }
                    let action = option.getAttribute("action");
                    let path =
                        option.parentNode.parentNode.parentNode.parentNode.getAttribute(
                            "path",
                        );

                    switch (action) {
                        case "edit":
                            window.location.pathname = `/edit/${path
                                .split("/")
                                .slice(1)
                                .join("/")}`;
                            break;
                        case "download":
                            path = path.split("/");
                            let id = parseInt(path.shift());
                            let url;
                            path = path.join("/");

                            console.log(id);
                            console.log(path);
                            if (id == localStorage.getItem("userid")) {
                                url = `/api/storage/v1/file/${getToken()}/tex/${path}`;
                            } else {
                                url = `/api/usercontent/v1/file/id/${id}/tex/${path}`;
                            }
                            var link = document.createElement("a");
                            link.download = path.split("/").pop();
                            link.href = url;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            delete link;
                            break;
                        case "delete": {
                            let delPath = path.split("/").slice(1).join("/");
                            let token = getToken();
                            let body = {
                                path: `tex/${delPath}`,
                                token,
                            };

                            fetch("/api/storage/v1/delete", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(body),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.type == "error") {
                                        alert(
                                            `Error deleting file: ${JSON.stringify(data.kind)}`,
                                        );
                                        return;
                                    }
                                    refresh();
                                })
                                .catch((error) => console.error(error));
                            break;
                        }
                        case "visibility":
                            option
                                .getElementsByClassName("dropdown-fold")[0]
                                .classList.remove("hide");
                            break;
                        case "public":
                        case "private":
                        case "hidden": {
                            let vispath =
                                option.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                                    .getAttribute("path")
                                    .split("/")
                                    .slice(1)
                                    .join("/");
                            let token = getToken();
                            let body = {
                                path: `tex/${vispath}`,
                                token,
                                visibility: action,
                            };

                            fetch("/api/storage/v1/set-visibility", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(body),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.type == "error") {
                                        alert(
                                            `Error changing visibility: ${JSON.stringify(data.kind)}`,
                                        );
                                        return;
                                    }
                                    for (const path in cache) {
                                        if (
                                            path.startsWith(
                                                `${window.history.state.path.split("/")[0]}/${vispath}`,
                                            )
                                        ) {
                                            delete cache[path];
                                        }
                                    }
                                    refresh();
                                })
                                .catch((error) => console.error(error));
                            break;
                        }
                        case "inherit": {
                            let vispath =
                                option.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                                    .getAttribute("path")
                                    .split("/")
                                    .slice(1)
                                    .join("/");
                            let token = getToken();
                            let body = {
                                path: `tex/${vispath}`,
                                token,
                            };

                            fetch("/api/storage/v1/remove-visibility", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(body),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.type == "error") {
                                        alert(
                                            `Error changing visibility: ${JSON.stringify(data.kind)}`,
                                        );
                                        return;
                                    }
                                    for (const path in cache) {
                                        if (
                                            path.startsWith(
                                                `${window.history.state.path.split("/")[0]}/${vispath}`,
                                            )
                                        ) {
                                            delete cache[path];
                                        }
                                    }
                                    refresh();
                                })
                                .catch((error) => console.error(error));
                            break;
                        }
                        case "copy": {
                            let slash_i = path.lastIndexOf("/") + 1;
                            let file_name = path.substring(slash_i);
                            let file = cache[window.history.state.path].find(
                                (item) => item.name === file_name,
                            );
                            copybut.setAttribute("path", path);
                            copy_from.innerText = `${path} (${formatBytes(file.size)})`;

                            copy_target.value = `/${path
                                .split("/")
                                .slice(1)
                                .join("/")}`;
                            backdrop.style.display = "block";
                            copyd.showModal();
                            copybut.innerText = "Copy";
                            copybut.classList.remove("not-allowed");
                            copybut.removeAttribute("disabled");
                            enterBehaviour = copyTask;
                            break;
                        }
                        case "move": {
                            let slash_i = path.lastIndexOf("/") + 1;
                            let file_name = path.substring(slash_i);
                            let file = cache[window.history.state.path].find(
                                (item) => item.name === file_name,
                            );
                            movebut.setAttribute("path", path);
                            move_from.innerText = `${path} (${formatBytes(file.size)})`;
                            move_target.value = `/${path
                                .split("/")
                                .slice(1)
                                .join("/")}`;
                            backdrop.style.display = "block";
                            moved.showModal();
                            movebut.innerText = "Move";
                            movebut.classList.remove("not-allowed");
                            movebut.removeAttribute("disabled");
                            enterBehaviour = moveTask;
                            break;
                        }
                        case "trash": {
                            trashTask(path);
                            break;
                        }
                        case "restore": {
                            restoreTask(path);
                            break;
                        }
                        default:
                            console.error(`Unknown action "${action}"`);
                    }
                });
            }
        }

        for (const menu of Array.from(
            document.getElementsByClassName("dropdown-content"),
        )) {
            menu.addEventListener("auxclick", function (event) {
                event.stopPropagation();
            });
        }

        for (const editBut of Array.from(
            document.querySelectorAll('[action="edit"]'),
        )) {
            let path =
                editBut.parentNode.parentNode.parentNode.parentNode.getAttribute(
                    "path",
                );

            editBut.addEventListener("auxclick", (event) =>
                newTab(`/edit/${path.split("/").slice(1).join("/")}`),
            );
        }
    }

    function clickDots(parent) {
        let dropdown = parent.getElementsByClassName("dropdown")[0];
        if (!dropdown.classList.contains("hide")) {
            return;
        }
        dropdown.classList.remove("hide");
        dropdownsHideExcept(dropdown);
    }

    function dropdownsHideExcept(except) {
        let dropdowns = document.getElementsByClassName("dropdown");
        for (const dropdown of dropdowns) {
            if (dropdown != except) {
                dropdown.classList.add("hide");
            }
        }

        let folds = document.getElementsByClassName("dropdown-fold");
        for (const fold of folds) {
            fold.classList.add("hide");
        }
    }

    window.addEventListener("click", (event) => {
        if (
            !event.target.classList.contains("dots") &&
            event.target.getAttribute("action") !== "visibility"
        )
            dropdownsHideExcept();
    });

    copybut.onclick = copyTask;

    movebut.onclick = moveTask;

    function conditionallyAddDots() {
        let token = getToken();
        if (token) {
            addDots();
        }
    }

    copy_target.oninput = () => {
        if (!copy_target.value.startsWith("/")) {
            copy_target.value = "/" + copy_target.value;
        }
    };

    create_target.oninput = () => {
        check_path();
    };

    conditionallyAddDots();

    create.onclick = () => {
        enterBehaviour = createTask;
        touchd.showModal();
        backdrop.style.display = "block";
    };

    document.querySelector("#touchd .x").onclick = () => {
        touchd.close();
    };

    function create_highlight() {
        if (isFileAdd) {
            folderadd.style.opacity = 0.5;
            fileadd.style.opacity = 1;
        } else {
            fileadd.style.opacity = 0.5;
            folderadd.style.opacity = 1;
        }
    }

    function create_reset() {
        createbut.disabled = true;
        createbut.classList.add("not-allowed");
        isFileAdd = true;
        create_highlight();
        create_target.value = "";
        createbut.innerText = "Create";
    }

    fileadd.onclick = () => {
        isFileAdd = true;
        create_highlight();
        if (create_target.value.endsWith("/")) {
            create_target.value = create_target.value.replace(/\/+$/, "");
        }
    };

    folderadd.onclick = () => {
        if (isFileAdd) {
            isFileAdd = false;
            create_highlight();
            if (
                !create_target.value.endsWith("/") &&
                create_target.value.length !== 0
            )
                create_target.value += "/";
        }
    };

    function check_path() {
        isFileAdd = !create_target.value.endsWith("/");
        create_highlight();
        if (create_target.value.length === 0) {
            createbut.disabled = true;
            createbut.classList.add("not-allowed");
        } else {
            createbut.disabled = false;
            createbut.classList.remove("not-allowed");
        }
    }

    create_reset();

    createbut.onclick = createTask;
}
