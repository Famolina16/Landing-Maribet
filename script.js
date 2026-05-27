const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const year = document.querySelector("[data-year]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxDialog = lightbox.querySelector("[data-lightbox-dialog]");
const lightboxTriggers = [...document.querySelectorAll("[data-lightbox-trigger]")];
const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
const lightboxCategory = lightbox.querySelector("[data-lightbox-category]");
const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
const lightboxClose = lightbox.querySelector("[data-lightbox-close]");
const lightboxPrevious = lightbox.querySelector("[data-lightbox-prev]");
const lightboxNext = lightbox.querySelector("[data-lightbox-next]");
const lightboxControls = [lightboxClose, lightboxPrevious, lightboxNext];
let activeImageIndex = 0;
let focusBeforeLightbox;

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const closeMenu = () => {
  nav.classList.remove("is-open");
  header.classList.remove("menu-visible");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("menu-visible", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 960) {
    closeMenu();
  }
});

year.textContent = new Date().getFullYear();
updateHeader();

const showLightboxImage = (index) => {
  activeImageIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
  const trigger = lightboxTriggers[activeImageIndex];
  const image = trigger.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCategory.textContent = trigger.dataset.category;
  lightboxCaption.textContent = trigger.dataset.caption;
};

const openLightbox = (index) => {
  focusBeforeLightbox = document.activeElement;
  showLightboxImage(index);
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  focusBeforeLightbox?.focus();
};

lightboxTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrevious.addEventListener("click", () => showLightboxImage(activeImageIndex - 1));
lightboxNext.addEventListener("click", () => showLightboxImage(activeImageIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target === lightboxDialog) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showLightboxImage(activeImageIndex - 1);
  } else if (event.key === "ArrowRight") {
    showLightboxImage(activeImageIndex + 1);
  } else if (event.key === "Tab") {
    event.preventDefault();
    const focusedControlIndex = lightboxControls.indexOf(document.activeElement);
    const movement = event.shiftKey ? -1 : 1;
    const nextControlIndex =
      (focusedControlIndex + movement + lightboxControls.length) % lightboxControls.length;

    lightboxControls[nextControlIndex].focus();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}
