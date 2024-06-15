import { v } from "convex/values";
import { query } from "@/convex/_generated/server";

const getAllUserClothStatus = query({
  handler: async (ctx) => {
    const fetch = await ctx.db.query("ref_user_cloth_status").collect();

    return fetch.map((status) => status.status);
  },
});

const filterUserClothStatus = query({
  args: {
    statusId: v.optional(v.id("ref_user_cloth_status")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const statusId = args.statusId;
    const status = args.status || "";

    const fetch = await ctx.db.query("ref_user_cloth_status").collect();

    if (statusId) {
      const getUserClothStatusById = fetch.find(
        (userClothStatus) => userClothStatus._id === statusId,
      );
      if (!getUserClothStatusById) {
        throw new Error(`User cloth status with ${statusId} not found`);
      }
      return getUserClothStatusById.status;
    }

    if (status) {
      const getStatusId = await ctx.db
        .query("ref_user_cloth_status")
        .withIndex("status", (q) => q.eq("status", status))
        .collect();

      if (!getStatusId) {
        throw new Error(`User cloth status with ${status} not found`);
      }

      return getStatusId[0]._id;
    }
  },
});

export { getAllUserClothStatus, filterUserClothStatus };
