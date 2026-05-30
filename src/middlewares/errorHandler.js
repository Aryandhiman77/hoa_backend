const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message;
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({
      success: false,
      message: `'${field}' must be unique.`,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
  if (err?.code === "LIMIT_FILE_COUNT") {
    return res.status(409).json({
      success: false,
      message: `Cannot upload more than 10 files.`,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size too large.",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
export default errorHandler;
