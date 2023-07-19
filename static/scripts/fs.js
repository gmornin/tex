let pathDisplay = document.getElementById("path-display");
let fslist = document.getElementById("fslist");

function go(path) {
  if (window.history.state.path === path) {
    return;
  }
  let token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

  if (cache[path]) {
    window.history.pushState({ path: path }, "", `/fs/${path}`);
    display(path, cache[path]);
    return;
  }

  let id = path.split("/")[0];

  if (id === localStorage.getItem("userid") && token) {
    fetch(
      `/api/storage/v1/diritems/${token.split("=")[1]}/tex/${path
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
      })
      .catch((error) => console.error(error));
  }
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
  Array.from(document.getElementsByClassName("fragment")).forEach((fragment) =>
    fragment.addEventListener("click", (_ev) =>
      go(fragment.getAttribute("path"))
    )
  );
  Array.from(fslist.children).forEach((fragment) => {
    if (fragment.getAttribute("isFile")) {
      fragment.addEventListener(
        "click",
        (_ev) =>
          (window.location.pathname = `/fs/${fragment.getAttribute("path")}`)
      );
    } else {
      fragment.addEventListener("click", (_ev) =>
        go(fragment.getAttribute("path"))
      );
    }
  });
}

addListeners();

window.addEventListener("popstate", function (_event) {
  let path = window.history.state.path;
  display(path, cache[path]);
});
