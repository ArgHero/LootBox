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
const session = sessionStorage.getItem('usuarioActivo');
//-Cargar Imagenes
const fileImageContainer = document.getElementById("fileImageContainer");
const imageOutput = document.getElementById("output");
const uploadBtn = document.getElementById("upload_widget");
const img_fileName = document.getElementById("img_fileName");
//const spinner = document.getElementsByClassName("spinner-border").item(0);


const tablaItems = document.getElementById("tabla-items");
const cuerpoTabla = tablaItems.getElementsByTagName("tbody").item(0);

let listaProductos = [];
let imageCoded;
if (window.location.pathname === '/publicar.html') {
   const user = JSON.parse(session);
    if (user.isAdmin === false) {
    window.location.href = 'index.html';
  }
}

function mostrarDatosLocal(){
  listaProductos = JSON.parse(localStorage.getItem('productos')) || [];
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
  
  if (!img_fileName.innerText) {
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
    imageOutput
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
              <label for="fileUploadEditar" class="form-label">Cargar la imagen del producto</label>
              <span id="fileUploadEditar-alert-container"></span>
              <div class="d-flex justify-content-around align-items-center p-3 rounded-3 bg-white shadow text-dark" id="fileImageContainerEditar">
                <span class="spinner-border text-secondary visually-hidden" role="status" id="spinnerEditar"></span>
                <input type="file" id="fileUploadEditar" accept="image/*">
              </div>
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

    const fileInputEditar = document.getElementById("fileUploadEditar");
      const spinnerEditar = document.getElementById("spinnerEditar");
        let imageCodedEditar; // Variable para la imagen del modal
          
          fileInputEditar.addEventListener("change", async () => {
            imageCodedEditar = null;       spinnerEditar.classList.remove("visually-hidden");
            const [file] = fileInputEditar.files;
          
        if (file) {
              const reader = new FileReader();
                reader.onload = (event) => {
              imageCodedEditar = event.target.result;
            spinnerEditar.classList.add("visually-hidden");
              };
          
          reader.onerror = (err) => {
          console.error("Error reading file:", err);
          alert("An error occurred while reading the file.");
        spinnerEditar.classList.add("visually-hidden");
          };
          reader.readAsDataURL(file);
          } else {
          spinnerEditar.classList.add("visually-hidden"); // Ocultar el spinner si no hay archivo
          }
     });
    
  
  document.getElementById("formEditarProducto").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener referencias
    const skuEditar = document.getElementById("skuEditar");
    const productoEditar = document.getElementById("productoEditar");
    const descripcionEditar = document.getElementById("descripcionEditar");
    const precioEditar = document.getElementById("precioEditar");
    const canditadEditar = document.getElementById("canditadEditar");


    // Validar
    let hayErrores = false;
     limpiarAlertasYEstilos(); // Asegúrate de que esta función limpie las alertas del modal también
    
     // Validar los campos de texto
     if (!skuPath.test(skuEditar.value.trim())) {
         mostrarError(skuEditar, 'skuEditar-alert-container', 'El SKU debe tener entre 1 y 4 caracteres alfanuméricos.');
         hayErrores = true;
       }
     if (productoEditar.value.trim().length < 3) {
         mostrarError(productoEditar, 'productoEditar-alert-container', 'El nombre del producto debe tener al menos 3 caracteres.');
         hayErrores = true;
     }
     if (descripcionEditar.value.trim().length < 5) {
         mostrarError(descripcionEditar, 'descripcionEditar-alert-container', 'La descripción debe tener al menos 5 caracteres.');
         hayErrores = true;
     }
     if (isNaN(precioEditar.value) || Number(precioEditar.value) <= 0) {
         mostrarError(precioEditar, 'precioEditar-alert-container', 'El precio debe ser un número mayor que 0.');
         hayErrores = true;
     }
     if (!/^\d+$/.test(canditadEditar.value) || Number(canditadEditar.value) <= 0) {
         mostrarError(canditadEditar, 'canditadEditar-alert-container', 'La cantidad debe ser un número mayor que 0 y sin decimales.');
         hayErrores = true;
     }
    
     // Validar la imagen SOLO si se ha seleccionado un nuevo archivo
     if (fileInputEditar.files.length > 0) {
         // Aquí podrías agregar validaciones más específicas para el tipo o tamaño del archivo si lo deseas
     } else if (!listaProductos[document.getElementById("indexEditar").value].img) {
         // Si no se seleccionó una nueva imagen Y el producto original no tenía imagen
         mostrarError(document.getElementById('fileImageContainerEditar'), 'fileUploadEditar-alert-container', 'La imagen del producto es necesaria.');
         hayErrores = true;
     }
    
     if (hayErrores) return;
    

    const idx = document.getElementById("indexEditar").value;

    listaProductos[idx] = {
      id: listaProductos[idx].id, // Mantener el ID original
      name: productoEditar.value.trim(),
      sku: skuEditar.value.trim(),
      description: descripcionEditar.value.trim(),
      img: imageCodedEditar !== undefined ? imageCodedEditar : listaProductos[idx].img,
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
      <td data-label=""><img src="${element.img}" alt="${element.name}" style="max-width: 4rem; max-height: 4rem;"></td>
      <td data-label="SKU">${element.sku}</td>
      <td data-label="Producto">
        <div class="label-mobile" hidden>Producto:</div>
        <div class="value-mobile">${element.name}</div>
      </td>
      <td data-label="Categoría">${element.category || 'Sin Categoría'}</td>
      <td data-label="Precio">${element.price}</td>
      <td data-label="Cantidad">${element.stock}</td>
      <td data-label="Acciones">
        <button type="button" class="btn btn-warning p-1 d-inline-block mb-1" onClick="editComp(event)">Editar</button>
        <button type="button" class="btn btn-danger p-1 d-inline-block" onClick="deleteComp(event)">Eliminar</button>
      </td>
    </tr>`
  );
}//addRow()

function cleanForm(){
  sku.value = "";
  producto.value = "";
  descripcion.value = "";
  precio.value = "";
  costo.value = "";
  cantidad.value = "";
  imageCoded = null;
  imageOutput.src="";
  img_fileName.innerText="";

  sku.focus();
  selectorCategoria.selectedIndex = 0;
}//cleanForm()


//--------------Eliminar Componentes
function deleteComp(event){
  event.preventDefault();
  const prodName = event.target.parentElement.parentElement.getElementsByTagName("td").item(2).innerText;
    Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar ${prodName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const indexDel = listaProductos.findIndex(producto => producto.name === prodName);
      if (indexDel !== -1) {
        listaProductos.splice(indexDel, 1);
        localStorage.setItem('productos', JSON.stringify(listaProductos));
        mostrarDatosLocal();
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      }
    }
  });
}//deleteComp()



//----Cargar imágenes
const myWidget = cloudinary.createUploadWidget({

    cloudName: 'dsjcemt6v', // Reemplaza con tu Cloud Name de Cloudinary
    uploadPreset: 'LootBox', // Reemplaza con tu Upload Preset (debes crearlo en tu consola de Cloudinary)
    sources: ['local', 'url'], // Fuentes permitidas para la subida
    multiple: false, // Permitir una sola subida o múltiples
    //cropping: true, // Habilitar la herramienta de recorte
    clientAllowedFormats: ['png', 'gif', 'jpeg','webp']

}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log(result);
        imageCoded = result.info.secure_url;
        imageOutput.src=result.info.thumbnail_url;
        img_fileName.innerText=result.info.original_filename;
        console.log(imageCoded);    
    }
});

uploadBtn.addEventListener("click", ()=>myWidget.open());
//-----
document.addEventListener("DOMContentLoaded", mostrarDatosLocal);
//----Cargar tabla si no existia el local storage
window.addEventListener('productosCargados',mostrarDatosLocal);
