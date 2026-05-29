// Initialize the category or search product listing page.
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam, renderBreadcrumb } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category') || 'tents';
const searchQuery = getParam('search');
const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');

// Map URL categories to display-friendly labels.
const categoryNames = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
};

const heading = document.querySelector('.products h2');
const sortSelect = document.getElementById('sort-by');

if (searchQuery) {
  if (heading) {
    heading.textContent = `Search Results: ${searchQuery}`;
  }
} else {
  const categoryLabel = categoryNames[category] || 'Products';
  if (heading) {
    heading.textContent = `Top Products: ${categoryLabel}`;
  }
}

const myList = new ProductList(category, dataSource, listElement, searchQuery);

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    myList.sortList(event.target.value);
  });
}

(async () => {
  const products = await myList.init();

  if (searchQuery) {
    renderBreadcrumb([
      { label: 'Search Results', current: false },
      { label: `${products.length} items`, current: true },
    ]);
  } else {
    const categoryLabel = categoryNames[category] || 'Products';
    renderBreadcrumb([
      { label: categoryLabel, current: false },
      { label: `${products.length} items`, current: true },
    ]);
  }
})();
