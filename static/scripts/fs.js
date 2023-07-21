let pathDisplay = document.getElementById("path-display");
let fslist = document.getElementById("fslist");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function getToken() {
  return getCookie("token");
}

function go(path, skipCheck) {
  if (!skipCheck && window.history.state.path === path) {
    return;
  }
  let token = getToken();

  if (cache[path]) {
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
        .join("/")}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        }

        if (data.type !== "dir content") {
          alert(
            `Expected response type of "dir content", got ${data.type} instead`
          );
          return;
        }
        window.history.pushState({ path: path }, "", `/fs/${path}`);
        cache[path] = data.content;
        display(path, data.content);
        conditionallyAddDots();
      })
      .catch((error) => console.error(error));
  } else {
    fetch(
      `/api/usercontent/v1/diritems/${id}/tex/${path
        .split("/")
        .slice(1)
        .join("/")}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        }

        if (data.type !== "dir content") {
          alert(
            `Expected response type of "dir content", got ${data.type} instead`
          );
          return;
        }
        window.history.pushState({ path: path }, "", `/fs/${path}`);
        cache[path] = data.content;
        display(path, data.content);
        conditionallyAddDots();
      })
      .catch((error) => console.error(error));
  }
}

function refresh() {
  let path = window.history.state.path;
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
  // fragment.onclick = () => go(fullpath);
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
  fslist.appendChild(node);
}

function addListeners() {
  Array.from(document.getElementsByClassName("fragment")).forEach(
    (fragment) => {
      let path = fragment.getAttribute("path");
      fragment.addEventListener("click", (_ev) => go(path));
      fragment.addEventListener("auxclick", (_event) =>
        window.open(`/fs/${path}`, "_blank").focus()
      );
    }
  );
  Array.from(fslist.children).forEach((fragment) => {
    let path = fragment.getAttribute("path");
    fragment.addEventListener("auxclick", (_event) =>
      window.open(`/fs/${path}`, "_blank").focus()
    );
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
  });
}

addListeners();

window.addEventListener("popstate", function (_event) {
  let path = window.history.state.path;
  go(path, true);
});

function addDots() {
  let items = fslist.children;
  for (const item of items) {
    let path = item.getAttribute("path").split("/");
    if (path.length < 2 || path[1] === ".system") {
      continue;
    }
    if (
      item.classList.contains("file") ||
      item.classList.contains("hidden-file")
    ) {
      item.innerHTML +=
        '<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="edit">Edit</span><span class="dropdown-item" action="delete">Delete</span></div></div></div>';
    } else {
      item.innerHTML +=
        '<div class="ellipsis"><img src="/static/icons/ellipsis.svg" class="dots"/><div class="dropdown hide"><div class="dropdown-content"><span class="dropdown-item" action="delete">Delete</span></div></div></div>';
    }
    item
      .getElementsByClassName("dots")[0]
      .addEventListener("click", () =>
        clickDots(item.getElementsByClassName("ellipsis")[0])
      );

    let options = item.getElementsByClassName("dropdown-item");
    for (const option of options) {
      option.addEventListener("click", (_e) => {
        let action = option.getAttribute("action");
        let path =
          option.parentNode.parentNode.parentNode.parentNode.getAttribute(
            "path"
          );

        switch (action) {
          case "edit":
            window.location.pathname = `/edit/${path
              .split("/")
              .slice(1)
              .join("/")}`;
            break;
          case "delete":
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
                  alert(`Error compiling: ${JSON.stringify(data.kind)}`);
                  return;
                }
                refresh();
              })
              .catch((error) => console.error(error));
            break;
          default:
            console.error(`Unknown action "${action}"`);
        }
      });
    }
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
}

window.addEventListener("click", (event) => {
  if (!event.target.classList.contains("dots")) dropdownsHideExcept();
});

function conditionallyAddDots() {
  let token = getToken();
  let id = window.history.state.path.split("/")[0];
  if (id === localStorage.getItem("userid") && token) {
    addDots();
  }
}

conditionallyAddDots();
