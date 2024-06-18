import {mutation, query} from '@/convex/_generated/server';
import {v} from 'convex/values';
import {
  findAllDonation,
  findDonation,
  findOneDonation,
} from '@/convex/repositories/DonationRepository';
import {
  findDonationStatus,
  findOneDonationStatus,
} from '@/convex/repositories/RefDonationStatusRepository';
import {findOneDonationRequest} from '@/convex/repositories/DonationRequestRepository';
import {findAllMapDonationRequestDetail} from '@/convex/repositories/MapDonationRequestDetailsRepository';
import {findAllClothRequest} from '@/convex/repositories/ClothRequestRepository';
import {findOneDonationRequestStatus} from '@/convex/repositories/RefDonationRequestStatusRepository';
import {findOneClothCategory} from '@/convex/repositories/RefClothCategoryRepository';

const getAllDonations = query({
  handler: async (ctx) => {
    const getDonations = await findAllDonation(ctx, {});

    if (getDonations) {
      return Promise.all(
        getDonations.map(async (donation) => {
          const statusId = donation.statusId;
          const donationRequestId = donation.donationRequestId;

          const donationStatus = await findOneDonationStatus(ctx, {
            statusId: statusId,
          });

          const donationRequest = await findOneDonationRequest(ctx, {
            id: donationRequestId,
          });

          const mapDonationRequestDetails =
            await findAllMapDonationRequestDetail(ctx, {});

          const clothRequest = await findAllClothRequest(ctx, {});

          let donationTitle,
            donationImageUrl,
            donationDescription,
            donationDuration,
            donationAddress,
            clothRequests;

          if (donationRequest) {
            ({
              title: donationTitle,
              imageUrl: donationImageUrl,
              description: donationDescription,
              duration: donationDuration,
              address: donationAddress,
            } = donationRequest);

            const donationRequestStatus = await findOneDonationRequestStatus(
              ctx,
              {
                id: donationRequest.statusId,
              }
            );

            const requestDetails = mapDonationRequestDetails.filter(
              (details) => details.donationRequestId === donationRequest._id
            );

            if (requestDetails.length > 0) {
              const clothIds = requestDetails.map(
                (details) => details.clothRequestId
              );

              const clothes = clothRequest.filter((cloth) =>
                clothIds.includes(cloth._id)
              );

              clothRequests = await Promise.all(
                clothes.map(async (cloth) => {
                  const clothCategory = await findOneClothCategory(ctx, {
                    id: cloth.categoryId,
                  });
                  return {
                    size: cloth.size,
                    gender: cloth.gender,
                    category: clothCategory?.name,
                    quantity: cloth.quantity,
                  };
                })
              );
            }

            return {
              id: donation._id,
              imageUrl: donationImageUrl,
              donationTitle: donationTitle,
              donationDescription: donationDescription,
              address: donationAddress,
              duration: donationDuration,
              startDate: donation.startDate,
              endDate: donation.endDate,
              donationStatus: donationStatus?.status,
              requestStatus: donationRequestStatus?.status,
              clothRequests: clothRequests || [],
            };
          }
        })
      );
    }
  },
});

const getDonationById = query({
  args: {
    donationId: v.id('donation'),
  },
  handler: async (ctx, args) => {
    const getDonation = await findOneDonation(ctx, {
      id: args.donationId,
    });

    if (!getDonation) {
      throw new Error(`Donation with ${args.donationId} not found`);
    }
    if (getDonation) {
      const donationStatus = await findOneDonationStatus(ctx, {
        statusId: getDonation.statusId,
      });

      const donationRequest = await findOneDonationRequest(ctx, {
        id: getDonation.donationRequestId,
      });

      const mapDonationRequestDetails = await findAllMapDonationRequestDetail(
        ctx,
        {}
      );

      const clothRequest = await findAllClothRequest(ctx, {});

      let donationTitle,
        donationImageUrl,
        donationDescription,
        donationDuration,
        donationAddress,
        clothRequests;

      if (donationRequest) {
        ({
          title: donationTitle,
          imageUrl: donationImageUrl,
          description: donationDescription,
          duration: donationDuration,
          address: donationAddress,
        } = donationRequest);

        const donationRequestStatus = await findOneDonationRequestStatus(ctx, {
          id: donationRequest.statusId,
        });

        const requestDetails = mapDonationRequestDetails.filter(
          (details) => details.donationRequestId === donationRequest._id
        );

        if (requestDetails.length > 0) {
          const clothIds = requestDetails.map(
            (details) => details.clothRequestId
          );

          const clothes = clothRequest.filter((cloth) =>
            clothIds.includes(cloth._id)
          );

          clothRequests = await Promise.all(
            clothes.map(async (cloth) => {
              const clothCategory = await findOneClothCategory(ctx, {
                id: cloth.categoryId,
              });
              return {
                size: cloth.size,
                gender: cloth.gender,
                category: clothCategory?.name,
                quantity: cloth.quantity,
              };
            })
          );
        }

        return {
          imageUrl: donationImageUrl,
          donationTitle: donationTitle,
          donationDescription: donationDescription,
          address: donationAddress,
          duration: donationDuration,
          startDate: getDonation.startDate,
          endDate: getDonation.endDate,
          donationStatus: donationStatus?.status,
          requestStatus: donationRequestStatus?.status,
          clothRequests: clothRequests || [],
        };
      }
    }
  },
});

const createDonation = mutation({
  args: {
    donationRequestId: v.id('donation_request'),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const getDonationActiveStatusId = await findDonationStatus(ctx, {
      status: 'ACTIVE',
    });

    return await ctx.db.insert('donation', {
      donationRequestId: args.donationRequestId,
      statusId: getDonationActiveStatusId,
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

    const getDonation = await findOneDonation(ctx, {
      id: args.donationId,
    });

    if (!getDonation) {
      throw new Error(`Donation with ${args.donationId} not found`);
    }

    return await ctx.db.patch(args.donationId, {
      statusId: args.statusId,
    });
  },
});

const filterDonation = query({
  args: {
    status: v.optional(v.string()),
    statusId: v.optional(v.id('ref_donation_status')),
  },
  handler: async (ctx, args) => {
    const getDonations = await findDonation(ctx, {
      status: args.status,
    });

    if (getDonations) {
      return Promise.all(
        getDonations.map(async (donation) => {
          const statusId = donation.statusId;
          const donationRequestId = donation.donationRequestId;

          const donationStatus = await findOneDonationStatus(ctx, {
            statusId: statusId,
          });

          const donationRequest = await findOneDonationRequest(ctx, {
            id: donationRequestId,
          });

          const mapDonationRequestDetails =
            await findAllMapDonationRequestDetail(ctx, {});

          const clothRequest = await findAllClothRequest(ctx, {});

          let donationTitle,
            donationImageUrl,
            donationDescription,
            donationDuration,
            donationAddress,
            clothRequests;

          if (donationRequest) {
            ({
              title: donationTitle,
              imageUrl: donationImageUrl,
              description: donationDescription,
              duration: donationDuration,
              address: donationAddress,
            } = donationRequest);

            const donationRequestStatus = await findOneDonationRequestStatus(
              ctx,
              {
                id: donationRequest.statusId,
              }
            );

            const requestDetails = mapDonationRequestDetails.filter(
              (details) => details.donationRequestId === donationRequest._id
            );

            if (requestDetails.length > 0) {
              const clothIds = requestDetails.map(
                (details) => details.clothRequestId
              );

              const clothes = clothRequest.filter((cloth) =>
                clothIds.includes(cloth._id)
              );

              clothRequests = await Promise.all(
                clothes.map(async (cloth) => {
                  const clothCategory = await findOneClothCategory(ctx, {
                    id: cloth.categoryId,
                  });
                  return {
                    size: cloth.size,
                    gender: cloth.gender,
                    category: clothCategory?.name,
                    quantity: cloth.quantity,
                  };
                })
              );
            }

            return {
              id: donation._id,
              imageUrl: donationImageUrl,
              donationTitle: donationTitle,
              donationDescription: donationDescription,
              address: donationAddress,
              duration: donationDuration,
              startDate: donation.startDate,
              endDate: donation.endDate,
              donationStatus: donationStatus?.status,
              requestStatus: donationRequestStatus?.status,
              clothRequests: clothRequests || [],
            };
          }
        })
      );
    }
  },
});

export {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonationStatus,
  filterDonation,
};
