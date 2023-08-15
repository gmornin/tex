function create() {
  let url = "/api/generic/v1/create";
  let token = getCookie("token");
  if (token === null) {
    window.location.pathname = "/login";
  }
  let data = {
    token,
  };
  let errorDisplay = document.getElementById("error-display");
  let button = document.getElementById("finish");

  button.setAttribute("disabled", "disabled");
  button.innerText = "Just a sec...";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      switch (data.type) {
        case "error":
          errorDisplay.innerHTML = `Server responded with error <code>${JSON.stringify(data.kind)}</code>`;
          break;
        case "service created":
          button.removeAttribute("disabled");
          button.innerText = "Let's go!";
          button.onclick = go;
          document.getElementById("not-yet").classList.add("hide");
          document.getElementById("done").classList.remove("hide");
          errorDisplay.classList.add("hide");
          return;
        default:
          errorDisplay.innerText = `Unexpected server response (check console)`;
          console.log(
            `Expected server to respond with type "error" or "service created", instead got "${data.type}"`
          );
      }
      button.removeAttribute("disabled");
      button.innerText = "Finish setup";
    })
    .catch((error) => {
      button.innerText = "Finish setup";
      errorDisplay.innerText = error;
      button.removeAttribute("disabled");
      console.error("Error:", error);
    });
}

function go() {
  let cacheBuster = new Date().getTime();
  window.location.href = `?cb=${cacheBuster}`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
