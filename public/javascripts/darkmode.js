// JavaScript for Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeClass = "dark-mode";

  // Check if dark mode is already enabled
  if (localStorage.getItem("darkMode") === "enabled") {
    enableDarkMode();
  }

  darkModeToggle.addEventListener("click", function () {
    if (document.body.classList.contains(darkModeClass)) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  function enableDarkMode() {
    document.body.classList.add(darkModeClass);
    document
      .querySelectorAll(".navbar, .card, .form-control, textarea, .btn")
      .forEach((element) => {
        element.classList.add(darkModeClass);
      });
    darkModeToggle.innerHTML =
      '<i class="bi bi-brightness-high"></i> Light Mode';
    localStorage.setItem("darkMode", "enabled");
  }

  function disableDarkMode() {
    document.body.classList.remove(darkModeClass);
    document
      .querySelectorAll(".navbar, .card, .form-control, textarea, .btn")
      .forEach((element) => {
        element.classList.remove(darkModeClass);
      });
    darkModeToggle.innerHTML = '<i class="bi bi-moon"></i> Dark Mode';
    localStorage.setItem("darkMode", "disabled");
  }
});
