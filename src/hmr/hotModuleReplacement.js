const normalizeUrl = require('normalize-url');

const srcByModuleId = Object.create(null);

const noDocument = typeof document === 'undefined';

function debounce(fn, time) {
  let timeout;

  // eslint-disable-next-line func-names
  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}

const forEach = Array.prototype.forEach;

function noop() {}

function getCurrentScriptUrl(moduleId) {
  let src = srcByModuleId[moduleId];

  if (!src) {
    if (document.currentScript) {
      src = document.currentScript.src;
    } else {
      const scripts = document.getElementsByTagName('script');
      const lastScriptTag = scripts[scripts.length - 1];

      if (lastScriptTag) {
        src = lastScriptTag.src;
      }
    }
    srcByModuleId[moduleId] = src;
  }

  return function(fileMap) {
    const splitResult = /([^\\/]+)\.js$/.exec(src);
    const filename = splitResult && splitResult[1];
    if (!filename) {
      return [src.replace('.js', '.css')];
    }
    return fileMap.split(',').map(mapRule => {
      const reg = new RegExp(`${filename}\\.js$`, 'g');
      return normalizeUrl(
        src.replace(reg, `${mapRule.replace(/{fileName}/g, filename)}.css`),
        { stripWWW: false }
      );
    });
  };
}

function updateCss(el, url) {
  if (!url) {
    url = el.href.split('?')[0];
  }
  if (el.isLoaded === false) {
    // We seem to be about to replace a css link that hasn't loaded yet.
    // We're probably changing the same file more than once.
    return;
  }
  if (!url || !(url.indexOf('.css') > -1)) return;

  el.visited = true;
  const newEl = el.cloneNode();

  newEl.isLoaded = false;

  newEl.addEventListener('load', () => {
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });

  newEl.addEventListener('error', () => {
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });

  newEl.href = `${url}?${Date.now()}`;
  el.parentNode.appendChild(newEl);
}

function getReloadUrl(href, src) {
  href = normalizeUrl(href, { stripWWW: false });
  let ret;
  // eslint-disable-next-line array-callback-return
  src.some(url => {
    if (href.indexOf(src) > -1) {
      ret = url;
    }
  });
  return ret;
}

function reloadStyle(src) {
  const elements = document.querySelectorAll('link');
  let loaded = false;

  forEach.call(elements, el => {
    if (el.visited === true) return;

    const url = getReloadUrl(el.href, src);
    if (url) {
      updateCss(el, url);
      loaded = true;
    }
  });

  return loaded;
}

function reloadAll() {
  const elements = document.querySelectorAll('link');
  forEach.call(elements, el => {
    if (el.visited === true) return;
    updateCss(el);
  });
}

module.exports = function(moduleId, options) {
  if (noDocument) {
    return noop;
  }

  const getScriptSrc = getCurrentScriptUrl(moduleId);

  function update() {
    const src = getScriptSrc(options.fileMap);
    const reloaded = reloadStyle(src);
    if (reloaded && !options.reloadAll) {
      console.log('[HMR] css reload %s', src.join(' '));
    } else {
      console.log('[HMR] Reload all css');
      reloadAll();
    }
  }

  return debounce(update, 10);
};
