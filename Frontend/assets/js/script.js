document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".custom-card img");
  const logo = document.querySelector(".pokemon-logo");
  const cards = document.querySelectorAll(".custom-card");

  // --- Evita deformación de imágenes ---
  images.forEach(img => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
    }
  });

  // --- Animación fade-in para el logo ---
  if (logo) {
    logo.classList.add("fade-in");
  }

    // 👉 Recarga la página al hacer clic
    logo.addEventListener("click", () => {
      window.location.reload();
    });
});

