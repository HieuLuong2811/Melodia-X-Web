import { io } from '../app.js';

export const sendNotificationToUser = (userId, notification) => {
  io.to(userId.toString()).emit("new_notification", notification);
  console.log(`📩 Realtime noti gửi đến user ${userId}`);
};

export const sendNotificationToManyUsers = (userIds, notification) => {
  userIds.forEach(uid => {
    io.to(uid.toString()).emit("new_notification", notification);
  });
  console.log(`📢 Realtime noti gửi đến ${userIds.length} users`);
};
