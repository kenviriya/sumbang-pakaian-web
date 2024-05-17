import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  points: defineTable({
    userId: v.string(),
    points: v.number(),
    clothCount: v.number(),
  }).index("userId", ["userId"]),
  donation: defineTable({
    donationRequest: v.id("donation_request"),
    status: v.id("ref_donation_status"),
  }).index("donationRequest", ["donationRequest"]),
  ref_donation_status: defineTable({
    status: v.string(),
  }),
  user_contribution: defineTable({
    userId: v.string(),
    contributionQuantity: v.number(),
  }).index("userId", ["userId"]),
  map_donation_contribution: defineTable({
    donationContriboutionId: v.id("user_contribution"),
    donationId: v.id("donation"),
  }),
  donation_request: defineTable({
    userId: v.string(),
    image: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.id("ref_request_status"),
    startDate: v.string(),
    endDate: v.string(),
    address: v.string(),
  }).index("userId", ["userId"]),
  ref_request_status: defineTable({
    status: v.string(),
  }),
  map_request_details: defineTable({
    donationRequestId: v.id("donation_request"),
    clothId: v.id("cloth_request"),
  }),
  cloth_request: defineTable({
    name: v.string(),
    size: v.string(),
    type: v.string(),
    quantity: v.number(),
    category: v.id("ref_cloth_category"),
  }),
  user_cloth: defineTable({
    userId: v.string(),
    image: v.string(),
    name: v.string(),
    size: v.string(),
    type: v.string(),
    category: v.id("ref_cloth_category"),
    status: v.id("user_cloth_status"),
  })
    .index("userId", ["userId"])
    .index("category", ["category"])
    .index("type", ["type"])
    .index("size", ["size"]),
  ref_cloth_category: defineTable({
    name: v.string(),
  }),

  user_cloth_status: defineTable({
    status: v.string(),
  }),

  notification: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.boolean(),
  }).index("userId", ["userId"]),

  ref_notification_status: defineTable({
    status: v.string(),
  }),

  ref_donation_contributor_status: defineTable({
    status: v.string(),
  }),

  donation_form_detail: defineTable({
    category: v.id("ref_cloth_category"),
    quantity: v.number(),
  }).index("category", ["category"]),

  donation_form: defineTable({
    donationFormDetailId: v.id("donation_form_detail"),
    donationContributorStatus: v.id("ref_donation_contributor_status"),
    donation: v.id("donation"),
    userId: v.string(),
    deadlineDate: v.string(),
  }).index("userId", ["userId"]),

  donation_contributor: defineTable({
    donation: v.id("donation"),
    userId: v.string(),
  }).index("userId", ["userId"]),
});
