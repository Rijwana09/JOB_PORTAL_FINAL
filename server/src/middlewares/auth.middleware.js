import jwt from "jsonwebtoken";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import { jwtConfig } from "../config/jwt.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    authHeader.startsWith("Bearer ")
  ) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      401,
      "Access token is required"
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      jwtConfig.accessSecret
    );
  } catch {
    throw new ApiError(
      401,
      "Invalid or expired access token"
    );
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(
      401,
      "User not found"
    );
  }

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  next();
});

export default protect;

// import jwt from "jsonwebtoken";

// import { jwtConfig } from "../config/jwt.js";

// const protect = (
//   req,
//   res,
//   next
// ) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith(
//       "Bearer"
//     )
//   ) {
//     token =
//       req.headers.authorization.split(
//         " "
//       )[1];
//   }

//   if (!token) {
//     return res.status(401).json({
//       message: "Unauthorized",
//     });
//   }

//   try {
//     req.user = jwt.verify(
//       token,
//       jwtConfig.accessSecret
//     );

//     next();
//   } catch {
//     return res.status(401).json({
//       message: "Invalid Token",
//     });
//   }
// };

// export default protect;