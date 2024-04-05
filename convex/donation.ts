import {v} from 'convex/values';
import {query} from './_generated/server';

const getAllDonation = query({
  handler: async (ctx) => {
    const donation = await ctx.db.query('donation').collect();
    const donationRequests = await ctx.db.query('donation_request').collect();
    const requestStatus = await ctx.db.query('ref_request_status').collect();
    const donationStatus = await ctx.db.query('ref_donation_status').collect();

    const tableJoin = donation.map((donation) => {
      const relatedRequest = donationRequests.find(
        (request) => request._id === donation.donationRequest
      );
      const relatedRequestStatus = requestStatus.find(
        (status) => status._id === relatedRequest?.status
      );
      const relatedStatusDonation = donationStatus.find(
        (status) => status._id === donation.status
      );
      return {
        donation,
        donationRequest: relatedRequest,
        requestStatus: relatedRequestStatus?.status,
        donationStatus: relatedStatusDonation?.status,
      };
    });

    const donations = tableJoin.map((data) => ({
      title: data?.donationRequest?.title,
      description: data?.donationRequest?.description,
      image: data?.donationRequest?.image,
      startDate: data?.donationRequest?.startDate,
      endDate: data?.donationRequest?.endDate,
      requestStatus: data?.requestStatus,
      donationStatus: data?.donationStatus,
    }));

    return donations;
  },
});

const getDonationById = query({
  args: {
    donationId: v.id('donation'),
  },
  handler: async (ctx, args) => {
    const getDonation = await ctx.db.get(args.donationId);

    if (!getDonation) {
      throw new Error('Donation not found');
    }

    const donationRequests = await ctx.db.query('donation_request').collect();
    const requestStatus = await ctx.db.query('ref_request_status').collect();
    const donationStatus = await ctx.db.query('ref_donation_status').collect();

    const tableJoin = donationRequests.map((donationRequest) => {
      const relatedRequestStatus = requestStatus.find(
        (status) => status._id === donationRequest?.status
      );
      const relatedStatusDonation = donationStatus.find(
        (status) => status._id === getDonation.status
      );
      return {
        donationRequest,
        requestStatus: relatedRequestStatus?.status,
        donationStatus: relatedStatusDonation?.status,
      };
    });

    const donationRequest = tableJoin.find(
      (data) => data?.donationRequest?._id === getDonation.donationRequest
    );

    if (!donationRequest) {
      throw new Error('Donation not found');
    }

    const donation = {
      title: donationRequest?.donationRequest?.title,
      description: donationRequest?.donationRequest?.description,
      image: donationRequest?.donationRequest?.image,
      startDate: donationRequest?.donationRequest?.startDate,
      endDate: donationRequest?.donationRequest?.endDate,
      requestStatus: donationRequest?.requestStatus,
      donationStatus: donationRequest?.donationStatus,
    };

    return donation;
  },
});

export {getAllDonation, getDonationById};
