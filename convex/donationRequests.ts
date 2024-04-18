import {v} from 'convex/values';
import {mutation, query} from './_generated/server';
import {api} from '@/convex/_generated/api';
import {Id} from './_generated/dataModel';

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

const getDonationStatus = query({
  handler: async (ctx) => {
      const getDonationStatus = await ctx.db.query('ref_donation_status').collect();
      return getDonationStatus;
  }
});

const getRequestDonationStatus = query({
  handler: async (ctx) => {
      const getRequestDonationStatus = await ctx.db.query('ref_request_status').collect();
      return getRequestDonationStatus;
  }
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

const createDonationRequest = mutation({
  args: {
    donationTitle: v.string(),
    donationDescription: v.string(),
    donationImage: v.string(),
    donationStatus: v.string(),
    donationEndDate: v.string(),
    donationStartDate: v.string()
  },
  handler: async (ctx, args) => {
    const statusDonation = await ctx.db.query('ref_request_status').collect();
    const statusRequestCompare = statusDonation.find(
      (data) => data?._id === args.donationStatus
    );

    if (!statusRequestCompare) {
      throw new Error('Request Status not Validated');
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    // start date dan end date akan di input oleh user bukan kita yang tentukan oleh kita

    // const currentDate = new Date();

    // kalau bisa ubah jadi ke id-ID timzone nya jakarta atau bangkok
    // const currentDateString = currentDate.toLocaleString('en-US', {
    //   timeZone: 'Asia/Singapore',
    // });

    // const deadline = new Date(currentDate);
    // deadline.setMonth(currentDate.getMonth() + 3);

    // const deadlines = deadline.toLocaleString('en-US', {
    //   timeZone: 'Asia/Singapore',
    // });

    const cloth = await ctx.db.insert('donation_request', {
      title: args.donationTitle,
      description: args.donationDescription,
      startDate: args.donationStartDate,
      endDate: args.donationEndDate,
      image: args.donationImage,
      status: args.donationStatus as Id<'ref_request_status'>,
      userId,
    });

    return cloth;
  },
});

const createDonation = mutation({
  args: {
    donationRequest: v.string(),
    donationStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const statusDonation = await ctx.db.query('ref_donation_status').collect();
    const donationRequest = await ctx.db.query('donation_request').collect();
    const statusDonationCompare = statusDonation.find(
      (data) => data?._id === args.donationStatus
    );
    const donationRequestCheck = donationRequest.find(
      (data) => data?._id === args.donationRequest
    );

    if (!statusDonationCompare || !donationRequestCheck) {
      throw new Error('Donation Status Error');
    }

    const donationCreate = await ctx.db.insert('donation', {
      donationRequest: args.donationRequest as Id<'donation_request'>,
      status: args.donationStatus as Id<'ref_donation_status'>
    });

    return donationCreate;
  },
});

const createMapRequestDetail = mutation({
  args: {
    donationCloth: v.string(),
    donationRequest: v.string(),
  },
  handler: async (ctx, args) => {
    const cloth = await ctx.db.query('cloth_request').collect();
    const donationRequest = await ctx.db.query('donation_request').collect();
    const checkCloth = cloth.find(
      (data) => data?._id === args.donationCloth
    );
    const donationRequestCheck = donationRequest.find(
      (data) => data?._id === args.donationRequest
    );

    if (!checkCloth || !donationRequestCheck) {
      throw new Error('Error in Checking Request Detail');
    }

    const mapRequestDetail = await ctx.db.insert('map_request_details', {
      clothId: args.donationCloth as Id<'cloth_request'>,
      donationRequestId: args.donationRequest as Id<'donation_request'>
      
    });

    return mapRequestDetail;
  },
});

const createNotification = mutation({
  args: {
    notificationDescription: v.string(),
    notificationStatus: v.boolean(),
    notificationTitle: v.string()
  },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const createNotification = await ctx.db.insert('notification', {
      description: args.notificationDescription,
      status: args.notificationStatus,
      title: args.notificationTitle,
      userId
    });

    return createNotification;
  },
});

const createMapDonationContribution = mutation({
  args: {
    donationContributionId: v.string(),
    donationId: v.string(),
  },
  handler: async (ctx, args) => {
    const donationContribution = await ctx.db.query('user_contribution').collect();
    const donation = await ctx.db.query('donation').collect();
    const contributionCheck = donationContribution.find(
      (data) => data?._id === args.donationContributionId
    );
    const donationCheck = donation.find(
      (data) => data?._id === args.donationId
    );

    if (!contributionCheck || !donationCheck) {
      throw new Error('Error in Checking Request Detail');
    }

    const createMapDonationContribution = await ctx.db.insert('map_donation_contribution', {
      donationContriboutionId: args.donationContributionId as Id<'user_contribution'>,
      donationId: args.donationId as Id<'donation'>
      
    });

    return createMapDonationContribution;
  },
});




export {getAllDonation, getDonationById, getDonationStatus, getRequestDonationStatus, createDonationRequest, createDonation, createMapRequestDetail, createNotification, createMapDonationContribution};