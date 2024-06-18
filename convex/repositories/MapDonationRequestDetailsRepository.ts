import {v} from 'convex/values';
import {internalMutation, internalQuery} from '../_generated/server';

const findAllMapDonationRequestDetail = internalQuery({
  handler: async (ctx) => {
    const mapDonationRequestDetails = await ctx.db
      .query('map_donation_request_details')
      .collect();
    return mapDonationRequestDetails;
  },
});

const findOneMapDonationRequestDetail = internalQuery({
  args: {
    id: v.id('map_donation_request_details'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

const createMapDonationRequestDetail = internalMutation({
  args: {
    donationRequestId: v.id('donation_request'),
    clothRequestId: v.id('cloth_request'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    return await ctx.db.insert('map_donation_request_details', {
      donationRequestId: args.donationRequestId,
      clothRequestId: args.clothRequestId,
    });
  },
});

export {
  findOneMapDonationRequestDetail,
  findAllMapDonationRequestDetail,
  createMapDonationRequestDetail,
};
