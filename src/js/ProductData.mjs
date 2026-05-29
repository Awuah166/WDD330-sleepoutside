// Base API URL loaded from Vite environment variables.
const baseURL = import.meta.env.VITE_SERVER_URL;

// Convert a fetch response to JSON, or throw when the response is not OK.
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error('Bad Response');
}

// Data source for retrieving product information from the API.
export default class ProductData {
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
}
