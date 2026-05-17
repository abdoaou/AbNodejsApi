/**
 * Converts :named placeholders (MySQL-style) to PostgreSQL $1, $2, …
 * @param {string} sql
 * @param {object} params
 */
function toNamedPg(sql, params = {}) {
  const order = [];
  const text = sql.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, name) => {
    if (!Object.prototype.hasOwnProperty.call(params, name)) {
      throw new Error(`Missing SQL parameter: ${name}`);
    }
    if (!order.includes(name)) {
      order.push(name);
    }
    const index = order.indexOf(name) + 1;
    return `$${index}`;
  });
  const values = order.map((name) => params[name]);
  return { text, values };
}

module.exports = { toNamedPg };
