import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { findUserClothStatus } from "@/convex/repositories/RefUserClothStatusRepository";
import { filterDonation } from "@/convex/controllers/donation_controller";
import { findClothCategory } from "@/convex/repositories/RefClothCategoryRepository";

const getAllClothRequest = query({
  handler: async (ctx) => {
    return await ctx.db.query("cloth_request").collect();
  },
});

const createClothRequest = mutation({
  args: {
    categoryId: v.any(),
    gender: v.string(),
    size: v.string(),
    quantity: v.number(),
    donationRequestId: v.any(),
  },
  handler: async (ctx, args) => {
    const insertClothRequest = await ctx.db.insert("cloth_request", {
      categoryId: args.categoryId,
      gender: args.gender,
      size: args.size,
      quantity: args.quantity,
    });

    if (!insertClothRequest) {
      throw new Error("Failed to create cloth request");
    }

    return await ctx.db.insert("map_donation_request_details", {
      donationRequestId: args.donationRequestId,
      clothRequestId: insertClothRequest,
    });
  },
});

const getUserClothes = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    size: v.optional(v.string()),
    gender: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    let userId = identity.subject;

    const status = args.status;

    let userClothes = await ctx.db
      .query("user_cloth")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    if (!userClothes) {
      throw new Error("No clothes stored");
    }

    if (args.category) {
      userClothes = userClothes.filter(
        (cloth) => cloth.categoryId === args.category,
      );
    }

    if (args.size) {
      userClothes = userClothes.filter((cloth) => cloth.size === args.size);
    }

    if (args.gender) {
      userClothes = userClothes.filter((cloth) => cloth.gender === args.gender);
    }

    if (args.status && status) {
      const getStatusId = await findUserClothStatus(ctx, {
        status: status,
      });
      userClothes = userClothes.filter(
        (cloth) => cloth.statusId === getStatusId,
      );
    }

    const getClothCategory = await ctx.db.query("ref_cloth_category").collect();
    const getClothStatus = await ctx.db
      .query("ref_user_cloth_status")
      .collect();
    const clothCategoryMap = new Map(
      getClothCategory.map((category) => [category._id, category]),
    );

    const clothStatusMap = new Map(
      getClothStatus.map((status) => [status._id, status]),
    );

    return userClothes.map((cloth) => ({
      clothId: cloth._id,
      userId: cloth.userId,
      name: cloth.name,
      size: cloth.size,
      gender: cloth.gender,
      description: cloth.description,
      category: clothCategoryMap.get(cloth.categoryId)?.name,
      status: clothStatusMap.get(cloth.statusId)?.status,
    }));
  },
});

const getAllUserClothes = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    size: v.optional(v.string()),
    gender: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const status = args.status;
    const category = args.category;

    let userClothes = await ctx.db.query("user_cloth").collect();

    if (!userClothes) {
      throw new Error("No clothes stored");
    }

    if (args.category && category) {
      const getCategoryId = await findClothCategory(ctx, {
        name: category,
      });
      userClothes = userClothes.filter(
        (cloth) => cloth.categoryId === getCategoryId,
      );
    }

    if (args.size) {
      userClothes = userClothes.filter((cloth) => cloth.size === args.size);
    }

    if (args.gender) {
      userClothes = userClothes.filter((cloth) => cloth.gender === args.gender);
    }

    if (args.status && status) {
      const getStatusId = await findUserClothStatus(ctx, {
        status: status,
      });
      userClothes = userClothes.filter(
        (cloth) => cloth.statusId === getStatusId,
      );
    }

    const getClothCategory = await ctx.db.query("ref_cloth_category").collect();
    const getClothStatus = await ctx.db
      .query("ref_user_cloth_status")
      .collect();
    const clothCategoryMap = new Map(
      getClothCategory.map((category) => [category._id, category]),
    );

    const clothStatusMap = new Map(
      getClothStatus.map((status) => [status._id, status]),
    );

    return userClothes.map((cloth) => ({
      clothId: cloth._id,
      userId: cloth.userId,
      name: cloth.name,
      size: cloth.size,
      gender: cloth.gender,
      description: cloth.description,
      category: clothCategoryMap.get(cloth.categoryId)?.name,
      status: clothStatusMap.get(cloth.statusId)?.status,
    }));
  },
});

const getUserClothById = query({
  args: {
    clothId: v.id("user_cloth"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const getCloth = await ctx.db.get(args.clothId);

    if (!getCloth) {
      throw new Error("Cloth not found");
    }

    if (getCloth.userId !== userId) {
      throw new Error("Not authorized to view this cloth");
    }

    const getClothCategory = await ctx.db.query("ref_cloth_category").collect();
    const getClothStatus = await ctx.db
      .query("ref_user_cloth_status")
      .collect();

    const clothCategoryMap = new Map(
      getClothCategory.map((category) => [category._id, category]),
    );

    const clothStatusMap = new Map(
      getClothStatus.map((status) => [status._id, status]),
    );

    return {
      clothId: getCloth._id,
      userId: getCloth.userId,
      name: getCloth.name,
      size: getCloth.size,
      gender: getCloth.gender,
      description: getCloth.description,
      category: clothCategoryMap.get(getCloth.categoryId)?.name,
      status: clothStatusMap.get(getCloth.statusId)?.status,
    };
  },
});

const createUserCloth = mutation({
  args: {
    name: v.string(),
    size: v.string(),
    gender: v.string(),
    description: v.string(),
    categoryId: v.id("ref_cloth_category"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const getStatusAvailableId = await findUserClothStatus(ctx, {
      status: "AVAILABLE",
    });

    return await ctx.db.insert("user_cloth", {
      userId: userId,
      name: args.name,
      size: args.size,
      gender: args.gender,
      description: args.description,
      categoryId: args.categoryId,
      statusId: getStatusAvailableId,
    });
  },
});

const updateUserClothStatus = mutation({
  args: {
    clothId: v.id("user_cloth"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const getUserCloth = await ctx.db.get(args.clothId);

    if (!getUserCloth) {
      throw new Error("Cloth not found");
    }

    if (getUserCloth.userId !== userId) {
      throw new Error("Not authorized to update this cloth");
    }

    const getStatusDonatedId = await findUserClothStatus(ctx, {
      status: args.status,
    });

    return await ctx.db.patch(args.clothId, {
      statusId: getStatusDonatedId,
    });
  },
});

const checkUserCloth = query({
  handler: async (ctx) => {
    const donations = await filterDonation(ctx, {
      status: "ACTIVE",
    });

    const userClothes = await getAllUserClothes(ctx, {
      status: "AVAILABLE",
    });

    const matches: any[] | PromiseLike<any[] | undefined> | undefined = [];

    if (donations) {
      donations.forEach((donation) => {
        if (donation) {
          donation.clothRequests.forEach((clothRequest) => {
            userClothes.forEach((userCloth) => {
              if (clothRequest.category === userCloth.category) {
                matches.push({
                  userId: userCloth.userId,
                  clothId: userCloth.clothId,
                  clothName: userCloth.name,
                  donationId: donation.id,
                  donationTitle: donation.donationTitle,
                  donationRequestId: donation.donationRequestId,
                });
              }
            });
          });
        }
      });

      return matches;
    }
  },
});

export {
  getAllClothRequest,
  createClothRequest,
  getUserClothes,
  getUserClothById,
  createUserCloth,
  updateUserClothStatus,
  getAllUserClothes,
  checkUserCloth,
};
