import { v } from "convex/values";
import { query } from "@/convex/_generated/server";

const getAllNotificationStatus = query({
  handler: async (ctx) => {
    const fetch = await ctx.db.query("ref_notification_status").collect();
    return fetch.map((status) => status.status);
  },
});

const filterNotificationStatus = query({
  args: {
    statusId: v.optional(v.id("ref_notification_status")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status || "";

    const fetch = await ctx.db.query("ref_notification_status").collect();

    if (statusId) {
      const getNotificationStatusById = fetch.find(
        (notificationStatus) => notificationStatus._id === statusId,
      );
      if (!getNotificationStatusById) {
        throw new Error(`Notification status with ${statusId} not found`);
      }
      return getNotificationStatusById.status;
    }

    if (status) {
      const getNotificationStatusId = await ctx.db
        .query("ref_notification_status")
        .withIndex("status", (q) => q.eq("status", status))
        .collect();

      if (!getNotificationStatusId) {
        throw new Error(`Notification status with ${status} not found`);
      }

      return getNotificationStatusId[0]._id;
    }
  },
});

export { getAllNotificationStatus, filterNotificationStatus };
