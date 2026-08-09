import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwtConfig.accessSecret,
    {
      expiresIn: jwtConfig.accessExpire,
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpire,
    }
  );
};