import {mutation, query} from '@/convex/_generated/server';
import {v} from 'convex/values';

const getAllDonationRequest = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    let getDonationRequests = await ctx.db.query('donation_request').collect();

    const getDonationRequestStatus = await ctx.db
      .query('ref_donation_request_status')
      .collect();

    const getDonationRequestDetails = await ctx.db
      .query('map_donation_request_details')
      .collect();

    const getClothRequest = await ctx.db.query('cloth_request').collect();

    const getClothCategory = await ctx.db.query('ref_cloth_category').collect();

    if (args.userId) {
      getDonationRequests = getDonationRequests.filter(
        (donationRequests) => donationRequests.userId === args.userId
      );
    }

    const donationRequestStatusMap = new Map(
      getDonationRequestStatus.map((status) => [status._id, status])
    );

    return getDonationRequests.map((donationRequests) => {
      const requestStatus = donationRequestStatusMap.get(
        donationRequests.statusId
      );

      let requestTitle,
        requestImageUrl,
        requestDescription,
        requestDuration,
        requestAddress,
        clothRequest;
      if (donationRequests) {
        ({
          title: requestTitle,
          imageUrl: requestImageUrl,
          description: requestDescription,
          duration: requestDuration,
          address: requestAddress,
        } = donationRequests);
        const requestDetail = getDonationRequestDetails.filter(
          (detail) => detail.donationRequestId === donationRequests._id
        );
        if (requestDetail.length) {
          const clothesIds = requestDetail.map(
            (detail) => detail.clothRequestId
          );
          const clothes = getClothRequest.filter((cloth) =>
            clothesIds.includes(cloth._id)
          );
          clothRequest = clothes.map((cloth) => {
            const category = getClothCategory.find(
              (category) => category._id === cloth.categoryId
            );
            return {
              size: cloth.size,
              gender: cloth.gender,
              category: category?.name,
              quantity: cloth.quantity,
            };
          });
        }
      }
      return {
        requestId: donationRequests._id,
        userId: donationRequests.userId,
        requestStatus: requestStatus?.status,
        title: requestTitle,
        imageUrl: requestImageUrl,
        description: requestDescription,
        duration: requestDuration,
        address: requestAddress,
        clothRequest,
      };
    });
  },
});

const getDonationRequestById = query({
  args: {
    donationRequestId: v.id('donation_request'),
  },
  handler: async (ctx, args) => {
    const donationRequest = await ctx.db.get(args.donationRequestId);

    if (!donationRequest) {
      throw new Error(
        `Donation Request with ${args.donationRequestId} not found`
      );
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const getRequestStatus = await ctx.db.get(donationRequest.statusId);

    const getRequestDetail = await ctx.db
      .query('map_donation_request_details')
      .collect();

    const mapDonationRequestDetails = getRequestDetail.filter(
      (detail) => detail.donationRequestId === donationRequest._id
    );

    const getClothRequest = await ctx.db.query('cloth_request').collect();

    const getClothCategory = await ctx.db.query('ref_cloth_category').collect();

    const clothRequest = mapDonationRequestDetails.map((detail) => {
      const clothes = getClothRequest.find(
        (clothes) => clothes._id === detail.clothRequestId
      );
      if (clothes) {
        const category = getClothCategory.find(
          (category) => category._id === clothes.categoryId
        );
        return {
          size: clothes.size,
          gender: clothes.gender,
          category: category?.name,
          quantity: clothes.quantity,
        };
      }
    });

    return {
      requestId: donationRequest._id,
      userId: donationRequest.userId,
      requestStatus: getRequestStatus?.status,
      title: donationRequest.title,
      imageUrl: donationRequest.imageUrl,
      description: donationRequest.description,
      duration: donationRequest.duration,
      address: donationRequest.address,
      clothRequest,
    };
  },
});

const getAllDonationRequestDetail = query({
  handler: async (ctx) => {
    const getRequestDetail = await ctx.db
      .query('map_donation_request_details')
      .collect();
  },
});

const createDonationRequestDetail = mutation({
  args: {
    donationRequestId: v.id('donation_request'),
    categoryId: v.id('ref_cloth_category'),
    gender: v.string(),
    size: v.string(),
    quantity: v.number(),
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

const createDonationRequest = mutation({
  args: {
    imageUrl: v.optional(v.string()),
    title: v.string(),
    duration: v.number(),
    description: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    address: v.string(),
    clothRequest: v.array(
      v.object({
        categoryId: v.id('ref_cloth_category'),
        gender: v.string(),
        size: v.string(),
        quantity: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const getDonationRequestStatusId = await ctx.db
      .query('ref_donation_request_status')
      .withIndex('status', (q) => q.eq('status', 'PENDING'))
      .collect();

    const statusId = getDonationRequestStatusId[0]._id;

    const createDonationRequest = await ctx.db.insert('donation_request', {
      imageUrl: args.imageUrl,
      title: args.title,
      duration: args.duration,
      description: args.description,
      address: args.address,
      statusId: statusId,
      userId,
    });

    if (!createDonationRequest) {
      throw new Error('Failed to create donation request');
    }

    if (args.clothRequest) {
      for (const clothRequest of args.clothRequest) {
        const insertClothRequest = await ctx.db.insert('cloth_request', {
          categoryId: clothRequest.categoryId,
          gender: clothRequest.gender,
          size: clothRequest.size,
          quantity: clothRequest.quantity,
        });

        if (!insertClothRequest) {
          throw new Error('Failed to create cloth request');
        }

        await ctx.db.insert('map_donation_request_details', {
          donationRequestId: createDonationRequest,
          clothRequestId: insertClothRequest,
        });
      }
    }
  },
});

const updateDonationRequestStatus = mutation({
  args: {
    donationRequestId: v.id('donation_request'),
    statusId: v.optional(v.id('ref_donation_request_status')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const donationRequest = await ctx.db.get(args.donationRequestId);

    if (!donationRequest) {
      throw new Error('Donation Request not found');
    }

    return await ctx.db.patch(args.donationRequestId, {
      statusId: args.statusId,
    });
  },
});

export {
  getAllDonationRequest,
  getDonationRequestById,
  getAllDonationRequestDetail,
  createDonationRequest,
  createDonationRequestDetail,
  updateDonationRequestStatus,
};
