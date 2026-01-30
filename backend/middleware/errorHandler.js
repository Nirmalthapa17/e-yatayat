// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max 1 MB allowed.' });
  }
  return res.status(500).json({ message: err.message || 'Server Error' });
};
