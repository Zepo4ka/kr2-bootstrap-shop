const productKey = new URLSearchParams(window.location.search).get('product');
const selectedProduct = PRODUCTS.find((product) => product.id === productKey);
const productPage = document.querySelector('[data-product-page]');

if (productPage) {
  const product = selectedProduct || PRODUCTS[0];
  document.title = product.name + ' — ShopProject Bootstrap';
  document.querySelector('meta[name="description"]').content = product.description;
  const textFields = {
    title: product.name,
    crumb: product.name,
    description: product.description,
    category: product.category,
    price: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(product.price),
    color: product.color,
    material: product.material,
    purpose: product.purpose,
  };
  Object.entries(textFields).forEach(([field, text]) => {
    document.querySelectorAll('[data-product-' + field + ']').forEach((element) => {
      element.textContent = text;
    });
  });
  const image = productPage.querySelector('[data-product-image]');
  image.src = product.image;
  image.alt = product.name;
  productPage.querySelector('[data-product-order]').href = 'order.html?product=' + product.id;
}

const orderProduct = document.getElementById('order-product');
if (orderProduct && selectedProduct) {
  orderProduct.value = selectedProduct.id;
}

function clearFormState(form) {
  form.classList.remove('was-validated');
  Array.from(form.elements).forEach((field) => field.removeAttribute('aria-invalid'));
}

document.querySelectorAll('[data-request-form]').forEach((form) => {
  const message = document.querySelector(form.dataset.success);
  form.addEventListener('input', (event) => {
    message.classList.add('d-none');
    const field = event.target;
    if (field.willValidate && form.classList.contains('was-validated')) {
      if (field.validity.valid) field.removeAttribute('aria-invalid');
      else field.setAttribute('aria-invalid', 'true');
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.classList.add('d-none');
    Array.from(form.elements).forEach((field) => field.removeAttribute('aria-invalid'));
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      Array.from(form.elements).forEach((field) => {
        if (field.willValidate && !field.validity.valid) field.setAttribute('aria-invalid', 'true');
      });
      form.querySelector(':invalid')?.focus();
      return;
    }
    form.reset();
    clearFormState(form);
    const modal = form.closest('.modal');
    if (modal) bootstrap.Modal.getInstance(modal)?.hide();
    message.classList.remove('d-none');
  });
});

const quickOrderModal = document.getElementById('quickOrderModal');
if (quickOrderModal) {
  quickOrderModal.addEventListener('show.bs.modal', (event) => {
    const form = quickOrderModal.querySelector('form');
    form.reset();
    clearFormState(form);
    document.getElementById('quickSuccess').classList.add('d-none');
    const product = PRODUCTS.find((item) => item.id === event.relatedTarget?.dataset.product);
    document.getElementById('quick-product').value = product?.id || '';
  });
  quickOrderModal.addEventListener('hidden.bs.modal', () => {
    const form = quickOrderModal.querySelector('form');
    form.reset();
    clearFormState(form);
  });
}
