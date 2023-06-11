function launchemail() {
  let search = window.location.search;
  if (search.length === 0) {
    window.location = "/";
    return;
  }
  let domain = search.slice(1);
  window.open(`https://${domain}/mail`);
}
