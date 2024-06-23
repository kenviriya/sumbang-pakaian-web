import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Donation Request
  donation_request: defineTable({
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    title: v.string(),
    duration: v.number(),
    description: v.string(),
    address: v.string(),
    phoneNumber: v.string(),
    statusId: v.id("ref_donation_request_status"),
  })
    .index("by_user", ["userId"])
    .index("by_duration", ["duration"])
    .index("by_status", ["statusId"]),

  map_donation_request_details: defineTable({
    donationRequestId: v.id("donation_request"),
    clothRequestId: v.id("cloth_request"),
  }),

  cloth_request: defineTable({
    size: v.string(),
    gender: v.string(),
    quantity: v.number(),
    categoryId: v.id("ref_cloth_category"),
  }),
  // End of Donation Request

  // Donation
  donation: defineTable({
    donationRequestId: v.id("donation_request"),
    statusId: v.id("ref_donation_status"),
    startDate: v.string(),
    endDate: v.string(),
  })
    .index("by_status", ["statusId"])
    .index("by_request", ["donationRequestId"])
    .index("by_endDate", ["endDate"]),
  // End of Donation

  // Donation Form for user donation
  donation_form: defineTable({
    userId: v.string(),
    userName: v.string(),
    donationId: v.id("donation"),
    deadlineDate: v.string(),
    receipt: v.optional(v.string()),
    statusId: v.id("ref_donation_form_status"),
  })
    .index("by_status", ["statusId"])
    .index("by_user", ["userId"])
    .index("by_donation", ["donationId"]),

  map_donation_form_details: defineTable({
    donationFormId: v.id("donation_form"),
    donationFormDetailId: v.id("donation_form_detail"),
  }),

  donation_form_detail: defineTable({
    size: v.string(),
    gender: v.string(),
    quantity: v.number(),
    categoryId: v.id("ref_cloth_category"),
  }).index("categoryId", ["categoryId"]),
  // Donation Form

  // Notification
  notification: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    statusId: v.id("ref_notification_status"),
    donationId: v.optional(v.id("donation")),
    clothId: v.optional(v.id("user_cloth")),
    donationRequestId: v.optional(v.id("donation_request")),
  })
    .index("by_status", ["statusId"])
    .index("by_user", ["userId"]),
  // End of Notification

  // User Cloth
  user_cloth: defineTable({
    userId: v.string(),
    name: v.string(),
    size: v.string(),
    gender: v.string(),
    description: v.string(),
    categoryId: v.id("ref_cloth_category"),
    statusId: v.id("ref_user_cloth_status"),
  }),
  // End of User Cloth

  // Banner
  banner: defineTable({
    imageUrl: v.string(),
    title: v.string(),
  }).index("title", ["title"]),
  // End of Banner

  // Ref Tables
  ref_donation_request_status: defineTable({
    status: v.string(),
  }).index("status", ["status"]),

  ref_donation_form_status: defineTable({
    status: v.string(),
  }).index("status", ["status"]),

  ref_donation_status: defineTable({
    status: v.string(),
  }).index("status", ["status"]),

  ref_cloth_category: defineTable({
    name: v.string(),
  }).index("name", ["name"]),

  ref_notification_status: defineTable({
    status: v.string(),
  }).index("status", ["status"]),

  ref_user_cloth_status: defineTable({
    status: v.string(),
  }).index("status", ["status"]),
  // End of Ref Tables
});
