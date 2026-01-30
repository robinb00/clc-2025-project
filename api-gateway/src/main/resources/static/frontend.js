// Small cache to map product IDs to names
let productMap = {};

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

// --- 1. MASTER DATA SERVICE ---
async function loadProducts() {
  const select = document.getElementById('orderSelect');

  try {
    const res = await fetch('/products');
    if (!res.ok) throw new Error("Could not load products");

    const products = await res.json();

    select.innerHTML = '<option value="">-- Please select --</option>';
    productMap = {};

    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.text = `${p.name} (${p.description})`;
      select.appendChild(opt);

      productMap[p.id] = p.name;
    });

    loadInventory();

  } catch (e) {
    console.error(e);
    select.innerHTML = '<option>Error: service unavailable</option>';
  }
}

async function createProduct() {
  const name = document.getElementById('prodName').value;
  const desc = document.getElementById('prodDesc').value;
  const status = document.getElementById('prodStatus');

  if (!name) {
    alert("Name is required!");
    return;
  }

  try {
    const res = await fetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, description: desc })
    });

    if (res.ok) {
      status.innerHTML = '<span class="text-success">✔ Product created!</span>';
      document.getElementById('prodName').value = '';
      loadProducts();

      // Clear message after 3 seconds
      setTimeout(() => { status.innerHTML = ''; }, 3000);
    } else {
      status.innerHTML = '<span class="text-error">Error while saving.</span>';
    }

  } catch (e) {
    status.innerHTML = '<span class="text-error">Service not reachable.</span>';
  }
}

// --- 2. ORDER SERVICE ---
async function placeOrder() {
  const prodId = document.getElementById('orderSelect').value;
  const qty = document.getElementById('orderAmount').value;
  const status = document.getElementById('orderStatus');

  if (!prodId) {
    alert("Please select a product!");
    return;
  }

  try {
    const res = await fetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: prodId, quantity: parseInt(qty) })
    });

    if (res.ok) {
      status.innerHTML = '<span class="text-success">✔ Order sent!</span>';
      setTimeout(loadInventory, 500);

      // Clear message after 3 seconds
      setTimeout(() => { status.innerHTML = ''; }, 3000);
    } else {
      status.innerHTML = '<span class="text-error">Order failed.</span>';
    }

  } catch (e) {
    status.innerHTML = '<span class="text-error">Order service offline?</span>';
  }
}

// --- 3. INVENTORY SERVICE ---
async function loadInventory() {
  const tbody = document.getElementById('inventoryTable');

  try {
    const res = await fetch('/inventory');
    const items = await res.json();

    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML =
              '<tr><td colspan="3" style="text-align:center">Inventory is empty.</td></tr>';
      return;
    }

    items.forEach(item => {
      const productName = productMap[item.productId] || "Unknown product";

      tbody.innerHTML += `
        <tr>
          <td><strong>${productName}</strong></td>
          <td>${item.quantity}</td>
          <td>
            <button class="btn-delete" onclick="deleteItem('${item.productId}')">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

  } catch (e) {
    tbody.innerHTML =
            '<tr><td colspan="3" class="text-error">Error: Could not load inventory.</td></tr>';
  }
}

async function deleteItem(id) {
  if (!confirm("Really delete this item?")) return;

  try {
    await fetch(`/inventory/${id}`, { method: 'DELETE' });
    loadInventory();
  } catch (e) {
    alert("Delete failed");
  }
}
async function simulateError(code) {
  const statusDiv = document.getElementById('testErrorStatus');
  statusDiv.style.display = 'block';
  statusDiv.innerHTML = '<small style="color:var(--muted)">Request pending...</small>';

  try {
    const res = await fetch(`/orders/test-error?type=${code}`, { method: 'POST' });

    const time = new Date().toLocaleTimeString();

    if (res.ok) {
      statusDiv.className = 'lab-success';
      statusDiv.innerHTML = `✅ <strong>${res.status}</strong> (OK) - ${time}`;
    } else {
      statusDiv.className = 'lab-error';
      statusDiv.innerHTML = `🔥 <strong>${res.status} ${res.statusText}</strong> triggered at ${time}`;
    }

  } catch (e) {
    statusDiv.className = 'lab-error';
    statusDiv.innerHTML = `❌ <strong>Network Error</strong>: Is the backend running?`;
  }
}

