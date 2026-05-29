// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const storedData = localStorage.getItem(key);

  if (storedData === null) {
    return [];
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.warn(`Unable to parse localStorage value for ${key}`, error);
    return [];
  }
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCartItems() {
  const cartItems = getLocalStorage('so-cart');
  return Array.isArray(cartItems) ? cartItems : [];
}

export function updateCartCount() {
  const cartCounts = document.querySelectorAll('.cart-count');
  const cartItems = getCartItems();

  cartCounts.forEach((countElement) => {
    countElement.textContent = cartItems.length;
    countElement.setAttribute('aria-label', `${cartItems.length} items in cart`);
  });
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
  return product;
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false
) {
  const htmlStrings = list.map(templateFn);

  if (clear) {
    parentElement.innerHTML = '';
  }

  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  const html = typeof template === 'function' ? template(data) : template;

  parentElement.innerHTML = html;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load template: ${path}`);
  }

  return await response.text();
}

export async function loadHeaderFooter() {
  const headerHtml = await loadTemplate('/partials/header.html');
  const footerHtml = await loadTemplate('/partials/footer.html');

  const headerElement = document.querySelector('#header');
  const footerElement = document.querySelector('#footer');

  if (headerElement) {
    renderWithTemplate(headerHtml, headerElement);
    updateCartCount();
  }

  if (footerElement) {
    renderWithTemplate(footerHtml, footerElement);
  }
}
