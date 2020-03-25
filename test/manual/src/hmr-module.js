/* eslint-env browser */
import style from './hmr-module.module.css';

export default function hmrBootstrap() {
  // should not log again if only css changed
  console.log('load');
  document.querySelector('.hmr-a').classList.add(style.a);
}
