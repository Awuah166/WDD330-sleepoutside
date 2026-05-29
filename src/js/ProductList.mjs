// Utility helper that renders a list using a provided template function.
import { renderListWithTemplate } from './utils.mjs';

// Build a single product card's HTML for the product list page.
function productCardTemplate(product) {
  const mediumImage =
    product.Images?.PrimaryMedium ||
    product.Images?.PrimarySmall ||
    product.Image ||
    '';
  const largeImage =
    product.Images?.PrimaryLarge ||
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
      <picture>
        <source media="(min-width: 700px)" srcset="${largeImage}" />
        <img
          src="${mediumImage}"
          alt="${productName}"
        />
      </picture>
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">$${price.toFixed(2)}</p>
      ${isDiscounted ? `<p class="product-card__discount">Save $${discountAmount.toFixed(2)}</p>` : ''}
    </a>
  </li>`;
}

// ProductList renders products into a list element for the selected category.
export default class ProductList {
  constructor(category, dataSource, listElement, searchQuery = '') {
    this.category = category;
    this.searchQuery = searchQuery;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.list = [];
    this.sortBy = 'default';
  }

  async init() {
    const list = this.searchQuery
      ? await this.dataSource.searchProducts(this.searchQuery)
      : await this.dataSource.getData(this.category);

    this.list = Array.isArray(list) ? list : [];
    this.renderList(this.list);
    return this.list;
  }

  sortList(sortBy) {
    this.sortBy = sortBy;
    this.renderList(this.list);
  }

  renderList(list) {
    const sortedList = [...list];

    if (this.sortBy === 'name') {
      sortedList.sort((a, b) => (a.NameWithoutBrand || a.Name || '').localeCompare(b.NameWithoutBrand || b.Name || ''));
    }

    if (this.sortBy === 'price') {
      sortedList.sort((a, b) => (Number(a.FinalPrice ?? a.ListPrice ?? 0)) - (Number(b.FinalPrice ?? b.ListPrice ?? 0)));
    }

    this.listElement.innerHTML = '';
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      sortedList,
      'afterbegin',
      true
    );
  }
}
