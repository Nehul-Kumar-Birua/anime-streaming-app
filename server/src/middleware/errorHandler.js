module.exports = (err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  const statusCode = err.statusCode || err.response?.status || 500;
  const message = err.message || 'Internal Server Error';

  // Check if it's an API error from the external service
  if (err.response?.data) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message: err.response.data.message || message,
        details: err.response.data,
        url: req.url
      }
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      url: req.url,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
