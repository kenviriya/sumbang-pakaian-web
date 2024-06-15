import { v } from "convex/values";
import { query } from "@/convex/_generated/server";

const getAllCategory = query({
  handler: async (ctx) => {
    const fetch = await ctx.db.query("ref_cloth_category").collect();

    return fetch.map((category) => {
      return {
        id: category._id,
        name: category.name,
      };
    });
  },
});

const filterClothCategory = query({
  args: {
    categoryId: v.optional(v.id("ref_cloth_category")),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const categoryId = args.categoryId;
    const category = args.category || "";

    const fetch = await ctx.db.query("ref_cloth_category").collect();

    if (categoryId) {
      const getCategoryById = fetch.find(
        (category) => category._id === categoryId,
      );
      if (!getCategoryById) {
        throw new Error(`Cloth category with ${categoryId} not found`);
      }
      return getCategoryById.name;
    }

    if (category) {
      const getCategoryId = await ctx.db
        .query("ref_cloth_category")
        .withIndex("name", (q) => q.eq("name", category))
        .collect();

      if (!getCategoryId) {
        throw new Error(`Cloth category with ${category} not found`);
      }

      return getCategoryId[0]._id;
    }
  },
});

export { getAllCategory, filterClothCategory };
