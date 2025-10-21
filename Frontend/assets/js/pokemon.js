document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrarPokemon");
    const tbody = document.querySelector("#tablaPokemon tbody");
    const btnListar = document.getElementById("btnListarPokemon");
    
    // El puerto 3000 y el prefijo /pokemon se confirman en tu app.js
    const API_BASE_URL = "http://localhost:3000"; 

    // === ANIMACIONES FADE IN ===
    const elementos = document.querySelectorAll(".fade-in");
    elementos.forEach(el => el.classList.add("visible"));

    // === REGISTRAR POKÉMON (POST /pokemon) ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. OBTENER DATOS (usando 'nivel' como en el HTML y el Modelo)
        const pokemon = {
            nombre: document.getElementById("nombre").value.trim(),
            tipo: document.getElementById("tipo").value.trim(),
            nivel: document.getElementById("nivel").value.trim() // <-- CORREGIDO: 'nivel'
        };

        // 2. VALIDACIÓN BÁSICA
        if (!pokemon.nombre || !pokemon.tipo || !pokemon.nivel) {
            mostrarPopup("⚠️ Completa todos los campos (Nombre, Tipo, Nivel).", "error");
            return;
        }

        try {
            // 3. ENVÍO DE DATOS
            const response = await fetch(`${API_BASE_URL}/pokemon`, { // <-- CORREGIDO: POST a /pokemon
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pokemon)
            });

            const data = await response.json();

            // 4. MANEJO DE RESPUESTA
            if (response.ok) {
                mostrarPopup(data.mensaje || "✅ Pokémon registrado correctamente.", "success"); 
                form.reset();
                listarPokemones(); // Actualiza la lista automáticamente
            } else {
                // Muestra el mensaje de error del controlador (ej: "El pokemon ya existe")
                mostrarPopup(data.mensaje || "❌ Error al registrar Pokémon.", "error");
            }
        } catch {
            mostrarPopup("🚫 Error de conexión con el servidor.", "error");
        }
    });

    // === LISTAR POKÉMONES (GET /pokemon) ===
    btnListar.addEventListener("click", listarPokemones);

    async function listarPokemones() {
        try {
            // 1. SOLICITUD DE DATOS
            const response = await fetch(`${API_BASE_URL}/pokemon`); // <-- CORREGIDO: GET a /pokemon
            
            if (!response.ok) {
                // Manejar errores como 404 o 500 del backend
                throw new Error("No se pudo obtener la lista."); 
            }

            const data = await response.json();
            
            tbody.innerHTML = "";

            // 2. RENDEREADO DE LA TABLA (usando data.resultado y 'nivel')
            if (data.resultado && data.resultado.length > 0) {
                 data.resultado.forEach((pokemon) => { 
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${pokemon.nombre}</td>
                        <td>${pokemon.tipo}</td>
                        <td>${pokemon.nivel}</td> `;
                    tbody.appendChild(row);
                });
                mostrarPopup("✅ Lista de Pokémon actualizada.", "success");
            } else {
                 mostrarPopup("ℹ️ No hay Pokémones registrados.", "info");
            }
           
        } catch (error) {
            console.error(error);
            mostrarPopup("⚠️ Error al listar los Pokémones o no hay conexión.", "error");
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

        popup.classList.add("show");
        document.getElementById("cerrarPopup").addEventListener("click", () => {
            popup.classList.remove("show");
            setTimeout(() => popup.remove(), 100);
        });

        setTimeout(() => {
            if(popup.classList.contains("show")) {
                 popup.classList.remove("show");
                 setTimeout(() => popup.remove(), 100);
            }
        }, 4000);
    }
    
    // === REDIRECCIÓN DEL LOGO ===
    const logo = document.querySelector(".logo-form");
    if (logo) {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});