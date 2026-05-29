import {
  getCartItems,
  renderListWithTemplate,
  setLocalStorage,
  updateCartCount,
} from './utils.mjs';

export function calculateCartTotal(items) {
  return items.reduce((total, item) => {
    const price = Number(item.FinalPrice ?? item.ListPrice ?? 0);
    return total + price;
  }, 0);
}

// Builds the HTML for a cart item using the provided item data.
function cartItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimarySmall ||
    item.Image ||
    '';

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
  <p class='cart-card__quantity'>qty: 1</p>
  <p class='cart-card__price'>$${Number(item.FinalPrice ?? item.ListPrice ?? 0).toFixed(2)}</p>
</li>`;
}

// This class displays the items in the shopping cart.
export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;

    if (this.listElement) {
      this.listElement.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-id]');

        if (!removeButton) {
          return;
        }

        event.preventDefault();
        this.removeItem(removeButton.dataset.id);
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
