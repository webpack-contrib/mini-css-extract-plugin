/* global document */
/*
  eslint-disable
  no-console,
  func-names
*/

// eslint-disable-next-line jsdoc/no-restricted-syntax
/** @typedef {any} TODO */

const normalizeUrl = require("./normalize-url");

const srcByModuleId = Object.create(null);

const noDocument = typeof document === "undefined";

const { forEach } = Array.prototype;

// eslint-disable-next-line jsdoc/no-restricted-syntax
/**
 * @param {Function} fn any function
 * @param {number} time time
 * @returns {() => void} wrapped function
 */
function debounce(fn, time) {
  let timeout = 0;

  return function () {
    // @ts-expect-error
    const self = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line func-style
    const functionCall = function functionCall() {
      return fn.apply(self, args);
    };

    clearTimeout(timeout);

    // @ts-expect-error
    timeout = setTimeout(functionCall, time);
  };
}

/**
 * @returns {void}
 */
function noop() {}

/**
 * @param {string | number} moduleId a module id
 * @returns {TODO} current script url
 */
function getCurrentScriptUrl(moduleId) {
  let src = srcByModuleId[moduleId];

  if (!src) {
    if (document.currentScript) {
      ({ src } = /** @type {HTMLScriptElement} */ (document.currentScript));
    } else {
      const scripts = document.getElementsByTagName("script");
      const lastScriptTag = scripts[scripts.length - 1];

      if (lastScriptTag) {
        ({ src } = lastScriptTag);
      }
    }

    srcByModuleId[moduleId] = src;
  }

  /**
   * @param {string} fileMap file map
   * @returns {null | string[]} normalized files
   */
  return function (fileMap) {
    if (!src) {
      return null;
    }

    const splitResult = src.split(/([^\\/]+)\.js$/);
    const filename = splitResult && splitResult[1];

    if (!filename) {
      return [src.replace(".js", ".css")];
    }

    if (!fileMap) {
      return [src.replace(".js", ".css")];
    }

    return fileMap.split(",").map((mapRule) => {
      const reg = new RegExp(`${filename}\\.js$`, "g");

      return normalizeUrl(
        src.replace(reg, `${mapRule.replace(/{fileName}/g, filename)}.css`),
      );
    });
  };
}

/**
 * @param {string} url url
 * @returns {boolean} true when is url can be requested, otherwise false
 */
function isUrlRequest(url) {
  // An URL is not an request if

  // It is not http or https
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
    return false;
  }

  return true;
}

/**
 * @param {TODO} el html link element
 * @param {string=} url a URL
 */
function updateCss(el, url) {
  if (!url) {
    if (!el.href) {
      return;
    }

    // eslint-disable-next-line
    url = el.href.split("?")[0];
  }

  if (!isUrlRequest(/** @type {string} */ (url))) {
    return;
  }

  if (el.isLoaded === false) {
    // We seem to be about to replace a css link that hasn't loaded yet.
    // We're probably changing the same file more than once.
    return;
  }

  if (!url || !url.includes(".css")) {
    return;
  }

  el.visited = true;

  const newEl = el.cloneNode();

  newEl.isLoaded = false;

  newEl.addEventListener("load", () => {
    if (newEl.isLoaded) {
      return;
    }

    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });

  newEl.addEventListener("error", () => {
    if (newEl.isLoaded) {
      return;
    }

    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });

  newEl.href = `${url}?${Date.now()}`;

  if (el.nextSibling) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  } else {
    el.parentNode.appendChild(newEl);
  }
}

/**
 * @param {string} href href
 * @param {TODO} src src
 * @returns {undefined | string} a reload url
 */
function getReloadUrl(href, src) {
  let ret;

  href = normalizeUrl(href);

  src.some(
    /**
     * @param {string} url url
     */
    // eslint-disable-next-line array-callback-return
    (url) => {
      if (href.includes(src)) {
        ret = url;
      }
    },
  );

  return ret;
}

/**
 * @param {string=} src source
 * @returns {boolean} true when loaded, otherwise false
 */
function reloadStyle(src) {
  if (!src) {
    return false;
  }

  const elements = document.querySelectorAll("link");
  let loaded = false;

  forEach.call(elements, (el) => {
    if (!el.href) {
      return;
    }

    const url = getReloadUrl(el.href, src);

    if (url && !isUrlRequest(url)) {
      return;
    }

    if (el.visited === true) {
      return;
    }

    if (url) {
      updateCss(el, url);

      loaded = true;
    }
  });

  return loaded;
}

/**
 * @returns {void}
 */
function reloadAll() {
  const elements = document.querySelectorAll("link");

  forEach.call(elements, (el) => {
    if (el.visited === true) {
      return;
    }

    updateCss(el);
  });
}

/**
 * @param {number | string} moduleId a module id
 * @param {TODO} options options
 * @returns {TODO} wrapper function
 */
module.exports = function (moduleId, options) {
  if (noDocument) {
    console.log("no window.document found, will not HMR CSS");

    return noop;
  }

  const getScriptSrc = getCurrentScriptUrl(moduleId);

  /**
   * @returns {void}
   */
  function update() {
    const src = getScriptSrc(options.filename);
    const reloaded = reloadStyle(src);

    if (options.locals) {
      console.log("[HMR] Detected local css modules. Reload all css");

      reloadAll();

      return;
    }

    if (reloaded) {
      console.log("[HMR] css reload %s", src.join(" "));
    } else {
      console.log("[HMR] Reload all css");

      reloadAll();
    }
  }

  return debounce(update, 50);
};
