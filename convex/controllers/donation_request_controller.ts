import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import {
  findAllDonationRequest,
  findDonationRequest,
  findOneDonationRequest,
} from "@/convex/repositories/DonationRequestRepository";
import { findAllMapDonationRequestDetail } from "@/convex/repositories/MapDonationRequestDetailsRepository";
import { findAllClothRequest } from "@/convex/repositories/ClothRequestRepository";
import {
  findDonationRequestStatus,
  findOneDonationRequestStatus,
} from "@/convex/repositories/RefDonationRequestStatusRepository";
import { findOneClothCategory } from "@/convex/repositories/RefClothCategoryRepository";
import { filterDonationRequestStatus } from "@/convex/controllers/ref_controller/refDonationRequestStatus";
import { Id } from "@/convex/_generated/dataModel";

const getAllDonationRequest = query({
  args: {
    userId: v.optional(v.string()),
    status: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let donationRequests;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (args.userId) {
      donationRequests = await findDonationRequest(ctx, {
        userId: args.userId,
      });
    } else {
      donationRequests = await findAllDonationRequest(ctx, {});
    }

    if (args.status) {
      const getStatusId = await findDonationRequestStatus(ctx, {
        status: args.status,
      });
      donationRequests = await findDonationRequest(ctx, {
        statusId: getStatusId,
      });
    }

    if (args.duration) {
      donationRequests = await findDonationRequest(ctx, {
        duration: args.duration,
      });
    }

    const mapDonationRequestDetails = await findAllMapDonationRequestDetail(
      ctx,
      {},
    );

    const clothRequest = await findAllClothRequest(ctx, {});

    if (donationRequests) {
      return Promise.all(
        donationRequests.map(async (donationRequest) => {
          let clothRequests;

          const donationRequestStatus = await findOneDonationRequestStatus(
            ctx,
            {
              id: donationRequest.statusId,
            },
          );

          const requestDetails = mapDonationRequestDetails.filter(
            (details) => details.donationRequestId === donationRequest._id,
          );

          if (requestDetails.length > 0) {
            const clothIds = requestDetails.map(
              (details) => details.clothRequestId,
            );

            const clothes = clothRequest.filter((cloth) =>
              clothIds.includes(cloth._id),
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
              }),
            );
          }

          return {
            requestId: donationRequest._id,
            userId: donationRequest.userId,
            imageUrl: donationRequest.imageUrl,
            title: donationRequest.title,
            description: donationRequest.description,
            address: donationRequest.address,
            phoneNumber: donationRequest.phoneNumber,
            duration: donationRequest.duration,
            requestStatus: donationRequestStatus.status,
            clothRequests: clothRequests || [],
          };
        }),
      );
    }
  },
});

const getDonationRequestById = query({
  args: {
    donationRequestId: v.id("donation_request"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const donationRequest = await findOneDonationRequest(ctx, {
      id: args.donationRequestId,
    });

    const mapDonationRequestDetails = await findAllMapDonationRequestDetail(
      ctx,
      {},
    );

    const clothRequest = await findAllClothRequest(ctx, {});

    if (donationRequest) {
      const donationRequestStatus = await findOneDonationRequestStatus(ctx, {
        id: donationRequest.statusId,
      });

      const requestDetails = mapDonationRequestDetails.filter(
        (details) => details.donationRequestId === donationRequest._id,
      );

      let clothRequests;

      if (requestDetails) {
        const clothIds = requestDetails.map(
          (details) => details.clothRequestId,
        );

        const clothes = clothRequest.filter((cloth) =>
          clothIds.includes(cloth._id),
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
          }),
        );
      }

      return {
        requestId: donationRequest._id,
        userId: donationRequest.userId,
        imageUrl: donationRequest.imageUrl,
        title: donationRequest.title,
        description: donationRequest.description,
        address: donationRequest.address,
        phoneNumber: donationRequest.phoneNumber,
        duration: donationRequest.duration,
        requestStatus: donationRequestStatus?.status,
        clothRequests: clothRequests || [],
      };
    }
  },
});

const createDonationRequestDetail = mutation({
  args: {
    donationRequestId: v.id("donation_request"),
    categoryId: v.id("ref_cloth_category"),
    gender: v.string(),
    size: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const insertClothRequest = await ctx.db.insert("cloth_request", {
      categoryId: args.categoryId,
      gender: args.gender,
      size: args.size,
      quantity: args.quantity,
    });

    if (!insertClothRequest) {
      throw new Error("Failed to create cloth request");
    }

    return await ctx.db.insert("map_donation_request_details", {
      donationRequestId: args.donationRequestId,
      clothRequestId: insertClothRequest,
    });
  },
});

const createDonationRequest = mutation({
  args: {
    imageUrl: v.optional(v.string()),
    title: v.string(),
    duration: v.number(),
    description: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    address: v.string(),
    phoneNumber: v.string(),
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

    const statusId = await filterDonationRequestStatus(ctx, {
      status: "PENDING",
    });

    const createDonationRequest = await ctx.db.insert("donation_request", {
      imageUrl: args.imageUrl,
      title: args.title,
      duration: args.duration,
      description: args.description,
      address: args.address,
      phoneNumber: args.phoneNumber,
      statusId: statusId as Id<"ref_donation_request_status">,
      userId,
    });

    if (!createDonationRequest) {
      throw new Error("Failed to create donation request");
    }

    if (args.clothRequest) {
      for (const clothRequest of args.clothRequest) {
        const insertClothRequest = await ctx.db.insert("cloth_request", {
          categoryId: clothRequest.categoryId,
          gender: clothRequest.gender,
          size: clothRequest.size,
          quantity: clothRequest.quantity,
        });

        if (!insertClothRequest) {
          throw new Error("Failed to create cloth request");
        }

        await ctx.db.insert("map_donation_request_details", {
          donationRequestId: createDonationRequest,
          clothRequestId: insertClothRequest,
        });
      }
    }
  },
});

const updateDonationRequestStatus = mutation({
  args: {
    donationRequestId: v.id("donation_request"),
    statusId: v.id("ref_donation_request_status"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const donationRequest = await ctx.db.get(args.donationRequestId);

    if (!donationRequest) {
      throw new Error("Donation Request not found");
    }

    return await ctx.db.patch(args.donationRequestId, {
      statusId: args.statusId,
    });
  },
});

export {
  getAllDonationRequest,
  getDonationRequestById,
  createDonationRequest,
  createDonationRequestDetail,
  updateDonationRequestStatus,
};
