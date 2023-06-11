function update() {
  let errorDisplay = document.getElementById("error-display");
  errorDisplay.innerText = "";
  let params = new URLSearchParams(document.location.search);
  let type = params.get("type");

  let hide, show;

  if (type === "new") {
    hide = "signin";
    show = "signup";
    document.title = "Create account - GoodMorning Tex";
  } else {
    hide = "signup";
    show = "signin";
    document.title = "Sign in - GoodMorning Tex";
  }
  {
    let elements = document.getElementsByClassName(hide);
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("hide");
    }
  }
  {
    let elements = document.getElementsByClassName(show);
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("hide");
    }
  }
}

function changeState(type) {
  let url = window.location.pathname;

  if (type === "signup") {
    url += "?type=new";
  }

  window.history.pushState({}, "", url);
  update();
}

function signup() {
  let email = document.getElementById("email").value;
  let username = document.getElementById("username").value;
  let pw1 = document.getElementById("password1").value;
  let pw2 = document.getElementById("password2").value;
  let errorDisplay = document.getElementById("error-display");

  if (
    email.length === 0 ||
    username.length === 0 ||
    pw1.length === 0 ||
    pw2.length === 0
  ) {
    errorDisplay.innerText = "One or more fields are empty";
    return;
  }

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorDisplay.innerText = "Invalid email address provided";
    return;
  }

  if (username.length < 3 || username.length > 32) {
    errorDisplay.innerText = "Acceptable username length between 3 to 32";
    return;
  }

  let usernameRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/;
  if (!usernameRegex.test(username)) {
    errorDisplay.innerText = "Username contains illegal patterns";
    return;
  }

  let url = "/api/services/v1/account/create";
  let data = {
    username,
    email,
    password: pw1,
  };

  errorDisplay.innerText = "Sending request";
  let button = document.getElementById("submit-create");
  button.setAttribute("disabled", "disabled");
  button.innerText = "Creating account...";

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
          errorDisplay.innerHTML = `Server responded with error <code>${data.kind}</code>`;
          break;
        case "created":
          document.cookie = `token=${data.token}; path=/; max-age=31536000; same-site=lax; Secure`;
          localStorage.setItem("userid", data.id);
          errorDisplay.innerText = "Account created. Redirecting...";
          window.location.pathname = "/remindverify";
          return;
        default:
          errorDisplay.innerText = `Unexpected server response (check console)`;
          console.log(
            `Expected server to respond with type "error" or "created", instead got "${data.type}"`
          );
      }
      button.removeAttribute("disabled");
      button.innerText = "Create account";
    })
    .catch((error) => {
      errorDisplay.innerText = error;
      console.error("Error:", error);
    });
}

function signin() {
  let identifier = document.getElementById("identifier").value;
  let pw = document.getElementById("password").value;
  let errorDisplay = document.getElementById("error-display");

  if (identifier.length === 0 || pw.length === 0) {
    errorDisplay.innerText = "One or more fields are empty";
    return;
  }

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let identifierType = emailRegex.test(identifier) ? "email" : "username";

  let url = "/api/services/v1/account/login";
  let data = {
    identifier,
    "identifier-type": identifierType,
    password: pw,
  };

  errorDisplay.innerText = "Sending request";
  let button = document.getElementById("submit-signin");
  button.setAttribute("disabled", "disabled");
  button.innerText = "Signing in...";

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
          errorDisplay.innerHTML = `Server responded with error <code>${data.kind}</code>`;
          break;
        case "login":
          document.cookie = `token=${data.token}; path=/; max-age=31536000; same-site=lax; Secure`;
          localStorage.setItem("userid", data.id);
          errorDisplay.innerText = "You are logged in!";
          window.location.pathname = "/";
          return;
        default:
          errorDisplay.innerText = `Unexpected server response (check console)`;
          console.log(
            `Expected server to respond with type "error" or "success", instead got "${data.type}"`
          );
      }
      button.removeAttribute("disabled");
      button.innerText = "Sign in";
    })
    .catch((error) => {
      errorDisplay.innerText = error;
      console.error("Error:", error);
    });
}

window.addEventListener("keydown", function (event) {
  if (event.key !== "Enter") {
    return;
  }
  let params = new URLSearchParams(document.location.search);
  let type = params.get("type");
  if (type === "new") {
    signup();
  } else {
    signin();
  }
});

update();
