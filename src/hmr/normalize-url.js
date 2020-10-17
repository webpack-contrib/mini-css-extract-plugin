/* eslint-disable */

function normalizeUrl(pathComponents) {
  var result = [];

  pathComponents.forEach((item) => {
    switch (item) {
      case '..':
        result.pop();
        break;
      case '.':
        break;
      default:
        result.push(item);
    }
  });

  return result.join('/');
}

var parseUrl = function (url) {
  var protocol =
    url.indexOf('//') !== -1 ? url.split('//')[0] + '//' : 'http://';
  var components = url.replace(new RegExp(protocol, 'i'), '').split('/');
  var host = components[0];

  components[0] = '';

  return {
    protocol: protocol,
    host: host.toLowerCase(),
    path: normalizeUrl(components),
  };
};

module.exports = function (urlString) {
  urlString = urlString.trim();

  if (/^data:/i.test(urlString)) {
    return urlString;
  }

  var hasRelativeProtocol =
    urlString.length > 2 && urlString[0] === '/' && urlString[1] === '/';

  var urlObj = parseUrl(urlString);

  var keepTrailingSlash = false;

  if (urlObj.path) {
    keepTrailingSlash = /\/$/i.test(urlString) && /\/$/i.test(urlObj.path);
  }

  if (urlObj.host) {
    urlObj.host = urlObj.host.replace(/\.$/, '');
  }

  urlString = urlObj.protocol + urlObj.host + urlObj.path;

  if (!keepTrailingSlash && urlObj.hash === '') {
    urlString = urlString.replace(/\/$/, '');
  }

  if (hasRelativeProtocol) {
    urlString = urlString.replace(/^http:\/\//, '//');
  }

  return urlString;
};
