import {defineSchema, defineTable} from 'convex/server';
import {v} from 'convex/values';

export default defineSchema({
  points: defineTable({
    userId: v.string(),
    points: v.number(),
    clothCount: v.number(),
  }).index('userId', ['userId']),
  donation: defineTable({
    donationRequest: v.id('donation_request'),
    status: v.boolean(),
  }).index('donationRequest', ['donationRequest']),
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
    title: v.string(),
    description: v.string(),
    status: v.id('ref_status'),
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
  })
    .index('userId', ['userId'])
    .index('category', ['category'])
    .index('type', ['type'])
    .index('size', ['size']),
  ref_cloth_category: defineTable({
    name: v.string(),
  }),
  ref_status: defineTable({
    name: v.string(),
  }),
});
