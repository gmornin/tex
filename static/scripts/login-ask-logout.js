function logout() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem("userid");
  let cacheBuster = new Date().getTime();
  window.location.href = `/login?cb=${cacheBuster}`;
}
