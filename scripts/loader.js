const productosL = localStorage.getItem('productos');
const session = sessionStorage.getItem('usuarioActivo');

const navPath = "./assets/components/navbar.html";
const footPath = "./assets/components/footer.html";
const fuentesPath = "./assets/components/fuentes.html";
const nombrePagina = window.location.pathname.split('/').pop();

const navBar=document.getElementById("navbar-container");
const cuerpo=document.getElementById("footer-container");
const fuentes=document.getElementsByTagName("head").item(0)

//Carrito de compras
let cart = JSON.parse(localStorage.getItem("cart"))||[];

function loadContainers(){
  fetch(navPath)
    .then(response => response.text())
    .then(data => {
      navBar.innerHTML = data;
      resaltarNav();
      inicioSesion();
      generateCarrito();
    })
    .catch(error => console.error('Error cargando el navbar:', error));
  fetch(footPath)
    .then(response => response.text())
    .then(data => cuerpo.innerHTML = data)
    .catch(error => console.error('Error cargando el footer:', error));
  fetch(fuentesPath)
    .then(response => response.text())
    .then(data => fuentes.insertAdjacentHTML("beforeend", data))
    .catch(error => console.error('Error cargando las fuentes:', error));
};//loadContainers()

function resaltarNav(){
  const paginas = ["index.html","sobreNosotros.html","contactanos.html","nuestrosProductos.html","publicar.html","registro.html"];
  const index = paginas.indexOf(nombrePagina);
  if(index!==-1){
    const navFocus = navBar.getElementsByClassName("nav-item")[index].getElementsByTagName("a").item(0);
    navFocus.classList.add("active");
  }
};//resaltarNav()

//======================Sesión de usuario===============================
function inicioSesion(){
  const user = JSON.parse(session);
  if(!user)
    return;
  const navActionsContainer = document.getElementById("navActionsContainer");
  navActionsContainer.innerHTML=`
  <span class="usuario-bienvenida text-white">Bienvenido, ${user.nombre || "Usuario"}</span>
    <button type="button" id="btnCerrar" class="btns-log-ins text-white px-3 py-1 rounded-4 text-center"> Cerrar Sesión </button>
    <img src="${user.img||"https://i.pinimg.com/736x/8d/59/b0/8d59b077f0c018f985ff8babeec16220.jpg"}" alt="${user.user}" class="rounded-circle" width="40px" height="40px">
  `;
  document.getElementById("btnCerrar").addEventListener("click",cerrarSesion);
}//inicioSesion()

function cerrarSesion(event){
  event.preventDefault();
  sessionStorage.removeItem("usuarioActivo");
  window.location.href = "./index.html";
}//cerrarSesion()
//=================Productos por default=================================
if (!productosL) {
  fetch('./assets/documents/Productos.txt')
  .then(response => {
    if (!response.ok) throw new Error('No se pudo cargar el archivo');
    return response.text(); // Usamos text() porque es un archivo .txt
  })
  .then(text => {
    const data = JSON.parse(text);
    // Verifica si es un array
    if (Array.isArray(data)) {
      localStorage.setItem('productos', JSON.stringify(data));
      //console.log('Productos cargados correctamente al localStorage.');
      window.dispatchEvent(new Event('productosCargados'));
    } else {
      console.error('El archivo no contiene un array válido.');
    }
  })
  .catch(error => {
    console.error('Error al cargar o parsear el archivo:', error);
  });
  }
//==================Agregar Elementos al carrito=======================
function generateCarrito(){
  if(cart.length===0)
    return;
  updateCartUI();
}//generateCarrito()

//Boton de agregar en las tarjetas
function handleAddToCartClick(event) {
  const card = event.target.closest(".card");
  if (!card) return;
  const producto = {
     id: card.id,
     name: card.querySelector(".card-title").textContent.trim(),
     price: Number(card.querySelector("ul.list-group li").textContent.trim().replace(/[^0-9.-]+/g,"")),
     img: card.querySelector("img").src,
     quantity: 1
  }
  addToCart(producto);
}//handleAddToCartClick()

// Agregar producto al carrito
function addToCart(product) {
  //TODO: Cambiar a ID cuando exista en la base de datos
  const alreadyIn = cart.find(item => item.name === product.name);
  if(alreadyIn)
    alreadyIn.quantity++;
  else
    cart.push(product);

  updateCartUI();
}//addToCart()

// Eliminar producto del carrito
function removeFromCart(productId) {
  //TODO: Cambiar a id cuando exista
  cart = cart.filter(item => item.name !== productId);
  updateCartUI();
}//removeFromCart()

// Cambiar cantidad de un producto
function updateQuantity(event,name) {
  event.preventDefault();
  cart.find(prod=> prod.name = name).quantity = Number(event.target.value);
  updateCartUI();
}//updateQuantity()

// Actualizar contador y mostrar productos en modal
function updateCartUI() {
  localStorage.setItem("cart",JSON.stringify(cart));//Guarda el carrito

  const cartCountElem = document.getElementById("cart-count");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalElem = document.getElementById("cart-total");
  if (!cartCountElem || !cartItemsList || !cartTotalElem) 
    return;
  // Si alguno de los elementos no existe, evitar errores
    
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = cartCount;
  cartItemsList.innerHTML = "";

  
  cart.forEach(item => {
    

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white";

    li.innerHTML = `
      <div class="d-flex flex-grow-1 align-items-center gap-3">
        <img src="${item.img}" alt="${item.name}" style="width:50px; height:50px; object-fit: cover; border-radius:5px;">
        <div class="flex-grow-1">
          <strong>${item.name}</strong><br>
          Precio unitario: $${item.price.toFixed(2)}<br>
          Subtotal: $${(item.price * item.quantity).toFixed(2)}
        </div>
        <input type="number" min="1" value="${item.quantity}" style="width: 60px;" onchange="updateQuantity(event,'${item.name}');">
      </div>
      <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart('${item.name}')">&times;</button>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotalElem.textContent = cart.reduce((cuenta, prod) => cuenta + (prod.quantity*prod.price), 0).toFixed(2);
  
}//updateCartUI()


//--Dejar visible la funcion hacia el DOM 
window.handleAddToCartClick = handleAddToCartClick;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
//==================Event Listeners=====================================
document.addEventListener("DOMContentLoaded", loadContainers);

