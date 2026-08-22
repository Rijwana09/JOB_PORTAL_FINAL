import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

class UserService {
  /*
  |--------------------------------------------------------------------------
  | Get My Profile
  |--------------------------------------------------------------------------
  */

  async getMyProfile(userId) {
    const user = await User.findById(userId).select(
      "name email role avatar phone location bio education skills companyName designation companyWebsite companyDescription companyLinkedIn createdAt updatedAt"
    );

    if (!user) {
      throw new ApiError(
        404,
        "User profile not found"
      );
    }

    return user;
  }

  /*
  |--------------------------------------------------------------------------
  | Update My Profile
  |--------------------------------------------------------------------------
  */

  async updateMyProfile(
    userId,
    profileData = {}
    ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User profile not found"
      );
    }

    const {
      name,
      phone,
      location,
      bio,
      education,
      skills,
      avatar,
      companyName,
      designation,
      companyWebsite,
      companyDescription,
      companyLinkedIn,
    } = profileData;

    const updateData = {};

    /*
    |--------------------------------------------------------------------------
    | Common Profile Fields
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Name
    |--------------------------------------------------------------------------
    */

    if (name !== undefined) {
      const trimmedName =
        String(name).trim();

      if (
        trimmedName.length < 2 ||
        trimmedName.length > 50
      ) {
        throw new ApiError(
          400,
          "Name must be between 2 and 50 characters"
        );
      }

      updateData.name =
        trimmedName;
    }

    /*
    |--------------------------------------------------------------------------
    | Phone
    |--------------------------------------------------------------------------
    */

    if (phone !== undefined) {
      updateData.phone =
        String(phone).trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */

    if (location !== undefined) {
      updateData.location =
        String(location).trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Bio
    |--------------------------------------------------------------------------
    */

    if (bio !== undefined) {
      const trimmedBio =
        String(bio).trim();

      if (trimmedBio.length > 500) {
        throw new ApiError(
          400,
          "Bio cannot exceed 500 characters"
        );
      }

      updateData.bio =
        trimmedBio;
    }

    /*
    |--------------------------------------------------------------------------
    | Avatar
    |--------------------------------------------------------------------------
    */

    if (avatar !== undefined) {
      updateData.avatar =
        String(avatar).trim();
    }

    /*
|--------------------------------------------------------------------------
| Education
|--------------------------------------------------------------------------
*/

if (education !== undefined) {
  const trimmedEducation =
    String(education).trim();

  if (trimmedEducation.length > 200) {
    throw new ApiError(
      400,
      "Education cannot exceed 200 characters"
    );
  }

  updateData.education =
    trimmedEducation;
}


/*
|--------------------------------------------------------------------------
| Skills
|--------------------------------------------------------------------------
*/

if (skills !== undefined) {

  if (!Array.isArray(skills)) {
    throw new ApiError(
      400,
      "Skills must be an array"
    );
  }

  updateData.skills =
    skills
      .map((skill) =>
        String(skill).trim()
      )
      .filter(Boolean)
      .slice(0, 30);
}

    /*
    |--------------------------------------------------------------------------
    | Recruiter Profile Fields
    |--------------------------------------------------------------------------
    */

    if (user.role === "recruiter") {
      /*
      |--------------------------------------------------------------------------
      | Company Name
      |--------------------------------------------------------------------------
      */

      if (companyName !== undefined) {
        const trimmedCompanyName =
          String(companyName).trim();

        if (
          trimmedCompanyName.length > 100
        ) {
          throw new ApiError(
            400,
            "Company name cannot exceed 100 characters"
          );
        }

        updateData.companyName =
          trimmedCompanyName;
      }

      /*
      |--------------------------------------------------------------------------
      | Designation
      |--------------------------------------------------------------------------
      */

      if (designation !== undefined) {
        const trimmedDesignation =
          String(designation).trim();

        if (
          trimmedDesignation.length > 100
        ) {
          throw new ApiError(
            400,
            "Designation cannot exceed 100 characters"
          );
        }

        updateData.designation =
          trimmedDesignation;
      }

      /*
      |--------------------------------------------------------------------------
      | Company Website
      |--------------------------------------------------------------------------
      */

      if (companyWebsite !== undefined) {
        updateData.companyWebsite =
          String(companyWebsite).trim();
      }

      /*
      |--------------------------------------------------------------------------
      | Company Description
      |--------------------------------------------------------------------------
      */

      if (
        companyDescription !==
        undefined
      ) {
        const trimmedDescription =
          String(
            companyDescription
          ).trim();

        if (
          trimmedDescription.length >
          1000
        ) {
          throw new ApiError(
            400,
            "Company description cannot exceed 1000 characters"
          );
        }

        updateData.companyDescription =
          trimmedDescription;
      }

      /*
      |--------------------------------------------------------------------------
      | Company LinkedIn
      |--------------------------------------------------------------------------
      */

      if (companyLinkedIn !== undefined) {
        updateData.companyLinkedIn =
          String(
            companyLinkedIn
          ).trim();
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Update User
    |--------------------------------------------------------------------------
    */

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select(
        "name email role avatar phone location bio education skills companyName designation companyWebsite companyDescription companyLinkedIn createdAt updatedAt"
      );

    if (!updatedUser) {
      throw new ApiError(
        404,
        "User profile not found"
      );
    }

    return updatedUser;
  }
}

export default new UserService();