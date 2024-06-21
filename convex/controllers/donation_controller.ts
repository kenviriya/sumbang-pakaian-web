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
              userId: donationRequest.userId,
              donationRequestId: donationRequest._id,
              imageUrl: donationImageUrl,
              donationTitle: donationTitle,
              donationDescription: donationDescription,
              address: donationAddress,
              phoneNumber: donationRequest.phoneNumber,
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
          userId: donationRequest.userId,
          donationRequestId: donationRequest._id,
          donationTitle: donationTitle,
          donationDescription: donationDescription,
          address: donationAddress,
          phoneNumber: donationRequest.phoneNumber,
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
    status: v.string(),
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

    const getDonationStatusId = await findDonationStatus(ctx, {
      status: args.status,
    });

    return await ctx.db.patch(args.donationId, {
      statusId: getDonationStatusId,
    });
  },
});

const filterDonation = query({
  args: {
    status: v.optional(v.string()),
    requestId: v.optional(v.id('donation_request')),
  },
  handler: async (ctx, args) => {
    const status = args.status;
    const requestId = args.requestId;

    let getDonations;
    if (status) {
      getDonations = await findDonation(ctx, {
        status: args.status,
      });
    }

    if (requestId) {
      getDonations = await findDonation(ctx, {
        donationRequestId: args.requestId,
      });
    }

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
              userId: donationRequest.userId,
              donationRequestId: donationRequest._id,
              imageUrl: donationImageUrl,
              donationTitle: donationTitle,
              donationDescription: donationDescription,
              address: donationAddress,
              phoneNumber: donationRequest.phoneNumber,
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
