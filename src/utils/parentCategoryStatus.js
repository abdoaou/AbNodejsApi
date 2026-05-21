/** Map API status strings to DB boolean (parent_categories.status). */
function toDbStatus(status) {
  if (status === false || status === 0 || status === '0' || status === 'inactive' || status === 'false') {
    return false;
  }
  return true;
}

function fromDbStatus(status) {
  if (status === true || status === 'true' || status === 't' || status === 1 || status === '1') {
    return 'active';
  }
  if (status === false || status === 'false' || status === 'f' || status === 0 || status === '0') {
    return 'inactive';
  }
  if (status === 'active' || status === 'inactive') {
    return status;
  }
  return status ? 'active' : 'inactive';
}

function formatParentRow(row) {
  if (!row) return row;
  return { ...row, status: fromDbStatus(row.status) };
}

module.exports = { toDbStatus, fromDbStatus, formatParentRow };
