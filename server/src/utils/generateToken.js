import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export const generateAccessToken = (user) => {

    console.log(
    "Access secret exists:",
    !!jwtConfig.accessSecret
  );

  console.log(
    "Access token expiration:",
    jwtConfig.accessExpire
  );


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