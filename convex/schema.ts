import {defineSchema, defineTable} from 'convex/server';
import {v} from 'convex/values';

export default defineSchema({
  points: defineTable({
    userId: v.string(),
    points: v.number(),
    clothCount: v.number(),
  }).index('userId', ['userId']),
  donation: defineTable({
    donationRequest: v.number(),
    status: v.boolean(),
  }),
  user_contribution: defineTable({
    userId: v.string(),
    contributionQuantity: v.number(),
  }).index('userId', ['userId']),
  map_donation_contribution: defineTable({
    donationContriboutionId: v.id('user_contribution'),
    donationId: v.id('donation'),
  }),
  donation_request: defineTable({
    userId: v.string(),
    image: v.string(),
    status: v.boolean(),
    startDate: v.string(),
    endDate: v.string(),
  }).index('userId', ['userId']),
  map_request_details: defineTable({
    donationRequestId: v.id('donation_request'),
    clothId: v.id('cloth_request'),
  }),
  cloth_request: defineTable({
    name: v.string(),
    size: v.string(),
    type: v.string(),
    quantity: v.number(),
    category: v.id('ref_cloth_category'),
  }),
  user_cloth: defineTable({
    userId: v.string(),
    image: v.string(),
    name: v.string(),
    size: v.string(),
    type: v.string(),
    category: v.id('ref_cloth_category'),
  }).index('userId', ['userId']),
  ref_cloth_category: defineTable({
    categoryName: v.string(),
  }),
});
