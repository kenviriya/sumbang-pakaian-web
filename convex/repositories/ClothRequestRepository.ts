import {v} from 'convex/values';
import {internalMutation, internalQuery} from '../_generated/server';

const findAllClothRequest = internalQuery({
  handler: async (ctx) => {
    const clothRequests = await ctx.db.query('cloth_request').collect();
    return clothRequests;
  },
});

const findOneClothRequest = internalQuery({
  args: {
    id: v.id('cloth_request'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

const createClothRequest = internalMutation({
  args: {
    size: v.string(),
    gender: v.string(),
    quantity: v.number(),
    categoryId: v.id('ref_cloth_category'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('cloth_request', {
      size: args.size,
      gender: args.gender,
      quantity: args.quantity,
      categoryId: args.categoryId,
    });
  },
});

export {findAllClothRequest, findOneClothRequest, createClothRequest};
