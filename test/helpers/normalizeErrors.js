/**
 * @param {string} str string
 * @returns {string} string without cwd
 */
function removeCWD(str) {
  const isWin = process.platform === "win32";
  let cwd = process.cwd();

  if (isWin) {
    str = str.replace(/\\/g, "/");

    cwd = cwd.replace(/\\/g, "/");
  }

  return str.replace(new RegExp(cwd, "g"), "");
}

export default (errors) =>
  errors.map((error) =>
    removeCWD(error.toString().split("\n").slice(0, 2).join("\n")),
  );
