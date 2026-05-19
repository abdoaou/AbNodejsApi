const { body } = require('express-validator');

/** JSON `image`: URL string, null, or "" (clears image). File upload still takes priority. */
const imageUrlRule = body('image')
  .optional({ nullable: true })
  .custom((value) => {
    if (value === null || value === '') {
      return true;
    }
    if (typeof value !== 'string') {
      throw new Error('Image must be a URL string or empty');
    }
    if (value.trim().length > 512) {
      throw new Error('Image URL must be at most 512 characters');
    }
    return true;
  });

module.exports = { imageUrlRule };
