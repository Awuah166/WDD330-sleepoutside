import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

// CheckoutProcess manages the order summary calculation and final form submission.
export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.itemCount = 0;
    this.service = new ExternalServices();
  }

  init() {
    // Load cart items from local storage and show initial subtotal details.
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemCount = this.list.reduce((sum, item) => sum + Number(item.Quantity || 1), 0);
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = Number(item.FinalPrice ?? item.ListPrice ?? 0);
      return sum + price * Number(item.Quantity || 1);
    }, 0);

    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotal) {
      subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // Calculate tax, shipping, and order total using the current subtotal.
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.itemCount > 0 ? 10 + 2 * (this.itemCount - 1) : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // Render the calculated totals into the order summary section.
    const root = document.querySelector(this.outputSelector);
    if (!root) {
      return;
    }

    const taxElement = root.querySelector('#tax');
    const shippingElement = root.querySelector('#shipping');
    const orderTotalElement = root.querySelector('#orderTotal');

    if (taxElement) {
      taxElement.innerText = `$${this.tax.toFixed(2)}`;
    }
    if (shippingElement) {
      shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    }
    if (orderTotalElement) {
      orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  packageItems(items) {
    return (Array.isArray(items) ? items : []).map((item) => ({
      id: item.Id,
      name: item.Name || item.NameWithoutBrand || '',
      price: Number(item.FinalPrice ?? item.ListPrice ?? 0),
      quantity: Number(item.Quantity || 1),
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }

  async checkout(form) {
    if (!form || !form.checkValidity()) {
      form.reportValidity?.();
      return null;
    }

    this.calculateOrderTotal();

    const formValues = this.formDataToJSON(form);
    // Build the payload object using the exact keys the server expects.
    const orderPayload = {
      orderDate: new Date().toISOString(),
      fname: formValues.fname,
      lname: formValues.lname,
      street: formValues.street,
      city: formValues.city,
      state: formValues.state,
      zip: formValues.zip,
      cardNumber: formValues.cardNumber,
      expiration: formValues.expiration,
      code: formValues.code,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    const response = await this.service.checkout(orderPayload);
    return response;
  }
}
