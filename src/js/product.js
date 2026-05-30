// Initialize the product detail page, loading the requested product from the API.
// This page shows the selected product and enables adding it to the cart.
import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();

const productId = getParam('product');
const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init();
