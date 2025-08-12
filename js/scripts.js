// Mostrar/Ocultar menú hamburguesa en los dispositivos moviles

 function toggleMenu() {
  const menu = document.getElementById("menu");
  const abierto = menu.classList.toggle("mostrar");
  const btn = document.querySelector(".hamburguesa");
  if (btn) {
    btn.setAttribute("aria-expanded", abierto ? "true" : "false");
  }
 }

  document.addEventListener("DOMContentLoaded", function () {
    const switchModo = document.getElementById("modo-switch");
    const body = document.body;

  // GUARDAR ESTADO DEL MODO OSCURO

  const modoGuardado = localStorage.getItem("modo-oscuro");
  if (modoGuardado === "activado") {
    body.classList.add("modo-activo");
    if (switchModo) switchModo.checked = true;
  }

  if (switchModo) {
    switchModo.addEventListener("change", function () {
      body.classList.toggle("modo-activo");
      const estado = body.classList.contains("modo-activo") ? "activado" : "desactivado";
      localStorage.setItem("modo-oscuro", estado);
    });
  }

  // CERRAR MENU

    document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
      const menu = document.getElementById("menu");
      menu.classList.remove("mostrar");
      const btn = document.querySelector(".hamburguesa");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });

  // FUNCION PARA WHATSAPP

  const NUMERO_DESTINO = "525562278234";

  // VALIDAR EL FORMULARIO

  const form = document.querySelector(".contacto form");
  if (form) {
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const telefonoInput = document.getElementById("telefono");
    const mensajeInput = document.getElementById("mensaje");

    // ALERTAR DE ERROR

    const campos = [nombreInput, emailInput, telefonoInput, mensajeInput];
    campos.forEach(campo => {
      let spanError = document.createElement("span");
      spanError.className = "error-mensaje";
      spanError.style.color = "white";
      spanError.style.fontWeight = "bold";
      campo.insertAdjacentElement("afterend", spanError);
    });

    // ALERTA DE ENVIO

    const mensajeExito = document.createElement("div");
    mensajeExito.className = "mensaje-exito";
    mensajeExito.style.color = "white";
    mensajeExito.style.fontWeight = "bold";
    mensajeExito.style.marginTop = "20px";
    mensajeExito.style.display = "none";
    form.appendChild(mensajeExito);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let errores = 0;

      // LIMPIAR ERRORES

      document.querySelectorAll(".error-mensaje").forEach(el => el.textContent = "");
      mensajeExito.style.display = "none";

      // ADVERTENCIA EN CASO DE ERROR

      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreInput.value.trim())) {
        nombreInput.nextElementSibling.textContent = "⚠️ Solo letras y espacios ⚠️.";
        errores++;
      }

      if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
        emailInput.nextElementSibling.textContent = "⚠️ Correo electrónico inválido ⚠️.";
        errores++;
      }

      if (telefonoInput.value.trim() !== "" && !/^\d{10}$/.test(telefonoInput.value.trim())) {
        telefonoInput.nextElementSibling.textContent = "⚠️ El numero debe de tener 10 digitos ⚠️.";
        errores++;
      }

      if (mensajeInput.value.trim().length === 0) {
        mensajeInput.nextElementSibling.textContent = "⚠️ Este campo es obligatorio. ⚠️";
        errores++;
      }

      // SI NO HAY ERRORES
      
      if (errores === 0) {

        // >>> CRAR MENSAJE Y ABRIR APLICACION DE WHATSAPP <<<

        const telUsuario = telefonoInput.value.trim() || "No proporcionado";
        const texto = `
         Hola, soy ${nombreInput.value.trim()}.
         Correo: ${emailInput.value.trim()}
         Teléfono: ${telUsuario}

         Mensaje:
         ${mensajeInput.value.trim()}
         `.trim();

        const url = `https://wa.me/${NUMERO_DESTINO}?text=${encodeURIComponent(texto)}`;
        window.open(url, "_blank"); // ABRIR WHATSAPP EN EL NAVEGADOR O EN LA APP

        form.reset(); // RESET DEL FORMULARIO

        mensajeExito.textContent = "✅ Formulario listo en WhatsApp. ¡Gracias por contactarme!";
        mensajeExito.style.display = "block";

        setTimeout(() => {
          mensajeExito.style.display = "none";
        }, 5000); // Nota> Modifica el tiempo de aparicion del letrero de envio exitoso
      }
    });
  }
});

// ==== Galería ====

// Estado
let galeriaImagenes = [];
let galeriaIndex = 0;
let ultimoTrigger = null;

// Referencias

const lightbox = document.getElementById("galeria-modal");
const lightboxImg = document.getElementById("lightbox-image");
const indicador = document.getElementById("lightbox-indicator");

function abrirGaleria(imagenes, startIndex = 0, triggerEl = null) {
  galeriaImagenes = imagenes;
  galeriaIndex = startIndex;
  ultimoTrigger = triggerEl;

  actualizarImagen();
  lightbox.setAttribute("aria-hidden", "false");

  const btnClose = lightbox.querySelector(".lightbox-close");
  if (btnClose) btnClose.focus();

  // BLOQUEAR 
  
  document.body.style.overflow = "hidden";
}

function cerrarGaleria() {
  lightbox.setAttribute("aria-hidden", "true");
  galeriaImagenes = [];
  galeriaIndex = 0;

  if (ultimoTrigger && typeof ultimoTrigger.focus === "function") {
    ultimoTrigger.focus();
  }
  ultimoTrigger = null;

  document.body.style.overflow = "";
}

function actualizarImagen() {
  if (!galeriaImagenes.length) return;
  const src = galeriaImagenes[galeriaIndex];
  lightboxImg.src = src;
  indicador.textContent = (galeriaIndex + 1) + " / " + galeriaImagenes.length;
}

function siguiente() {
  if (!galeriaImagenes.length) return;
  galeriaIndex = (galeriaIndex + 1) % galeriaImagenes.length;
  actualizarImagen();
}

function anterior() {
  if (!galeriaImagenes.length) return;
  galeriaIndex = (galeriaIndex - 1 + galeriaImagenes.length) % galeriaImagenes.length;
  actualizarImagen();
}

// FUNCION DE GALERIA 

document.addEventListener("click", (e) => {
  
  // RUTA DE IMAGENES

  const trigger = e.target.closest(".proyecto-trigger");
  if (trigger) {
    const data = (trigger.getAttribute("data-images") || "").trim();
    if (data) {
      e.preventDefault(); // evita salto a # y flicker
      const imagenes = data.split(",").map(s => s.trim()).filter(Boolean);
      if (imagenes.length) abrirGaleria(imagenes, 0, trigger);
    }
  }

  // CLOSE

  if (e.target.matches("[data-close='true']")) {
    e.preventDefault();
    cerrarGaleria();
  }

  // NAV

  if (e.target.closest(".lightbox-prev")) { e.preventDefault(); anterior(); }
  if (e.target.closest(".lightbox-next")) { e.preventDefault(); siguiente(); }
});

// NAV CON TECLADO

document.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.getAttribute("aria-hidden") === "true") return;
  if (e.key === "Escape") cerrarGaleria();
  if (e.key === "ArrowRight") siguiente();
  if (e.key === "ArrowLeft") anterior();
});

