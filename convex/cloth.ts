import {v} from 'convex/values';
import {query, mutation} from './_generated/server';

const createCloth = mutation({
  args: {
    clothName: v.string(),
    clothSize: v.string(),
    clothType: v.string(),
    clothImage: v.string(),
    clothCategory: v.id('ref_cloth_category'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const cloth = await ctx.db.insert('user_cloth', {
      name: args.clothName,
      size: args.clothSize,
      type: args.clothType,
      image: args.clothImage,
      category: args.clothCategory,
      userId,
    });

    return cloth;
  },
});

const getCloth = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

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

    if (!identity) {
      throw new Error('Not authenticated');
    }

    if (!cloth) {
      throw new Error('Cloth not found');
    }

    const userId = identity.subject;

    if (cloth.userId !== userId) {
      throw new Error('Cloth not found');
    }

    return cloth;
  },
});

const filterCloth = query({
  args: {
    clothCategory: v.optional(v.id('ref_cloth_category')),
    clothType: v.optional(v.string()),
    clothSize: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let getCloth = await ctx.db.query('user_cloth').collect();

    if (args.clothCategory) {
      const clothCategory = args.clothCategory;
      getCloth = getCloth.filter((cloth) => cloth.category === clothCategory);
    }

    if (args.clothType) {
      const clothType = args.clothType;
      getCloth = getCloth.filter((cloth) => cloth.type === clothType);
    }

    if (args.clothSize) {
      const clothSize = args.clothSize;
      getCloth = getCloth.filter((cloth) => cloth.size === clothSize);
    }

    return getCloth;
  },
});

export {createCloth, getCloth, getClothById, filterCloth};