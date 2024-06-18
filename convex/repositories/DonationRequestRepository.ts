import {v} from 'convex/values';
import {internalMutation, internalQuery} from '../_generated/server';

const findDonationRequest = internalQuery({
  args: {
    userId: v.optional(v.string()),
    duration: v.optional(v.number()),
    statusId: v.optional(v.id('ref_donation_request_status')),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    const duration = args.duration;
    const status = args.statusId;

    if (userId) {
      return await ctx.db
        .query('donation_request')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect();
    }

    if (duration) {
      return await ctx.db
        .query('donation_request')
        .withIndex('by_duration', (q) => q.eq('duration', duration))
        .collect();
    }

    if (status) {
      const statusId = await ctx.db
        .query('ref_donation_request_status')
        .withIndex('status', (q) => q.eq('status', status))
        .collect();

      if (!statusId) {
        throw new Error(`Donation request status with ${status} not found`);
      }

      return await ctx.db
        .query('donation_request')
        .withIndex('by_status', (q) => q.eq('statusId', status))
        .collect();
    }
  },
});

const findAllDonationRequest = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query('donation_request').collect();
  },
});

const findOneDonationRequest = internalQuery({
  args: {
    id: v.id('donation_request'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

const createDonationRequest = internalMutation({
  args: {
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    title: v.string(),
    duration: v.number(),
    description: v.string(),
    address: v.string(),
    statusId: v.id('ref_donation_request_status'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('donation_request', {
      userId: args.userId,
      title: args.title,
      imageUrl: args.imageUrl,
      description: args.description,
      duration: args.duration,
      address: args.address,
      statusId: args.statusId,
    });
  },
});

const updateDonationRequest = internalMutation({
  args: {
    id: v.id('donation_request'),
    title: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    address: v.optional(v.string()),
    statusId: v.optional(v.id('ref_donation_request_status')),
  },
  handler: async (ctx, args) => {
    const id = args.id;
    const title = args.title;
    const imageUrl = args.imageUrl;
    const description = args.description;
    const duration = args.duration;
    const address = args.address;
    const statusId = args.statusId;

    if (title) {
      await ctx.db.patch(id, {title: title});
    }

    if (imageUrl) {
      await ctx.db.patch(id, {imageUrl: imageUrl});
    }

    if (description) {
      await ctx.db.patch(id, {description: description});
    }

    if (duration) {
      await ctx.db.patch(id, {duration: duration});
    }

    if (address) {
      await ctx.db.patch(id, {address: address});
    }

    if (statusId) {
      await ctx.db.patch(id, {statusId: statusId});
    }

    return await ctx.db.get(id);
  },
});

export {
  findDonationRequest,
  findAllDonationRequest,
  findOneDonationRequest,
  createDonationRequest,
  updateDonationRequest,
};
