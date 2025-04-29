
//SE DECLARAN VARIABLES....
const sku = document.getElementById("sku");
const producto = document.getElementById("producto");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const costo = document.getElementById("costo");
const cantidad = document.getElementById("cantidad");
const btnPublicar = document.getElementById("btn-publicar");

const tablaItems = document.getElementById("tabla-items");
const cuerpoTabla = tablaItems.getElementsByTagName("tbody").item(0);







//FUNCIONES PARA VALIDACION DE CAMPOS...
//FUNCION QUE VALIDA LA CANTIDAD...

function validarCantidad() {

    //VERIFICA EXISTA UN VALOR INGREADO...
    if(cantidad.value.trim().length <= 0){
        return false;
    }

    //VARIFICA QUE EL VALOR INGRESADO SEA UN NUMERO...
    if(isNaN(cantidad.value)){
        return false;
    }

    //VERIFICA QUE EL NUMERO INGREASADO SEA MAYOR QUE CERO...
    if(Number(cantidad.value)<=0){
        return false;
    }
    
    return true;

}




//OREJA PARA EL BOTON DE PUBLICAR...
btnPublicar.addEventListener("click",function(event){

    event.preventDefault();
    let row = `<tr>
    <td>${sku.value}</td>
    <td>${producto.value}</td>
    <td>${precio.value}</td>
    <td>${cantidad.value}</td>
     <td class="d-flex justify-content-end">
                <button type="button" class="btn btn-warning me-3">Editar</button>
                <button type="button" class="btn btn-danger">Eliminar</button>
    </td>
    </tr>`;

    cuerpoTabla.insertAdjacentHTML("beforeend",row);

});
