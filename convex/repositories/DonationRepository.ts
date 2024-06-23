import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findDonation = internalQuery({
  args: {
    statusId: v.optional(v.id("ref_donation_status")),
    status: v.optional(v.string()),
    donationRequestId: v.optional(v.id("donation_request")),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status;
    const donationRequestId = args.donationRequestId;
    const endDate = args.endDate;

    if (statusId) {
      return await ctx.db
        .query("donation")
        .withIndex("by_status", (q) => q.eq("statusId", statusId))
        .order("desc")
        .collect();
    }

    if (status) {
      const getStatusId = await ctx.db
        .query("ref_donation_status")
        .withIndex("status", (q) => q.eq("status", status))
        .order("desc")
        .collect();

      if (!getStatusId) {
        throw new Error(`Donation request status with ${status} not found`);
      }

      return await ctx.db
        .query("donation")
        .withIndex("by_status", (q) => q.eq("statusId", getStatusId[0]._id))
        .order("desc")
        .collect();
    }

    if (donationRequestId) {
      return await ctx.db
        .query("donation")
        .withIndex("by_request", (q) =>
          q.eq("donationRequestId", donationRequestId),
        )
        .order("desc")
        .collect();
    }

    if (endDate) {
      return await ctx.db
        .query("donation")
        .withIndex("by_endDate", (q) => q.eq("endDate", endDate))
        .order("desc")
        .collect();
    }
  },
});

const findAllDonation = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("donation").order("desc").collect();
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
