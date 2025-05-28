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

//Carga contenidos compartidos entre páginas
function loadContainers(){
  fetch(navPath)
    .then(response => response.text())
    .then(data => {
      navBar.innerHTML = data;
      document.body.style.marginTop = "7rem";
      resaltarNav();
      inicioSesion();
      generateCarrito();
      buyProducts();
    })
    .catch(error => console.error('Error cargando el navbar:', error));
  fetch(footPath)
    .then(response => response.text())
    .then(data => cuerpo.innerHTML = data)
    .catch(error => console.error('Error cargando el footer:', error));
  formatoPagina();
};//loadContainers()

function resaltarNav(){
  const paginas = ["index.html","sobreNosotros.html","contactanos.html","nuestrosProductos.html","publicar.html","registro.html"];
  const index = paginas.indexOf(nombrePagina);
  if(index!==-1){
    const navFocus = navBar.getElementsByClassName("nav-item")[index].getElementsByTagName("a").item(0);
    navFocus.classList.add("active");
  }
};//resaltarNav()

//Dependencias empleadas en todas las páginas
function formatoPagina(){
  document.head.insertAdjacentHTML("beforeend",`
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Alumni+Sans+Collegiate+One:ital@0;1&family=Galindo&family=Irish+Grover&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
    crossorigin="anonymous"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
  <link rel="stylesheet" href="./styles/styles.css" />
  <link rel="icon" type="image/png" href="./assets/icons/favicon-lootbox.png" />
    `);
  cargarScriptCDN("https://cdn.jsdelivr.net/npm/sweetalert2@11");
  cargarScriptCDN("https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js");
  
}//formatoPagina()

function cargarScriptCDN(url) {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    document.body.appendChild(script); // También puedes usar document.body.appendChild(script);
}


//======================Sesión de usuario===============================
function inicioSesion(){
  const user = JSON.parse(session);
  if(!user)
    return;
  const navActionsContainer = document.getElementById("navActionsContainer");
  const primerNombre = (user.nombre || "Usuario").split(" ")[0];

  navActionsContainer.innerHTML=`
  <span class="usuario-bienvenida text-white">Bienvenido, ${primerNombre}</span>
    <button type="button" id="btnCerrar" class="btns-log-ins text-white px-3 py-1 rounded-4 text-center"> Cerrar Sesión </button>
    <img src="${user.img||"https://i.pinimg.com/736x/8d/59/b0/8d59b077f0c018f985ff8babeec16220.jpg"}" alt="${user.user}" class="rounded-circle" width="40px" height="40px">
  `;
  document.getElementById("btnCerrar").addEventListener("click",cerrarSesion);
if (user.isAdmin === true) {
    const publicarNavItem = document.getElementById("nav-publicar");
    if (publicarNavItem) publicarNavItem.style.display = "block";
  }
  
}//inicioSesion

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
  event.target.classList.add("animado");
  setTimeout(() => {
        event.target.classList.remove("animado");
    }, 500);



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
  //consigue el item que se esta borrando 
  const item = cart.find(item => item.name === productId);
  cart = cart.filter(item => item.name !== productId);
  let mensaje = "";
  if(item.quantity >1) mensaje = `Se han eliminado ${item.quantity} ${item.name} de tu carrito.`
  else  mensaje = `Se ha eliminado ${item.name} de tu carrito.`
  Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: mensaje
        });
  updateCartUI();
}//removeFromCart()

// Cambiar cantidad de un producto
function updateQuantity(event,name) {
  event.preventDefault();
  cart.find(prod=> prod.name === name).quantity = Number(event.target.value);
  updateCartUI();
}//updateQuantity()

// Actualizar contador y mostrar productos en modal
function updateCartUI() {
  localStorage.setItem("cart",JSON.stringify(cart));//Guarda el carrito

  const cartCountElem = document.getElementById("cart-count");
  const cartCountMobileElem = document.getElementById("cart-count-mobile");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalElem = document.getElementById("cart-total");
  if (!cartCountElem || !cartItemsList || !cartTotalElem) 
    return;
  // Si alguno de los elementos no existe, evitar errores
    
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = cartCount;
  if (cartCountMobileElem) cartCountMobileElem.textContent = cartCount; 
  
  cartItemsList.innerHTML = "";

  
  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white";

    li.innerHTML = `
      <div class="d-flex flex-grow-1 align-items-center gap-3">
        <img src="${item.img}" alt="${item.name}" style="width:50px; height:50px; object-fit: cover; border-radius:5px;">
        <div class="flex-grow-1">
          <span style="color: var(--sky);">${item.name}</span><br>
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

//Boton comprar
function buyProducts() {
  const buyButton = document.getElementById("buy-button");

  if (buyButton) {
    buyButton.addEventListener("click", () => {

       if (!session) {
        Swal.fire({
          icon: "warning",
          title: "¡No iniciaste sesión!",
          text: "Debes iniciar sesión antes de comprar.", 
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "./sesion.html"; 
          }
        });
        return;
      }

      if (cart.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tu carrito está vacío",
          text: "Agrega productos antes de comprar"
        });
        return;
      }

      Swal.fire({
        title: "¿Confirmas la compra?",
        text: "Tu pedido será procesado",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, comprar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          cart = [];
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartUI();

          const cartModalElem = document.getElementById("cartModal");
          if (cartModalElem) {
            const modalInstance = bootstrap.Modal.getInstance(cartModalElem) || new bootstrap.Modal(cartModalElem);
            modalInstance.hide();
          }

          Swal.fire({
            icon: "success",
            title: "¡Gracias por tu compra!",
            text: "Tu pedido fue procesado exitosamente."
          });
        }
      });
    });
  }
}//buyProducts

//--Dejar visible la funcion hacia el DOM 
window.handleAddToCartClick = handleAddToCartClick;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;
//==================Event Listeners=====================================
document.addEventListener("DOMContentLoaded", loadContainers);
window.addEventListener("load",()=>document.getElementById("pantalla-carga").style.display = "none");

