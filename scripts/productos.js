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
}

//Carga las tarjetas en el main a partir de un objeto tipo prods
function createCards(prods) {
  main.insertAdjacentHTML(
    "beforeend",
    `
      <div id="${prods.id}" class="card p-3 text-white bg-dark d-flex flex-column justify-content-between" style="width: 18rem;" data-categoria="${prods.category}">
        <div class="ratio ratio-1x1">
          <img src="${prods.img}" class="card-img-top" alt="">
        </div>
        <div class=" h-100 card-body d-flex flex-column flex-wrap justify-content-between gap-3">

          <h5 class="card-title text-center">${prods.name}</h5>       
          <p class="card-text d-none">${prods.description}</p>
          <button class="btn btn-primary add-cart-button" onclick="handleAddToCartClick(event);">
            <i class="bi bi-cart-plus"></i>
          </button>
          
        </div>

        <ul class="list-group list-group-flush text-center" >
          <li class="list-group-item text-white bg-dark">$ ${prods.price}</li>
          <li class="list-group-item text-white bg-dark">⭐ ${prods.rating.rate} (${prods.rating.count})</li>
        </ul>

        <button type="button" onclick="modalProducto(event);" class="btn fs-3 btn-transparent text-white btn-puntos border-0" 
          data-bs-toggle="modal" data-bs-target="#modalDescripcion" >
             <p class="puntos">. . .</p>
        </button>

      </div>
      `
  );//insertAdjacentHTML
} //createCards()

function modalProducto(event) {
  event.preventDefault();
  const contenedorPadre = event.target.closest("div.card");
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

// Filtro por categoría
function aplicarFiltroCategoria() {
  const prodsData = JSON.parse(localStorage.getItem('productos'))||null;
  if(!prodsData)
    return;
  main.innerHTML = '';
  let prodsfilter;
  const categoriaSeleccionada = document.getElementById("filtro-categoria").value;
  if(categoriaSeleccionada==="Todos")
    prodsfilter = prodsData;
  else 
   prodsfilter = prodsData.filter(prod => prod.category===categoriaSeleccionada);
  prodsfilter.forEach(createCards);

  // const tarjetas = document.querySelectorAll("main.card");

  // tarjetas.forEach((card) => {
  //   const categoria = card.getAttribute("data-categoria");
  //   if (categoriaSeleccionada === "todos" || categoria === categoriaSeleccionada) {
  //     card.style.display = "block";
  //   } else {
  //     card.style.display = "none";
  //   }
  // });
}

document.getElementById("filtro-categoria").addEventListener("change", aplicarFiltroCategoria);
// Escuchar el evento personalizado para actualizar si el local storage no contiene PRODUCTS
document.addEventListener("DOMContentLoaded", actualizarProductos);
// Cargar productos si ya existen al cargar la página
window.addEventListener('productosCargados', actualizarProductos);
//history.pushState({}, '', '/nuestrosProductos');
