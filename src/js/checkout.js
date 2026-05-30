import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load shared header and footer content for the page.
loadHeaderFooter();

// Initialize the checkout process logic using stored cart data.
const checkout = new CheckoutProcess('so-cart', '#orderSummary');
checkout.init();

const form = document.getElementById('checkoutForm');
if (form) {
  // Prevent default form submission so we can validate and POST via JavaScript.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    await checkout.checkout(form);
  });

  // Recalculate totals when the zip code is entered or changed.
  const zipInput = form.querySelector('[name="zip"]');
  zipInput?.addEventListener('blur', () => {
    checkout.calculateOrderTotal();
  });
}
