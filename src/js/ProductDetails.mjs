import { getLocalStorage, setLocalStorage } from './utils.mjs';

// ProductDetails loads and renders a single product on the product detail page.
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    // Load product details by ID and render the page.
    if (!this.productId) {
      this.product = null;
      this.renderProductDetails();
      return;
    }

    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    const addToCartButton = document.getElementById('addToCart');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    // Add the current product to the local storage cart.
    if (!this.product) {
      return;
    }

    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    const container = document.getElementById('productDetail');
    if (!container) {
      return;
    }

    if (!this.product) {
      container.innerHTML = `
        <h2>Product not found</h2>
        <p>We could not find the requested item. Please return to the product list and try again.</p>
      `;
      return;
    }

    const brand = this.product.Brand?.Name || '';
    const title = this.product.NameWithoutBrand || this.product.Name || '';
    const imageSrc =
      this.product.Images?.PrimaryLarge ||
      this.product.Images?.PrimaryMedium ||
      this.product.Image ||
      '';
    const color = this.product.Colors?.[0]?.ColorName || '';
    const description = this.product.DescriptionHtmlSimple || '';
    const price = this.product.FinalPrice ?? this.product.ListPrice ?? 0;

    container.innerHTML = `
      <h3>${brand}</h3>
      <h2 class="divider">${title}</h2>
      <img
        class="divider"
        src="${imageSrc}"
        alt="${title}"
      />
      <p class="product-card__price">$${price.toFixed(2)}</p>
      <p class="product__color">${color}</p>
      <p class="product__description">${description}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
