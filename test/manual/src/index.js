/* eslint-env browser */
/* global __webpack_public_path__ */
/* eslint-disable no-console, camelcase, no-global-assign */

import './initial.css';

const handleError = (err) => {
  document.querySelector('.errors').textContent += `\n${err.toString()}`;
  console.error(err);
};

const makeButton = (className, fn, shouldDisable = true) => {
  const button = document.querySelector(className);
  button.addEventListener('click', () => {
    if (shouldDisable) {
      button.disabled = true;
    }
    fn()
      .then(() => {
        button.disabled = false;
      })
      .catch(handleError);
  });
};

makeButton('.lazy-button', () => import('./lazy.js'));
makeButton('.lazy-button2', () => import('./lazy2.css'));

makeButton('.preloaded-button1', () =>
  import(/* webpackChunkName: "preloaded1" */ './preloaded1')
);
makeButton('.preloaded-button2', () =>
  import(/* webpackChunkName: "preloaded2" */ './preloaded2')
);

makeButton('.lazy-failure-button', () => import('./lazy-failure.js'), false);

makeButton('.crossorigin', () => {
  const originalPublicPath = __webpack_public_path__;
  __webpack_public_path__ = 'http://0.0.0.0:8080/dist/';
  const promise = import('./crossorigin').then(() => {
    const lastTwoElements = Array.from(document.head.children).slice(-2);
    const hasCrossorigin = lastTwoElements.every(
      (element) => element.crossOrigin === 'anonymous'
    );
    if (!hasCrossorigin) {
      throw new Error('Chunks miss crossorigin="anonymous" attribute.');
    }
  });
  __webpack_public_path__ = originalPublicPath;
  return promise;
});
