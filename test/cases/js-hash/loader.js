module.exports = function loader(source) {
  const { number } = this.query;
  return source.split(/\r?\n/)[number - 1];
};
