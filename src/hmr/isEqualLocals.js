function isEqualLocals(a, b) {
  if ((!a && b) || (a && !b)) {
    return false;
  }

  let p;

  for (p in a) {
    if (a[p] !== b[p]) {
      return false;
    }
  }

  for (p in b) {
    if (!a[p]) {
      return false;
    }
  }

  return true;
}

module.exports = isEqualLocals;
