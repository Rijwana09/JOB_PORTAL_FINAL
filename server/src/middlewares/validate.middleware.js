import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
    value: error.value,
  }));

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: formattedErrors,
  });
};

export default validate;