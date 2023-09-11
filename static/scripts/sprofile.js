let textarea = document.getElementById("bio-textarea");
let addbut = document.getElementById("add");
let addd = document.getElementById("addd");
let badges = document.getElementById("badges");
let pfp = document.getElementById("pfp");
let pfp_input = document.querySelector("#pfp-container input");
let pfp_container = document.getElementById("pfp-container");

function updateHeight(ele) {
  ele.style.height = ""; /* Reset the height*/
  ele.style.height = ele.scrollHeight + "px";
}

textarea.oninput = () => updateHeight(textarea);

updateHeight(textarea);

const badgesList = document.getElementById("badges");
let draggedBadge = null;
let previewLine = null;

// Add event listeners to the badges for drag-and-drop
badgesList.addEventListener("dragstart", (event) => {
  draggedBadge = event.target.closest(".badge");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", draggedBadge.outerHTML);
  draggedBadge.classList.add("dragged");
});

badgesList.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const targetBadge = event.target.closest(".badge");
  if (targetBadge && targetBadge !== draggedBadge) {
    const targetRect = targetBadge.getBoundingClientRect();
    const targetMidY = targetRect.top + targetRect.height / 2;
    if (event.clientY < targetMidY) {
      badgesList.insertBefore(draggedBadge, targetBadge);
    } else {
      badgesList.insertBefore(draggedBadge, targetBadge.nextSibling);
    }
    if (!previewLine) {
      previewLine = document.createElement("div");
      previewLine.className = "preview-line";
      badgesList.appendChild(previewLine);
    }
    const previewLineY = targetMidY - badgesList.getBoundingClientRect().top;
    previewLine.style.display = "block";
    previewLine.style.top = `${previewLineY}px`;
  } else {
    if (previewLine) {
      previewLine.style.display = "none";
    }
  }
});

badgesList.addEventListener("dragend", (event) => {
  event.preventDefault();
  if (previewLine) {
    badgesList.removeChild(previewLine);
    previewLine = null;
  }
  draggedBadge.classList.remove("dragged");
  draggedBadge = null;
});

for (const li of Array.from(document.querySelectorAll("#addd li"))) {
  li.innerHTML += '<img class="plus" src="/static/icons/plus.svg">';
}

addbut.onclick = () => {
  addd.setAttribute("open", "");
  let backdrop = document.getElementById("backdrop");
  backdrop.style.display = "block";
};

function addBackspace(elem) {
  let backspace = document.createElement("img");
  backspace.src = "/static/icons/backspace.svg";
  backspace.onclick = () => elem.remove();
  elem.appendChild(backspace);
}

function fieldPlaceHolder(field) {
  switch (field) {
    case "cake day":
      return "dd/mm";
    case "birthday":
      return "dd/mm/yyyy";
    case "occupation":
    case "location":
    case "company":
    case "school":
    case "education":
      return "any string";
    case "email":
      return "username@example.com";
    case "matrix":
    case "mastodon":
    case "lemmy":
      return "username:instance.org";
    case "github":
    case "gitlab":
    case "bitbucket":
    case "reddit":
    case "discord":
    case "twitter":
    case "youtube":
      return "example_user";
    case "odysee":
      return "username:1";
    case "website":
      return "example.com (omit https://)";
    default:
      alert(`I don't know what is ${field}`);
      return "error value";
  }
}

function fieldImgName(field) {
  switch (field) {
    case "cake day":
    case "birthday":
      return "cake";
    case "occupation":
      return "suitcase";
    case "company":
      return "business";
    case "email":
      return "envolope";
    case "website":
      return "link";
    default:
      return field;
  }
}

for (const badge of Array.from(badges.children)) {
  badge
    .querySelector("input")
    .setAttribute("placeholder", fieldPlaceHolder(badge.getAttribute("field")));
  addBackspace(badge);
}

for (const add of Array.from(document.querySelectorAll("#list-container li"))) {
  add.onclick = () => {
    let field = add.getAttribute("field");

    let li = document.createElement("li");
    li.setAttribute("field", field);
    li.classList.add("badge");
    let img = document.createElement("img");
    img.src = `/static/icons/${fieldImgName(field)}.svg`;
    img.draggable = true;
    let input = document.createElement("input");
    input.classList.add("badge-value");
    input.value = "";
    input.type = "text";
    input.placeholder = fieldPlaceHolder(field);

    li.appendChild(img);
    li.appendChild(input);
    badges.appendChild(li);
    addBackspace(li);
  };
}

function genProfileTree() {
  return {
    description: textarea.value,
    details: Array.from(badges.children).map((badge) => {
      let field = badge.getAttribute("field");
      let input = badge.querySelector("input");
      let value;

      switch (field) {
        case "cake day": {
          let [d, m] = input.value.split("/");
          value = { day: parseInt(d), month: parseInt(m) };
          break;
        }
        case "birthday": {
          let [d, m, y] = input.value.split("/");
          value = { day: parseInt(d), month: parseInt(m), year: parseInt(y) };
          break;
        }
        case "location":
        case "occupation":
        case "company":
        case "school":
        case "education":
          value = input.value;
      }

      if (value) {
        return {
          type: field,
          value,
        };
      }

      switch (field) {
        case "email": {
          let [name, instance] = input.value.split("@");
          value = { name, instance };
          break;
        }
        case "matrix":
        case "mastodon":
        case "lemmy": {
          let [name, instance] = input.value.split(":");
          value = { name, instance };
          break;
        }
        case "odysee": {
          let [name, discriminator] = input.value.split(":");
          value = { name, discriminator };
          break;
        }
        default:
          value = { value: input.value };
      }

      value.type = field;

      return {
        type: "contact",
        value,
      };
    }),
  };
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function getToken() {
  return getCookie("token");
}

function saveProfile(elem) {
  let body = {
    token: getToken(),
    profile: genProfileTree(),
  };

  fetch("/api/generic/v1/set-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.type == "error") {
        alert(`Error deleting file: ${JSON.stringify(data.kind)}`);
        return;
      }
      turnItGreen(elem);
    })
    .catch((error) => console.error(error));
}

function setStatus(elem) {
  let body = {
    token: getToken(),
    new: document.getElementById("status").value,
  };

  fetch("/api/accounts/v1/set-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.type == "error") {
        alert(`Error deleting file: ${JSON.stringify(data.kind)}`);
        return;
      }
      turnItGreen(elem);
    })
    .catch((error) => console.error(error));
}

function setUsername(elem) {
  let body = {
    token: getToken(),
    new: document.getElementById("username").value,
  };

  fetch("/api/accounts/v1/rename", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.type == "error") {
        alert(`Error deleting file: ${JSON.stringify(data.kind)}`);
        return;
      }
      turnItGreen(elem);
    })
    .catch((error) => console.error(error));
}

for (const save of Array.from(document.getElementsByClassName("save"))) {
  save.onclick = () => {
    save.style.cursor = "wait";
    switch (save.getAttribute("field")) {
      case "profile":
        saveProfile(save);
        break;
      case "status":
        setStatus(save);
        break;
      case "username":
        setUsername(save);
        break;
      default:
        alert(
          `I have died a horrible disease of "${save.getAttribute("field")}"`
        );
    }
  };
}

pfp_input.oninput = (_event) => {
  pfp_input.disabled = true;
  pfp_container.classList.add("hover-loading");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `/api/generic/v1/set-pfp/${getCookie("token")}`, true);

  const formData = new FormData();
  formData.append("file", pfp_input.files[0]);

  xhr.onreadystatechange = function (event) {
    if (xhr.readyState === 4) {
      let res = JSON.parse(event.target.responseText);
      if (res.type == "error") {
        console.error(res);
        alert(
          `Upload failed: ${res.kind.type}\nNote that only pngs are allowed at the moment`
        );
      } else {
        pfp.src = `/api/generic/v1/pfp/id/${localStorage.getItem(
          "userid"
        )}?time=${Date.now()}`;
        alert(
          "Pfp updated, wait while the cached image wears off in other pages"
        );
      }
      pfp_input.removeAttribute("disabled");
      pfp_container.classList.remove("hover-loading");
    }
  };
  xhr.send(formData);
};
