import { internalMutation, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import {
  findAllDonationForms,
  findDonationForm,
  findOneDonationForm,
} from "@/convex/repositories/DonationFormRepository";
import { findOneDonation } from "@/convex/repositories/DonationRepository";
import {
  findDonationFormStatus,
  findOneDonationFormStatus,
} from "@/convex/repositories/RefDonationFormStatusRepository";
import { findAllMapDonationFormDetails } from "@/convex/repositories/MapDonationFormDetailsRepository";
import { findOneClothCategory } from "@/convex/repositories/RefClothCategoryRepository";

import { getDonationRequestById } from "./donation_request_controller";
import { findOneDonationStatus } from "../repositories/RefDonationStatusRepository";

const filterDonationForm = query({
  args: {
    donationFormId: v.optional(v.id("donation_form")),
    donationId: v.optional(v.id("donation")),
    donationRequestId: v.optional(v.id("donation_request")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const getAllForm = await getAllDonationForm(ctx, {});

    if (args.donationFormId && getAllForm) {
      return getAllForm.filter((form) => form.formId === args.donationFormId);
    }

    if (args.donationId && getAllForm) {
      return getAllForm.filter((form) => form.donationId === args.donationId);
    }

    if (args.donationRequestId && getAllForm) {
      return getAllForm.filter(
        (form) => form.donationRequestId === args.donationRequestId,
      );
    }
  },
});

const getAllDonationForm = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const getDonationForms = await findAllDonationForms(ctx, {});

    if (getDonationForms) {
      return Promise.all(
        getDonationForms.map(async (donationForm) => {
          const getDonationFormStatus = await findOneDonationFormStatus(ctx, {
            id: donationForm.statusId,
          });

          const getDonation = await findOneDonation(ctx, {
            id: donationForm.donationId,
          });

          if (!getDonation) {
            throw new Error(`Donation ${donationForm.donationId} not found`);
          }

          const getDonationStatus = await findOneDonationStatus(ctx, {
            statusId: getDonation.statusId,
          });

          const donationRequest = await getDonationRequestById(ctx, {
            donationRequestId: getDonation.donationRequestId,
          });

          const getMapDonationFormDetails = await findAllMapDonationFormDetails(
            ctx,
            {},
          );

          const donationFormDetails = getMapDonationFormDetails.filter(
            (detail) => detail.donationFormId === donationForm._id,
          );

          let donationFormDetail;

          if (donationFormDetails.length > 0) {
            donationFormDetail = await Promise.all(
              donationFormDetails.map(async (detail) => {
                const clothes = await ctx.db.get(detail.donationFormDetailId);
                if (clothes) {
                  const getClothCategory = await findOneClothCategory(ctx, {
                    id: clothes.categoryId,
                  });
                  return {
                    size: clothes.size,
                    gender: clothes.gender,
                    category: getClothCategory?.name,
                    quantity: clothes.quantity,
                  };
                }
              }),
            );
          }
          return {
            formId: donationForm._id,
            userName: donationForm.userName,
            formReceipt: donationForm.receipt,
            donationId: getDonation?._id,
            donationStatus: getDonationStatus?.status,
            donationRequestId: getDonation.donationRequestId,
            donationImageUrl: donationRequest?.imageUrl,
            donationTitle: donationRequest?.title,
            donationDescription: donationRequest?.description,
            donationAddress: donationRequest?.address,
            donationPhone: donationRequest?.phoneNumber,
            donationStartDate: getDonation.startDate,
            donationEndDate: getDonation.endDate,
            donationDuration: donationRequest?.duration,
            formStatus: getDonationFormStatus?.status,
            deadlineDate: donationForm.deadlineDate,
            donationClothRequest: donationFormDetail,
          };
        }),
      );
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

    const getDonationForm = await findOneDonationForm(ctx, {
      id: args.donationFormId,
    });

    if (getDonationForm) {
      const getDonationFormStatus = await findOneDonationFormStatus(ctx, {
        id: getDonationForm.statusId,
      });

      const getDonation = await findOneDonation(ctx, {
        id: getDonationForm.donationId,
      });

      if (!getDonation) {
        throw new Error(`Donation ${getDonationForm.donationId} not found`);
      }

      const getDonationStatus = await findOneDonationStatus(ctx, {
        statusId: getDonation.statusId,
      });

      const donationRequest = await getDonationRequestById(ctx, {
        donationRequestId: getDonation.donationRequestId,
      });

      const getMapDonationFormDetails = await findAllMapDonationFormDetails(
        ctx,
        {},
      );

      const donationFormDetails = getMapDonationFormDetails.filter(
        (detail) => detail.donationFormId === getDonationForm._id,
      );

      let donationFormDetail;

      if (donationFormDetails.length > 0) {
        donationFormDetail = await Promise.all(
          donationFormDetails.map(async (detail) => {
            const clothes = await ctx.db.get(detail.donationFormDetailId);
            if (clothes) {
              const getClothCategory = await findOneClothCategory(ctx, {
                id: clothes.categoryId,
              });
              return {
                size: clothes.size,
                gender: clothes.gender,
                category: getClothCategory?.name,
                quantity: clothes.quantity,
              };
            }
          }),
        );
      }
      return {
        formId: getDonationForm._id,
        userName: getDonationForm.userName,
        formReceipt: getDonationForm.receipt,
        donationId: getDonation?._id,
        donationStatus: getDonationStatus?.status,
        donationImageUrl: donationRequest?.imageUrl,
        donationTitle: donationRequest?.title,
        donationDescription: donationRequest?.description,
        donationAddress: donationRequest?.address,
        donationPhone: donationRequest?.phoneNumber,
        donationStartDate: getDonation.startDate,
        donationEndDate: getDonation.endDate,
        donationDuration: donationRequest?.duration,
        formStatus: getDonationFormStatus?.status,
        deadlineDate: getDonationForm.deadlineDate,
        donationClothRequest: donationFormDetail,
      };
    }
  },
});

const getUserDonationForm = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const getDonationForms = await findDonationForm(ctx, {
      userId: userId,
    });

    if (getDonationForms) {
      return Promise.all(
        getDonationForms.map(async (donationForm) => {
          const getDonationFormStatus = await findOneDonationFormStatus(ctx, {
            id: donationForm.statusId,
          });

          const getDonation = await findOneDonation(ctx, {
            id: donationForm.donationId,
          });

          if (!getDonation) {
            throw new Error(`Donation ${donationForm.donationId} not found`);
          }

          const getDonationStatus = await findOneDonationStatus(ctx, {
            statusId: getDonation.statusId,
          });

          const donationRequest = await getDonationRequestById(ctx, {
            donationRequestId: getDonation.donationRequestId,
          });

          const getMapDonationFormDetails = await findAllMapDonationFormDetails(
            ctx,
            {},
          );

          const donationFormDetails = getMapDonationFormDetails.filter(
            (detail) => detail.donationFormId === donationForm._id,
          );

          let donationFormDetail;

          if (donationFormDetails.length > 0) {
            donationFormDetail = await Promise.all(
              donationFormDetails.map(async (detail) => {
                const clothes = await ctx.db.get(detail.donationFormDetailId);
                if (clothes) {
                  const getClothCategory = await findOneClothCategory(ctx, {
                    id: clothes.categoryId,
                  });
                  return {
                    size: clothes.size,
                    gender: clothes.gender,
                    category: getClothCategory?.name,
                    quantity: clothes.quantity,
                  };
                }
              }),
            );
          }
          return {
            formId: donationForm._id,
            userName: donationForm.userName,
            donationId: getDonation?._id,
            donationStatus: getDonationStatus?.status,
            donationImageUrl: donationRequest?.imageUrl,
            donationTitle: donationRequest?.title,
            donationDescription: donationRequest?.description,
            donationAddress: donationRequest?.address,
            donationPhone: donationRequest?.phoneNumber,
            donationStartDate: getDonation.startDate,
            donationEndDate: getDonation.endDate,
            donationDuration: donationRequest?.duration,
            formStatus: getDonationFormStatus?.status,
            deadlineDate: donationForm.deadlineDate,
            donationClothRequest: donationFormDetail,
          };
        }),
      );
    }
  },
});

const createDonationForm = mutation({
  args: {
    donationId: v.id("donation"),
    deadlineDate: v.string(),
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
    const userName = identity.name || "";

    const deadlineDate = args.deadlineDate;
    const getStatusPending = await ctx.db
      .query("ref_donation_form_status")
      .withIndex("status", (q) => q.eq("status", "PENDING"))
      .collect();

    const statusId = getStatusPending[0]._id;

    const createDonationForm = await ctx.db.insert("donation_form", {
      userId: userId,
      userName: userName,
      donationId: args.donationId,
      deadlineDate: deadlineDate,
      statusId: statusId,
    });

    if (!createDonationForm) {
      throw new Error("Failed to create donation request");
    }

    if (args.clothDonation) {
      for (const clothDonation of args.clothDonation) {
        const insertClothRequest = await ctx.db.insert("donation_form_detail", {
          categoryId: clothDonation.categoryId,
          gender: clothDonation.gender,
          size: clothDonation.size,
          quantity: clothDonation.quantity,
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

    return createDonationForm;
  },
});

const updateDonationForm = mutation({
  args: {
    donationFormId: v.id("donation_form"),
    receipt: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const status = args.status || "PENDING";

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const donationForm = await ctx.db.get(args.donationFormId);

    const statusId = await findDonationFormStatus(ctx, {
      status: status,
    });

    if (!donationForm) {
      throw new Error("Donation Request not found");
    }

    if (args.status) {
      await ctx.db.patch(args.donationFormId, {
        statusId: statusId,
      });
    }

    if (args.receipt) {
      await ctx.db.patch(args.donationFormId, {
        receipt: args.receipt,
      });
    }

    if (!args.status && !args.receipt) {
      throw new Error("No data to update");
    }
  },
});

const expiredDonationForm = query({
  handler: async (ctx) => {
    const getDonationForms = await getAllDonationForm(ctx, {});

    if (getDonationForms) {
      return getDonationForms.filter((donationForm) => {
        const currentDate = new Date();
        let endDate;

        if (donationForm) {
          endDate = Date.parse(donationForm.deadlineDate);
        }
        if (endDate) {
          return Date.parse(currentDate.toString()) > endDate;
        }
      });
    }
  },
});

const updateDonationFormStatusCron = internalMutation({
  args: {
    donationFormId: v.id("donation_form"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const getDonation = await findOneDonationForm(ctx, {
      id: args.donationFormId,
    });

    if (!getDonation) {
      throw new Error(`Donation with ${args.donationFormId} not found`);
    }

    const getDonationFormStatusId = await findDonationFormStatus(ctx, {
      status: args.status,
    });

    return await ctx.db.patch(args.donationFormId, {
      statusId: getDonationFormStatusId,
    });
  },
});

const updateExpiredDonationForm = mutation({
  handler: async (ctx) => {
    const getExpiredDonationForms = await expiredDonationForm(ctx, {});

    if (!getExpiredDonationForms) {
      throw new Error("No expired donations found");
    }

    if (getExpiredDonationForms) {
      getExpiredDonationForms.map(async (donationForm) => {
        if (donationForm && donationForm.formStatus === "PENDING") {
          return await updateDonationFormStatusCron(ctx, {
            donationFormId: donationForm.formId,
            status: "EXPIRED",
          });
        }
      });
    }
  },
});

export {
  filterDonationForm,
  getAllDonationForm,
  getDonationFormById,
  getUserDonationForm,
  createDonationForm,
  updateDonationForm,
  updateDonationFormStatusCron,
  updateExpiredDonationForm,
};
