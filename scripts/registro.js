const telPattern = new RegExp("^(?!.*(\\d)([-.\\s()]?)(?:\\1\\2?){9}$)(\\+?\\d{1,3}[-.\\s]?)?(\\(?\\d{2,4}\\)?[-.\\s]?)?\\d{3,4}[-.\\s]?\\d{4}$");
const emailPattern = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+");
const passwordPattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$");

const txtNombre = document.getElementById("txtNombre");
const txtCorreo = document.getElementById("txtCorreo");
const txtTel = document.getElementById("txtTel");
const txtPassword = document.getElementById("txtPassword");
const txtConfirmar = document.getElementById("txtConfirmar");
const btnEnviar = document.getElementById("btnEnviar");

// Validaciones
function validarNombre() {
    const nombreCompleto = txtNombre.value.trim();
    const partesNombre = nombreCompleto.split(" ");
    return partesNombre.length >= 2 && partesNombre.every(p => p.length > 0);
}

function validarEmail() {
    const content = txtCorreo.value.trim();
    return emailPattern.test(content);
}

function validarTelefono() {
    const content = txtTel.value.trim();
    return telPattern.test(content);
}

function validarPassword() {
  const content = txtPassword.value.trim();
  return passwordPattern.test(content);
}

function coincidenPasswords() {
  return txtPassword.value === txtConfirmar.value;
}

btnEnviar.addEventListener("click", function(event) {
  event.preventDefault();
  let isValid = true;


  // Validación Nombre y Apellido
  if (txtNombre.value.trim() === "") {
    isValid = false;
  } else if (!validarNombre()) {
    isValid = false;
  }

  // Validación Email
  if (txtCorreo.value.trim() === "") {
    isValid = false;
  } else if (!validarEmail()) {
    isValid = false;
  }

  // Validación Teléfono
  if (txtTel.value.trim() === "") {
    isValid = false;
  } else if (!validarTelefono()) {
    isValid = false;
  }


  // Validación contraseña
  if (txtPassword.value.trim() === "") {
    isValid = false;
  } else if (!validarPassword()) {
    isValid = false;
  }

  // Validación confirmación contraseña
  if (txtConfirmar.value.trim() === "") {
    isValid = false;
  } else if (!coincidenPasswords()) {
    isValid = false;
  }

  // Si todo es válido, se envía el correo
  if (isValid) {
    txtNombre.value = "";
    txtCorreo.value = "";
    txtTel.value = "";
    txtPassword.value = "";
    txtConfirmar.value = "";

    txtNombre.focus();
  }
});
