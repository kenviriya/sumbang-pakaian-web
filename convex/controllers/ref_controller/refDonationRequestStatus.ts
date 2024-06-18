import { query } from "@/convex/_generated/server";
import { v } from "convex/values";

const getAllDonationRequestStatus = query({
  handler: async (ctx) => {
    return await ctx.db.query("ref_donation_request_status").collect();
  },
});

const filterDonationRequestStatus = query({
  args: {
    statusId: v.optional(v.id("ref_donation_request_status")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status || "";

    if (statusId) {
      const getStatus = await ctx.db.get(statusId);

      if (!getStatus) {
        throw new Error(`Donation request status with ${statusId} not found`);
      }

      return getStatus.status;
    }

    if (status) {
      const getStatusId = await ctx.db
        .query("ref_donation_request_status")
        .withIndex("status", (q) => q.eq("status", status))
        .first();
      if (!getStatusId) {
        throw new Error(`Donation request status with ${status} not found`);
      }
      return getStatusId._id;
    }
  },
});

export { getAllDonationRequestStatus, filterDonationRequestStatus };
