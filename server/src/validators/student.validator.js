import { body } from "express-validator";

export const updateStudentProfileValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage(
      "Name must be between 2 and 50 characters"
    )
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(
      "Name can contain only letters and spaces"
    ),
];

// import { body } from "express-validator";

// export const updateStudentProfileValidation = [

//   body("name")
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage("Name cannot be empty")
//     .isLength({
//       min: 2,
//       max: 50,
//     })
//     .withMessage(
//       "Name must be between 2 and 50 characters"
//     )
//     .matches(/^[A-Za-z\s]+$/)
//     .withMessage(
//       "Name can contain only letters and spaces"
//     ),

//   body("email")
//     .optional()
//     .trim()
//     .normalizeEmail()
//     .isEmail()
//     .withMessage(
//       "Please enter a valid email address"
//     ),
// ];