import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

import ROLES from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Basic Information
    |--------------------------------------------------------------------------
    */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Role
    |--------------------------------------------------------------------------
    */

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
    },

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

avatar: {
  type: String,
  default: "",
},

phone: {
  type: String,
  default: "",
  trim: true,
},

location: {
  type: String,
  default: "",
  trim: true,
},

bio: {
  type: String,
  default: "",
  trim: true,
  maxlength: 500,
},

/*
|--------------------------------------------------------------------------
| Student Profile
|--------------------------------------------------------------------------
*/

education: {
  type: String,
  default: "",
  trim: true,
},

skills: {
  type: [String],
  default: [],
},

/*
|--------------------------------------------------------------------------
| Recruiter Profile
|--------------------------------------------------------------------------
*/

companyName: {
  type: String,
  default: "",
  trim: true,
  maxlength: 100,
},

designation: {
  type: String,
  default: "",
  trim: true,
  maxlength: 100,
},

companyWebsite: {
  type: String,
  default: "",
  trim: true,
},

companyDescription: {
  type: String,
  default: "",
  trim: true,
  maxlength: 1000,
},

companyLinkedIn: {
  type: String,
  default: "",
  trim: true,
},

    /*
    |--------------------------------------------------------------------------
    | Account Status
    |--------------------------------------------------------------------------
    */

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Email Verification
    |--------------------------------------------------------------------------
    */

    verificationToken: {
      type: String,
      default: null,
      select: false,
    },

    verificationTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Refresh Token
    |--------------------------------------------------------------------------
    */

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Password Reset
    |--------------------------------------------------------------------------
    */

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Hash Password
|--------------------------------------------------------------------------
*/

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    10
  );

  next();
});

/*
|--------------------------------------------------------------------------
| Compare Password
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword =
  async function (password) {
    return bcrypt.compare(
      password,
      this.password
    );
  };

export default mongoose.model(
  "User",
  userSchema
);