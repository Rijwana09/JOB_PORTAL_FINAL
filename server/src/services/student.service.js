import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

import ROLES from "../constants/roles.js";

class StudentService {

  /*
  |--------------------------------------------------------------------------
  | Get Student Profile
  |--------------------------------------------------------------------------
  */

  async getProfile(userId) {
    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (user.role !== ROLES.STUDENT) {
      throw new ApiError(
        403,
        "Student access required"
      );
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Student Profile
  |--------------------------------------------------------------------------
  */

  async updateProfile(userId, data) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (user.role !== ROLES.STUDENT) {
      throw new ApiError(
        403,
        "Student access required"
      );
    }

    const { name, email } = data;

    /*
    |--------------------------------------------------------------------------
    | Update Name
    |--------------------------------------------------------------------------
    */

    if (name !== undefined) {
      user.name = name;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Email
    |--------------------------------------------------------------------------
    */

    if (email !== undefined) {
      const existingUser =
        await User.findOne({
          email,
          _id: { $ne: userId },
        });

      if (existingUser) {
        throw new ApiError(
          409,
          "Email is already registered"
        );
      }

      user.email = email;
    }

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default new StudentService();