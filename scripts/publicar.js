const skuPath = new RegExp("^[a-zA-Z0-9]{1,4}$");

const sku = document.getElementById("sku");
const producto = document.getElementById("producto");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const costo = document.getElementById("costo");
const cantidad = document.getElementById("cantidad");
const urlImage = document.getElementById("url-imagen");
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
            sku: sku.value,
            name: producto.value,
            img: urlImage.value,
            description: descripcion.value,
            category: "Periféricos",
            price: Number(precio.value),
            cost: Number(costo.value),
            stock: Number(cantidad.value),
            rating: {
              rate: 4.8,
              count: 77
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
            <td><img src="${element.img}" alt="${element.name}" style="max-width: 4rem; max-height: 4rem;"></td>
            <td>${element.sku}</td>
            <td>${element.name}</td>
            <td>${element.category}</td>
            <td>${element.price}</td>
            <td>${element.stock}</td>
            <td>
                <button type="button" class="btn btn-warning p-1 d-inline-block mb-1">Editar</button>
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