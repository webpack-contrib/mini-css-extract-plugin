/**
 * @param {string[]} pathComponents path components
 * @returns {string} normalized url
 */
function normalizeUrlInner(pathComponents) {
  return pathComponents
    .reduce((accumulator, item) => {
      switch (item) {
        case "..":
          accumulator.pop();
          break;
        case ".":
          break;
        default:
          accumulator.push(item);
      }

      return accumulator;
    }, /** @type {string[]} */ ([]))
    .join("/");
}

/**
 * @param {string} urlString url string
 * @returns {string} normalized url string
 */
module.exports = function normalizeUrl(urlString) {
  urlString = urlString.trim();

  if (/^data:/i.test(urlString)) {
    return urlString;
  }

  const protocol = urlString.includes("//")
    ? `${urlString.split("//")[0]}//`
    : "";
  const components = urlString
    .replace(new RegExp(protocol, "i"), "")
    .split("/");
  const host = components[0].toLowerCase().replace(/\.$/, "");

  components[0] = "";

  const path = normalizeUrlInner(components);

  return protocol + host + path;
};
