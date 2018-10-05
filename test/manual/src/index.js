import './initial.css';

const handleError = (err) => {
  document.querySelector(".errors").textContent += `\n${err.toString()}`;
  console.error(err);
}

const makeButton = (className, fn, shouldDisable = true) => {
  const button = document.querySelector(className);
  button.addEventListener("click", () => {
    if(shouldDisable) {
      button.disabled = true;
    }
    fn().then(() => {
      button.disabled = false;
    }).catch(handleError);
  });
}

makeButton(".lazy-button", () => import('./lazy.js'));
makeButton(".lazy-button2", () => import('./lazy2.css'));

makeButton(".preloaded-button1", () => import(/* webpackChunkName: "preloaded1" */ './preloaded1'));
makeButton(".preloaded-button2", () => import(/* webpackChunkName: "preloaded2" */ './preloaded2'));

makeButton(".lazy-failure-button", () => import('./lazy-failure.js'), false);
