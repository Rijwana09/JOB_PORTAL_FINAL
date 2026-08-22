import express from "express";

import adminController from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getDashboard
);

/*
|--------------------------------------------------------------------------
| Admin - Users
|--------------------------------------------------------------------------
*/

router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getAllUsers
);

export default router;