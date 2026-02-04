const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const adminSection = document.getElementById('admin-section');
const adminMessage = document.getElementById('admin-message');
const productsTable = document.getElementById('products-table');
const addProductBtn = document.getElementById('add-product');
const logoutBtn = document.getElementById('logout');

const modal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const productForm = document.getElementById('product-form');
const productMessage = document.getElementById('product-message');
const uploadBtn = document.getElementById('upload-btn');
const uploadPreview = document.getElementById('upload-preview');
const uploadPreviewImg = uploadPreview.querySelector('img');
const passwordForm = document.getElementById('password-form');
const passwordMessage = document.getElementById('password-message');
const currentPasswordInput = document.getElementById('current-password');
const newPasswordInput = document.getElementById('new-password');

const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productCategoryInput = document.getElementById('product-category');
const productDescriptionInput = document.getElementById('product-description');
const productImageUrlInput = document.getElementById('product-image-url');
const productImageFileInput = document.getElementById('product-image-file');

const state = {
  products: [],
  mode: 'add'
};

function showMessage(target, message, type = 'error') {
  if (!target) return;
  if (!message) {
    target.textContent = '';
    target.className = 'message';
    target.hidden = true;
    return;
  }
  target.textContent = message;
  target.className = `message ${type}`;
  target.hidden = false;
}

function showFormMessage(message, isError = true) {
  productMessage.textContent = message || '';
  productMessage.style.color = isError ? '#dc2626' : '#16a34a';
}

function showPasswordMessage(message, isError = true) {
  if (!passwordMessage) return;
  passwordMessage.textContent = message || '';
  passwordMessage.style.color = isError ? '#dc2626' : '#16a34a';
}

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  return response;
}

async function checkSession() {
  try {
    const response = await apiFetch('/api/admin/me', { method: 'GET' });
    if (!response.ok) return false;
    const data = await response.json();
    return !!data.success;
  } catch (error) {
    return false;
  }
}

function showAdmin() {
  loginSection.hidden = true;
  adminSection.hidden = false;
}

function showLogin() {
  loginSection.hidden = false;
  adminSection.hidden = true;
}

function resetForm() {
  productForm.reset();
  productIdInput.readOnly = false;
  uploadPreview.hidden = true;
  uploadPreviewImg.src = '';
  showFormMessage('');
}

function openModal(mode, product = null) {
  state.mode = mode;
  resetForm();

  if (mode === 'edit' && product) {
    modalTitle.textContent = 'Edit Product';
    productIdInput.value = product.id;
    productIdInput.readOnly = true;
    productNameInput.value = product.name || '';
    productPriceInput.value = product.price || '';
    productCategoryInput.value = product.category || '';
    productDescriptionInput.value = product.description || '';
    productImageUrlInput.value = product.image_url || '';
    if (product.image_url) {
      uploadPreviewImg.src = product.image_url;
      uploadPreview.hidden = false;
    }
  } else {
    modalTitle.textContent = 'Add Product';
  }

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

function renderProducts() {
  productsTable.innerHTML = '';
  if (!state.products.length) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="6">No products yet.</td>';
    productsTable.appendChild(emptyRow);
    return;
  }

  state.products.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>SGD $${Number(product.price || 0).toFixed(2)}</td>
      <td>${product.category || '-'}</td>
      <td>
        ${product.image_url ? `<img class="product-image" src="${product.image_url}" alt="${product.name}">` : '-'}
      </td>
      <td>
        <div class="actions">
          <button class="action-btn" data-action="edit" data-id="${product.id}">Edit</button>
          <button class="action-btn delete" data-action="delete" data-id="${product.id}">Delete</button>
        </div>
      </td>
    `;
    productsTable.appendChild(row);
  });
}

async function loadProducts() {
  try {
    const response = await apiFetch('/api/admin/products', { method: 'GET' });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to load products');
    }
    state.products = data.products || [];
    renderProducts();
  } catch (error) {
    showMessage(adminMessage, error.message || 'Failed to load products', 'error');
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.textContent = '';

  const formData = new FormData(loginForm);
  const payload = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const response = await apiFetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    showAdmin();
    await loadProducts();
  } catch (error) {
    loginMessage.textContent = error.message || 'Login failed';
  }
});

logoutBtn.addEventListener('click', async () => {
  await apiFetch('/api/admin/logout', { method: 'POST' });
  showLogin();
});

addProductBtn.addEventListener('click', () => openModal('add'));
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

productsTable.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  const product = state.products.find((item) => item.id === id);

  if (action === 'edit' && product) {
    openModal('edit', product);
  }

  if (action === 'delete' && product) {
    if (!confirm(`Delete ${product.name}?`)) return;
    deleteProduct(product.id);
  }
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showFormMessage('');

  const payload = {
    id: productIdInput.value.trim(),
    name: productNameInput.value.trim(),
    price: parseFloat(productPriceInput.value || '0'),
    category: productCategoryInput.value.trim(),
    description: productDescriptionInput.value.trim(),
    image_url: productImageUrlInput.value.trim()
  };

  if (!payload.id || !payload.name || Number.isNaN(payload.price)) {
    showFormMessage('Please fill in ID, name, and price.');
    return;
  }

  try {
    const method = state.mode === 'edit' ? 'PUT' : 'POST';
    const response = await apiFetch('/api/admin/products', {
      method,
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Save failed');
    }

    closeModal();
    await loadProducts();
    showMessage(adminMessage, 'Product saved successfully.', 'success');
  } catch (error) {
    showFormMessage(error.message || 'Save failed');
  }
});

async function deleteProduct(id) {
  try {
    const response = await apiFetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Delete failed');
    }
    await loadProducts();
    showMessage(adminMessage, 'Product deleted.', 'success');
  } catch (error) {
    showMessage(adminMessage, error.message || 'Delete failed', 'error');
  }
}

uploadBtn.addEventListener('click', async () => {
  showFormMessage('');
  const file = productImageFileInput.files[0];
  if (!file) {
    showFormMessage('Please choose an image file to upload.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showFormMessage('File is too large. Max 10MB.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    productImageUrlInput.value = data.url;
    uploadPreviewImg.src = data.url;
    uploadPreview.hidden = false;
    showFormMessage('Upload complete.', false);
  } catch (error) {
    showFormMessage(error.message || 'Upload failed');
  }
});

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showPasswordMessage('');

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  if (!currentPassword || !newPassword) {
    showPasswordMessage('Please fill both password fields.');
    return;
  }

  if (newPassword.length < 8) {
    showPasswordMessage('New password must be at least 8 characters.');
    return;
  }

  try {
    const response = await apiFetch('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Password update failed');
    }
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    showPasswordMessage('Password updated successfully.', false);
  } catch (error) {
    showPasswordMessage(error.message || 'Password update failed');
  }
});

(async () => {
  const loggedIn = await checkSession();
  if (loggedIn) {
    showAdmin();
    loadProducts();
  } else {
    showLogin();
  }
})();
