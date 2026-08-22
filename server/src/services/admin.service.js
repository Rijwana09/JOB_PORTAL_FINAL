import mongoose from "mongoose";

import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

import ApiError from "../utils/ApiError.js";

class AdminService {

  /*
  |--------------------------------------------------------------------------
  | Admin Dashboard
  |--------------------------------------------------------------------------
  */

  async getDashboard() {

    /*
    |--------------------------------------------------------------------------
    | User Statistics
    |--------------------------------------------------------------------------
    */

    const totalUsers =
      await User.countDocuments();

    const totalStudents =
      await User.countDocuments({
        role: "student",
      });

    const totalRecruiters =
      await User.countDocuments({
        role: "recruiter",
      });

    const totalAdmins =
      await User.countDocuments({
        role: "admin",
      });

    /*
    |--------------------------------------------------------------------------
    | Job Statistics
    |--------------------------------------------------------------------------
    */

    const totalJobs =
      await Job.countDocuments();

    const publishedJobs =
      await Job.countDocuments({
        status: "published",
      });

    const draftJobs =
      await Job.countDocuments({
        status: "draft",
      });

    const closedJobs =
      await Job.countDocuments({
        status: "closed",
      });

    /*
    |--------------------------------------------------------------------------
    | Application Statistics
    |--------------------------------------------------------------------------
    */

    const totalApplications =
      await Application.countDocuments();

    const appliedApplications =
      await Application.countDocuments({
        status: "applied",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "shortlisted",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "rejected",
      });

    const hiredApplications =
      await Application.countDocuments({
        status: "hired",
      });

    const withdrawnApplications =
      await Application.countDocuments({
        status: "withdrawn",
      });

    /*
    |--------------------------------------------------------------------------
    | Application Success Rate
    |--------------------------------------------------------------------------
    */

    const successRate =
      totalApplications > 0
        ? Number(
            (
              (hiredApplications /
                totalApplications) *
              100
            ).toFixed(2)
          )
        : 0;

    /*
    |--------------------------------------------------------------------------
    | Recent Users
    |--------------------------------------------------------------------------
    */

    const recentUsers =
      await User.find()
        .select(
          "name email role avatar createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    /*
    |--------------------------------------------------------------------------
    | Recent Jobs
    |--------------------------------------------------------------------------
    */

    const recentJobs =
      await Job.find()
        .select(
          "title company location jobType workMode status recruiter createdAt"
        )
        .populate(
          "recruiter",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    /*
    |--------------------------------------------------------------------------
    | Recent Applications
    |--------------------------------------------------------------------------
    */

    const recentApplications =
      await Application.find()
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "job",
          "title company"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    /*
    |--------------------------------------------------------------------------
    | Application Status Summary
    |--------------------------------------------------------------------------
    */

    const applicationStatusSummary = [
      {
        status: "applied",
        count: appliedApplications,
      },
      {
        status: "shortlisted",
        count: shortlistedApplications,
      },
      {
        status: "rejected",
        count: rejectedApplications,
      },
      {
        status: "hired",
        count: hiredApplications,
      },
      {
        status: "withdrawn",
        count: withdrawnApplications,
      },
    ];

    /*
    |--------------------------------------------------------------------------
    | Return Dashboard
    |--------------------------------------------------------------------------
    */

    return {
      statistics: {
        users: {
          total: totalUsers,
          students: totalStudents,
          recruiters: totalRecruiters,
          admins: totalAdmins,
        },

        jobs: {
          total: totalJobs,
          published: publishedJobs,
          draft: draftJobs,
          closed: closedJobs,
        },

        applications: {
          total: totalApplications,
          applied: appliedApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
          hired: hiredApplications,
          withdrawn: withdrawnApplications,
          successRate,
        },
      },

      applicationStatusSummary,

      recentUsers,

      recentJobs,

      recentApplications,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Users
  |--------------------------------------------------------------------------
  */

  async getAllUsers(filters = {}) {

    const {
      role,
      page = 1,
      limit = 10,
    } = filters;

    const query = {};

    if (role) {
      query.role = role;
    }

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const itemsPerPage =
      Math.min(
        Math.max(
          Number(limit) || 10,
          1
        ),
        100
      );

    const skip =
      (currentPage - 1) *
      itemsPerPage;

    const totalUsers =
      await User.countDocuments(query);

    const users =
      await User.find(query)
        .select(
          "name email role avatar isVerified createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(itemsPerPage)
        .lean();

    const totalPages =
      Math.ceil(
        totalUsers /
          itemsPerPage
      );

    return {
      users,

      pagination: {
        currentPage,
        itemsPerPage,
        totalUsers,
        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    };
  }
}

export default new AdminService();