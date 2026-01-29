(() => {
  const API_BASE = "/api";

  // Small cache to map product IDs to names
  let productMap = {};

  function apiUrl(path) {
    if (!path.startsWith("/")) path = `/${path}`;
    return `${API_BASE}${path}`;
  }

  function setStatus(elId, html) {
    const el = document.getElementById(elId);
    if (el) el.innerHTML = html;
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }
    return res.json();
  }

  // --- 1. MASTER DATA SERVICE ---
  async function loadProducts() {
    const select = document.getElementById("orderSelect");

    try {
      const products = await fetchJson(apiUrl("/products"));

      select.innerHTML = '<option value="">-- Please select --</option>';
      productMap = {};

      products.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.text = `${p.name} (${p.description})`;
        select.appendChild(opt);

        productMap[p.id] = p.name;
      });

      await loadInventory();
    } catch (e) {
      console.error(e);
      select.innerHTML = "<option>Error: service unavailable</option>";
    }
  }

  async function createProduct() {
    const name = document.getElementById("prodName").value;
    const desc = document.getElementById("prodDesc").value;

    if (!name) {
      alert("Name is required!");
      return;
    }

    try {
      const res = await fetch(apiUrl("/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, description: desc })
      });

      if (res.ok) {
        setStatus("prodStatus", '<span class="text-success">✔ Product created!</span>');
        document.getElementById("prodName").value = "";
        await loadProducts();
      } else {
        setStatus("prodStatus", '<span class="text-error">Error while saving.</span>');
      }
    } catch (e) {
      console.error(e);
      setStatus("prodStatus", '<span class="text-error">Service not reachable.</span>');
    }
  }

  // --- 2. ORDER SERVICE ---
  async function placeOrder() {
    const prodId = document.getElementById("orderSelect").value;
    const qty = document.getElementById("orderAmount").value;

    if (!prodId) {
      alert("Please select a product!");
      return;
    }

    try {
      const res = await fetch(apiUrl("/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: prodId, quantity: parseInt(qty, 10) })
      });

      if (res.ok) {
        setStatus("orderStatus", '<span class="text-success">✔ Order sent!</span>');
        setTimeout(loadInventory, 500);
      } else {
        setStatus("orderStatus", '<span class="text-error">Order failed.</span>');
      }
    } catch (e) {
      console.error(e);
      setStatus("orderStatus", '<span class="text-error">Order service offline?</span>');
    }
  }

  // --- 3. INVENTORY SERVICE ---
  async function loadInventory() {
    const tbody = document.getElementById("inventoryTable");

    try {
      const items = await fetchJson(apiUrl("/inventory"));

      tbody.innerHTML = "";

      if (!items || items.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="4" style="text-align:center">Inventory is empty.</td></tr>';
        return;
      }

      items.forEach((item) => {
        const productName = productMap[item.productId] || "Unknown product";

        tbody.innerHTML += `
          <tr>
            <td><strong>${productName}</strong></td>
            <td><small style="color:#999">${item.productId}</small></td>
            <td>${item.quantity} units</td>
            <td>
              <button class="btn-delete" onclick="deleteItem('${item.productId}')">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    } catch (e) {
      console.error(e);
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-error">Error: Could not load inventory.</td></tr>';
    }
  }

  async function deleteItem(id) {
    if (!confirm("Really delete this item?")) return;

    try {
      await fetch(apiUrl(`/inventory/${id}`), { method: "DELETE" });
      await loadInventory();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  }

  // Make functions available to inline onclick handlers in index.html
  window.loadProducts = loadProducts;
  window.createProduct = createProduct;
  window.placeOrder = placeOrder;
  window.loadInventory = loadInventory;
  window.deleteItem = deleteItem;

  // Initial load
  document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
  });
})();