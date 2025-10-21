document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrarUsuario");
  const tbody = document.querySelector("#tablaUsuarios tbody");
  const btnListar = document.getElementById("btnListarUsuarios"); 
  const API_BASE_URL = "http://localhost:3000"; // Base URL de tu Express

  // === Utilerías de mensajes (Revisada para consistencia) ===
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

    popup.classList.add("show");
    
    // Función para cerrar
    const cerrar = () => {
        popup.classList.remove("show");
        popup.classList.add("cerrar");
        setTimeout(() => popup.remove(), 300);
    };
    
    // Evento de clic en botón
    document.getElementById("cerrarPopup").addEventListener("click", cerrar);

    // Opcional: Cerrar automáticamente después de 4 segundos
    setTimeout(cerrar, 4000);
  }

  // === REGISTRAR USUARIO (POST /usuario) ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = {
      cedula: document.getElementById("cedula").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      email: document.getElementById("email").value.trim(),
      edad: document.getElementById("edad").value.trim(),
    };

    if (!usuario.cedula || !usuario.nombre || !usuario.email || !usuario.edad) {
      mostrarPopup("⚠️ Por favor completa todos los campos.", "error");
      return;
    }

    try {
      // CORRECCIÓN 1: Endpoint a /usuario
      const response = await fetch(`${API_BASE_URL}/usuario`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (response.ok) {
        // CORRECCIÓN 2: Usar data.mensaje (según tu controlador)
        mostrarPopup(data.mensaje || "✅ Usuario registrado exitosamente.", "success"); 
        form.reset();
        listarUsuarios();
      } else {
        // CORRECCIÓN 3: Usar data.mensaje (según tu controlador)
        mostrarPopup(data.mensaje || "❌ Error al registrar usuario.", "error"); 
      }
    } catch (err) {
      mostrarPopup("🚫 Error de conexión con el servidor.", "error");
      console.error(err);
    }
  });

  // === LISTAR USUARIOS (GET /usuario) ===
  if (btnListar) {
    btnListar.addEventListener("click", listarUsuarios);
  }

  async function listarUsuarios() {
    try {
      // CORRECCIÓN 4: Endpoint a /usuario
      const response = await fetch(`${API_BASE_URL}/usuario`); 
      
      if (!response.ok) throw new Error("Fallo al obtener la lista.");

      const data = await response.json();
      tbody.innerHTML = "";

      // El controlador devuelve la lista en data.resultado
      if (data.resultado && data.resultado.length > 0) {
          data.resultado.forEach((usuario) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${usuario.cedula}</td>
              <td>${usuario.nombre}</td>
              <td>${usuario.email}</td>
              <td>${usuario.edad}</td>
            `;
            tbody.appendChild(row);
          });
          mostrarPopup("✅ Lista de usuarios actualizada.", "success");
      } else {
          mostrarPopup("ℹ️ No hay usuarios registrados.", "info");
      }
      
    } catch (err) {
      console.error("Error al listar usuarios:", err);
      mostrarPopup("⚠️ Error al obtener la lista de usuarios. Asegúrate que el backend esté activo.", "error");
    }
  }

  // === REDIRECCIÓN DEL LOGO ===
  const logo = document.querySelector(".logo-form");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // === Cambio de entrenador con flechas ===
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
    imgPerfil.classList.add("fade-change"); 
    setTimeout(() => {
      indice = (nuevoIndice + imagenes.length) % imagenes.length;
      imgPerfil.src = imagenes[indice];
      imgPerfil.classList.remove("fade-change"); 
    }, 250);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => cambiarImagen(indice - 1));
    nextBtn.addEventListener("click", () => cambiarImagen(indice + 1));
  }
});