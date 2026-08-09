import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert unknown errors into ApiError
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // MongoDB duplicate key error
    if (error.code === 11000) {
      statusCode = 409;

      const field = Object.keys(error.keyValue)[0];

      message = `${field} already exists`;
    }

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${error.path}`;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      statusCode = 400;

      message = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");
    }

    error = new ApiError(statusCode, message);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
  };

  if (error.errors?.length) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;