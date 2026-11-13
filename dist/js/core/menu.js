
function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}

function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}
