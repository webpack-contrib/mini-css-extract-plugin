/* eslint-env browser */

let theme = "light";

document.onclick = () => {
  // eslint-disable-next-line no-console
  console.log("CHANGE THEME");

  if (theme === "light") {
    theme = "dark";
  } else {
    theme = "light";
  }

  const themeElement = document.querySelector("#theme");

  if (themeElement) {
    themeElement.remove();
  }

  const linkElement = document.createElement("link");

  linkElement.type = "text/css";
  linkElement.rel = "stylesheet";
  linkElement.href = `${theme}-theme.css`;

  document.getElementsByTagName("head")[0].appendChild(linkElement);
};
