import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "@/convex/_generated/api";
import { Id } from "./_generated/dataModel";
import { table } from "console";

const getAllRequestDonation = query({
  handler: async (ctx) => {
    const donation = await ctx.db.query("donation").collect();
    const donationRequests = await ctx.db.query("donation_request").collect();
    const requestStatus = await ctx.db.query("ref_request_status").collect();
    const donationStatus = await ctx.db.query("ref_donation_status").collect();
    const mappingRequestDetail = await ctx.db
      .query("map_request_details")
      .collect();
    const clothRequest = await ctx.db.query("cloth_request").collect();
    const refCategory = await ctx.db.query("ref_cloth_category").collect();

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
      const mapRequestData = mappingRequestDetail.find(
        (mapCloth) => mapCloth.donationRequestId === donation.donationRequest
      );
      const clothRequests = clothRequest.find(
        (clothData) => clothData._id === mapRequestData?.clothId
      );
      const refClothCategory = refCategory.find(
        (category) => category._id === clothRequests?.category
      );
      return {
        donation,
        donationRequest: relatedRequest,
        clothRequests,
        refClothCategory,
        requestStatus: relatedRequestStatus?.status,
        donationStatus: relatedStatusDonation?.status,
      };
    });

    const donations = tableJoin.map((data) => ({
      donationId: data?.donation._id,
      title: data?.donationRequest?.title,
      description: data?.donationRequest?.description,
      image: data?.donationRequest?.image,
      startDate: data?.donationRequest?.startDate,
      endDate: data?.donationRequest?.endDate,
      requestStatus: data?.requestStatus,
      donationStatus: data?.donationStatus,
      clothName: data?.clothRequests?.name,
      clothQuantity: data?.clothRequests?.quantity,
      clothSize: data?.clothRequests?.size,
      clothType: data?.clothRequests?.type,
      clothCategory: data?.refClothCategory?.name,
      uploadTime: data?.donation?._creationTime,
    }));

    return donations;
  },
});

const getDonationStatus = query({
  handler: async (ctx) => {
    const getDonationStatus = await ctx.db
      .query("ref_donation_status")
      .collect();
    return getDonationStatus;
  },
});

const getRequestDonationStatus = query({
  handler: async (ctx) => {
    const getRequestDonationStatus = await ctx.db
      .query("ref_request_status")
      .collect();
    return getRequestDonationStatus;
  },
});

const getDonationById = query({
  args: {
    donationId: v.id("donation"),
  },
  handler: async (ctx, args) => {
    const getDonation = await ctx.db.get(args.donationId);

    if (!getDonation) {
      throw new Error("Donation not found");
    }

    const donations = await ctx.db.query("donation").collect();
    const donationRequests = await ctx.db.query("donation_request").collect();
    const requestStatus = await ctx.db.query("ref_request_status").collect();
    const donationStatus = await ctx.db.query("ref_donation_status").collect();
    const mappingRequestDetail = await ctx.db
      .query("map_request_details")
      .collect();
    const clothRequest = await ctx.db.query("cloth_request").collect();
    const refCategory = await ctx.db.query("ref_cloth_category").collect();

    const tableJoin = donations.map((donation) => {
      const relatedRequest = donationRequests.find(
        (request) => request._id === donation.donationRequest
      );
      const relatedRequestStatus = requestStatus.find(
        (status) => status._id === relatedRequest?.status
      );
      const relatedStatusDonation = donationStatus.find(
        (status) => status._id === donation.status
      );
      const mapRequestData = mappingRequestDetail.find(
        (mapCloth) => mapCloth.donationRequestId === donation.donationRequest
      );
      const clothRequests = clothRequest.find(
        (clothData) => clothData._id === mapRequestData?.clothId
      );
      const refClothCategory = refCategory.find(
        (category) => category._id === clothRequests?.category
      );
      return {
        donation,
        donationRequest: relatedRequest,
        clothRequests,
        refClothCategory,
        requestStatus: relatedRequestStatus?.status,
        donationStatus: relatedStatusDonation?.status,
      };
    });

    const donationRequestById = tableJoin.find(
      (data) => data?.donationRequest?._id === getDonation.donationRequest
    );

    if (!donationRequestById) {
      throw new Error("Donation not found");
    }

    const donation = {
      title: donationRequestById?.donationRequest?.title,
      description: donationRequestById?.donationRequest?.description,
      image: donationRequestById?.donationRequest?.image,
      startDate: donationRequestById?.donationRequest?.startDate,
      endDate: donationRequestById?.donationRequest?.endDate,
      requestStatus: donationRequestById?.requestStatus,
      donationStatus: donationRequestById?.donationStatus,
      clothName: donationRequestById?.clothRequests?.name,
      clothQuantity: donationRequestById?.clothRequests?.quantity,
      clothSize: donationRequestById?.clothRequests?.size,
      clothType: donationRequestById?.clothRequests?.type,
      clothCategory: donationRequestById?.refClothCategory?.name,
    };

    return donation;
  },
});

const getAllDonationFormData = query({
  handler: async (ctx) => {
    const donationForm = await ctx.db.query("donation_form").collect();
    const donationFormDetail = await ctx.db
      .query("donation_form_detail")
      .collect();
    const donate = await ctx.db.query("donation").collect();
    const donationContributionStatus = await ctx.db
      .query("ref_donation_contributor_status")
      .collect();

    const categoryDonation = await ctx.db.query("ref_cloth_category").collect();
    const donationData = await ctx.db.query("donation").collect();
    const donationRequests = await ctx.db.query("donation_request").collect();

    const tableJoin = donationForm.map((donation) => {
      const formDetail = donationFormDetail.find(
        (formDetail) => formDetail._id === donation.donationFormDetailId
      );
      const donations = donate.find(
        (donations) => donations?._id === donation.donation
      );
      const donationFormStatus = donationContributionStatus.find(
        (status) => status._id === donation.donationContributorStatus
      );
      const donationCategory = categoryDonation.find(
        (category) => category?._id === formDetail?.category
      );
      const donationDataJoin = donationData.find(
        (donate) => donate?._id === donation?.donation
      );
      const donationRequestData = donationRequests.find(
        (donateRequest) =>
          donateRequest?._id === donationDataJoin?.donationRequest
      );
      return {
        donationForm: donation,
        donation: donations,
        donationRequest: donationRequestData,
        donationFormDetail: formDetail,
        donationStatus: donationFormStatus?.status,
        donationClothCategory: donationCategory?.name,
        donationRequestTitle: donationRequestData?.title,
      };
    });

    const formDonationDetail = tableJoin.map((data) => ({
      id: data.donationForm._id,
      donationId: data?.donation?._id,
      donationFormDetailId: data?.donationFormDetail?._id,
      donationContributionStatus: data?.donationStatus,
      donationCategory: data?.donationClothCategory,
      donationQuantity: data?.donationFormDetail?.quantity,
      userId: data?.donationForm.userId,
      donationDeadlineDate: data?.donationForm.deadlineDate,
      donationRequestId: data?.donationRequest?._id,
      donationRequestTitle: data?.donationRequestTitle,
      donationRequestAddress: data?.donationRequest?.address,
    }));

    return formDonationDetail;
  },
});

const getDonationFormDataById = query({
  args: {
    donationFormId: v.id("donation_form"),
  },
  handler: async (ctx, args) => {
    const getDonationFormId = await ctx.db.get(args.donationFormId);
    const donationForm = await ctx.db.query("donation_form").collect();
    const donationFormDetail = await ctx.db
      .query("donation_form_detail")
      .collect();
    const donate = await ctx.db.query("donation").collect();
    const donateRequest = await ctx.db.query("donation_request").collect();
    const donationContributionStatus = await ctx.db
      .query("ref_donation_contributor_status")
      .collect();

    const categoryDonation = await ctx.db.query("ref_cloth_category").collect();

    if (!getDonationFormId) {
      throw new Error("Donation Form data not found");
    }

    const tableJoin = donationForm.map((donation) => {
      const formDetail = donationFormDetail.find(
        (formDetail) => formDetail._id === donation.donationFormDetailId
      );
      const donationsJoin = donate.find(
        (donations) => donations?._id === donation.donation
      );
      const donationFormStatus = donationContributionStatus.find(
        (status) => status._id === donation.donationContributorStatus
      );
      const donationCategory = categoryDonation.find(
        (category) => category?._id === formDetail?.category
      );
      const donationsRequestJoin = donateRequest.find(
        (donateRequest) => donateRequest?._id === donationsJoin?.donationRequest
      );
      return {
        donationForm: donation,
        donation: donationsJoin,
        donationFormDetail: formDetail,
        donationStatus: donationFormStatus?.status,
        donationClothCategory: donationCategory?.name,
        donationRequestId: donationsRequestJoin?._id,
        donationRequestTitle: donationsRequestJoin?.title,
        donationRequestAddress: donationsRequestJoin?.address,
      };
    });

    const getDonationFormDataById = tableJoin.find(
      (data) => data?.donationForm._id === getDonationFormId._id
    );

    const FormDonationDetailById = {
      donationId: getDonationFormDataById?.donation?._id,
      donationFormDetailId: getDonationFormDataById?.donationFormDetail?._id,
      donationContributionStatus: getDonationFormDataById?.donationStatus,
      donationCategory: getDonationFormDataById?.donationClothCategory,
      donationQuantity: getDonationFormDataById?.donationFormDetail?.quantity,
      userId: getDonationFormDataById?.donationForm.userId,
      donationDeadlineDate: getDonationFormDataById?.donationForm.deadlineDate,
      donationRequestId: getDonationFormDataById?.donationRequestId,
      donationRequestTitle: getDonationFormDataById?.donationRequestTitle,
      donationRequestAddress: getDonationFormDataById?.donationRequestAddress,
    };

    return FormDonationDetailById;
  },
});

const getDonationContributor = query({
  handler: async (ctx) => {
    const donationContributor = await ctx.db
      .query("donation_contributor")
      .collect();
    const donate = await ctx.db.query("donation").collect();
    const donateRequest = await ctx.db.query("donation_request").collect();

    const tableJoin = donationContributor.map((donationContrib) => {
      const donations = donate.find(
        (donations) => donations?._id === donationContrib.donation
      );
      const donationRequest = donateRequest.find(
        (donationRequest) => donationRequest?._id === donations?.donationRequest
      );
      return {
        id: donationContrib._id,
        userId: donationContrib?.userId,
        donations: donations?._id,
        donationAddress: donationRequest?.address,
        donationTitle: donationRequest?.title,
      };
    });

    return tableJoin;
  },
});

const getDonationContributorByUser = query({
  handler: async (ctx) => {
    const donationContributor = await ctx.db
      .query("donation_contributor")
      .collect();
    const donate = await ctx.db.query("donation").collect();
    const donateRequest = await ctx.db.query("donation_request").collect();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User not Authenticated");
    }

    const tableJoin = donationContributor.map((donationContrib) => {
      const donations = donate.find(
        (donations) => donations?._id === donationContrib.donation
      );
      const donationRequest = donateRequest.find(
        (donationRequest) => donationRequest?._id === donations?.donationRequest
      );
      return {
        id: donationContrib._id,
        userId: donationContrib?.userId,
        donations: donations?._id,
        donationAddress: donationRequest?.address,
        donationTitle: donationRequest?.title,
      };
    });

    const getContributionByUserId = tableJoin.find(
      (data) => data?.userId === identity.subject
    );

    const donationContributionMap = {
      id: getContributionByUserId?.id,
      userId: getContributionByUserId?.userId,
      donationId: getContributionByUserId?.donations,
      donationAddress: getContributionByUserId?.donationAddress,
      donationTitle: getContributionByUserId?.donationTitle,
    };

    return donationContributionMap;
  },
});

const createDonationRequest = mutation({
  args: {
    donationTitle: v.string(),
    donationDescription: v.string(),
    donationImage: v.string(),
    donationStatus: v.string(),
    donationEndDate: v.string(),
    donationStartDate: v.string(),
    donationAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const statusDonation = await ctx.db.query("ref_request_status").collect();
    const statusRequestCompare = statusDonation.find(
      (data) => data?._id === args.donationStatus
    );

    if (!statusRequestCompare) {
      throw new Error("Request Status not Validated");
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
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

    const cloth = await ctx.db.insert("donation_request", {
      title: args.donationTitle,
      description: args.donationDescription,
      startDate: args.donationStartDate,
      endDate: args.donationEndDate,
      image: args.donationImage,
      status: args.donationStatus as Id<"ref_request_status">,
      address: args.donationAddress,
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
    const statusDonation = await ctx.db.query("ref_donation_status").collect();
    const donationRequest = await ctx.db.query("donation_request").collect();
    const statusDonationCompare = statusDonation.find(
      (data) => data?._id === args.donationStatus
    );
    const donationRequestCheck = donationRequest.find(
      (data) => data?._id === args.donationRequest
    );

    if (!statusDonationCompare || !donationRequestCheck) {
      throw new Error("Donation Status Error");
    }

    const donationCreate = await ctx.db.insert("donation", {
      donationRequest: args.donationRequest as Id<"donation_request">,
      status: args.donationStatus as Id<"ref_donation_status">,
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
    const cloth = await ctx.db.query("cloth_request").collect();
    const donationRequest = await ctx.db.query("donation_request").collect();
    const checkCloth = cloth.find((data) => data?._id === args.donationCloth);
    const donationRequestCheck = donationRequest.find(
      (data) => data?._id === args.donationRequest
    );

    if (!checkCloth || !donationRequestCheck) {
      throw new Error("Error in Checking Request Detail");
    }

    const mapRequestDetail = await ctx.db.insert("map_request_details", {
      clothId: args.donationCloth as Id<"cloth_request">,
      donationRequestId: args.donationRequest as Id<"donation_request">,
    });

    return mapRequestDetail;
  },
});

const createNotification = mutation({
  args: {
    notificationDescription: v.string(),
    notificationStatus: v.boolean(),
    notificationTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const createNotification = await ctx.db.insert("notification", {
      description: args.notificationDescription,
      status: args.notificationStatus,
      title: args.notificationTitle,
      userId,
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
    const donationContribution = await ctx.db
      .query("user_contribution")
      .collect();
    const donation = await ctx.db.query("donation").collect();
    const contributionCheck = donationContribution.find(
      (data) => data?._id === args.donationContributionId
    );
    const donationCheck = donation.find(
      (data) => data?._id === args.donationId
    );

    if (!contributionCheck || !donationCheck) {
      throw new Error("Error in Checking Request Detail");
    }

    const createMapDonationContribution = await ctx.db.insert(
      "map_donation_contribution",
      {
        donationContriboutionId:
          args.donationContributionId as Id<"user_contribution">,
        donationId: args.donationId as Id<"donation">,
      }
    );

    return createMapDonationContribution;
  },
});

const createDonationForm = mutation({
  args: {
    donationFormDetailId: v.string(),
    donationContributorStatusId: v.string(),
    donationId: v.string(),
    deadlineDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const donationFormDetail = await ctx.db
      .query("donation_form_detail")
      .collect();
    const donationFormDetailCheck = donationFormDetail.find(
      (data) => data?._id === args.donationFormDetailId
    );
    const donationContributorStatus = await ctx.db
      .query("ref_donation_contributor_status")
      .collect();

    const donationContributorCheck = donationContributorStatus.find(
      (data) => data?._id === args.donationContributorStatusId
    );
    const donations = await ctx.db.query("donation_form_detail").collect();
    const donationCheck = donations.find(
      (data) => data?._id === args.donationId
    );
    if (
      !donationFormDetailCheck ||
      !donationContributorCheck ||
      donationCheck
    ) {
      throw new Error("Invalid occured in checking donation data");
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const createMapDonationForm = await ctx.db.insert("donation_form", {
      donationFormDetailId:
        args.donationFormDetailId as Id<"donation_form_detail">,
      donationContributorStatus:
        args.donationContributorStatusId as Id<"ref_donation_contributor_status">,
      donation: args.donationId as Id<"donation">,
      userId,
      deadlineDate: args.deadlineDate,
    });

    return createMapDonationForm;
  },
});

const createDonationFormDetail = mutation({
  args: {
    categoryId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.query("ref_cloth_category").collect();
    const categoryCheck = category.find(
      (data) => data?._id === args.categoryId
    );
    if (!categoryCheck) {
      throw new Error("Category not Found");
    }
    const insertDonationDetail = await ctx.db.insert("donation_form_detail", {
      category: args.categoryId as Id<"ref_cloth_category">,
      quantity: args.quantity,
    });

    return insertDonationDetail;
  },
});

const createDonationContributor = mutation({
  args: {
    donationId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db.query("donation").collect();
    const donationCheck = donation.find(
      (data) => data?._id === args.donationId
    );
    if (!donationCheck) {
      throw new Error("donation not Available");
    }

    const insertDonationContributor = await ctx.db.insert(
      "donation_contributor",
      {
        donation: args.donationId as Id<"donation">,
        userId: args.userId,
      }
    );

    return insertDonationContributor;
  },
});

const createClothRequest = mutation({
  args: {
    clothName: v.string(),
    clothQuantity: v.number(),
    clothSize: v.string(),
    clothType: v.string(),
    clothCategory: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const clothCategory = await ctx.db.query("ref_cloth_category").collect();
    const clothCheck = clothCategory.find(
      (data) => data?._id === args.clothCategory
    );

    if (!identity) {
      throw new Error("User not authenticated");
    } else if (!clothCheck) {
      throw new Error("Invalid insert cloth request data");
    }

    const insertClothRequest = await ctx.db.insert("cloth_request", {
      name: args.clothName,
      quantity: args.clothQuantity,
      size: args.clothSize,
      type: args.clothType,
      category: args.clothCategory as Id<"ref_cloth_category">,
    });

    return insertClothRequest;
  },
});

export {
  getAllRequestDonation,
  getDonationById,
  getDonationStatus,
  getRequestDonationStatus,
  getAllDonationFormData,
  getDonationFormDataById,
  getDonationContributorByUser,
  createDonationRequest,
  createDonation,
  createMapRequestDetail,
  createNotification,
  createMapDonationContribution,
  createDonationForm,
  createDonationFormDetail,
  createDonationContributor,
  createClothRequest,
  getDonationContributor,
};
