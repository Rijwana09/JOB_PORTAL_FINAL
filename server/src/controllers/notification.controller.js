import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import notificationService from "../services/notification.service.js";

class NotificationController {

  /*
  |--------------------------------------------------------------------------
  | Get My Notifications
  |--------------------------------------------------------------------------
  */

  getMyNotifications = asyncHandler(
    async (req, res) => {

      const notifications =
        await notificationService.getMyNotifications(
          req.user.id
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: notifications,
            message:
              "Notifications fetched successfully",
          })
        );
    }
  );
}

export default new NotificationController();