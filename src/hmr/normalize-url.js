/* eslint-disable */

function testParameter(name, filters) {
  return filters.some(function (filter) {
    return filter instanceof RegExp ? filter.test(name) : filter === name;
  });
}

module.exports = function (urlString, options) {
  var normalizeOptions = Object.assign(
    {},
    {
      defaultProtocol: 'http:',
      normalizeProtocol: true,
      forceHttp: false,
      forceHttps: false,
      stripAuthentication: true,
      stripHash: false,
      stripWWW: true,
      removeQueryParameters: [/^utm_\w+/i],
      removeTrailingSlash: true,
      removeSingleSlash: true,
      removeDirectoryIndex: false,
      sortQueryParameters: true,
    },
    options
  );

  urlString = urlString.trim();

  // Data URL
  if (/^data:/i.test(urlString)) {
    return urlString;
  }

  var hasRelativeProtocol =
    urlString.length > 2 && urlString[0] === '/' && urlString[1] === '/';
  var isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

  // Prepend protocol
  if (!isRelativeUrl) {
    // eslint-disable-next-line no-param-reassign
    urlString = urlString.replace(
      /^(?!(?:\w+:)?\/\/)|^\/\//,
      normalizeOptions.defaultProtocol
    );
  }

  var urlObj = new URL(urlString);

  // Remove auth
  if (normalizeOptions.stripAuthentication) {
    urlObj.username = '';
    urlObj.password = '';
  }

  // Remove hash
  if (normalizeOptions.stripHash) {
    urlObj.hash = '';
  }

  // Remove duplicate slashes if not preceded by a protocol
  if (urlObj.pathname) {
    urlObj.pathname = urlObj.pathname.replace(
      /(?<!\b(?:[a-z][a-z\d+\-.]{1,50}:))\/{2,}/g,
      '/'
    );
  }

  // Decode URI octets
  if (urlObj.pathname) {
    try {
      urlObj.pathname = decodeURI(urlObj.pathname);
      // eslint-disable-next-line no-empty
    } catch (_) {}
  }

  if (urlObj.hostname) {
    // Remove trailing dot
    urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

    // Remove `www.`
    if (
      normalizeOptions.stripWWW &&
      /^www\.(?!www\.)(?:[a-z\-\d]{1,63})\.(?:[a-z.\-\d]{2,63})$/.test(
        urlObj.hostname
      )
    ) {
      urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
    }
  }

  // Remove query unwanted parameters
  if (Array.isArray(normalizeOptions.removeQueryParameters)) {
    for (var key in Array.from(urlObj.searchParams.keys())) {
      if (testParameter(key, normalizeOptions.removeQueryParameters)) {
        urlObj.searchParams.delete(key);
      }
    }
  }

  // Sort query parameters
  if (normalizeOptions.sortQueryParameters) {
    urlObj.searchParams.sort();
  }

  if (normalizeOptions.removeTrailingSlash) {
    urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
  }

  var oldUrlString = urlString;

  // Take advantage of many of the Node `url` normalizations
  urlString = urlObj.toString();

  if (
    !normalizeOptions.removeSingleSlash &&
    urlObj.pathname === '/' &&
    oldUrlString.indexOf('/') !== oldUrlString.length - 1 &&
    urlObj.hash === ''
  ) {
    urlString = urlString.replace(/\/$/, '');
  }

  // Remove ending `/` unless removeSingleSlash is false
  if (
    (normalizeOptions.removeTrailingSlash || urlObj.pathname === '/') &&
    urlObj.hash === '' &&
    normalizeOptions.removeSingleSlash
  ) {
    urlString = urlString.replace(/\/$/, '');
  }

  // Restore relative protocol, if applicable
  if (hasRelativeProtocol && !normalizeOptions.normalizeProtocol) {
    // eslint-disable-next-line no-param-reassign
    urlString = urlString.replace(/^http:\/\//, '//');
  }

  return urlString;
};
