import {v} from 'convex/values';
import {internalQuery} from '../_generated/server';

const findDonationStatus = internalQuery({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const donationStatus = await ctx.db
      .query('ref_donation_status')
      .withIndex('status', (q) => q.eq('status', args.status))
      .first();

    if (!donationStatus) {
      throw new Error(`Donation status id with ${args.status} not found`);
    }

    return donationStatus._id;
  },
});

const findAllDonationStatus = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query('ref_donation_status').collect();
  },
});

const findOneDonationStatus = internalQuery({
  args: {
    statusId: v.id('ref_donation_status'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.statusId);
  },
});

export {findDonationStatus, findAllDonationStatus, findOneDonationStatus};
