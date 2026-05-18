// Import a helper function that displays a list of items on the page.
import { renderListWithTemplate } from './utils.mjs';

// Builds the HTML for one product card.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img
        src="${product.Image}"
        alt="${product.NameWithoutBrand}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
    </a>
  </li>`;
}

// This class gets product data and displays it in the product list.
export default class ProductList {
  // Save the category, data source, and HTML element for later use.
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  // Get the product data, then render it on the page.
  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  // Display the product cards inside the list element.
  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true
    );
  }
}
