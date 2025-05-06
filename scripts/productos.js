document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementsByTagName("main").item(0);
  const modalTitulo = document.getElementById("modalTitulo");
  const modalBody = document.getElementsByClassName("modal-body").item(0);
  const ulMenu = document.getElementById("ulMenu");

  // Función para obtener y mostrar los datos
  function actualizarProductos() {
    const prodsData = localStorage.getItem('productos');
    console.log(prodsData);

    let prods = [];
    main.innerHTML = '';
    if (prodsData) {
      try {
        prods = JSON.parse(prodsData);
        prods.forEach(createCards);
      } catch (error) {
        console.error("Error al analizar los datos de productos de localStorage:", error);
      }
    }
  }

  function createCards(prods) {
    console.log(prods);
    
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
            <button type="button" onclick=modalProducto(event)  class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#modalDescripcion">
              Saber más...
            </button>
          </div>
          <ul class="list-group list-group-flush" >
            <li class="list-group-item text-white bg-dark">$ ${prods.price}</li>
            <li class="list-group-item text-white bg-dark">⭐ ${prods.rating.rate} (${
              prods.rating.count
            }) </li>
            <li class="list-group-item text-white bg-dark">${prods.category.toUpperCase()}</li>
          </ul>
        </div>
        `
    );//insertAdjacentHTML
  } //createCards()

  function modalProducto(event) {
    event.preventDefault();
    const contenedorPadre = event.target.parentElement;
    modalTitulo.innerText = contenedorPadre
      .getElementsByTagName("h5")
      .item(0)
      .innerText.trim();
    modalBody.innerText = contenedorPadre
      .getElementsByTagName("p")
      .item(0)
      .innerText.trim();
  };//modalProducto

  // Escuchar el evento personalizado para actualizar
  window.addEventListener('productosCargados', actualizarProductos);

  // Cargar productos si ya existen al cargar la página
  actualizarProductos();
});