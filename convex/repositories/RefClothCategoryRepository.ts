import {v} from 'convex/values';
import {internalQuery} from '../_generated/server';

const findAllClothCategory = internalQuery({
  handler: async (ctx) => {
    const clothCategories = await ctx.db.query('ref_cloth_category').collect();
    return clothCategories;
  },
});

const findOneClothCategory = internalQuery({
  args: {
    id: v.id('ref_cloth_category'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export {findAllClothCategory, findOneClothCategory};
