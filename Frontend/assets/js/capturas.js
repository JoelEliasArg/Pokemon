document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrarCaptura");
  const tbody = document.querySelector("#tablaCapturas tbody");
  const btnListar = document.getElementById("btnListarCapturas");

  // === ANIMACIONES FADE IN ===
  const elementos = document.querySelectorAll(".fade-in");
  elementos.forEach(el => el.classList.add("visible"));

  // === REGISTRAR CAPTURA ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const captura = {
      usuarioCedula: document.getElementById("usuarioCedula").value.trim(),
      pokemonId: document.getElementById("pokemonId").value.trim(),
    };

    if (!captura.usuarioCedula || !captura.pokemonId) {
      mostrarPopup("⚠️ Completa todos los campos.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/capturas/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(captura),
      });

      const data = await response.json();
      if (response.ok) {
        mostrarPopup(data.message || "✅ Captura registrada exitosamente.", "success");
        form.reset();
      } else {
        mostrarPopup(data.message || "❌ Error al registrar la captura.", "error");
      }
    } catch {
      mostrarPopup("🚫 Error de conexión con el servidor.", "error");
    }
  });

  // === LISTAR CAPTURAS (solo al hacer clic) ===
  btnListar.addEventListener("click", listarCapturas);

  async function listarCapturas() {
    try {
      const response = await fetch("http://localhost:3000/api/capturas/listar");
      const data = await response.json();

      tbody.innerHTML = "";
      data.resultado.forEach((c) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.usuarioCedula}</td>
          <td>${c.pokemonId}</td>
          <td>${new Date(c.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
      });

      // ✅ Solo mostrar popup tras clic
      mostrarPopup("✅ Lista de capturas actualizada correctamente.", "success");
    } catch {
      mostrarPopup("⚠️ Error al listar capturas.", "error");
    }
  }

  // === POPUP MENSAJES ===
  function mostrarPopup(mensaje, tipo) {
    const popupExistente = document.querySelector(".popup-mensaje");
    if (popupExistente) popupExistente.remove();

    const popup = document.createElement("div");
    popup.className = `popup-mensaje ${tipo}`;
    popup.innerHTML = `
      <div class="popup-contenido">
        <p>${mensaje}</p>
        <button id="cerrarPopup">OK</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Animación suave de aparición
    popup.classList.add("show");
    document.getElementById("cerrarPopup").addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 10);
    });
  }

  // ❌ Eliminamos la llamada automática:
  // listarCapturas();

  // === REDIRECCIÓN DEL LOGO AL INDEX PRINCIPAL ===
  const logo = document.querySelector(".logo-form");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.location.href = "index.html"; // 🔹 Redirige al inicio
    });
  }
});
