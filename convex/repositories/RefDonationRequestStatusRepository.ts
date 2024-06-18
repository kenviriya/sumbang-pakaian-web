import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findDonationRequestStatus = internalQuery({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const requestStatus = await ctx.db
      .query("ref_donation_request_status")
      .withIndex("status", (q) => q.eq("status", args.status))
      .first();

    if (!requestStatus) {
      throw new Error(
        `Donation request status id with ${args.status} not found`,
      );
    }

    return requestStatus._id;
  },
});

const findAllDonationRequestStatus = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("ref_donation_request_status").collect();
  },
});

const findOneDonationRequestStatus = internalQuery({
  args: {
    id: v.id("ref_donation_request_status"),
  },
  handler: async (ctx, args) => {
    const requestStatus = await ctx.db.get(args.id);

    if (!requestStatus) {
      throw new Error(`Donation request status id with ${args.id} not found`);
    }

    return requestStatus;
  },
});

export {
  findDonationRequestStatus,
  findAllDonationRequestStatus,
  findOneDonationRequestStatus,
};
