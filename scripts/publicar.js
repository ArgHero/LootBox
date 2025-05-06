const skuPath = new RegExp("^[a-zA-Z0-9]{1,4}$");
const validaURL = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const sku = document.getElementById("sku");
const producto = document.getElementById("producto");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const costo = document.getElementById("costo");
const cantidad = document.getElementById("cantidad");
const urlImage = document.getElementById("url-imagen");
const btnPublicar = document.getElementById("btn-publicar");
const selectorCategoria = document.getElementById("selector-categoria");
//-Cargar Imagenes
const fileInput = document.getElementById("fileUpload");
const fileImageContainer = document.getElementById("fileImageContainer");
//const imageOutput = document.getElementById("output");
const spinner = document.getElementsByClassName("spinner-border").item(0);
let imageCoded;

const tablaItems = document.getElementById("tabla-items");
const cuerpoTabla = tablaItems.getElementsByTagName("tbody").item(0);

let listaProductos = [];

function mostrarDatosLocal(){
  cuerpoTabla.innerHTML = "";
  listaProductos.forEach(addRow);
}

function limpiarAlertasYEstilos() {
  // Elimina clases de error
  const campos = document.querySelectorAll('.border-danger');
  campos.forEach(campo => {
    campo.classList.remove('border', 'border-danger', 'border-3');
  });

  // Limpia todos los contenedores de alertas
  const alertas = document.querySelectorAll('[id$="-alert-container"]');
  alertas.forEach(container => {
    container.innerHTML = '';
  });
}

function mostrarError(campo, containerId, mensaje) {
  campo.classList.add('border', 'border-danger', 'border-3');
  const contenedor = document.getElementById(containerId);
  contenedor.innerHTML = `
      <div class="alert alert-danger py-1 px-2 mb-1" role="alert" style="display: inline-block;">
          ${mensaje}
      </div>`;
  campo.focus();
}



//FUNCION VALIDAR VALIDAR
function validarCamposProducto({ sku, producto, descripcion, precio, costo, cantidad, fileInput }) {

  const skuTxt = sku.value.trim();
  const productoTxt = producto.value.trim();
  const descripcionTxt = descripcion.value.trim();
  //const urlTxt = urlImage.value.trim();

  let hayErrores = false;

  limpiarAlertasYEstilos();


  if (!skuPath.test(skuTxt)) {
    mostrarError(sku, 'sku-alert-container', 'El SKU debe tener entre 1 y 4 caracteres alfanuméricos.');
    hayErrores = true;
  }
  if (productoTxt.length < 3) {
    mostrarError(producto, 'producto-alert-container', 'El nombre del producto debe tener al menos 3 caracteres.');
    hayErrores = true;
  }

  if (descripcionTxt.length < 5) {
    mostrarError(descripcion, 'descripcion-alert-container', 'La descripción debe tener al menos 5 caracteres.');
    hayErrores = true;
  }

  if (isNaN(precio.value) || Number(precio.value) <= 0) {
    mostrarError(precio, 'precio-alert-container', 'El precio debe ser un número mayor que 0.');
    hayErrores = true;
  }

  if (isNaN(costo.value) || Number(costo.value) <= 0) {
    mostrarError(costo, 'costo-alert-container', 'El costo debe ser un número mayor que 0.');
    hayErrores = true;
  }

  if (!/^\d+$/.test(cantidad.value) || Number(cantidad.value) <= 0) {
    mostrarError(cantidad, 'cantidad-alert-container', 'La cantidad debe ser un número mayor que 0 y sin decimales.');
    hayErrores = true;
  }

  if (!fileInput.files.length) {
    mostrarError(fileImageContainer, 'fileUpload-alert-container', 'La imagen del producto es necesaria.');
    hayErrores = true;
  }
  

  return !hayErrores;
}

// AGREGAR
btnPublicar.addEventListener("click", function (event) {
  event.preventDefault();

  //mandar Elementos a validar
  const valido = validarCamposProducto({
    sku,
    producto,
    descripcion,
    precio,
    costo,
    cantidad,
    fileInput
  });

  if (!valido) return;

  const nuevoProducto = {
    id: Date.now(), // Añadir un ID único al producto
    sku: sku.value.trim(),
    name: producto.value.trim(),
    img: imageCoded,
    description: descripcion.value,
    price: Number(precio.value),
    cost: Number(costo.value),
    stock: Number(cantidad.value),
    category: selectorCategoria.value,
    rating: {
      rate: parseFloat((Math.random() * 5).toFixed(1)),
      count: Math.floor(Math.random() * 1001)
    }
  };

  addRow(nuevoProducto);
  listaProductos.push(nuevoProducto);
  localStorage.setItem('productos', JSON.stringify(listaProductos));
  window.dispatchEvent(new Event('productosCargados'));

  Swal.fire({
    icon: "success",
    title: "¡Producto publicado!",
    text: "El producto se ha guardado exitosamente.",
    confirmButtonText: "Aceptar"
  });

  cleanForm();
});

//Editar
function editComp(event) {
  const fila = event.target.closest("tr");
  const nombreProducto = fila.getElementsByTagName("td")[2].innerText;
  const index = listaProductos.findIndex(prod => prod.name === nombreProducto);
  const producto = listaProductos[index];
  console.log(producto);

  // Borra modal existente
  const modalExistente = document.getElementById("modalEditar");
  if (modalExistente) modalExistente.remove();

  // Crear el modal dinámicamente
  const modalHTML = `
    <div class="modal fade" id="modalEditar" tabindex="-1" aria-labelledby="modalEditarLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="formEditarProducto">
            <div class="modal-header">
              <h5 class="modal-title" id="modalEditarLabel">Editar Producto</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="indexEditar" value="${index}">

              <div class="mb-3">
                <label for="skuEditar" class="form-label">SKU</label>
                <input type="text" class="form-control" id="skuEditar" value="${producto.sku }"  maxlength="4">
              </div>

              <div class="mb-3">
                <label for="productoEditar" class="form-label">Nombre del producto</label>
                <input type="text" class="form-control" id="productoEditar" value="${producto.name}">
              </div>

              <div class="mb-3">
                <label for="descripcionEditar" class="form-label">Descripción</label>
                <input type="text" class="form-control" id="descripcionEditar" value="${producto.description}">
              </div>

              <div class="mb-3">
                <label for="urlImagenEditar" class="form-label">URL de Imagen</label>
                <input type="text" class="form-control" id="urlImagenEditar" value="${producto.img}">
              </div>

              <div class="mb-3">
                <label for="precioEditar" class="form-label">Precio</label>
                <input type="number" class="form-control" id="precioEditar" value="${producto.price}">
              </div>

              <div class="col-md-4">
                <label for="canditadEditar" class="form-label">Cantidad</label>
                <input type="text" class="form-control" placeholder="${producto.stock}" id="canditadEditar" value="${producto.stock}" required>
              </div>

              <div class="mb-3">
                <label for="categoriaEditar" class="form-label">Categoría</label>
                <select class="form-select" id="categoriaEditar">
                  <option disabled hidden ${!producto.category ? 'selected' : ''}>Selecciona la categoría</option>
                  <option value="Consolas" ${producto.category === "Consolas" ? 'selected' : ''}>Consolas</option>
                  <option value="Merch" ${producto.category === "Merch" ? 'selected' : ''}>Merch</option>
                  <option value="Periféricos" ${producto.category === "Periféricos" ? 'selected' : ''}>Periféricos</option>
                  <option value="Videojuegos" ${producto.category === "Videojuegos" ? 'selected' : ''}>Videojuegos</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.getElementById("formEditarProducto").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener referencias
    const skuEditar = document.getElementById("skuEditar");
    const productoEditar = document.getElementById("productoEditar");
    const descripcionEditar = document.getElementById("descripcionEditar");
    const urlImagenEditar = document.getElementById("urlImagenEditar");
    const precioEditar = document.getElementById("precioEditar");
    const canditadEditar = document.getElementById("canditadEditar");


    // Validar
    const valido = validarCamposProducto({
      sku: skuEditar,
      producto: productoEditar,
      descripcion: descripcionEditar,
      precio: precioEditar,
      costo: { value: 1, focus: () => {} },
      cantidad: { value: 1, focus: () => {} },
      urlImagen: urlImagenEditar,
    });

    if (!valido) return;

    const idx = document.getElementById("indexEditar").value;

    listaProductos[idx] = {
      id: listaProductos[idx].id, // Mantener el ID original
      name: productoEditar.value.trim(),
      sku: skuEditar.value.trim(),
      description: descripcionEditar.value.trim(),
      img: imageCoded,
      price: Number(precioEditar.value),
      stock: Number(canditadEditar.value),
      category: categoriaEditar.value,
      rating: {
        rate: parseFloat((Math.random() * 5).toFixed(1)),
        count: Math.floor(Math.random() * 1001)
      }
    };

    localStorage.setItem('productos', JSON.stringify(listaProductos));
    mostrarDatosLocal();
    const modalElement = document.getElementById("modalEditar");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    Swal.fire({
      icon: "success",
      title: "¡Producto actualizado!",
      text: "Los cambios se han guardado.",
      confirmButtonText: "Aceptar"
    });
  });

  // Mostrar el modal
  const nuevoModal = new bootstrap.Modal(document.getElementById("modalEditar"));
  nuevoModal.show();
}


function addRow(element){
  cuerpoTabla.insertAdjacentHTML("beforeend",`
      <tr>
        <td><img src="${element.img}" alt="${element.name}" style="max-width: 4rem; max-height: 4rem;"></td>
        <td>${element.sku}</td>
        <td>${element.name}</td>
        <td>${element.category || 'Sin Categoría'}</td>
        <td>${element.price}</td>
        <td>${element.stock}</td>
        <td>
          <button type="button" class="btn btn-warning p-1 d-inline-block mb-1" onClick="editComp(event)">Editar</button>
          <button type="button" class="btn btn-danger p-1 d-inline-block" onClick="deleteComp(event)">Eliminar</button>
        </td>
      </tr>`
  );
}//adRow()

function cleanForm(){
  sku.value = "";
  producto.value = "";
  descripcion.value = "";
  precio.value = "";
  costo.value = "";
  cantidad.value = "";
  urlImage.value = "";
  sku.focus();
  selectorCategoria.selectedIndex = 0;
}//cleanForm()


//--------------Eliminar Componentes
function deleteComp(event){
  event.preventDefault();
  const prodName = event.target.parentElement.parentElement.getElementsByTagName("td").item(2).innerText;
  const indexDel = listaProductos.findIndex(producto=>producto.name===prodName);
  listaProductos.splice(indexDel,1);
  localStorage.setItem('productos', JSON.stringify(listaProductos));
  mostrarDatosLocal();
}//deleteComp()

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar la lista de productos al cargar la página
  listaProductos = JSON.parse(localStorage.getItem('productos')) || [];
  mostrarDatosLocal();
});

//----Cargar imágenes
fileInput.addEventListener("change", async () => {
  imageCoded = null;
  spinner.classList.remove("visually-hidden");
  let [file] = fileInput.files;

  const reader = new FileReader();
  reader.onload = (event) => {
    //imageOutput.src = event.target.result;
    imageCoded = event.target.result;
    spinner.classList.add("visually-hidden");
  };

  reader.onerror = (err) => {
      console.error("Error reading file:", err);
      alert("An error occurred while reading the file.");
      spinner.classList.add("visually-hidden");
  };


  reader.readAsDataURL(file);
  
  
})