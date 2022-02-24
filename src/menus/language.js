import { con } from './rendermenu.js';
import { menus } from './menuoptions.js';

const selectLanguage = () => {
  const message = `${con()}{${menus.language.selectLanguage}}`;
  return message;
};
export default selectLanguage;