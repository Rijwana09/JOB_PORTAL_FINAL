import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";

class NotificationService {

  /*
  |--------------------------------------------------------------------------
  | Get My Notifications
  |--------------------------------------------------------------------------
  */

  async getMyNotifications(userId) {
    const notifications =
      await Notification.find({
        recipient: userId,
      })
        .populate(
          "application",
          "status createdAt"
        )
        .sort({
          createdAt: -1,
        });

    return notifications;
  }

  /*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

  async markNotificationAsRead(
    notificationId,
    userId
  ) {
    const notification =
      await Notification.findOne({
        _id: notificationId,
        recipient: userId,
      });

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found"
      );
    }

    notification.isRead = true;

    await notification.save();

    return notification;
  }

  /*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

async markAllNotificationsAsRead(userId) {
  const result =
    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

  return {
    modifiedCount: result.modifiedCount,
  };
}

}

export default new NotificationService();