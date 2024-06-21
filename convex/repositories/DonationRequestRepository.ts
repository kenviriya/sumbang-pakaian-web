import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findDonationRequest = internalQuery({
  args: {
    userId: v.optional(v.string()),
    duration: v.optional(v.number()),
    statusId: v.optional(v.id("ref_donation_request_status")),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    const duration = args.duration;
    const status = args.statusId;

    if (userId) {
      return await ctx.db
        .query("donation_request")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    }

    if (duration) {
      return await ctx.db
        .query("donation_request")
        .withIndex("by_duration", (q) => q.eq("duration", duration))
        .collect();
    }

    if (status) {
      const statusId = await ctx.db
        .query("ref_donation_request_status")
        .withIndex("status", (q) => q.eq("status", status))
        .collect();

      if (!statusId) {
        throw new Error(`Donation request status with ${status} not found`);
      }

      return await ctx.db
        .query("donation_request")
        .withIndex("by_status", (q) => q.eq("statusId", status))
        .collect();
    }
  },
});

const findAllDonationRequest = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("donation_request").collect();
  },
});

const findOneDonationRequest = internalQuery({
  args: {
    id: v.id("donation_request"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findDonationRequest, findAllDonationRequest, findOneDonationRequest };
