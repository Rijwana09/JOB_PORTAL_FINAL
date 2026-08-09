
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import hashToken from "../utils/hashToken.js";

import { jwtConfig } from "../config/jwt.js";

import emailService from "../services/email.service.js";

import generateSecureToken from "../utils/generateSecureToken.js";

class AuthService {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  async register(userData) {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate secure verification token
  const { token, hashedToken } = generateSecureToken();

  // Store only the hashed token
  user.verificationToken = hashedToken;

  // Token valid for 24 hours
  user.verificationTokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await user.save();

  // Build verification URL
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Send verification email
  await emailService.sendVerificationEmail({
    email: user.email,
    name: user.name,
    verificationUrl,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  async login({ email, password }) {
    const user = await User.findOne({ email }).select(
      "+password +refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isVerified) {
      throw new ApiError(
        403,
        "Please verify your email before logging in."
      );
    }


    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      hashToken(refreshToken);

    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    };
  }

  /*
|--------------------------------------------------------------------------
| Verify Email
|--------------------------------------------------------------------------
*/

  async verifyEmail(token) {
    if (!token) {
      throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,
    }).select("+verificationToken");

    if (!user) {
      throw new ApiError(400, "Invalid verification token");
    }

    if (
      !user.verificationTokenExpiresAt ||
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new ApiError(400, "Verification token has expired");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email is already verified");
    }

    user.isVerified = true;

    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };
  }

  /*
|--------------------------------------------------------------------------
| Resend Verification Email
|--------------------------------------------------------------------------
*/

async resendVerificationEmail(email) {
  const genericMessage =
    "If an unverified account with that email exists, a verification email has been sent.";

  const user = await User.findOne({ email });

  /*
  |--------------------------------------------------------------------------
  | Prevent Email Enumeration
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return {
      message: genericMessage,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Already Verified
  |--------------------------------------------------------------------------
  */

  if (user.isVerified) {
    return {
      message: genericMessage,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Generate New Verification Token
  |--------------------------------------------------------------------------
  */

  const { token, hashedToken } =
    generateSecureToken();

  user.verificationToken = hashedToken;

  user.verificationTokenExpiresAt =
    new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

  await user.save();

  /*
  |--------------------------------------------------------------------------
  | Build Verification URL
  |--------------------------------------------------------------------------
  */

  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  /*
  |--------------------------------------------------------------------------
  | Send Verification Email
  |--------------------------------------------------------------------------
  */

  try {
    await emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationUrl,
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Roll Back Token If Email Fails
    |--------------------------------------------------------------------------
    */

    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save();

    throw error;
  }

  return {
    message: genericMessage,
  };
}

  /*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

async forgotPassword(email) {
  const user = await User.findOne({ email });

  /*
  |--------------------------------------------------------------------------
  | Prevent Email Enumeration
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Generate Secure Reset Token
  |--------------------------------------------------------------------------
  */

  const { token, hashedToken } =
    generateSecureToken();

  user.passwordResetToken = hashedToken;

  user.passwordResetTokenExpiresAt =
    new Date(
      Date.now() + 60 * 60 * 1000
    );

  await user.save();

  /*
  |--------------------------------------------------------------------------
  | Build Reset URL
  |--------------------------------------------------------------------------
  */

  const resetUrl =
    `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  /*
  |--------------------------------------------------------------------------
  | Send Email
  |--------------------------------------------------------------------------
  */

  await emailService.sendForgotPasswordEmail({
    email: user.email,
    name: user.name,
    resetUrl,
  });

  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
}



  /*
  |--------------------------------------------------------------------------
  | Refresh Access Token
  |--------------------------------------------------------------------------
  */

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        jwtConfig.refreshSecret
      );
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id).select(
      "+refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const hashedToken = hashToken(refreshToken);

    if (user.refreshToken !== hashedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken =
      generateAccessToken(user);

    const newRefreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      hashToken(newRefreshToken);

    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

   /*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

async resetPassword(token, newPassword) {
  if (!token) {
    throw new ApiError(
      400,
      "Password reset token is required"
    );
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresAt: {
      $gt: new Date(),
    },
  }).select(
    "+passwordResetToken +password"
  );

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired password reset token"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Password
  |--------------------------------------------------------------------------
  */

  user.password = newPassword;

  /*
  |--------------------------------------------------------------------------
  | Clear Password Reset Token
  |--------------------------------------------------------------------------
  */

  user.passwordResetToken = null;
  user.passwordResetTokenExpiresAt = null;

  /*
  |--------------------------------------------------------------------------
  | Invalidate Existing Refresh Token
  |--------------------------------------------------------------------------
  |
  | This prevents an old session from continuing to refresh
  | access tokens after the password has been changed.
  |
  */

  user.refreshToken = null;
  user.refreshTokenExpiresAt = null;

  await user.save();

  return {
    id: user._id,
    email: user.email,
  };
}

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

async changePassword(userId, currentPassword, newPassword) {
  if (!userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const user = await User.findById(userId).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Current Password
  |--------------------------------------------------------------------------
  */

  const isCurrentPasswordCorrect =
    await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    throw new ApiError(
      400,
      "Current password is incorrect"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent Same Password
  |--------------------------------------------------------------------------
  */

  const isSamePassword =
    await user.comparePassword(newPassword);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from current password"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Password
  |--------------------------------------------------------------------------
  */

  user.password = newPassword;

  /*
  |--------------------------------------------------------------------------
  | Invalidate Refresh Token
  |--------------------------------------------------------------------------
  */

  user.refreshToken = null;
  user.refreshTokenExpiresAt = null;

  await user.save();

  return {
    id: user._id,
    email: user.email,
  };
}


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  async logout(userId) {
    const user = await User.findById(userId).select(
      "+refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = null;

    await user.save();

    return true;
  }
}

export default new AuthService();
