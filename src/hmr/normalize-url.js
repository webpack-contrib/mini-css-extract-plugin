/* eslint-disable */

module.exports = function (urlString) {
  var defaultProtocol = 'http:';

  urlString = urlString.trim();

  if (/^data:/i.test(urlString)) {
    return urlString;
  }

  var hasRelativeProtocol =
    urlString.length > 2 && urlString[0] === '/' && urlString[1] === '/';
  var isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

  if (!isRelativeUrl) {
    urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, defaultProtocol);
  }

  var urlObj = new URL(urlString);

  var keepTrailingSlash = false;

  // Remove duplicate slashes if not preceded by a protocol
  if (urlObj.pathname) {
    urlObj.pathname = urlObj.pathname.replace(
      /(?<!\b(?:[a-z][a-z\d+\-.]{1,50}:))\/{2,}/g,
      '/'
    );

    keepTrailingSlash = /\/$/i.test(urlString) && /\/$/i.test(urlObj.pathname);
  }

  if (urlObj.hostname) {
    urlObj.hostname = urlObj.hostname.replace(/\.$/, '');
  }

  // Take advantage of many of the Node `url` normalizations
  urlString = urlObj.toString();

  if (!keepTrailingSlash && urlObj.hash === '') {
    urlString = urlString.replace(/\/$/, '');
  }

  if (hasRelativeProtocol) {
    urlString = urlString.replace(/^http:\/\//, '//');
  }

  return urlString;
};
