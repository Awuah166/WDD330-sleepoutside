// Base API URL loaded from Vite environment variables.
const baseURL = import.meta.env.VITE_SERVER_URL;

// Convert a fetch response to JSON, or throw when the response is not OK.
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error('Bad Response');
}

// ExternalServices handles API requests for product data and order submission.
export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(query) {
    const response = await fetch(`${baseURL}products/search/${encodeURIComponent(query)}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(orderPayload) {
    // Send the completed order to the backend as JSON.
    const response = await fetch('https://wdd330-backend.onrender.com:3000/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    return convertToJson(response);
  }
}
