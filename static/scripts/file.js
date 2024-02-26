let fragments = document.getElementsByClassName("fragment");

for (let i = 0; i < fragments.length - 1; i++) {
    fragments[i].addEventListener(
        "click",
        (_ev) =>
            (window.location.pathname = `/fs/${fragments[i].getAttribute("path")}`),
    );
}

switch (window.location.pathname.split(".").pop()) {
    case "html":
        document.addEventListener("DOMContentLoaded", function () {
            renderMathInElement(document.getElementById('display'))
        });
}
