/* eslint-disable no-return-assign */
/* eslint-disable import/no-cycle */
import { con } from './rendermenu.js';
import { strings } from './strings.js';

const selectLanguage = () => `${con()} ${strings.language.en}`;
export const getStrings = (string, lang) => {
  const res = {};
  Object.entries(string).forEach(
    ([key, value]) => (res[`${key}`] = !value[`${lang}`] && typeof value === 'object'
      ? getStrings(value, lang)
      : value[`${lang}`]),
  );
  return res;
};

export default selectLanguage;
