import {mutation, query} from '../_generated/server';
import {v} from 'convex/values';
import {
  findAllDonationForms,
  findDonationForm,
  findOneDonationForm,
} from '@/convex/repositories/DonationFormRepository';
import {findOneDonation} from '@/convex/repositories/DonationRepository';
import {
  findDonationFormStatus,
  findOneDonationFormStatus,
} from '@/convex/repositories/RefDonationFormStatusRepository';
import {findAllMapDonationFormDetails} from '@/convex/repositories/MapDonationFormDetailsRepository';
import {findOneClothCategory} from '@/convex/repositories/RefClothCategoryRepository';
import {format} from 'date-fns';
import {getDonationRequestById} from './donation_request_controller';

const getAllDonationForm = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
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

          const donationRequest = await getDonationRequestById(ctx, {
            donationRequestId: getDonation.donationRequestId,
          });

          const getMapDonationFormDetails = await findAllMapDonationFormDetails(
            ctx,
            {}
          );

          const donationFormDetails = getMapDonationFormDetails.filter(
            (detail) => detail.donationFormId === donationForm._id
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
              })
            );
          }
          return {
            formId: donationForm._id,
            formReceipt: donationForm.receipt,
            donationId: getDonation?._id,
            donationImageUrl: donationRequest?.imageUrl,
            donationTitle: donationRequest?.title,
            donationDescription: donationRequest?.description,
            donationAddress: donationRequest?.address,
            donationStartDate: getDonation.startDate,
            donationEndDate: getDonation.endDate,
            donationDuration: donationRequest?.duration,
            formStatus: getDonationFormStatus?.status,
            deadlineDate: donationForm.deadlineDate,
            donationClothRequest: donationFormDetail,
          };
        })
      );
    }
  },
});

const getDonationFormById = query({
  args: {
    donationFormId: v.id('donation_form'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
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

      const donationRequest = await getDonationRequestById(ctx, {
        donationRequestId: getDonation.donationRequestId,
      });

      const getMapDonationFormDetails = await findAllMapDonationFormDetails(
        ctx,
        {}
      );

      const donationFormDetails = getMapDonationFormDetails.filter(
        (detail) => detail.donationFormId === getDonationForm._id
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
          })
        );
      }
      return {
        formId: getDonationForm._id,
        formReceipt: getDonationForm.receipt,
        donationId: getDonation?._id,
        donationImageUrl: donationRequest?.imageUrl,
        donationTitle: donationRequest?.title,
        donationDescription: donationRequest?.description,
        donationAddress: donationRequest?.address,
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
      throw new Error('Not authenticated');
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

          const donationRequest = await getDonationRequestById(ctx, {
            donationRequestId: getDonation.donationRequestId,
          });

          const getMapDonationFormDetails = await findAllMapDonationFormDetails(
            ctx,
            {}
          );

          const donationFormDetails = getMapDonationFormDetails.filter(
            (detail) => detail.donationFormId === donationForm._id
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
              })
            );
          }
          return {
            formId: donationForm._id,
            donationId: getDonation?._id,
            donationImageUrl: donationRequest?.imageUrl,
            donationTitle: donationRequest?.title,
            donationDescription: donationRequest?.description,
            donationAddress: donationRequest?.address,
            donationStartDate: getDonation.startDate,
            donationEndDate: getDonation.endDate,
            donationDuration: donationRequest?.duration,
            formStatus: getDonationFormStatus?.status,
            deadlineDate: donationForm.deadlineDate,
            donationClothRequest: donationFormDetail,
          };
        })
      );
    }
  },
});

const createDonationForm = mutation({
  args: {
    donationId: v.id('donation'),
    clothDonation: v.array(
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
    const deadlineDate = format(new Date(), 'yyyy-MM-dd, HH:mm:ss');
    const getStatusPending = await ctx.db
      .query('ref_donation_form_status')
      .withIndex('status', (q) => q.eq('status', 'PENDING'))
      .collect();

    const statusId = getStatusPending[0]._id;

    const createDonationForm = await ctx.db.insert('donation_form', {
      userId: userId,
      donationId: args.donationId,
      deadlineDate: deadlineDate,
      statusId: statusId,
    });

    if (!createDonationForm) {
      throw new Error('Failed to create donation request');
    }

    if (args.clothDonation) {
      for (const clothDonation of args.clothDonation) {
        const insertClothRequest = await ctx.db.insert('donation_form_detail', {
          categoryId: clothDonation.categoryId,
          gender: clothDonation.gender,
          size: clothDonation.size,
          quantity: clothDonation.quantity,
        });

        if (!insertClothRequest) {
          throw new Error('Failed to create cloth request');
        }

        await ctx.db.insert('map_donation_form_details', {
          donationFormId: createDonationForm,
          donationFormDetailId: insertClothRequest,
        });
      }
    }

    return {
      donationFormId: createDonationForm,
    };
  },
});

const updateDonationForm = mutation({
  args: {
    donattionFormId: v.id('donation_form'),
    receipt: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const status = args.status || 'PENDING';

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const donationForm = await ctx.db.get(args.donattionFormId);

    const statusId = await findDonationFormStatus(ctx, {
      status: status,
    });

    if (!donationForm) {
      throw new Error('Donation Request not found');
    }

    return await ctx.db.patch(args.donattionFormId, {
      receipt: args.receipt,
      statusId: statusId,
    });
  },
});

export {
  getAllDonationForm,
  getDonationFormById,
  getUserDonationForm,
  createDonationForm,
  updateDonationForm,
};
