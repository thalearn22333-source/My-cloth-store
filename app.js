document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // MOBILE HAMBURGER MENU (Works on all pages)
  // =====================
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      menuBtn.textContent = mobileMenu.classList.contains("hidden")
        ? "☰"
        : "✕";
    });
  }

  // =====================
  // FILTER (Only on home page)
  // =====================
  const productSelect = document.getElementById("product");
  const productSelectMobile = document.getElementById("productMobile");
  const products = document.querySelectorAll(".product-card");

  function filterProducts(value) {
    if (products.length === 0) return;
    products.forEach((product) => {
      const match =
        value === "allProducts" || product.dataset.category === value;
      product.style.display = match ? "block" : "none";
    });
  }

  if (productSelect) {
    productSelect.addEventListener("change", (e) =>
      filterProducts(e.target.value),
    );
  }
  if (productSelectMobile) {
    productSelectMobile.addEventListener("change", (e) =>
      filterProducts(e.target.value),
    );
  }

  // =====================
  // SEARCH (Only on home page)
  // =====================
  const searchInput = document.getElementById("searchInput");
  const searchInputMobile = document.getElementById("searchInputMobile");

  function handleSearch(keyword) {
    if (products.length === 0) return;
    const lower = keyword.toLowerCase();
    products.forEach((product) => {
      const name = product
        .querySelector(".product-name")
        .textContent.toLowerCase();
      product.style.display = name.includes(lower) ? "block" : "none";
    });
  }

  if (searchInput)
    searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
  if (searchInputMobile)
    searchInputMobile.addEventListener("input", (e) =>
      handleSearch(e.target.value),
    );
});
