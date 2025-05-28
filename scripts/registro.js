const telPattern = new RegExp("^\\(?\\d{2}\\)?[-\\s]?\\d{4}[-\\s]?\\d{4}$");
const emailPattern = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+");
const passwordPattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$");

const txtNombre = document.getElementById("txtNombre");
const txtCorreo = document.getElementById("txtCorreo");
const txtTel = document.getElementById("txtTel");
const txtPassword = document.getElementById("txtPassword");
const txtConfirmar = document.getElementById("txtConfirmar");
const btnEnviar = document.getElementById("btnEnviar");
const alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
const alertValidaciones = document.getElementById("alertValidaciones");

const imgContainer = document.getElementById("imgContainer");

//Validaciones
function validarNombre() {
    const nombreCompleto = txtNombre.value.trim();
    const partesNombre = nombreCompleto.split(" ");
    return partesNombre.length >= 2 && partesNombre.every(p => p.length > 0);
}

function validarEmail() {
    const content = txtCorreo.value.trim();
    return emailPattern.test(content);
}//validarEmail

// Validar telefono
function validarTelefono() {
    const content = txtTel.value.trim();
    if (!telPattern.test(content)) return false;
    const limpio = content.replace(/\D/g, '');
  
    // Verificar que haya 10 dígitos
    if (limpio.length !== 10) return false;
  
    const bloque1 = limpio.slice(2, 6);
    const bloque2 = limpio.slice(6, 10);
    const repetidos = /(\d)\1{3}/;
    if (repetidos.test(bloque1) || repetidos.test(bloque2)) return false;

  return telPattern.test(content);
};//validarTelefono

function validarPassword() {
    const content = txtPassword.value.trim();
    return passwordPattern.test(content);
}//validarPassword

function coincidenPasswords() {
    return txtPassword.value === txtConfirmar.value;
}//coincidenPasswords

btnEnviar.addEventListener("click", function(event) {
    event.preventDefault();
    alertValidaciones.style.display = "none";
    alertValidacionesTexto.innerHTML = "";

    //Quitar bordes rojos

    txtNombre.style.border = "";
    txtCorreo.style.border = "";
    txtTel.style.border = "";
    txtPassword.style.border = "";
    txtConfirmar.style.border = "";
    let isValid = true;

//Validación de nombre y apellido

    if (txtNombre.value.trim() === "") {
        txtNombre.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>El nombre y apellido no puede estar vacío.</strong><br/><br/>";
        isValid = false;
    } else if (!validarNombre()) {
        txtNombre.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>Debe ingresar al menos nombre y apellido.</strong><br/><br/>";
        isValid = false;
    }

//Validación de correo electrónico

    if (txtCorreo.value.trim() === "") {
        txtCorreo.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>El correo no puede estar vacío.</strong><br/><br/>";
        isValid = false;
    } else if (!validarEmail()) {
        txtCorreo.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>Formato de correo inválido.</strong><br/><br/>";
        isValid = false;
    }

//Validación de teléfono

    if (txtTel.value.trim() === "") {
        txtTel.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>El teléfono no puede estar vacío.</strong><br/><br/>";
        isValid = false;
    } else if (!validarTelefono()) {
        txtTel.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>Formato de teléfono inválido.</strong><br/><br/>";
        isValid = false;
    }

//Validación Contraseña

    if (txtPassword.value.trim() === "") {
        txtPassword.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>La contraseña no puede estar vacía.</strong><br/><br/>";
        isValid = false;
    } else if (!validarPassword()) {
        txtPassword.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.</strong><br/>";
        isValid = false;
    }

    if (txtConfirmar.value.trim() === "") {
        txtConfirmar.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>Debe confirmar la contraseña.</strong><br/><br/>";
        isValid = false;
    } else if (!coincidenPasswords()) {
        txtConfirmar.style.border = "2px solid red";
        alertValidacionesTexto.innerHTML += "<strong>Las contraseñas no coinciden.</strong><br/><br/>";
        isValid = false;
    }

//Check de Términos y condiciones

    if (!document.getElementById('chkTerminos').checked) {
      alertValidacionesTexto.innerHTML += "<strong>Debe aceptar los términos y condiciones.</strong>";
      document.getElementById('chkTerminos').style.border = "2px solid red";  // Añadir borde rojo si no está seleccionado
      isValid = false;
  } else {
      document.getElementById('chkTerminos').style.border = "";  // Limpiar el borde rojo si está seleccionado
  }

//LocalStorage

    if (!isValid) {
        alertValidaciones.style.display = "block";
    } else {
        const nombre = txtNombre.value.trim();
        const correo = txtCorreo.value.trim();
        const telefono = txtTel.value.trim();
        const password = txtPassword.value.trim();

        const usuarios = JSON.parse(localStorage.getItem('users')) || [];
        const correoExiste = usuarios.some(usuario => usuario.email.toLowerCase() === correo.toLowerCase());

        const nuevoUsuario = {
            nombre: nombre,
            email: correo,
            telefono: telefono,
            password: password,
            isAdmin: false
        };

        if (correoExiste) {
            Swal.fire("Error", "Este correo ya está registrado", "error");
        } else {
            usuarios.push(nuevoUsuario);
            localStorage.setItem('users', JSON.stringify(usuarios));
            Swal.fire("Registro exitoso", "El usuario fue guardado correctamente", "success").then(()=>{
                window.location.href = "./sesion.html"
            });

            // Limpiar todos los campos del formulario
            txtNombre.value = "";
            txtCorreo.value = "";
            txtTel.value = "";
            txtPassword.value = "";
            txtConfirmar.value = "";

            // Limpiar el check de términos
            document.getElementById('chkTerminos').checked = false;

            document.getElementById('chkTerminos').style.border = "";

            // INICIO en el primer campo
            txtNombre.focus();
        }
    }

            if (!isValid) {
    alertValidaciones.style.display = "block";
    imgContainer.style.display = "none";
} else {
    alertValidaciones.style.display = "none";
    imgContainer.style.display = "block";
}

});