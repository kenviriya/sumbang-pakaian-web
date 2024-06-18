import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";

const findAllDonationDetail = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("donation_form_detail").collect();
  },
});

const findOneDonationDetail = internalQuery({
  args: {
    id: v.id("donation_form_detail"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findAllDonationDetail, findOneDonationDetail };
