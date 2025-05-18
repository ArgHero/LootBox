console.log("el scripy de carrito esta comentado");

/*
let cart = [];

// Agregar producto al carrito YA
function addToCart(product) {
  const indice = cart.findindice(item => item.id === product.id);
  if (indice !== -1) {
    cart[indice].quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

// Eliminar producto del carrito YA
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

// Cambiar cantidad de un producto YA
function updateQuantity(productId, quantity) {
  const indice = cart.findindice(item => item.id === productId);
  if (indice !== -1) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      cart[indice].quantity = quantity;
    }
    updateCartUI();
  }
}

// Actualizar contador y mostrar productos en modal YA
function updateCartUI() {
  const cartCountElem = document.getElementById("cart-count");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotalElem = document.getElementById("cart-total");

  if (!cartCountElem || !cartItemsList || !cartTotalElem) {
    // Si alguno de los elementos no existe, evitar errores
    return;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = cartCount;

  cartItemsList.innerHTML = "";

  let total = 0;
  cart.forEach(item => { YA
    total += item.price * item.quantity;

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
        <input type="number" min="1" value="${item.quantity}" style="width: 60px;" onchange="updateQuantity('${item.id}', parseInt(this.value))">
      </div>
      <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart('${item.id}')">&times;</button>
    `;

    cartItemsList.appendChild(li);
  });

  cartTotalElem.textContent = total.toFixed(2);
}

// Manejar click en botón agregar a carrito en cada card YA
function handleAddToCartClick(event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const id = card.id;
  const name = card.querySelector(".card-title").textContent.trim();
  const priceText = card.querySelector("ul.list-group li").textContent.trim();
  const price = parseFloat(priceText.replace(/[^0-9.-]+/g,""));
  const img = card.querySelector("img").src;

  addToCart({ id, name, price, img });
}

// Inicializar eventos en botones de agregar al carrito
function initAddToCartButtons() {
  document.querySelectorAll(".card button.btn-primary").forEach(btn => {
    btn.addEventListener("click", handleAddToCartClick);
  });
}

// Evento para botón comprar YA
document.addEventListener("DOMContentLoaded", () => {
  const buyButton = document.getElementById("buy-button");
  if (buyButton) {
    buyButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
      }
      if (confirm("¿Confirmas la compra?")) {
        cart = [];
        updateCartUI();
        const cartModalElem = document.getElementById("cartModal");
        if (cartModalElem) {
          const cartModal = new bootstrap.Modal(cartModalElem);
          cartModal.hide();
        }
        alert("¡Gracias por tu compra!");
      }
    });
  }

  updateCartUI();
  initAddToCartButtons();
});

*/