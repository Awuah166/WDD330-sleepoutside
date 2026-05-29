import {
  getCartItems,
  renderListWithTemplate,
  setLocalStorage,
  updateCartCount,
} from './utils.mjs';

export function calculateCartTotal(items) {
  return items.reduce((total, item) => {
    const price = Number(item.FinalPrice ?? item.ListPrice ?? 0);
    const quantity = Number(item.Quantity || 1);
    return total + price * quantity;
  }, 0);
}

// Builds the HTML for a cart item using the provided item data.
function cartItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimarySmall ||
    item.Image ||
    '';
  const quantity = Number(item.Quantity || 1);

  return `<li class='cart-card divider'>
  <button class='cart-card__remove' data-id='${item.Id}' aria-label='Remove ${item.Name} from cart'>X</button>
  <a href='#' class='cart-card__image'>
    <img
      src='${imageSrc}'
      alt='${item.Name}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors?.[0]?.ColorName || ''}</p>
  <p class='cart-card__quantity'>
    <span class='cart-card__quantity-label'>qty:</span>
    <button class='cart-quantity-button cart-quantity-button--decrease' data-id='${item.Id}' data-action='decrease' aria-label='Decrease quantity for ${item.Name}'>-</button>
    <span class='cart-quantity-value'>${quantity}</span>
    <button class='cart-quantity-button cart-quantity-button--increase' data-id='${item.Id}' data-action='increase' aria-label='Increase quantity for ${item.Name}'>+</button>
  </p>
  <p class='cart-card__price'>$${(Number(item.FinalPrice ?? item.ListPrice ?? 0) * quantity).toFixed(2)}</p>
</li>`;
}

// This class displays the items in the shopping cart.
export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;

    if (this.listElement) {
      this.listElement.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.cart-card__remove');
        const quantityButton = event.target.closest('.cart-quantity-button');

        if (removeButton) {
          event.preventDefault();
          this.removeItem(removeButton.dataset.id);
          return;
        }

        if (quantityButton) {
          event.preventDefault();
          const direction = quantityButton.dataset.action === 'increase' ? 1 : -1;
          this.updateQuantity(quantityButton.dataset.id, direction);
        }
      });
    }
  }

  async init() {
    const items = getCartItems();
    this.renderList(items);
  }

  removeItem(itemId) {
    const items = getCartItems().filter((item) => item.Id !== itemId);
    setLocalStorage('so-cart', items);
    this.renderList(items);
    updateCartCount();
  }

  updateQuantity(itemId, change) {
    const items = getCartItems().map((item) => {
      if (item.Id !== itemId) {
        return item;
      }

      const newQuantity = Number(item.Quantity || 1) + change;

      if (newQuantity <= 0) {
        return null;
      }

      return {
        ...item,
        Quantity: newQuantity,
      };
    }).filter(Boolean);

    setLocalStorage('so-cart', items);
    this.renderList(items);
    updateCartCount();
  }

  // Display the cart items in the list element.
  renderList(list) {
    if (!this.listElement) return;

    const cartFooter = document.querySelector('.cart-footer');
    const cartTotal = document.querySelector('.cart-total');

    if (!Array.isArray(list) || list.length === 0) {
      this.listElement.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';

      if (cartFooter) {
        cartFooter.classList.add('hide');
      }

      if (cartTotal) {
        cartTotal.textContent = 'Total: ';
      }

      return;
    }

    this.listElement.innerHTML = '';

    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      list,
      'afterbegin',
      true
    );

    const total = calculateCartTotal(list);

    if (cartFooter) {
      cartFooter.classList.remove('hide');
    }

    if (cartTotal) {
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
  }
}
