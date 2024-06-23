import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";
import { findNotificationStatus } from "@/convex/repositories/RefNotificationStatusRepository";

const findNotification = internalQuery({
  args: {
    userId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    const status = args.status;

    if (userId) {
      return await ctx.db
        .query("notification")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    }

    if (status) {
      const statusId = await findNotificationStatus(ctx, { status });
      return await ctx.db
        .query("notification")
        .withIndex("by_status", (q) => q.eq("statusId", statusId))
        .collect();
    }
  },
});

const findAllNotifications = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("notification").collect();
  },
});

const findNotificationById = internalQuery({
  args: {
    id: v.id("notification"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findNotification, findAllNotifications, findNotificationById };
