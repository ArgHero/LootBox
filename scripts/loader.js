const productosL = localStorage.getItem('productos');
const session = sessionStorage.getItem('usuarioActivo');

const navPath = "./assets/components/navbar.html";
const footPath = "./assets/components/footer.html";
const fuentesPath = "./assets/components/fuentes.html";
const nombrePagina = window.location.pathname.split('/').pop();

const navBar=document.getElementById("navbar-container");
const cuerpo=document.getElementById("footer-container");
const fuentes=document.getElementsByTagName("head").item(0)

function loadContainers(){
  fetch(navPath)
    .then(response => response.text())
    .then(data => {
      navBar.innerHTML = data;
      resaltarNav();
      inicioSesion();
    })
    .catch(error => console.error('Error cargando el navbar:', error));
  fetch(footPath)
    .then(response => response.text())
    .then(data => cuerpo.innerHTML = data)
    .catch(error => console.error('Error cargando el footer:', error));
  fetch(fuentesPath)
    .then(response => response.text())
    .then(data => fuentes.insertAdjacentHTML("beforeend", data))
    .catch(error => console.error('Error cargando las fuentes:', error));
};//loadContainers()

function resaltarNav(){
  const paginas = ["index.html","sobreNosotros.html","contactanos.html","nuestrosProductos.html","publicar.html","registro.html"];
  const index = paginas.indexOf(nombrePagina);
  if(index!==-1){
    const navFocus = navBar.getElementsByClassName("nav-item")[index].getElementsByTagName("a").item(0);
    navFocus.classList.add("active");
  }
};//resaltarNav()

//======================Sesión de usuario===============================
function inicioSesion(){
  const user = JSON.parse(session);
  if(!user)
    return;
  const containerBtn = navBar.getElementsByTagName("div").item(4);
  containerBtn.innerHTML=`
  <span class="usuario-bienvenida text-white">Bienvenido, ${user.nombre || "Usuario"}</span>
    <button type="button" id="btnCerrar" class="btns-log-ins text-white px-3 py-1 rounded-4 text-center"> Cerrar Sesión </button>
    <img src="${user.img||"https://i.pinimg.com/736x/8d/59/b0/8d59b077f0c018f985ff8babeec16220.jpg"}" alt="${user.user}" class="rounded-circle" width="40px" height="40px">
  `;
  document.getElementById("btnCerrar").addEventListener("click",cerrarSesion);
}//inicioSesion()

function cerrarSesion(event){
  event.preventDefault();
  sessionStorage.removeItem("usuarioActivo");
  window.location.href = "./index.html";
}//cerrarSesion()
//=================Productos por default=================================
if (!productosL) {
  fetch('./assets/documents/Productos.txt')
  .then(response => {
    if (!response.ok) throw new Error('No se pudo cargar el archivo');
    return response.text(); // Usamos text() porque es un archivo .txt
  })
  .then(text => {
    const data = JSON.parse(text);
    // Verifica si es un array
    if (Array.isArray(data)) {
      localStorage.setItem('productos', JSON.stringify(data));
      //console.log('Productos cargados correctamente al localStorage.');
      window.dispatchEvent(new Event('productosCargados'));
    } else {
      console.error('El archivo no contiene un array válido.');
    }
  })
  .catch(error => {
    console.error('Error al cargar o parsear el archivo:', error);
  });
  }
//==================Event Listeners=====================================
document.addEventListener("DOMContentLoaded", loadContainers);
