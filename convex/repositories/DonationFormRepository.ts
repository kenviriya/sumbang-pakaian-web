import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";

const findDonationForm = internalQuery({
  args: {
    status: v.optional(v.string()),
    userId: v.optional(v.string()),
    donationId: v.optional(v.id("donation")),
  },
  handler: async (ctx, args) => {
    const status = args.status;
    const userId = args.userId;
    const donationId = args.donationId;

    if (status) {
      const statusId = await ctx.db
        .query("ref_donation_form_status")
        .withIndex("status", (q) => q.eq("status", status))
        .collect();

      if (!statusId) {
        throw new Error(`Donation status with ${status} not found`);
      }

      return await ctx.db
        .query("donation_form")
        .withIndex("by_status", (q) => q.eq("statusId", statusId[0]._id))
        .collect();
    }

    if (userId) {
      return await ctx.db
        .query("donation_form")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }

    if (donationId) {
      return await ctx.db
        .query("donation_form")
        .filter((q) => q.eq(q.field("donationId"), donationId))
        .collect();
    }

    return await ctx.db.query("donation_form").collect();
  },
});

const findAllDonationForms = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("donation_form").collect();
  },
});

const findOneDonationForm = internalQuery({
  args: {
    id: v.id("donation_form"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findDonationForm, findAllDonationForms, findOneDonationForm };
