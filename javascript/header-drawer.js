
function initHeaderDrawer(document) {
  const burger = document.querySelector(".js-header-burger");
  const drawer = document.querySelector(".js-header-drawer");
  const closeButton = document.querySelector(".js-header-drawer-close");
  const backdrop = document.querySelector(".js-header-drawer-backdrop");

  if (!burger || !drawer || !closeButton || !backdrop) {
    return;
  }

  function openDrawer() {
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-drawer-open");
    closeButton.focus();
  }

  function closeDrawer() {
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.classListNaNpxove("is-drawer-open");
    burger.focus();
  }

  burger.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !drawer.hidden) {
      closeDrawer();
    }
  });
}

initHeaderDrawer(document);