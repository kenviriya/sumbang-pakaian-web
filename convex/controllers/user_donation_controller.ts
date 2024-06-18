import { query, mutation } from "@/convex/_generated/server";
import { v } from "convex/values";

const getUserDonation = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const getDonations = await ctx.db.query("donation").collect();

    const getDonationRequest = await ctx.db.query("donation_request").collect();

    const getDonationForm = await ctx.db.query("donation_form").collect();

    const getUserDonations = await ctx.db
      .query("user_contribution")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const getMapDonationContributionDetails = await ctx.db
      .query("map_user_contribution_details")
      .collect();

    const getClothDonation = await ctx.db
      .query("user_contribution_detail")
      .collect();

    const getClothCategory = await ctx.db.query("ref_cloth_category").collect();

    const getDonationsMap = new Map(
      getDonations.map((donation) => [donation._id, donation]),
    );

    const getDonationRequestMap = new Map(
      getDonationRequest.map((donationRequest) => [
        donationRequest._id,
        donationRequest,
      ]),
    );

    const getDonationFormMap = new Map(
      getDonationForm.map((donationForm) => [donationForm._id, donationForm]),
    );

    return getUserDonations.map((userDonation) => {
      const donationForm = getDonationFormMap.get(userDonation.donationFormId);
      let donation;
      let donationRequest;
      if (donationForm) {
        donation = getDonationsMap.get(donationForm.donationId);
        if (donation) {
          donationRequest = getDonationRequestMap.get(
            donation.donationRequestId,
          );
        }
      }

      let userClothDonation;
      if (userDonation) {
        const donationDetail = getMapDonationContributionDetails.filter(
          (detail) => detail.userContributionId === userDonation._id,
        );

        if (donationDetail.length > 0) {
          donationDetail.map((detail) => {
            const clothesIds = donationDetail.map(
              (detail) => detail.userContributionDetailId,
            );

            const clothes = getClothDonation.filter((cloth) =>
              clothesIds.includes(cloth._id),
            );

            userClothDonation = clothes.map((cloth) => {
              const category = getClothCategory.find(
                (category) => category._id === cloth.categoryId,
              );
              return {
                size: cloth.size,
                gender: cloth.gender,
                category: category?.name,
                quantity: cloth.quantity,
              };
            });
          });
        }

        return {
          donationFormId: userDonation.donationFormId,
          donationId: donation?._id,
          donationRequestId: donation?.donationRequestId,
          donationTitle: donationRequest?.title,
          userClothDonation,
        };
      }
    });
  },
});

const createUserDonation = mutation({
  args: {
    donationFormId: v.id("donation_form"),
    clothDonation: v.array(
      v.object({
        categoryId: v.id("ref_cloth_category"),
        gender: v.string(),
        size: v.string(),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const getDonationForm = await ctx.db.get(args.donationFormId);

    if (getDonationForm) {
      const getDonation = await ctx.db.get(getDonationForm.donationId);

      if (!getDonation) {
        throw new Error("Donation not found");
      }

      const donationRequest = await ctx.db.get(getDonation.donationRequestId);

      if (!donationRequest) {
        throw new Error("Donation Request not found");
      }
    }

    const insertUserDonation = await ctx.db.insert("user_contribution", {
      userId,
      donationFormId: args.donationFormId,
    });
  },
});

export { getUserDonation, createUserDonation };
