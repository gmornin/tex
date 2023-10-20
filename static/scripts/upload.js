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
let folderInput = document.querySelector("#folderupload input");
let dialogs = Array.from(document.getElementsByTagName("dialog"));

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

document.querySelector("#uploadd .x").onclick = () => {
  dialog.close();
};

dialog.addEventListener("close", function (_event) {
  backdrop.style.display = "none";
  reset();
});

fileInput.addEventListener("change", fileSelect);
folderInput.addEventListener("change", folderSelect);

function fileSelect(event) {
  const file = event.target.files[0];
  sourceDisplay.textContent = `${file.name} (${formatBytes(file.size)})`;
  target.value = file.name;
  targetInput();
}

function folderSelect(event) {
  if (event.target.files.length === 0) {
    alert("No files to upload");
    reset();
    return;
  }
  let total = Array.from(event.target.files)
    .map((item) => item.size)
    .reduce((acc, value) => acc + value, 0);

  sourceDisplay.textContent = `${
    event.target.files.length
  } files (total ${formatBytes(total)})`;
  target.value = event.target.files[0].webkitRelativePath.split("/")[0];
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
    true,
  );

  xhr.upload.addEventListener("progress", fileUploadProgress);

  // xhr.addEventListener("load", fileUploadComplete);

  const formData = new FormData();
  formData.append("file", file);

  xhr.onreadystatechange = function (event) {
    if (xhr.readyState === 4) {
      let res = JSON.parse(event.target.responseText);
      if (res.type == "error") {
        uploadbut.innerText = `Upload failed: ${res.kind.type}`;
        return;
      }

      reset();
      refresh();
      uploadbut.innerText = "Upload completed";
    }
  };
  xhr.send(formData);
}

function uploadFolder(files, path) {
  uploadbut.disabled = true;
  let totalBytes = files
    .map((item) => item.size)
    .reduce((acc, value) => acc + value, 0);
  folderUploadFile(files, path, files.length, totalBytes, 0);
}

function folderUploadFile(files, path, totalFiles, totalBytes, uploadedBytes) {
  let file = files.shift();
  let uploadPath = `${path}/${file.webkitRelativePath
    .split("/")
    .slice(1)
    .join("/")}`;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `/api/storage/v1/upload-createdirs-overwrite/${getCookie(
      "token",
    )}${uploadPath}`,
    true,
  );

  xhr.upload.addEventListener("progress", (event) =>
    folderFileUploadProgress(
      event,
      uploadedBytes,
      totalBytes,
      totalFiles - files.length,
      totalFiles,
    ),
  );

  // xhr.addEventListener("load", fileUploadComplete);

  const formData = new FormData();
  formData.append("file", file);

  xhr.onreadystatechange = function (event) {
    if (xhr.readyState === 4) {
      let res = JSON.parse(event.target.responseText);
      if (res.type == "error") {
        setTimeout(
          () =>
            alert(
              `Error uploading "${path}", skipping this file.\n${JSON.stringify(
                res.kind.type,
              )}`,
            ),
          0,
        );
      }

      if (files.length === 0) {
        reset();
        refresh();
        uploadbut.innerText = "Upload completed";
        return;
      }

      uploadedBytes += file.size;
      folderUploadFile(files, path, totalFiles, totalBytes, uploadedBytes);
    }
  };
  xhr.send(formData);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function folderFileUploadProgress(
  event,
  uploadedBytes,
  totalBytes,
  uploadedFiles,
  totalFiles,
) {
  if (event.lengthComputable) {
    uploadbut.innerText = `Uploading file ${uploadedFiles} of ${totalFiles} (${(
      ((event.loaded + uploadedBytes) / totalBytes) *
      100
    ).toFixed(2)}%)`;
  }
}

function fileUploadProgress(event) {
  if (event.lengthComputable) {
    uploadbut.innerText = `${formatBytes(event.loaded)}/${formatBytes(
      event.total,
    )} (${((event.loaded / event.total) * 100).toFixed(2)}%)`;
  }
}

// function fileUploadComplete(event) {}

uploadbut.onclick = () => {
  if (uploadbut.disabled) {
    return;
  }

  if (fileInput.files.length !== 0) {
    uploadFile(fileInput.files[0], getPath(target.value));
    return;
  }

  uploadFolder(Array.from(folderInput.files), getPath(target.value));
};

target.addEventListener("input", targetInput);

function targetInput(_event) {
  if (target.value.length === 0) {
    uploadbut.disabled = true;
    uploadbut.classList.add("not-allowed");
  } else if (fileInput.files.length !== 0 || folderInput.files.length !== 0) {
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
