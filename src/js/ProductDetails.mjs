import { getCartItems, renderBreadcrumb, setLocalStorage, updateCartCount } from './utils.mjs';

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

    const cartItems = getCartItems();
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.Quantity = Number(existingItem.Quantity || 1) + 1;
    } else {
      cartItems.push({ ...this.product, Quantity: 1 });
    }

    setLocalStorage('so-cart', cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    const container = document.getElementById('productDetail') || document.querySelector('.product-detail');
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
    const mediumImage =
      this.product.Images?.PrimaryMedium ||
      this.product.Images?.PrimarySmall ||
      this.product.Image ||
      '';
    const largeImage =
      this.product.Images?.PrimaryLarge ||
      mediumImage;
    const color = this.product.Colors?.[0]?.ColorName || '';
    const description = this.product.DescriptionHtmlSimple || '';
    const price = Number(this.product.FinalPrice ?? this.product.ListPrice ?? 0);
    const suggestedPrice = Number(this.product.SuggestedRetailPrice ?? price);
    const discountAmount = suggestedPrice - price;
    const isDiscounted = discountAmount > 0;

    renderBreadcrumb([
      { label: 'Products', current: false },
      { label: title, current: true },
    ]);

    container.innerHTML = `
      <h3>${brand}</h3>
      <h2 class="divider">${title}</h2>
      <picture class="divider">
        <source media="(min-width: 700px)" srcset="${largeImage}" />
        <img
          src="${mediumImage}"
          alt="${title}"
        />
      </picture>
      <p class="product-card__price">$${price.toFixed(2)}</p>
      ${isDiscounted ? `<p class="product-detail__discount">Discounted — Save $${discountAmount.toFixed(2)}</p>` : ''}
      <p class="product__color">${color}</p>
      <p class="product__description">${description}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
