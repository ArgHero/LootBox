const productosL = localStorage.getItem('productos');

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
    })
    .catch(error => console.error('Error cargando el navbar:', error));
  fetch(footPath)
    .then(response => response.text())
    .then(data => cuerpo.innerHTML = data)
    .catch(error => console.error('Error cargando el footer:', error));
  fetch(fuentesPath)
    .then(response => response.text())
    .then(data => fuentes.insertAdjacentHTML("beforeend", data))
    .catch(error => console.error('Error cargando el fuentes:', error));
};//loadContainers()

function resaltarNav(){
  const paginas = ["index.html","aboutUs.html","contacUs.html","prodList.html","publicar.html"];
  const navFocus = document.getElementById("navbar-container").getElementsByClassName("nav-item")[paginas.indexOf(nombrePagina)].getElementsByTagName("a").item(0);
  navFocus.classList.add("active");
};//resaltarNav()


document.addEventListener("DOMContentLoaded", loadContainers);


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

