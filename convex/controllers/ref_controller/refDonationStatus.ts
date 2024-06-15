import { v } from "convex/values";
import { query } from "@/convex/_generated/server";

const getAllDonationStatus = query({
  handler: async (ctx) => {
    const fetch = await ctx.db.query("ref_donation_status").collect();
    return fetch.map((status) => status.status);
  },
});

const filterDonationStatus = query({
  args: {
    statusId: v.optional(v.id("ref_donation_status")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status || "";

    const fetch = await ctx.db.query("ref_donation_status").collect();

    if (statusId) {
      const getDonationStatusById = fetch.find(
        (donationStatus) => donationStatus._id === statusId,
      );
      if (!getDonationStatusById) {
        throw new Error(`Cloth category with ${statusId} not found`);
      }
      return getDonationStatusById.status;
    }

    if (status) {
      const getDonationStatusId = await ctx.db
        .query("ref_donation_status")
        .withIndex("status", (q) => q.eq("status", status))
        .collect();

      if (!getDonationStatusId) {
        throw new Error(`Cloth category with ${status} not found`);
      }

      return getDonationStatusId[0]._id;
    }
  },
});

export { getAllDonationStatus, filterDonationStatus };
