// Load shared page chrome such as the site header and footer.
import { loadHeaderFooter } from './utils.mjs';
import Alert from './Alert.js';

loadHeaderFooter();

const alert = new Alert();
alert.init();
