const skuPath = new RegExp("^[a-zA-Z0-9]{1,3}$");

const sku = document.getElementById("sku");
const producto = document.getElementById("producto");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const costo = document.getElementById("costo");
const cantidad = document.getElementById("cantidad");
const btnPublicar = document.getElementById("btn-publicar");
const tablaItems = document.getElementById("tabla-items");
const cuerpoTabla = tablaItems.getElementsByTagName("tbody").item(0);

const listaProductos = JSON.parse(localStorage.getItem('productos'))||[];

mostrarDatosLocal();


//FUNCION VALIDAR CANTIDAD...
function validarCantidad() {
    // CANTIDAD
    if (cantidad.value.trim().length <= 0) {
        alert("La cantidad no puede estar vacía.");
        cantidad.focus();
        return false;
    }

    // VERIFICAR NÚMERO
    if (isNaN(cantidad.value)) {
        alert("La cantidad debe ser un número.");
        cantidad.focus();
        return false;
    }

    // Cantidad no 0
    if (Number(cantidad.value) <= 0) {
        alert("La cantidad debe ser mayor que cero.");
        cantidad.focus();
        return false;
    }

    return true;
}




//FUNCION VALDIAR SKU...
function validarSKU() {
    const skuTxt = sku.value.trim();
    if (!skuTxt) {
        alert("El SKU es obligatorio.");
        sku.focus();
        return false;
    }
    if(!skuPath.test(skuTxt))
        return false;
    return true;
}



//FUNCION VALDIAR PRODUCTO...
function validarProducto() {
    if (producto.value.trim().length < 3) {
        alert("El nombre del producto debe tener al menos 3 caracteres.");
        producto.focus();
        return false;
    }
    return true;
}

//FUNCIONA VALIDAR DESCRIPCION...
function validarDescripcion() {
    if (descripcion.value.trim().length < 5) {
        alert("La descripción del producto debe tener al menos 5 caracteres.");
        descripcion.focus();
        return false;
    }
    return true;
}

// FUNCION VALIDAR PRECIO...
function validarPrecio() {
    if (isNaN(precio.value) || Number(precio.value) <= 0) {
        alert("El precio debe ser un número mayor que 0.");
        precio.focus();
        return false;
    }
    return true;
}

//FUNCION VALIDAR COSTO...
function validarCosto() {
    if (isNaN(costo.value) || Number(costo.value) <= 0) {
        alert("El costo debe ser un número mayor que 0.");
        costo.focus();
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

    // Validar todos los campos antes de agregar el producto
    if (!validarSKU() || !validarProducto() || !validarDescripcion() || !validarPrecio() || !validarCosto() || !validarCantidad()) {
        
    }//if
    else{
        let nuevoProducto = {
            name: `${sku.value}`,
            img: `${urlImagen.value}`,
            description: `${descripcion.value}`,
            category: "Periféricos",
            price: 599.99,
            rating: {
              rate: 4.6,
              count: 89
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
    }//else
});

function addRow(element){
    cuerpoTabla.insertAdjacentHTML("beforeend",`
        <tr>
            <td>${element.category}</td>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td>${element.price}</td>
            <td><img src="${urlImagen.value}" alt="Imagen del producto" style="max-width: 100px; max-height: 100px;"></td>
            <td class="d-flex justify-content-end">
                        <button type="button" class="btn btn-warning me-3">Editar</button>
                        <button type="button" class="btn btn-danger" onClick="deleteComp(event)">Eliminar</button>
            </td>
        </tr>`
    );  
}

function cleanForm(){
    sku.value = "";
    producto.value = "";
    descripcion.value = "";
    precio.value = "";
    costo.value = "";
    cantidad.value = "";
    urlImagen.value = "";
    sku.focus();
}//cleanForm()


//--------------Eliminar Componentes