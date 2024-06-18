import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

const findDonation = internalQuery({
  args: {
    statusId: v.optional(v.id("ref_donation_status")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status;

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

const createDonation = internalMutation({
  args: {
    donationRequestId: v.id("donation_request"),
    statusId: v.id("ref_donation_status"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("donation", {
      donationRequestId: args.donationRequestId,
      statusId: args.statusId,
      startDate: args.startDate,
      endDate: args.endDate,
    });
  },
});

const updateDonation = internalMutation({
  args: {
    id: v.id("donation"),
    statusId: v.optional(v.id("ref_donation_status")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = args.id;
    const statusId = args.statusId;
    const startDate = args.startDate;
    const endDate = args.endDate;

    if (statusId) {
      await ctx.db.patch(id, { statusId });
    }

    if (startDate) {
      await ctx.db.patch(id, { startDate });
    }

    if (endDate) {
      await ctx.db.patch(id, { endDate });
    }

    return await ctx.db.get(id);
  },
});

export {
  findDonation,
  findAllDonation,
  findOneDonation,
  createDonation,
  updateDonation,
};
