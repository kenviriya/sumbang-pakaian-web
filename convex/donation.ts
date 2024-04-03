import {query} from './_generated/server';

const getAll = query({
  handler: async (ctx) => {
    const donation = await ctx.db.query('donation').collect();
    const donationRequests = await ctx.db.query('donation_request').collect();
    const requestStatus = await ctx.db.query('ref_status').collect();

    const tableJoin = donation.map((donation) => {
      const relatedRequest = donationRequests.find(
        (request) => request._id === donation.donationRequest
      );
      const relatedStatus = requestStatus.find(
        (status) => status._id === relatedRequest?.status
      );
      return {
        donation,
        donationRequest: relatedRequest,
        donationStatus: relatedStatus?.name,
      };
    });

    const donations = tableJoin.map((data) => ({
      title: data?.donationRequest?.title,
      description: data?.donationRequest?.description,
      image: data?.donationRequest?.image,
      startDate: data?.donationRequest?.startDate,
      endDate: data?.donationRequest?.endDate,
      requestStatus: data?.donationStatus,
      donationStatus: data?.donation.status === false ? 'Not Active' : 'Active',
    }));

    return donations;
  },
});

export {getAll};
