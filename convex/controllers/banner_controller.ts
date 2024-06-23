import { mutation, query } from "@/convex/_generated/server";
import {
  findAllBanner,
  findBanner,
  findOneBanner,
} from "@/convex/repositories/BannerRepository";
import { v } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";

const getAllBanners = query({
  handler: async (ctx) => {
    const banners = await findAllBanner(ctx, {});

    return banners.map((banner) => {
      return {
        id: banner._id,
        title: banner.title,
        imageUrl: banner.imageUrl,
      };
    });
  },
});

const getBannerById = query({
  args: {
    bannerId: v.id("banner"),
  },
  handler: async (ctx, args) => {
    const banner = await findOneBanner(ctx, {
      id: args.bannerId,
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    return {
      id: banner._id,
      title: banner.title,
      imageUrl: banner.imageUrl,
    };
  },
});

const updateBanner = mutation({
  args: {
    title: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const findBannerId = await findBanner(ctx, {
      title: args.title,
    });

    if (!findBannerId) {
      throw new Error("Banner not found");
    }

    const banner = await findOneBanner(ctx, {
      id: findBannerId._id,
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    return await ctx.db.patch(findBannerId._id, {
      imageUrl: args.imageUrl,
    });
  },
});

export { getAllBanners, getBannerById, updateBanner };
