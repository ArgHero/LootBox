const telPattern = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$");
const emailPattern = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+");

const txtCorreo = document.getElementById("txtCorreo");
const txtTel = document.getElementById("txtTel");
const txtNombre = document.getElementById("txtNombre");
const txtMensaje = document.getElementById("txtMensaje");
const btnEnviar = document.getElementById("btnEnviar");
const alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
const alertValidaciones = document.getElementById("alertValidaciones");

let correoValido = false;
let telefonoValido = false;

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

// Validar correo electrónico
function validarEmail() {
  const content = txtCorreo.value.trim();
  return emailPattern.test(content);
};//validarEmail()

// Validar correo electrónico
function validarTelefono() {
  const content = txtTel.value.trim();
  return telPattern.test(content);
};//validarTelefono()

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
    txtCorreo.value = "";
    txtTel.value = "";

    txtNombre.focus();

    // Ocultar la alerta de validaciones ya que todo está bien
    alertValidaciones.style.display = "none";
  }
});//btnEnviar-Click

//---------LimpiarContorno----
const cleanBorder = (event)=>{
  const contenedor = event.target;
  contenedor.style.border = "";
};//cleanBorder()

const colorBorder = (event)=>{
  const contenedor = event.target;
  contenedor.style.border = "2px solid red";
};//colorBorder()

txtNombre.addEventListener("click",cleanBorder);
txtMensaje.addEventListener("click",cleanBorder);
txtTel.addEventListener("click",cleanBorder);
txtCorreo.addEventListener("click",cleanBorder);

//----------Validación rápida-----------------
txtNombre.addEventListener("blur",(event)=>{
  if(!validarNombre())
    colorBorder(event);
});//txtNombre-blur

txtMensaje.addEventListener("blur",(event)=>{
  if(!validarMensaje())
    colorBorder(event);
});//txtMensaje-blur

txtTel.addEventListener("blur",(event)=>{
  if(!validarTelefono())
    colorBorder(event);
});//txtTel-blur

txtCorreo.addEventListener("blur",(event)=>{
  if(!validarEmail())
    colorBorder(event);
});//txtCorreo-blur