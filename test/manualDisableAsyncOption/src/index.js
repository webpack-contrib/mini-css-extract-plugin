/* eslint-env browser */

import './a.css';
import './b.css';

const render = () => {
  const div = document.createElement('div');
  div.setAttribute('class', 'container');
  const text = 'My background color should be blue, and my text should be red!';
  div.innerHTML = text;
  document.body.appendChild(div);
};

render();
