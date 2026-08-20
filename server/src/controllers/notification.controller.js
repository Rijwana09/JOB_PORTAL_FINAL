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

  /*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

  markNotificationAsRead = asyncHandler(
    async (req, res) => {
      const notification =
        await notificationService.markNotificationAsRead(
          req.params.notificationId,
          req.user.id
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: notification,
            message:
              "Notification marked as read",
          })
        );
    }
  );

  /*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

markAllNotificationsAsRead =
  asyncHandler(
    async (req, res) => {
      const result =
        await notificationService
          .markAllNotificationsAsRead(
            req.user.id
          );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: result,
            message:
              "All notifications marked as read",
          })
        );
    }
  );

}

export default new NotificationController();