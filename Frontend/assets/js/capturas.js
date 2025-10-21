// Archivo: js/capturas.js (VERSIÓN FINAL CORREGIDA)

document.addEventListener("DOMContentLoaded", () => {
    const formCaptura = document.getElementById("registrarCaptura");
    const tbody = document.querySelector("#tablaCapturas tbody");
    const btnListar = document.getElementById("btnListarCapturas");
    const API_BASE_URL = "http://localhost:3000";

    // Función para mostrar mensajes visuales (Implementación completa)
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
        
        const cerrar = () => {
            popup.classList.remove("show");
            popup.classList.add("cerrar");
            setTimeout(() => popup.remove(), 300);
        };
        
        document.getElementById("cerrarPopup").addEventListener("click", cerrar);

        // Cierre automático después de 4 segundos
        setTimeout(cerrar, 4000);
    }

    // --- REGISTRAR CAPTURA (POST /capturado) ---
    formCaptura.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuarioCedula = document.getElementById("usuarioCedula").value.trim();
        const pokemonId = document.getElementById("pokemonId").value.trim();

        const captura = { usuarioCedula, pokemonId };

        if (!captura.usuarioCedula || !captura.pokemonId) {
            mostrarPopup("⚠️ Debes ingresar la Cédula del Usuario y el ID del Pokémon.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/capturado`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(captura),
            });

            const data = await response.json();

            if (response.ok) {
                mostrarPopup(data.mensaje || "✅ Captura registrada exitosamente.", "success"); 
                formCaptura.reset();
                listarCapturas(usuarioCedula);
            } else {
                mostrarPopup(data.mensaje || "❌ Error al registrar la captura. Revisa Cédula/ID.", "error"); 
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            mostrarPopup("🚫 Error de conexión con el servidor. Asegúrate que el backend esté activo.", "error");
        }
    });

    // --- LISTAR CAPTURAS (GET /capturado/:usuarioCedula) ---

    btnListar.addEventListener("click", () => {
        const usuarioCedula = document.getElementById("usuarioCedula").value.trim();

        if (usuarioCedula) {
            listarCapturas(usuarioCedula);
        } else {
            mostrarPopup("ℹ️ Ingresa la Cédula del Usuario en el campo de registro para listar sus capturas.", "info");
        }
    });

    async function listarCapturas(cedula) {
        tbody.innerHTML = ""; // Limpiar antes de solicitar

        try {
            const response = await fetch(`${API_BASE_URL}/capturado/${cedula}`);
            
            if (!response.ok) throw new Error("Fallo al obtener la lista de capturas.");

            const data = await response.json();

            if (data.resultado && data.resultado.length > 0) {
                 data.resultado.forEach((captura) => {
                    const row = document.createElement("tr");
                    
                    // 🚨 CORRECCIÓN: Estructura de tabla limpia y correcta
                    row.innerHTML = `
                        <td>${captura.cedula}</td>
                        <td>${captura.pokemonId} (${captura.nombrePokemon})</td> 
                        <td>${captura.fechaCaptura}</td>
                    `;
                    
                    tbody.appendChild(row);
                });
                mostrarPopup(`✅ ${data.resultado.length} capturas encontradas para Cédula: ${cedula}`, "success");
            } else {
                 mostrarPopup(`ℹ️ No se encontraron capturas para la Cédula: ${cedula}.`, "info");
            }

        } catch (error) {
            console.error("Error al listar capturas:", error);
            mostrarPopup("⚠️ Error al obtener la lista de capturas. Revisa la Cédula o el servidor.", "error");
        }
    }

    // --- REDIRECCIÓN DEL LOGO ---
    const logo = document.querySelector(".logo-form");
    if (logo) {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => {
            window.location.href = "index.html"; 
        });
    }
});