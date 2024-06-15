import {defineSchema, defineTable} from 'convex/server';
import {v} from 'convex/values';

export default defineSchema({
  // Donation Request
  donation_request: defineTable({
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    title: v.string(),
    duration: v.number(),
    description: v.string(),
    address: v.string(),
    statusId: v.id('ref_donation_request_status'),
  })
    .index('by_user', ['userId'])
    .index('by_duration', ['duration'])
    .index('by_status', ['statusId']),

  map_donation_request_details: defineTable({
    donationRequestId: v.id('donation_request'),
    clothRequestId: v.id('cloth_request'),
  }),

  cloth_request: defineTable({
    size: v.string(),
    gender: v.string(),
    quantity: v.number(),
    categoryId: v.id('ref_cloth_category'),
  }),
  // End of Donation Request

  // Donation
  donation: defineTable({
    donationRequestId: v.id('donation_request'),
    statusId: v.id('ref_donation_status'),
    startDate: v.string(),
    endDate: v.string(),
  }).index('by_status', ['statusId']),

  donation_contributor: defineTable({
    donationId: v.id('donation'),
    userId: v.string(),
  }),
  // End of Donation

  // User Cloth
  user_cloth: defineTable({
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    name: v.string(),
    size: v.string(),
    gender: v.string(),
    description: v.string(),
    categoryId: v.id('ref_cloth_category'),
    statusId: v.id('ref_user_cloth_status'),
  }),
  // End of User Cloth

  // User Donation
  user_contribution: defineTable({
    userId: v.string(),
    donationId: v.id('donation'),
    clothId: v.id('user_cloth'),
    contributionQuantity: v.number(),
  }).index('by_donation', ['donationId']),
  // End of User Donation

  // Donation Form for user donation
  donation_form: defineTable({
    userId: v.string(),
    donationId: v.id('donation'),
    deadlineDate: v.string(),
    statusId: v.id('ref_donation_form_status'),
  }),

  map_donation_form_details: defineTable({
    donationFormId: v.id('donation_form'),
    donationFormDetailId: v.id('donation_form_detail'),
  }),

  donation_form_detail: defineTable({
    size: v.string(),
    gender: v.string(),
    quantity: v.number(),
    categoryId: v.id('ref_cloth_category'),
  }).index('categoryId', ['categoryId']),
  // Donation Form

  // Notification
  notification: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    statusId: v.id('ref_notification_status'),
  }).index('by_status', ['statusId']),
  // End of Notification

  // User Points
  points: defineTable({
    userId: v.string(),
    points: v.number(),
    clothCount: v.number(),
  }).index('userId', ['userId']),
  // End of User Points

  // Map Table
  map_donation_contribution: defineTable({
    userContributionId: v.string(),
    donationId: v.id('donation'),
  }),
  // End of Map Table

  // Ref Tables
  ref_donation_request_status: defineTable({
    status: v.string(),
  }).index('status', ['status']),

  ref_donation_form_status: defineTable({
    status: v.string(),
  }).index('status', ['status']),

  ref_donation_status: defineTable({
    status: v.string(),
  }).index('status', ['status']),

  ref_cloth_category: defineTable({
    name: v.string(),
  }).index('name', ['name']),

  ref_notification_status: defineTable({
    status: v.string(),
  }).index('status', ['status']),

  ref_user_cloth_status: defineTable({
    status: v.string(),
  }).index('status', ['status']),
  // End of Ref Tables
});
