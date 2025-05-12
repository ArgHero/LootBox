const main = document.getElementsByTagName("main").item(0);
const modalTitulo = document.getElementById("modalTitulo");
const modalBody = document.getElementsByClassName("modal-body").item(0);
const ulMenu = document.getElementById("ulMenu");

//Función para obtener y mostrar los datos
function actualizarProductos() {
  const prodsData = localStorage.getItem('productos');
  if(!prodsData)
    return;
  main.innerHTML = '';
  JSON.parse(prodsData).forEach(createCards);
}//actualizarProductos()

//Carga las tarjetas en el main a partir de un objeto tipo prods
function createCards(prods) {
  main.insertAdjacentHTML(
    "beforeend",
    `
      <div id="${prods.id}" class="card p-3 text-white bg-dark" style="width: 18rem;">
        <div class="ratio ratio-1x1">
          <img src="${prods.img}" class="card-img-top" alt="">
        </div>
        <div class="card-body d-flex flex-wrap justify-content-center gap-3 ">
          <h5 class="card-title">${prods.name}</h5>
          <p class="card-text text-truncate text-break">${
            prods.description
          }</p>
          <button type="button" onclick="modalProducto(event);"  class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#modalDescripcion">
            Saber más...
          </button>
        </div>
        <ul class="list-group list-group-flush" >
          <li class="list-group-item text-white bg-dark">$ ${prods.price}</li>
          <li class="list-group-item text-white bg-dark">⭐ ${prods.rating.rate} (${
            prods.rating.count
          }
        </ul>
      </div>
      `
  );//insertAdjacentHTML
} //createCards()

function modalProducto(event) {
  event.preventDefault();
  const contenedorPadre = event.target.parentElement;
  modalDescripcion.removeAttribute("inert");

  modalTitulo.innerText = contenedorPadre
    .getElementsByTagName("h5")
    .item(0)
    .innerText.trim();
  modalBody.innerText = contenedorPadre
    .getElementsByTagName("p")
    .item(0)
    .innerText.trim();

  modalDescripcion.querySelector("button").focus();
};//modalProducto

// Escuchar el evento personalizado para actualizar si el local storage no contiene PRODUCTS
document.addEventListener("DOMContentLoaded", actualizarProductos);
// Cargar productos si ya existen al cargar la página
window.addEventListener('productosCargados', actualizarProductos);
//history.pushState({}, '', '/nuestrosProductos');