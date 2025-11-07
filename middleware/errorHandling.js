const AppError = require("../utils/appError");

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

// final error handler
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    status: "error",
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
