const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

module.exports = {
  errorHandler
};