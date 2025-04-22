let txtNombre = document.getElementById("txtNombre");
let txtMensaje = document.getElementById("txtMensaje");
let btnEnviar = document.getElementById("btnEnviar");
let alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
let alertValidaciones = document.getElementById("alertValidaciones");

// Se valida el nombre
function validarNombre() {
  const nombreCompleto = txtNombre.value.trim();
  const partesNombre = nombreCompleto.split(" ");
  return partesNombre.length >= 2 && partesNombre.every(p => p.length > 0);
}//validarNombre


// Se valida el mensaje
function validarMensaje() {
  const longitud = txtMensaje.value.trim().length;
  return longitud >= 10 && longitud <= 150;
}//ValidarMensahe

// Botón enviar
btnEnviar.addEventListener("click", function(event) {
  event.preventDefault();
  let isValid = true;

  // Limpiar los mensajes anteriores
  alertValidacionesTexto.innerHTML = "";
  alertValidaciones.style.display = "none";
  txtNombre.style.border = "";
  txtMensaje.style.border = "";

  
  // Validar que el campo no esté vacío o tenga al menos un nombre y apellido
  if (txtNombre.value.trim() === "") {
    txtNombre.style.border = "solid 3px red";
    alertValidacionesTexto.innerHTML += "<strong>El campo Nombre no puede estar vacío.</strong><br/>";
    isValid = false;
  } else if (!validarNombre()) {
    txtNombre.style.border = "solid 3px red";
    alertValidacionesTexto.innerHTML += "<strong>El nombre debe contener al menos un nombre y un apellido.</strong><br/>";
    isValid = false;
  }

  // Validar que el campo no esté vacío o tenga entre 10 y 150 caracteres
  if (txtMensaje.value.trim() === "") {
    txtMensaje.style.border = "solid 3px red";
    alertValidacionesTexto.innerHTML += "<strong>El campo Mensaje no puede estar vacío.</strong><br/>";
    isValid = false;
  } else if (!validarMensaje()) {
    txtMensaje.style.border = "solid 3px red";
    alertValidacionesTexto.innerHTML += "<strong>El mensaje debe tener entre 10 y 150 caracteres.</strong><br/>";
    isValid = false;
  }

  // Alerta para errores
  if (!isValid) {
    alertValidaciones.style.display = "block";
  } else {
    // Si todo es válido, enviar el formulario
    alert("Formulario enviado correctamente\nNombre: " + txtNombre.value + "\nMensaje: " + txtMensaje.value);

    // Limpiar los campos después de enviar
    txtNombre.value = "";
    txtMensaje.value = "";
    txtNombre.focus();

    // Ocultar la alerta de validaciones ya que todo está bien
    alertValidaciones.style.display = "none";
  }
});