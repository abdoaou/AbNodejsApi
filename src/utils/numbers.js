function toNumber(value, fallback = null) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

module.exports = { toNumber };
