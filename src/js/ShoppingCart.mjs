import { getLocalStorage, renderListWithTemplate, renderWithTemplate } from './utils.mjs';

// Builds the HTML for a cart item using the provided item data.
function cartItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimarySmall ||
    item.Image ||
    '';

  return `<li class='cart-card divider'>
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
  <p class='cart-card__price'>$${item.FinalPrice}</p>
</li>`;
}

// This class displays the items in the shopping cart.
export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
  }

  async init() {
    const items = getLocalStorage('so-cart') || [];
    this.renderList(items);
  }

  // Display the cart items in the list element.
  renderList(list) {
    if (!this.listElement) return;

    // Show empty cart message if no items
    if (!list || list.length === 0) {
      renderWithTemplate('<p>Your cart is empty.</p>', this.listElement);
      return;
    }

    // Render cart items using the template
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      list,
      'afterbegin',
      true
    );
  }
}
