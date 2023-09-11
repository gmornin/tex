let backdrop = document.getElementById("backdrop");

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAllDialogs();
  }
});

function closeAllDialogs() {
  var dialogs = document.querySelectorAll("dialog");
  backdrop.style.display = "none";

  dialogs.forEach(function (dialog) {
    dialog.close();
  });
}

for (const but of Array.from(document.getElementsByClassName("x"))) {
  but.onclick = () => {
    closeAllDialogs();
    backdrop.style.display = "none";
  };
}

function turnItGreen(elem) {
  elem.style.filter = "drop-shadow(0 0 2px lightgreen)";
  elem.style.cursor = "";
  setTimeout(() => (elem.style.filter = ""), 1000);
}
