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
}

export default new NotificationService();