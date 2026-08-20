import express from "express";

import notificationController from "../controllers/notification.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  notificationController.getMyNotifications
);

router.patch(
  "/read-all",
  authMiddleware,
  notificationController
    .markAllNotificationsAsRead
);

router.patch(
  "/:notificationId/read",
  authMiddleware,
  notificationController.markNotificationAsRead
);

export default router;