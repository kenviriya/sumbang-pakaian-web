import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findDonation = internalQuery({
  args: {
    statusId: v.optional(v.id("ref_donation_status")),
    status: v.optional(v.string()),
    donationRequestId: v.optional(v.id("donation_request")),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status;
    const donationRequestId = args.donationRequestId;

    if (statusId) {
      return await ctx.db
        .query("donation")
        .withIndex("by_status", (q) => q.eq("statusId", statusId))
        .collect();
    }

    if (status) {
      const getStatusId = await ctx.db
        .query("ref_donation_status")
        .withIndex("status", (q) => q.eq("status", status))
        .collect();

      if (!getStatusId) {
        throw new Error(`Donation request status with ${status} not found`);
      }

      return await ctx.db
        .query("donation")
        .withIndex("by_status", (q) => q.eq("statusId", getStatusId[0]._id))
        .collect();
    }

    if (donationRequestId) {
      return await ctx.db
        .query("donation")
        .withIndex("by_request", (q) =>
          q.eq("donationRequestId", donationRequestId),
        )
        .collect();
    }
  },
});

const findAllDonation = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("donation").collect();
  },
});

const findOneDonation = internalQuery({
  args: {
    id: v.id("donation"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findDonation, findAllDonation, findOneDonation };
