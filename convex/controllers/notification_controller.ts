import { v } from "convex/values";
import { mutation, query } from "@/convex/_generated/server";
import { findNotification } from "@/convex/repositories/NotificationRepository";
import {
  findNotificationStatus,
  findOneNotificationStatus,
} from "@/convex/repositories/RefNotificationStatusRepository";
import { checkUserCloth } from "@/convex/controllers/cloth_controller";

const filterUserNotification = query({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const getNotifications = await findNotification(ctx, {
      userId: userId,
    });

    if (!getNotifications || getNotifications.length === 0) {
      return []; // Return empty array if no notifications found
    }

    const status = await findNotificationStatus(ctx, {
      status: args.status,
    });

    const filteredNotifications = getNotifications.filter((notification) => {
      return notification.statusId === status;
    });

    return await Promise.all(
      filteredNotifications.map(async (notification) => {
        const notificationStatus = await findOneNotificationStatus(ctx, {
          statusId: notification.statusId,
        });

        return {
          notificationId: notification._id,
          userId: notification.userId,
          donationId: notification.donationId,
          clothId: notification.clothId,
          donationRequestId: notification.donationRequestId,
          title: notification.title,
          message: notification.description,
          createdAt: notification._creationTime,
          status: notificationStatus?.status,
        };
      }),
    );
  },
});

const getUserNotifications = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const getNotifications = await findNotification(ctx, {
      userId: args.userId,
    });
    if (getNotifications) {
      return await Promise.all(
        getNotifications.map(async (notification) => {
          const getNotificationStatus = await findOneNotificationStatus(ctx, {
            statusId: notification.statusId,
          });

          return {
            notificationId: notification._id,
            userId: notification.userId,
            donationId: notification.donationId,
            clothId: notification.clothId,
            donationRequestId: notification.donationRequestId,
            title: notification.title,
            message: notification.description,
            createdAt: notification._creationTime,
            status: getNotificationStatus?.status,
          };
        }),
      );
    }
    return [];
  },
});

const createUserNotification = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    statusId: v.id("ref_notification_status"),
    donationId: v.optional(v.id("donation")),
    clothId: v.optional(v.id("user_cloth")),
    donationRequestId: v.optional(v.id("donation_request")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notification", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      statusId: args.statusId,
      donationId: args.donationId,
      clothId: args.clothId,
      donationRequestId: args.donationRequestId,
    });
  },
});

const updateUserNotificationstatus = mutation({
  args: {
    notificationId: v.id("notification"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const statusId = await findNotificationStatus(ctx, {
      status: args.status,
    });
    if (!statusId) {
      throw new Error("Status not found");
    }
    return await ctx.db.patch(args.notificationId, {
      statusId: statusId,
    });
  },
});

const sendNotificationClothMatch = mutation({
  handler: async (ctx) => {
    const userClothMatch = await checkUserCloth(ctx, {});

    if (!userClothMatch) {
      throw new Error("No cloth match found");
    }

    const statusId = await findNotificationStatus(ctx, {
      status: "UNREAD",
    });

    if (!statusId) {
      throw new Error("Status not found");
    }

    userClothMatch.map(async (cloth) => {
      return await createUserNotification(ctx, {
        userId: cloth.userId,
        title: "Kami menemukan donasi yang membutuhkan pakaian kamu.",
        description: `Pakaian ${cloth.clothName} dibutuhkan untuk donasi ${cloth.donationTitle}`,
        statusId: statusId,
        donationId: cloth.donationId,
        clothId: cloth.clothId,
        donationRequestId: cloth.donationRequestId,
      });
    });
  },
});

export {
  getUserNotifications,
  filterUserNotification,
  sendNotificationClothMatch,
  updateUserNotificationstatus,
};
