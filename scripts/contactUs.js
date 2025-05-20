const telPattern = new RegExp("^\\(?\\d{2}\\)?[-\\s]?\\d{4}[-\\s]?\\d{4}$");
const emailPattern = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+");

const txtCorreo = document.getElementById("txtCorreo");
const txtTel = document.getElementById("txtTel");
const txtNombre = document.getElementById("txtNombre");
const txtMensaje = document.getElementById("txtMensaje");
const btnEnviar = document.getElementById("btnEnviar");
const alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
const alertValidaciones = document.getElementById("alertValidaciones");


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
};//validarTelefono()

//--------------------Botón enviar---------------------
btnEnviar.addEventListener("click", function(event) {
  event.preventDefault();
  // Ocultar la alerta de validaciones ya que todo está bien
  alertValidaciones.style.display = "none";
  let isValid = true;

  // Limpiar los mensajes anteriores
  alertValidacionesTexto.innerHTML = "";
  alertValidaciones.style.display = "none";
  txtNombre.style.border = "";
  txtCorreo.style.border = "";
  txtTel.style.border = "";
  txtMensaje.style.border = "";

  
  // Validar que el campo no esté vacío o tenga al menos un nombre y apellido
  if (txtNombre.value.trim() === "") {
    txtNombre.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El nombre y apellido no puede estar vacío.</strong><br/>";
    isValid = false;
  } else if (!validarNombre()) {
    txtNombre.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El nombre debe contener al menos un nombre y un apellido.</strong><br/>";
    isValid = false;
  }

  // Validar que el campo no esté vacío o y que el correo sea válido
  if (txtCorreo.value.trim() === "") {
    txtCorreo.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El correo Electrónico no puede estar vacío.</strong><br/>";
    isValid = false;
  } else if (!validarEmail()) {
    txtCorreo.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El correo electrónico no es válido.</strong><br/>";
    isValid = false;
  }

  // Validar que el campo no esté vacío o y que el número de teléfono sea válido.
  if (txtTel.value.trim() === "") {
    txtTel.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El teléfono no puede estar vacío.</strong><br/>";
    isValid = false;
  } else if (!validarTelefono()) {
    txtTel.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El número telefónico no es válido.</strong><br/>";
    isValid = false;
  } else {
    txtTel.style.border = ""; 
  }

  // Validar que el campo no esté vacío o tenga entre 10 y 150 caracteres
  if (txtMensaje.value.trim() === "") {
    txtMensaje.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El mensaje no puede estar vacío.</strong><br/>";
    isValid = false;
  } else if (!validarMensaje()) {
    txtMensaje.style.border = "2px solid red";
    alertValidacionesTexto.innerHTML += "<strong>El mensaje debe tener entre 10 y 150 caracteres.</strong><br/>";
    isValid = false;
  }

  // Alerta para errores
  if (!isValid) {
    alertValidaciones.style.display = "block";
  } else {
    // Si todo es válido, enviar el formulario <----------Funciones que reciben los valores validados
    enviarCorreo();

    // Limpiar los campos después de enviar
    txtNombre.value = "";
    txtMensaje.value = "";
    txtCorreo.value = "";
    txtTel.value = "";
    
    txtNombre.focus();
  }
});//btnEnviar-Click

//---------LimpiarContorno--------------------
const cleanBorder = (event)=>{
  const contenedor = event.target;
  contenedor.style.border = "";
};//cleanBorder()

//---------Colorear contornos-----------------
const colorBorder = (event)=>{
  const contenedor = event.target;
  contenedor.style.border = "2px solid red";
};//colorBorder()

//---------Limpiar bordes al clickear--------
txtNombre.addEventListener("click",cleanBorder);
txtMensaje.addEventListener("click",cleanBorder);
txtTel.addEventListener("click",cleanBorder);
txtCorreo.addEventListener("click",cleanBorder);

//----------Validación rápida-----------------
// txtNombre.addEventListener("blur",(event)=>{
//   if(!validarNombre())
//     colorBorder(event);
// });//txtNombre-blur

// txtMensaje.addEventListener("blur",(event)=>{
//   if(!validarMensaje())
//     colorBorder(event);
// });//txtMensaje-blur

// txtTel.addEventListener("blur",(event)=>{
//   if(!validarTelefono())
//     colorBorder(event);
// });//txtTel-blur

// txtCorreo.addEventListener("blur",(event)=>{
//   if(!validarEmail())
//     colorBorder(event);
// });//txtCorreo-blur


//email....
//DECLARACION DE VARIABLES...
function enviarCorreo(){
 //Entradas para mandar el correo
  const entries = {
    nombre: txtNombre.value.trim(),
    email: txtCorreo.value.trim(),
    telefono: txtTel.value.trim(),
    mensaje: txtMensaje.value.trim()
  };
  //entries.status = 1;
  /*const statusCode = entries.status == 1 ? 200 : 400;
  const jsons = {
      200: {
          icon: "success",
          title: "Drag me!"
      },
      400: {
          title: "Ooops...",
          icon: "error"
      }
  };
  const alertConfig = jsons[statusCode];
  */

  emailjs.send("service_5nrp32q", "template_3picx8s", entries).then(
    (response) => {
      Swal.fire({
          title: "Genial!",
          text: "Correo enviado!",
          icon: "success"
      });
    },
    (error) => {
      Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
      });
    },
  );
}




//history.pushState({}, '', '/contactanos');





