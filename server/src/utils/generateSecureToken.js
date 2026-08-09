import crypto from "crypto";

const generateSecureToken = (size = 32) => {
  const token = crypto.randomBytes(size).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return {
    token,
    hashedToken,
  };
};

export default generateSecureToken;