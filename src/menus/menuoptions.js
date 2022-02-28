import store from 'store';
import { getStrings } from './language.js';
import { strings } from './strings.js';

const language = store.get('language');
console.log(language);
const menus = getStrings(strings, language);

export default menus;
