import {mutation, query} from '@/convex/_generated/server';
import {v} from 'convex/values';
import {findUserClothStatus} from '@/convex/repositories/RefUserClothStatusRepository';

const getAllClothRequest = query({
  handler: async (ctx) => {
    return await ctx.db.query('cloth_request').collect();
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
    const insertClothRequest = await ctx.db.insert('cloth_request', {
      categoryId: args.categoryId,
      gender: args.gender,
      size: args.size,
      quantity: args.quantity,
    });

    if (!insertClothRequest) {
      throw new Error('Failed to create cloth request');
    }

    return await ctx.db.insert('map_donation_request_details', {
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
      throw new Error('Not Authenticated');
    }

    const userId = identity.subject;

    const status = args.status;

    let userClothes = await ctx.db
      .query('user_cloth')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();

    if (!userClothes) {
      throw new Error('No clothes stored');
    }

    if (args.category) {
      userClothes = userClothes.filter(
        (cloth) => cloth.categoryId === args.category
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
        (cloth) => cloth.statusId === getStatusId
      );
    }

    const getClothCategory = await ctx.db.query('ref_cloth_category').collect();
    const getClothStatus = await ctx.db
      .query('ref_user_cloth_status')
      .collect();
    const clothCategoryMap = new Map(
      getClothCategory.map((category) => [category._id, category])
    );

    const clothStatusMap = new Map(
      getClothStatus.map((status) => [status._id, status])
    );

    return userClothes.map((cloth) => ({
      ...cloth,
      category: clothCategoryMap.get(cloth.categoryId)?.name,
      status: clothStatusMap.get(cloth.statusId)?.status,
    }));
  },
});

const getUserClothById = query({
  args: {
    clothId: v.id('user_cloth'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const getCloth = await ctx.db.get(args.clothId);

    if (!getCloth) {
      throw new Error('Cloth not found');
    }

    if (getCloth.userId !== userId) {
      throw new Error('Not authorized to view this cloth');
    }

    const getClothCategory = await ctx.db.query('ref_cloth_category').collect();
    const getClothStatus = await ctx.db
      .query('ref_user_cloth_status')
      .collect();

    const clothCategoryMap = new Map(
      getClothCategory.map((category) => [category._id, category])
    );

    const clothStatusMap = new Map(
      getClothStatus.map((status) => [status._id, status])
    );

    return {
      ...getCloth,
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
    categoryId: v.id('ref_cloth_category'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const getStatusAvailableId = await findUserClothStatus(ctx, {
      status: 'AVAILABLE',
    });

    return await ctx.db.insert('user_cloth', {
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

export {
  getAllClothRequest,
  createClothRequest,
  getUserClothes,
  getUserClothById,
  createUserCloth,
};
