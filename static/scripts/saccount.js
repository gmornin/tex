let sudod = document.getElementById("sudod");
let pwBut = document.getElementById("pwset");
let pwInput = document.getElementById("su");
let rusureBut = document.getElementById("confirm");
let confirmd = document.getElementById("confirmd");
let newEmail = document.getElementById("email");
let pw1 = document.getElementById("pw1");
let pw2 = document.getElementById("pw2");
let deleteBut = document.getElementById("delete");
let logoutBut = document.getElementById("logout");

let suAction;
let verified = document.getElementById("verified");
let unverified = document.getElementById("unverified");

function resetPw() {
  pw1.value = "";
  pw2.value = "";
}

function verifiedDisplay() {
  verified.style.display = "block";
  unverified.style.display = "none";
}

function unverifiedDisplay() {
  unverified.style.display = "block";
  verified.style.display = "none";
}

function pwRun(f) {
  let pw = sessionStorage.getItem("password");
  if (pw) {
    f(pw);
    return;
  }

  sudod.setAttribute("open", true);
  backdrop.style.display = "block";
  suAction = f;
}

pwBut.onclick = () => {
  backdrop.style.display = "none";
  sudod.removeAttribute("open");
  sessionStorage.setItem("password", pwInput.value);
  suAction(pwInput.value);
};

let rusureAction;

function rusureRun(f) {
  confirmd.setAttribute("open", true);
  backdrop.style.display = "block";
  rusureAction = f;
}

rusureBut.onclick = () => {
  rusureBut.setAttribute("disabled", true);
  rusureAction(() => {
    rusureBut.removeAttribute("disabled");
    backdrop.style.display = "none";
    confirmd.removeAttribute("open");
  });
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function getToken() {
  return getCookie("token");
}

let resendBut = document.getElementById("resend");
let regenBut = document.getElementById("regen");

regenBut.onclick = () => {
  pwRun((pw) => {
    rusureRun((end) => {
      let body = {
        token: getToken(),
        password: pw,
      };
      let url = "/api/accounts/v1/regeneratetoken";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.type == "error") {
            if (data.kind.type == "password incorrect") {
              sessionStorage.removeItem("password");
              alert("Incorrect password");
            } else {
              alert(JSON.stringify(data.kind));
            }
            end();
            return;
          }

          document.cookie = `token=${data.token}; path=/; max-age=31536000; same-site=lax; Secure`;
          end();
          regenBut.innerText = "Regenerated";
          regenBut.classList.add("not-allowed");
          regenBut.setAttribute("disabled", true);

          setTimeout(() => {
            regenBut.innerText = "Regenerate token";
            regenBut.classList.remove("not-allowed");
            regenBut.removeAttribute("disabled");
          }, 1000);
        })
        .catch((error) => console.error(error));
    });
  });
};

resendBut.onclick = () => {
  let body = {
    token: getToken(),
  };
  let url = "/api/accounts/v1/resend-verify";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.type == "nothing changed") {
        verifiedDisplay();
        alert("Already verified");
        return;
      }

      if (data.type == "error") {
        alert(JSON.stringify(data.kind));
        return;
      }

      resendBut.innerText = "Message sent";
      resendBut.classList.add("not-allowed");
      resendBut.setAttribute("disabled", true);

      setTimeout(() => {
        resendBut.innerText = "Resend verification";
        resendBut.classList.remove("not-allowed");
        resendBut.removeAttribute("disabled");
      }, 1000);
    })
    .catch((error) => console.error(error));
};

function changeEmail(but) {
  console.log(1);
  pwRun((pw) => {
    rusureRun((end) => {
      let body = {
        password: pw,
        token: getToken(),
        new: email.value,
      };
      let url = "/api/accounts/v1/change-email";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.type == "error") {
            if (data.kind.type == "password incorrect") {
              sessionStorage.removeItem("password");
              alert("Incorrect password");
            } else {
              alert(JSON.stringify(data.kind));
            }
            end();
            return;
          }

          unverifiedDisplay();
          end();
          turnItGreen(but);
        })
        .catch((error) => console.error(error));
    });
  });
}

function checkPw() {
  if (pw1.value !== pw2.value) {
    alert("Password mismatch");
    return false;
  }
  if (pw1.value.length < 8) {
    alert("Password too short");
    return false;
  }
  return true;
}

function changePw(but) {
  pwRun((pw) => {
    rusureRun((end) => {
      let body = {
        old: pw,
        token: getToken(),
        new: pw1.value,
      };
      let url = "/api/accounts/v1/change-password";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.type == "error") {
            if (data.kind.type == "password incorrect") {
              sessionStorage.removeItem("password");
              alert("Incorrect password");
            } else {
              alert(JSON.stringify(data.kind));
            }
            end();
            return;
          }

          sessionStorage.setItem("password", pw1.value);
          resetPw();
          end();
          turnItGreen(but);
        })
        .catch((error) => console.error(error));
    });
  });
}

for (const but of Array.from(document.getElementsByClassName("save"))) {
  let action = but.getAttribute("field");
  but.onclick = () => {
    switch (action) {
      case "email":
        changeEmail(but);
        break;
      case "password":
        if (!checkPw()) {
          return;
        }

        changePw(but);
        return;
      default:
        console.log(`Unknown action ${action}`);
    }
  };
}

resetPw();

deleteBut.onclick = () => {
  pwRun((pw) => {
    rusureRun((end) => {
      let body = {
        password: pw,
        token: getToken(),
      };
      let url = "/api/accounts/v1/delete";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.type == "error") {
            if (data.kind.type == "password incorrect") {
              sessionStorage.removeItem("password");
              alert("Incorrect password");
            } else {
              alert(JSON.stringify(data.kind));
            }
            end();
            return;
          }

          sessionStorage.setItem("password", pw1.value);
          end();
          deleteBut.innerText = "Account deleted, redirecting...";
          deleteBut.setAttribute("disabled", true);
          deleteBut.classList.add("not-allowed");
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("userid");
          sessionStorage.removeItem("password");
          setTimeout(() => {
            let cacheBuster = new Date().getTime();
            window.location.href = `/login?cb=${cacheBuster}`;
          }, 5000);
        })
        .catch((error) => console.error(error));
    });
  });
};

logoutBut.onclick = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem("userid");
  sessionStorage.removeItem("password");
  let cacheBuster = new Date().getTime();
  window.location.href = `/login?cb=${cacheBuster}`;
};
