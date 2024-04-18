import {v} from 'convex/values';
import {mutation, query} from './_generated/server';
import {api} from '@/convex/_generated/api';
import {Id} from './_generated/dataModel';


const getUserClothDonation = query({
    handler: async (ctx) => {
        const userCloth = await ctx.db.query('user_cloth').collect();

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Not authenticated');
        } else if (userCloth.some(cloth => cloth.userId !== identity.tokenIdentifier)) {
            throw new Error('User identity not Authorized');
        }
        const clothCategory = await ctx.db.query('ref_cloth_category').collect();
    
        const tableJoin = userCloth.map((userCloth) => {
          const findClothCategory = clothCategory.find(
            (category) => category._id === userCloth.category
          );
          return {
            userCloth,
            clothCategory: findClothCategory?.name,
          };
        });

        const clothDonationCheck = tableJoin.find(
            (data) => data?.userCloth?.userId === identity.subject
          );
    
        const clothDonation = {
            category : clothDonationCheck?.clothCategory,
            image : clothDonationCheck?.userCloth.image,
            name : clothDonationCheck?.userCloth.name,
            size : clothDonationCheck?.userCloth.size,
            type: clothDonationCheck?.userCloth.type,
        };
    
        return clothDonation;
      },
})

const getUserContributionPoint = query({
    handler: async (ctx) => {
        const userContrib = await ctx.db.query('user_contribution').collect();

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Not authenticated');
        } else if (userContrib.some(contrib => contrib.userId !== identity.subject)) {
            throw new Error('User identity not Authorized');
        }

        const checkUserContrib = userContrib.find(
            (data) => data.userId === identity.subject
        );
    
        const contibution = {
            contributionQuantity : checkUserContrib?.contributionQuantity
        };
    
        return contibution;
      },
})

const getPoints = query({
    handler: async (ctx) => {
        const points = await ctx.db.query('points').collect();

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Not authenticated');
        } else if (points.some(points => points.userId !== identity.subject)) {
            throw new Error('User identity not Authorized');
        }

        const checkUserPoints = points.find(
            (data) => data.userId === identity.subject
        );
    
        const Point = {
            clothCount : checkUserPoints?.clothCount,
            points : checkUserPoints?.points
        };
    
        return Point;
      },
    
})


const createUserCloth = mutation({
    args: {
      clothCategory: v.string(),
      clothImage: v.string(),
      clothName: v.string(),
      clothSize: v.string(),
      clothType: v.string()
    },
    handler: async (ctx, args) => {
    const statusCloth = await ctx.db.query('ref_cloth_category').collect();
    const statusClothCompare = statusCloth.find(
      (data) => data?._id === args.clothCategory
    );

    if (!statusClothCompare) {
      throw new Error('Cloth Category not Available');
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const cloth = await ctx.db.insert('user_cloth', {
        category : args.clothCategory as Id<'ref_cloth_category'>,
        image : args.clothImage,
        name : args.clothName,
        size : args.clothSize,
        type: args.clothType,
        userId,
      });
  
      return cloth;
    },
})

const createUserContribution =  mutation({
    args: {
      contributionCount : v.number()
    },
    handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const contribution = await ctx.db.insert('user_contribution', {
        contributionQuantity: args.contributionCount,
        userId,
      });
  
      return contribution;

    },
})

const createPoints =  mutation({
    args: {
      clothCount : v.number(),
      pointCount : v.number()
    },
    handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const createPoints = await ctx.db.insert('points', {
        clothCount: args.clothCount,
        points: args.pointCount,
        userId, 
      });
  
      return createPoints;
    },
})


export {}

