const navPath = "./assets/components/navbar.html";
const footPath = "./assets/components/footer.html";

const navBar=document.getElementById("navbar-container");
const cuerpo=document.getElementById("footer-container");

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
}