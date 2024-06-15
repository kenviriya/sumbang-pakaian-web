import {mutation, query} from '@/convex/_generated/server';
import {v} from 'convex/values';

const getAllDonations = query({
  handler: async (ctx) => {
    const getDonations = await ctx.db.query('donation').collect();
    const getDonationRequests = await ctx.db
      .query('donation_request')
      .collect();
    const getDonationStatus = await ctx.db
      .query('ref_donation_status')
      .collect();
    const getRequestDetail = await ctx.db
      .query('map_donation_request_details')
      .collect();
    const getClothRequest = await ctx.db.query('cloth_request').collect();
    const getClothCategory = await ctx.db.query('ref_cloth_category').collect();

    const donationRequestMap = new Map(
      getDonationRequests.map((donationRequest) => [
        donationRequest._id,
        donationRequest,
      ])
    );

    const donationStatusMap = new Map(
      getDonationStatus.map((statusId) => [statusId._id, statusId])
    );

    return getDonations.map((donation) => {
      const donationRequest = donationRequestMap.get(
        donation.donationRequestId
      );
      const donationStatus = donationStatusMap.get(donation.statusId);

      let donationTitle,
        donationImageUrl,
        donationDescription,
        donationDuration,
        donationAddress,
        clothRequest;
      if (donationRequest) {
        ({
          title: donationTitle,
          imageUrl: donationImageUrl,
          description: donationDescription,
          duration: donationDuration,
          address: donationAddress,
        } = donationRequest);
        const requestDetail = getRequestDetail.filter(
          (detail) => detail.donationRequestId === donation.donationRequestId
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
        donationId: donation._id,
        requestId: donation.donationRequestId,
        donationStatus: donationStatus?.status,
        title: donationTitle,
        imageUrl: donationImageUrl,
        description: donationDescription,
        duration: donationDuration,
        address: donationAddress,
        clothRequest,
      };
    });
  },
});

const getDonationById = query({
  args: {
    donationId: v.id('donation'),
  },
  handler: async (ctx, args) => {
    const getDonation = await ctx.db.get(args.donationId);

    if (!getDonation) {
      throw new Error(`Donation with ${args.donationId} not found`);
    }

    const getDonationStatus = await ctx.db
      .query('ref_donation_status')
      .collect();
    const getRequestDetail = await ctx.db
      .query('map_donation_request_details')
      .collect();
    const getClothRequest = await ctx.db.query('cloth_request').collect();
    const getClothCategory = await ctx.db.query('ref_cloth_category').collect();

    const donationStatusMap = new Map(
      getDonationStatus.map((status) => [status._id, status])
    );

    let donationTitle,
      donationImageUrl,
      donationDescription,
      donationDuration,
      donationAddress,
      clothRequest;
    const donationStatus = donationStatusMap.get(getDonation.statusId);

    if (getDonation) {
      const donationRequest = await ctx.db.get(getDonation.donationRequestId);
      if (donationRequest) {
        ({
          title: donationTitle,
          imageUrl: donationImageUrl,
          description: donationDescription,
          duration: donationDuration,
          address: donationAddress,
        } = donationRequest);
      }
      const requestDetail = getRequestDetail.filter(
        (detail) => detail.donationRequestId === donationRequest?._id
      );
      if (requestDetail.length) {
        const clothesIds = requestDetail.map((detail) => detail.clothRequestId);
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
      donationId: getDonation._id,
      requestId: getDonation.donationRequestId,
      donationStatus: donationStatus?.status,
      title: donationTitle,
      imageUrl: donationImageUrl,
      description: donationDescription,
      duration: donationDuration,
      address: donationAddress,
      clothRequest,
    };
  },
});

const createDonation = mutation({
  args: {
    donationRequestId: v.id('donation_request'),
    statusId: v.id('ref_donation_status'),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    return await ctx.db.insert('donation', {
      donationRequestId: args.donationRequestId,
      statusId: args.statusId,
      startDate: args.startDate,
      endDate: args.endDate,
    });
  },
});

const updateDonationStatus = mutation({
  args: {
    donationId: v.id('donation'),
    statusId: v.id('ref_donation_status'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const getDonation = await ctx.db.get(args.donationId);

    if (!getDonation) {
      throw new Error(`Donation with ${args.donationId} not found`);
    }

    return await ctx.db.patch(args.donationId, {
      statusId: args.statusId,
    });
  },
});

export {getAllDonations, getDonationById, createDonation, updateDonationStatus};
