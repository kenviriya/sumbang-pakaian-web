import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findAllMapDonationRequestDetail = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("map_donation_request_details").collect();
  },
});

const findOneMapDonationRequestDetail = internalQuery({
  args: {
    id: v.id("map_donation_request_details"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findOneMapDonationRequestDetail, findAllMapDonationRequestDetail };
