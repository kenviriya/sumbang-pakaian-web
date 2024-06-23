import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findClothCategory = internalQuery({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const clothCategory = await ctx.db
      .query("ref_cloth_category")
      .withIndex("name", (q) => q.eq("name", args.name))
      .first();

    if (!clothCategory) {
      throw new Error(`Cloth category with name ${args.name} not found`);
    }

    return clothCategory._id;
  },
});

const findAllClothCategory = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("ref_cloth_category").collect();
  },
});

const findOneClothCategory = internalQuery({
  args: {
    id: v.id("ref_cloth_category"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findClothCategory, findAllClothCategory, findOneClothCategory };
