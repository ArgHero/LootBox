const navPath = "./assets/components/navbar.html";
const footPath = "./assets/components/footer.html";
const fuentesPath = "./assets/components/fuentes.html";

const navBar=document.getElementById("navbar-container");
const cuerpo=document.getElementById("footer-container");
const fuentes=document.getElementsByTagName("head").item(0)

document.addEventListener("DOMContentLoaded", loadContainers);

function loadContainers(){
  fetch(navPath)
    .then(response => response.text())
    .then(data => navBar.innerHTML = data)
    .catch(error => console.error('Error cargando el navbar:', error));
  fetch(footPath)
    .then(response => response.text())
    .then(data => cuerpo.innerHTML = data)
    .catch(error => console.error('Error cargando el footer:', error));
  fetch(fuentesPath)
    .then(response => response.text())
    .then(data => fuentes.innerHTML = data)
    .catch(error => console.error('Error cargando el fuentes:', error));
}