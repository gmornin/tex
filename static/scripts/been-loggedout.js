document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
localStorage.removeItem("userid");
setTimeout(() => (window.location.pathname = "/login"), 5000);
