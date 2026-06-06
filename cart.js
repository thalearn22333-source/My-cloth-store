// ANTI-DUPLICATE PROTECTION
if (!window.cartScriptLoaded) {
  // console.log("cart.js loaded");
  window.cartScriptLoaded = true;
}
// ====================== CORE ======================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document
    .querySelectorAll(".cart-count")
    .forEach((el) => (el.textContent = total));
}

function showToast(msg, type = "success") {
  let toast = document.getElementById("toast") || document.createElement("div");
  toast.id = "toast";
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 24px;border-radius:8px;color:white;z-index:9999;`;
  toast.style.background = type === "success" ? "#10b981" : "#ef4444";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ====================== IMPROVED ADD TO CART WITH VALIDATION ======================
function addToCart(name, price) {
  // === Strong Validation ===
  if (!name || typeof name !== "string" || name.trim() === "") {
    showToast("Product name is invalid!", "error");
    return;
  }
  if (!price || isNaN(price) || price <= 0) {
    showToast("Invalid product price!", "error");
    return;
  }

  let cart = getCart();
  const productName = name.trim();

  const existing = cart.find((item) => item.name === productName);

  if (existing) {
    // Max quantity limit = 10
    if (existing.qty >= 10) {
      showToast("Maximum 10 items allowed per product!", "error");
      return;
    }
    existing.qty += 1;
    showToast(`+1 ${productName} (Total: ${existing.qty})`);
  } else {
    cart.push({
      name: productName,
      price: parseFloat(price),
      qty: 1,
    });
    showToast(`${productName} added to cart`);
  }

  saveCart(cart);
  updateCartCount();
}

// ====================== RENDER CART ======================
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `<div class="text-center py-12 text-gray-500">Your cart is empty</div>`;
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    container.innerHTML += `
            <div class="cart-item bg-white p-4 mb-4 rounded shadow flex justify-between items-center" data-index="${i}">
                <div>
                    <h3 class="font-semibold">${item.name}</h3>
                    <p class="text-gray-600">$${Number(item.price).toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-4">
                    <button class="decrease-btn px-4 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                    <span class="w-6 text-center">${item.qty}</span>
                    <button class="increase-btn px-4 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                    <button class="remove-btn text-red-600 hover:text-red-700 ml-4">Remove</button>
                </div>
            </div>`;
  });

  if (totalEl) totalEl.textContent = "$" + total.toFixed(2);
}

// Event Delegation for + - Remove
function setupCartEvents() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;
    const index = parseInt(itemEl.dataset.index);

    let cart = getCart();

    if (e.target.classList.contains("increase-btn")) {
      if (cart[index] && cart[index].qty < 10) {
        cart[index].qty++;
      } else if (cart[index]) {
        showToast("Maximum 10 items allowed!", "error");
      }
    } else if (e.target.classList.contains("decrease-btn")) {
      if (cart[index]) {
        if (cart[index].qty > 1) cart[index].qty--;
        else cart.splice(index, 1);
      }
    } else if (e.target.classList.contains("remove-btn")) {
      if (cart[index]) cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
    updateCartCount();
  });
}

// Clear Cart
function clearCart() {
  if (confirm("Do you wanna Clear all cart?")) {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
    showToast("Cart cleared");
  }
}

// Print Product List
function printProductList() {
  const cart = getCart();
  if (cart.length === 0) return showToast("Cart is empty!", "error");

  // (Keep your current print function)
  let printContent = `<html><head><title>Product List</title><style>body{font-family:Arial;padding:30px;}table{width:100%;border-collapse:collapse;}th,td{padding:10px;border-bottom:1px solid #ddd;}</style></head><body><h1>Clothing Store - Product List</h1><table><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead><tbody>`;
  let total = 0;
  cart.forEach((item) => {
    const sub = item.price * item.qty;
    total += sub;
    printContent += `<tr><td>${item.name}</td><td>$${Number(item.price).toFixed(2)}</td><td>${item.qty}</td><td>$${sub.toFixed(2)}</td></tr>`;
  });
  printContent += `</tbody></table><h2 style="text-align:right;margin-top:30px;">Total: $${total.toFixed(2)}</h2></body></html>`;

  const win = window.open("");
  win.document.write(printContent);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

// ====================== INITIALIZE ======================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  if (document.getElementById("cartItems")) {
    renderCart();
    setupCartEvents();
  }

  // Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      if (!card) return;
      const name = card.querySelector(".product-name")?.textContent.trim();
      const priceStr = card.querySelector(".price")?.textContent || "";
      const price = parseFloat(priceStr.replace("$", "").trim());

      if (name && price) addToCart(name, price);
    });
  });
});
