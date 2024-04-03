import {query} from './_generated/server';

const getAll = query({
  handler: async (ctx) => {
    const donation = await ctx.db.query('donation').collect();
    const donationRequests = await ctx.db.query('donation_request').collect();

    const tableJoin = donation.map((donation) => {
      const relatedRequest = donationRequests.find(
        (request) => request._id === donation.donationRequest
      );
      return {
        donation,
        donationRequest: relatedRequest,
      };
    });

    const donations = tableJoin.map((data) => ({
      title: data?.donationRequest?.title,
      description: data?.donationRequest?.description,
      image: data?.donationRequest?.image,
      startDate: data?.donationRequest?.startDate,
      endDate: data?.donationRequest?.endDate,
      requestStatus:
        data?.donationRequest?.status === 'Pending' ? 'Pending' : 'Completed',
      donationStatus: data?.donation.status === false ? 'Pending' : 'Completed',
    }));

    return donations;
  },
});

export {getAll};
