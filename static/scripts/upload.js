{
  let div = document.createElement("div");
  div.id = "backdrop";
  div.style.display = "none";
  document.body.appendChild(div);
}

let dialog = document.getElementById("uploadd");
let backdrop = document.getElementById("backdrop");
let sourceDisplay = document.querySelector("#upload-from span");
let target = document.getElementById("target");
let uploadbut = document.getElementById("uploadbut");
let fileInput = document.querySelector("#fileupload input");

function disableOtherFileInputs() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  for (let i = 0; i < fileInputs.length; i++) {
    fileInputs[i].disabled = true;
  }

  const icons = document.querySelectorAll("#upload-types img");

  for (let i = 0; i < fileInputs.length; i++) {
    icons[i].classList.add("disabled");
  }
}

const fileInputs = document.querySelectorAll('input[type="file"]');
for (let i = 0; i < fileInputs.length; i++) {
  const fileInput = fileInputs[i];
  fileInput.addEventListener("change", () => {
    disableOtherFileInputs();
  });
}

document.getElementById("upload").onclick = () => {
  dialog.showModal();
  backdrop.style.display = "block";
};

document.getElementById("x").onclick = () => {
  dialog.close();
};

dialog.addEventListener("close", function (_event) {
  backdrop.style.display = "none";
  reset();
});

document
  .querySelector("#fileupload input")
  .addEventListener("change", fileSelect);

function fileSelect(event) {
  const file = event.target.files[0];
  sourceDisplay.textContent = `${file.name} (${formatBytes(file.size)})`;
  target.value = file.name;
  targetInput();
}

function formatBytes(a, b = 2) {
  if (!+a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ["B", "KB", "MB", "GB", "TB"][d]
  }`;
}

function getPath(add) {
  let splitted = window.history.state.path.split("/");
  splitted[0] = "tex";
  splitted.push(add);
  return `/${splitted.join("/")}`;
}

function uploadFile(file, path) {
  uploadbut.disabled = true;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `/api/storage/v1/upload-overwrite/${getCookie("token")}${path}`,
    true
  );

  xhr.upload.addEventListener("progress", fileUploadProgress);

  xhr.addEventListener("load", fileUploadComplete);

  const formData = new FormData();
  formData.append("file", file);

  xhr.send(formData);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function fileUploadProgress(event) {
  if (event.lengthComputable) {
    uploadbut.innerText = `${formatBytes(event.loaded)}/${formatBytes(
      event.total
    )} (${((event.loaded / event.total) * 100).toFixed(2)}%)`;
  }
}

function fileUploadComplete(event) {
  let res = JSON.parse(event.target.responseText);
  if (res.error) {
    uploadbut.innerText = res.kind;
    return;
  }

  reset();
  refresh();
  uploadbut.innerText = "Upload success";
}

uploadbut.addEventListener("click", (_e) => {
  if (uploadbut.disabled) {
    return;
  }

  if (fileInput.files.length !== 0) {
    uploadFile(fileInput.files[0], getPath(target.value));
    return;
  }
});

target.addEventListener("input", targetInput);

function targetInput(_event) {
  if (target.value.length === 0) {
    uploadbut.disabled = true;
  } else if (fileInput.files.length !== 0) {
    uploadbut.removeAttribute("disabled");
    uploadbut.classList.remove("not-allowed");
  }
}

function reset() {
  target.value = "";
  fileInput.value = "";
  uploadbut.disabled = true;
  uploadbut.classList.add("not-allowed");
  uploadbut.innerText = "Upload";
  sourceDisplay.innerText = "select a source";

  const fileInputs = document.querySelectorAll('input[type="file"]');
  for (let i = 0; i < fileInputs.length; i++) {
    fileInputs[i].removeAttribute("disabled");
  }

  const icons = document.querySelectorAll("#upload-types img");

  for (let i = 0; i < fileInputs.length; i++) {
    icons[i].classList.remove("disabled");
  }
}

reset();
