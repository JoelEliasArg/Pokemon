document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrarUsuario");
  const tbody = document.querySelector("#tablaUsuarios tbody");
  const btnListar = document.getElementById("btnListarUsuarios"); // 🔹 Botón para listar manualmente

  // === Registrar Usuario ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = {
      cedula: document.getElementById("cedula").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      email: document.getElementById("email").value.trim(),
      edad: document.getElementById("edad").value.trim(),
    };

    // Validar campos vacíos
    if (!usuario.cedula || !usuario.nombre || !usuario.email || !usuario.edad) {
      mostrarPopup("⚠️ Por favor completa todos los campos.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (response.ok) {
        mostrarPopup(data.message || "✅ Usuario registrado exitosamente.", "success");
        form.reset();
        listarUsuarios(); // refrescar tabla automáticamente al registrar
      } else {
        mostrarPopup(data.message || "❌ Error al registrar usuario.", "error");
      }
    } catch (err) {
      mostrarPopup("🚫 Error de conexión con el servidor.", "error");
      console.error(err);
    }
  });

  // === Listar Usuarios (solo cuando se presione el botón) ===
  if (btnListar) {
    btnListar.addEventListener("click", listarUsuarios);
  }

  async function listarUsuarios() {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios/listar");
      const usuarios = await response.json();
      tbody.innerHTML = "";

      usuarios.resultado.forEach((usuario) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${usuario.cedula}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.email}</td>
          <td>${usuario.edad}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Error al listar usuarios:", err);
      mostrarPopup("⚠️ Error al obtener la lista de usuarios.", "error");
    }
  }

  // === Mostrar mensajes visuales como popup centrado ===
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

    // Cerrar popup con animación fade-out
    const cerrarBtn = document.getElementById("cerrarPopup");
    cerrarBtn.addEventListener("click", () => {
      popup.classList.add("cerrar");
      setTimeout(() => popup.remove(), 300);
    });
  }
});

// === Redirigir al index principal al hacer clic en el logo ===
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo-form");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});

// === Cambio de entrenador con flechas ===
document.addEventListener("DOMContentLoaded", () => {
  const imagenes = [
    "images/profile_1.png",
    "images/profile_2.png",
    "images/profile_3.png",
    "images/profile_4.png",
    "images/profile_5.png"
  ];

  let indice = 0;
  const imgPerfil = document.getElementById("perfilActivo");
  const prevBtn = document.getElementById("prevPerfil");
  const nextBtn = document.getElementById("nextPerfil");

  function cambiarImagen(nuevoIndice) {
    imgPerfil.classList.add("fade-change"); // aplica animación de salida
    setTimeout(() => {
      indice = (nuevoIndice + imagenes.length) % imagenes.length;
      imgPerfil.src = imagenes[indice];
      imgPerfil.classList.remove("fade-change"); // vuelve visible
    }, 250);
  }

  prevBtn.addEventListener("click", () => cambiarImagen(indice - 1));
  nextBtn.addEventListener("click", () => cambiarImagen(indice + 1));
});
