// Initialize the category product listing page.
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category') || 'tents';
const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');

// Map URL categories to display-friendly labels.
const categoryNames = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
};

const categoryLabel = categoryNames[category] || 'Products';
const heading = document.querySelector('.products h2');
if (heading) {
  heading.textContent = `Top Products: ${categoryLabel}`;
}

const myList = new ProductList(category, dataSource, listElement);
myList.init();
