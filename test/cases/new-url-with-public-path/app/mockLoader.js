export default function loader() {
  const callback = this.async();

  callback(
    null,
    `export default [
      [0, ".foo {background: url(" + new URL("./img.png", import.meta.url) + ")}", ""],
      [1, ".bar {background: url(" + new URL("../outer-img.png", import.meta.url) + ")}", ""],
      [2, ".baz {background: url(" + new URL("./nested/nested-img.png", import.meta.url) + ")}", ""]
  ]`
  );
}
