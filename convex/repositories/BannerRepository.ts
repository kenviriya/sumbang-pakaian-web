import { internalQuery } from "@/convex/_generated/server";
import { v } from "convex/values";

const findBanner = internalQuery({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("banner")
      .withIndex("title", (q) => q.eq("title", args.title))
      .first();
  },
});

const findAllBanner = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("banner").collect();
  },
});

const findOneBanner = internalQuery({
  args: {
    id: v.id("banner"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export { findAllBanner, findOneBanner, findBanner };
