const skuPath = new RegExp("^[a-zA-Z0-9]{1,4}$");

const sku = document.getElementById("sku");
const producto = document.getElementById("producto");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const costo = document.getElementById("costo");
const cantidad = document.getElementById("cantidad");
const urlImage = document.getElementById("url-imagen");
const btnPublicar = document.getElementById("btn-publicar");
const selectorCategoria = document.getElementById("selector-categoria");

const tablaItems = document.getElementById("tabla-items");
const cuerpoTabla = tablaItems.getElementsByTagName("tbody").item(0);

const listaProductos = JSON.parse(localStorage.getItem('productos'))||[];

mostrarDatosLocal();


//FUNCION VALIDAR VALIDAR
function validarCamposProducto({ sku, producto, descripcion, precio, costo, cantidad }) {
    const skuTxt = sku.value.trim();
    const productoTxt = producto.value.trim();
    const descripcionTxt = descripcion.value.trim();

    if (!skuTxt) {
        alert("El SKU es obligatorio.");
        sku.focus();
        return false;
    }
    if (!skuPath.test(skuTxt)) {
        alert("El SKU debe tener entre 1 y 3 caracteres alfanuméricos.");
        sku.focus();
        return false;
    }
    if (productoTxt.length < 3) {
        alert("El nombre del producto debe tener al menos 3 caracteres.");
        producto.focus();
        return false;
    }

    if (descripcionTxt.length < 5) {
        alert("La descripción debe tener al menos 5 caracteres.");
        descripcion.focus();
        return false;
    }

    if (isNaN(precio.value) || Number(precio.value) <= 0) {
        alert("El precio debe ser un número mayor que 0.");
        precio.focus();
        return false;
    }

    if (isNaN(costo.value) || Number(costo.value) <= 0) {
        alert("El costo debe ser un número mayor que 0.");
        costo.focus();
        return false;
    }

    if (isNaN(cantidad.value) || Number(cantidad.value) <= 0) {
        alert("La cantidad debe ser un número mayor que 0.");
        cantidad.focus();
        
        return false;
    }

    return true;
}

//FUNCION PARA MOSTAR DATOS DE LOCALSTORAGE...
function mostrarDatosLocal(){
    cuerpoTabla.innerHTML = "";
    listaProductos.forEach(addRow);
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
    });

    if (!valido) return;

    const nuevoProducto = {
        sku: sku.value.trim(),
        name: producto.value.trim(),
        img: urlImage.value,
        description: descripcion.value,
        price: Number(precio.value),
        cost: Number(costo.value),
        stock: Number(cantidad.value),
        rating: {
          rate: parseFloat((Math.random() * 5).toFixed(1)),
          count: Math.floor(Math.random() * 1001) 
        }
    };

    addRow(nuevoProducto);
    listaProductos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(listaProductos));

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
                <input type="text" class="form-control" placeholder="0" id="canditadEditar" value"${producto.stock}" required>
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
          name: productoEditar.value.trim(),
          sku: skuEditar.value.trim(),
          description: descripcionEditar.value.trim(),
          img: urlImagenEditar.value.trim(),
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
            <td>${element.category}</td>
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
}//cleanForm()


//--------------Eliminar Componentes
function deleteComp(event){
    event.preventDefault();
    //Si se cambia el orden de la tabla es necesario ajustar el numero de item
    const prodName = event.target.parentElement.parentElement.getElementsByTagName("td").item(2).innerText;
    const indexDel = listaProductos.findIndex(producto=>producto.name===prodName);
    listaProductos.splice(indexDel,1);
    localStorage.setItem('productos', JSON.stringify(listaProductos));
    mostrarDatosLocal();
}//deleteComp()