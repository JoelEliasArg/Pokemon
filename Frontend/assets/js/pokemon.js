document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrarPokemon");
  const tbody = document.querySelector("#tablaPokemon tbody");
  const btnListar = document.getElementById("btnListarPokemon");

  // === ANIMACIONES FADE IN ===
  const elementos = document.querySelectorAll(".fade-in");
  elementos.forEach(el => el.classList.add("visible"));

  // === REGISTRAR POKÉMON ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pokemon = {
      nombre: document.getElementById("nombre").value.trim(),
      tipo: document.getElementById("tipo").value.trim(),
      poder: document.getElementById("poder").value.trim()
    };

    if (!pokemon.nombre || !pokemon.tipo || !pokemon.poder) {
      mostrarPopup("⚠️ Completa todos los campos.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/pokemon/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pokemon)
      });

      const data = await response.json();

      if (response.ok) {
        mostrarPopup(data.message || "✅ Pokémon registrado correctamente.", "success");
        form.reset();
      } else {
        mostrarPopup(data.message || "❌ Error al registrar Pokémon.", "error");
      }
    } catch {
      mostrarPopup("🚫 Error de conexión con el servidor.", "error");
    }
  });

  // === LISTAR POKÉMONES (solo al hacer clic) ===
  btnListar.addEventListener("click", listarPokemones);

  async function listarPokemones() {
    try {
      const response = await fetch("http://localhost:3000/api/pokemon/listar");
      const pokemones = await response.json();

      tbody.innerHTML = "";
      pokemones.resultado.forEach((pokemon) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${pokemon.id}</td>
          <td>${pokemon.nombre}</td>
          <td>${pokemon.tipo}</td>
          <td>${pokemon.poder}</td>
        `;
        tbody.appendChild(row);
      });

      // ✅ Solo mostrar popup cuando se da clic
      mostrarPopup("✅ Lista de Pokémon actualizada correctamente.", "success");
    } catch {
      mostrarPopup("⚠️ Error al listar los Pokémones.", "error");
    }
  }

  // === POPUP DE MENSAJES ===
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

    // animación fade in/out
    popup.classList.add("show");
    document.getElementById("cerrarPopup").addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 10);
    });
  }

  // ❌ Se elimina esta línea para que no cargue automáticamente la lista
  // listarPokemones();

  // === REDIRECCIÓN DEL LOGO ===
  const logo = document.querySelector(".logo-form");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
