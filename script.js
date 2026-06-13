const body = document.body;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const languageButtons = document.querySelectorAll("[data-language]");
const revealElements = document.querySelectorAll(".reveal");
const workPlayer = document.querySelector("[data-work-player]");
const workVideo = document.querySelector("[data-work-video]");
const openWorkPlayerButton = document.querySelector("[data-open-work-player]");
const closeWorkPlayerButton = document.querySelector("[data-close-work-player]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 32);
};

const closeMenu = () => {
  body.classList.remove("menu-open");
  header.classList.remove("is-menu-open");
  menuButton.setAttribute("aria-expanded", "false");
};

menuButton.addEventListener("click", () => {
  const willOpen = !header.classList.contains("is-menu-open");
  body.classList.toggle("menu-open", willOpen);
  header.classList.toggle("is-menu-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.language;
    const isEnglish = language === "en";

    body.classList.toggle("is-en", isEnglish);
    document.documentElement.lang = isEnglish ? "en" : "ja";
    languageButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
  });
});

const closeWorkPlayer = () => {
  if (!workPlayer?.open) return;
  workVideo.pause();
  workVideo.currentTime = 0;
  workPlayer.close();
  body.classList.remove("media-open");
};

openWorkPlayerButton?.addEventListener("click", () => {
  body.classList.add("media-open");
  workPlayer.showModal();
  workVideo.play().catch(() => {
    // Native controls remain available if autoplay is blocked.
  });
});

closeWorkPlayerButton?.addEventListener("click", closeWorkPlayer);

workPlayer?.addEventListener("click", (event) => {
  if (event.target === workPlayer) closeWorkPlayer();
});

workPlayer?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeWorkPlayer();
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 1020) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

setHeaderState();
