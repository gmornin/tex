let fragments = document.getElementsByClassName("fragment");

for (let i = 0; i < fragments.length - 1; i++) {
    let path = fragments[i].getAttribute("path");
    let a = document.createElement("a");
    a.href = `/fs/${path}`;
    a.classList.add("fragment");
    a.innerText = fragments[i].innerText;
    fragments[i].outerHTML = a.outerHTML;
}

switch (window.location.pathname.split(".").pop()) {
    case "html":
        document.addEventListener("DOMContentLoaded", function () {
            try {
                renderMathInElement(document.getElementById("display"));
            } catch(_) {}
            try {
                renderTikzjax();
            } catch (_) {}
        });
}
