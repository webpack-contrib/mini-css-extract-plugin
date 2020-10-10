import normalizeErrors from './normalizeErrors';

export default (stats) => {
  return normalizeErrors(stats.compilation.errors);
};
