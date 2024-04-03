import {v} from 'convex/values';
import {query, mutation} from './_generated/server';

const createCloth = mutation({
  args: {
    clothName: v.string(),
    clothSize: v.string(),
    clothType: v.string(),
    clothCategory: v.id('ref_cloth_category'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    // const userId = 'js724gk08gd45q55yk9bm2x1sh6pexds';

    const cloth = await ctx.db.insert('user_cloth', {
      clothName: args.clothName,
      clothSize: args.clothSize,
      clothType: args.clothType,
      clothCategory: args.clothCategory,
      userId,
    });

    return cloth;
  },
});

const getCloth = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error('Not authenticated');
    // }

    // const userId = identity.subject;

    const userId = 'js724gk08gd45q55yk9bm2x1sh6pexds';

    const userClothes = await ctx.db
      .query('user_cloth')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();

    return userClothes;
  },
});

const getClothById = query({
  args: {
    clothId: v.id('user_cloth'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const cloth = await ctx.db.get(args.clothId);

    // if (!identity) {
    //   throw new Error('Not authenticated');
    // }

    if (!cloth) {
      throw new Error('Cloth not found');
    }

    // const userId = identity.subject;
    const userId = 'js724gk08gd45q55yk9bm2x1sh6pexds';

    if (cloth.userId !== userId) {
      throw new Error('Cloth not found');
    }

    return cloth;
  },
});

const getClothByCategory = query({
  args: {
    clothCategory: v.id('ref_cloth_category'),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    const cloth = await ctx.db
      .query('user_cloth')
      .filter((q) => q.eq(q.field('clothCategory'), args.clothCategory))
      .collect();

    // if (!identity) {
    //   throw new Error('Not authenticated');
    // }

    if (!cloth) {
      throw new Error('Cloth not found');
    }

    return cloth;
  },
});

export {createCloth, getCloth, getClothById, getClothByCategory};
