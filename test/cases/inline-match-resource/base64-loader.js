module.exports = function base64Loader() {
  return Buffer.from(this.query.slice(1), 'base64').toString('ascii');
};
