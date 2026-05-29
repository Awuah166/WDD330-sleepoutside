// Utility helper that renders a list using a provided template function.
import { renderListWithTemplate } from './utils.mjs';

// Build a single product card's HTML for the product list page.
function productCardTemplate(product) {
  const imageSrc =
    product.Images?.PrimaryMedium ||
    product.Images?.PrimarySmall ||
    product.Image ||
    '';
  const brandName = product.Brand?.Name || '';
  const productName = product.NameWithoutBrand || product.Name || '';
  const price = Number(product.FinalPrice ?? product.ListPrice ?? 0);
  const suggestedPrice = Number(product.SuggestedRetailPrice ?? price);
  const discountAmount = suggestedPrice - price;
  const isDiscounted = discountAmount > 0;

  return `<li class="product-card${isDiscounted ? ' product-card--discounted' : ''}">
    <a href="/product_pages/?product=${product.Id}">
      <img
        src="${imageSrc}"
        alt="${productName}"
      />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">$${price.toFixed(2)}</p>
      ${isDiscounted ? `<p class="product-card__discount">Save $${discountAmount.toFixed(2)}</p>` : ''}
    </a>
  </li>`;
}

// ProductList renders products into a list element for the selected category.
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

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
