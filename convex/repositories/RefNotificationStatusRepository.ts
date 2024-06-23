import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";

const findNotificationStatus = internalQuery({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const donationStatus = await ctx.db
      .query("ref_notification_status")
      .withIndex("status", (q) => q.eq("status", args.status))
      .first();

    if (!donationStatus) {
      throw new Error(`Donation status id with ${args.status} not found`);
    }

    return donationStatus._id;
  },
});

const findAllNotificationStatus = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("ref_notification_status").collect();
  },
});

const findOneNotificationStatus = internalQuery({
  args: {
    statusId: v.id("ref_notification_status"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.statusId);
  },
});

export {
  findNotificationStatus,
  findAllNotificationStatus,
  findOneNotificationStatus,
};
