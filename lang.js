import strings from "./src/menus/strings.js";

const getStrings = (string, lang) => {
  const res = {};
  Object.entries(string).forEach(
    ([key, value]) =>
      (res[key] =
        !value[lang] && typeof value === "object"
          ? getStrings(value, lang)
          : value[lang])
  );
  return res;
};
const translations = getStrings(strings, "sw");
