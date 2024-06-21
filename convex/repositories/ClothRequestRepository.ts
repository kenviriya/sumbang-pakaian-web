import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const findAllClothRequest = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("cloth_request").collect();
  },
});

const findOneClothRequest = internalQuery({
  args: {
    id: v.id("cloth_request"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findAllClothRequest, findOneClothRequest };
