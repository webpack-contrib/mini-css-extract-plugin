module.exports = function loader() {
  const callback = this.async();
  callback(new Error('I am error'));
};
