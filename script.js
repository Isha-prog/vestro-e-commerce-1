// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Simple cart state
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

// Helper to open/close cart
function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

// Add to cart
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

clearCartBtn.addEventListener("click", clearCart);

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {

  return;
  }
    window.location.href = "payment.html";
  // alert("This is a demo checkout. In a real site, payment would happen here.");
});

// Render cart UI
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartCountEl.textContent = "0";
    cartTotalEl.textContent = "0";
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>Qty: ${item.qty} · ₹${item.price}</span>
      </div>
      <button class="cart-item-remove" aria-label="Remove ${item.name}">
        Remove
      </button>
    `;

    row.querySelector(".cart-item-remove").addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartItemsContainer.appendChild(row);
  });

  cartCountEl.textContent = count;
  cartTotalEl.textContent = total.toLocaleString("en-IN");
  checkoutBtn.disabled = false;
}

// Attach listeners to product buttons
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = {
      id: Number(btn.dataset.id),
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      // we read the image from the card so we don't repeat URLs
      image: btn
        .closest(".product-card")
        .querySelector("img")
        .getAttribute("src"),
    };
    addToCart(product);
    openCart();
  });
});
