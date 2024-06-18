import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";

const findAllMapDonationFormDetails = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("map_donation_form_details").collect();
  },
});

const findOneMapDonationFormDetails = internalQuery({
  args: {
    id: v.id("map_donation_form_details"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findAllMapDonationFormDetails, findOneMapDonationFormDetails };
