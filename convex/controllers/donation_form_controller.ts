import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

const getAllDonationForm = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const getDonationForms = await ctx.db.query("donation_form").collect();

    const getDonations = await ctx.db.query("donation").collect();

    const getDonationFormStatus = await ctx.db
      .query("ref_donation_form_status")
      .collect();

    const getMapDonationFormDetails = await ctx.db
      .query("map_donation_form_details")
      .collect();

    const getDonationFormDetails = await ctx.db
      .query("donation_form_detail")
      .collect();

    const getClothCategory = await ctx.db.query("ref_cloth_category").collect();

    if (getDonationForms.length > 0) {
      return getDonationForms.map((donationForm) => {
        const donation = getDonations.find(
          (donation) => donation._id === donationForm.donationId,
        );

        const donationFormStatus = getDonationFormStatus.find(
          (status) => status._id === donationForm.statusId,
        );

        const mapDonationFormDetails = getMapDonationFormDetails.filter(
          (detail) => detail.donationFormId === donationForm._id,
        );

        const donationFormDetails = mapDonationFormDetails.map((detail) => {
          const cloth = getDonationFormDetails.find(
            (cloth) => cloth._id === detail.donationFormDetailId,
          );

          if (cloth) {
            const category = getClothCategory.find(
              (category) => category._id === cloth.categoryId,
            );
            return {
              size: cloth.size,
              gender: cloth.gender,
              quantity: cloth.quantity,
              category: category?.name,
            };
          }
        });

        return {
          formId: donationForm._id,
          donationId: donation?._id,
          formStatus: donationFormStatus?.status,
          deadlineDate: donationForm.deadlineDate,
          donationClothRequest: donationFormDetails,
        };
      });
    }
  },
});

const getDonationFormById = query({
  args: {
    donationFormId: v.id("donation_form"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const getDonationForms = await ctx.db.get(args.donationFormId);

    const getDonations = await ctx.db.query("donation").collect();

    const getDonationFormStatus = await ctx.db
      .query("ref_donation_form_status")
      .collect();

    const getMapDonationFormDetails = await ctx.db
      .query("map_donation_form_details")
      .collect();

    const getDonationFormDetails = await ctx.db
      .query("donation_form_detail")
      .collect();

    const getClothCategory = await ctx.db.query("ref_cloth_category").collect();

    if (getDonationForms) {
      const donation = getDonations.find(
        (donation) => donation._id === getDonationForms.donationId,
      );

      const donationFormStatus = getDonationFormStatus.find(
        (status) => status._id === getDonationForms.statusId,
      );

      const mapDonationFormDetails = getMapDonationFormDetails.filter(
        (detail) => detail.donationFormId === getDonationForms._id,
      );

      const donationFormDetails = mapDonationFormDetails.map((detail) => {
        const cloth = getDonationFormDetails.find(
          (cloth) => cloth._id === detail.donationFormDetailId,
        );

        if (cloth) {
          const category = getClothCategory.find(
            (category) => category._id === cloth.categoryId,
          );
          return {
            size: cloth.size,
            gender: cloth.gender,
            quantity: cloth.quantity,
            category: category?.name,
          };
        }
      });

      return {
        formId: getDonationForms._id,
        donationId: donation?._id,
        formStatus: donationFormStatus?.status,
        deadlineDate: getDonationForms.deadlineDate,
        donationClothRequest: donationFormDetails,
      };
    }
  },
});

const createDonationForm = mutation({
  args: {
    donationId: v.id("donation"),
    deadlineDate: v.string(),
    clothRequest: v.array(
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

    const getStatusPending = await ctx.db
      .query("ref_donation_form_status")
      .withIndex("status", (q) => q.eq("status", "PENDING"))
      .collect();

    const statusId = getStatusPending[0]._id;

    const createDonationForm = await ctx.db.insert("donation_form", {
      userId: userId,
      donationId: args.donationId,
      deadlineDate: args.deadlineDate,
      statusId: statusId,
    });

    if (!createDonationForm) {
      throw new Error("Failed to create donation request");
    }

    if (args.clothRequest) {
      for (const clothRequest of args.clothRequest) {
        const insertClothRequest = await ctx.db.insert("donation_form_detail", {
          categoryId: clothRequest.categoryId,
          gender: clothRequest.gender,
          size: clothRequest.size,
          quantity: clothRequest.quantity,
        });

        if (!insertClothRequest) {
          throw new Error("Failed to create cloth request");
        }

        await ctx.db.insert("map_donation_form_details", {
          donationFormId: createDonationForm,
          donationFormDetailId: insertClothRequest,
        });
      }
    }
  },
});

export { getAllDonationForm, getDonationFormById, createDonationForm };
