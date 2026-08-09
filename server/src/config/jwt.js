import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET,

  refreshSecret: process.env.JWT_REFRESH_SECRET,

  accessExpire:
    process.env.ACCESS_TOKEN_EXPIRE,

  refreshExpire:
    process.env.REFRESH_TOKEN_EXPIRE,
};