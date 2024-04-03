function renderTikzjax() {
    for (let script of Array.from(
        document.getElementById("display").getElementsByTagName("script"),
    )) {
        if (script.getAttribute("type") != "tikzjax") continue;
        script.setAttribute("type", "text/tikz")
        script.innerHTML = `\\begin{document}${script.innerHTML}\\end{document}`;
        script.setAttribute("data-show-console", "true");
        script.outerHTML = `<div class="tikzpicture">${script.outerHTML}</div>`;
    }

    tikzjax();
}
