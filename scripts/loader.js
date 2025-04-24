const navPath = "./assets/components/navbar.html";
const footPath = "./assets/components/footer.html";
const nombrePagina = window.location.pathname.split('/').pop();

const navBar=document.getElementById("navbar-container");
const cuerpo=document.getElementById("footer-container");

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
};//loadContainers()

function resaltarNav(){
  const paginas = ["index.html","aboutUs.html","contacUs.html","prodList.html","publicar.html"];
  const navFocus = document.getElementById("navbar-container").getElementsByClassName("nav-item")[paginas.indexOf(nombrePagina)].getElementsByTagName("a").item(0);
  navFocus.classList.add("active");
};//resaltarNav()


document.addEventListener("DOMContentLoaded", loadContainers);

