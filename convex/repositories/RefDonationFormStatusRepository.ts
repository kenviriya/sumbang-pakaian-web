import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";

const findDonationFormStatus = internalQuery({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const donationFormStatus = await ctx.db
      .query("ref_donation_form_status")
      .withIndex("status", (q) => q.eq("status", args.status))
      .first();

    if (!donationFormStatus) {
      throw new Error(`Donation form status id with ${args.status} not found`);
    }

    return donationFormStatus._id;
  },
});

const findAllDonationFormStatus = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("ref_donation_form_status").collect();
  },
});

const findOneDonationFormStatus = internalQuery({
  args: {
    id: v.id("ref_donation_form_status"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export {
  findDonationFormStatus,
  findAllDonationFormStatus,
  findOneDonationFormStatus,
};
