/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.11.2.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as controllers_banner_controller from "../controllers/banner_controller.js";
import type * as controllers_cloth_controller from "../controllers/cloth_controller.js";
import type * as controllers_donation_controller from "../controllers/donation_controller.js";
import type * as controllers_donation_form_controller from "../controllers/donation_form_controller.js";
import type * as controllers_donation_request_controller from "../controllers/donation_request_controller.js";
import type * as controllers_notification_controller from "../controllers/notification_controller.js";
import type * as controllers_ref_controller_refClothCategory from "../controllers/ref_controller/refClothCategory.js";
import type * as controllers_ref_controller_refDonationRequestStatus from "../controllers/ref_controller/refDonationRequestStatus.js";
import type * as controllers_ref_controller_refDonationStatus from "../controllers/ref_controller/refDonationStatus.js";
import type * as controllers_ref_controller_refNotificationStatus from "../controllers/ref_controller/refNotificationStatus.js";
import type * as controllers_ref_controller_refUserClothStatus from "../controllers/ref_controller/refUserClothStatus.js";
import type * as crons from "../crons.js";
import type * as repositories_BannerRepository from "../repositories/BannerRepository.js";
import type * as repositories_ClothRequestRepository from "../repositories/ClothRequestRepository.js";
import type * as repositories_DonationFormDetailRepository from "../repositories/DonationFormDetailRepository.js";
import type * as repositories_DonationFormRepository from "../repositories/DonationFormRepository.js";
import type * as repositories_DonationRepository from "../repositories/DonationRepository.js";
import type * as repositories_DonationRequestRepository from "../repositories/DonationRequestRepository.js";
import type * as repositories_MapDonationFormDetailsRepository from "../repositories/MapDonationFormDetailsRepository.js";
import type * as repositories_MapDonationRequestDetailsRepository from "../repositories/MapDonationRequestDetailsRepository.js";
import type * as repositories_NotificationRepository from "../repositories/NotificationRepository.js";
import type * as repositories_RefClothCategoryRepository from "../repositories/RefClothCategoryRepository.js";
import type * as repositories_RefDonationFormStatusRepository from "../repositories/RefDonationFormStatusRepository.js";
import type * as repositories_RefDonationRequestStatusRepository from "../repositories/RefDonationRequestStatusRepository.js";
import type * as repositories_RefDonationStatusRepository from "../repositories/RefDonationStatusRepository.js";
import type * as repositories_RefNotificationStatusRepository from "../repositories/RefNotificationStatusRepository.js";
import type * as repositories_RefUserClothStatusRepository from "../repositories/RefUserClothStatusRepository.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "controllers/banner_controller": typeof controllers_banner_controller;
  "controllers/cloth_controller": typeof controllers_cloth_controller;
  "controllers/donation_controller": typeof controllers_donation_controller;
  "controllers/donation_form_controller": typeof controllers_donation_form_controller;
  "controllers/donation_request_controller": typeof controllers_donation_request_controller;
  "controllers/notification_controller": typeof controllers_notification_controller;
  "controllers/ref_controller/refClothCategory": typeof controllers_ref_controller_refClothCategory;
  "controllers/ref_controller/refDonationRequestStatus": typeof controllers_ref_controller_refDonationRequestStatus;
  "controllers/ref_controller/refDonationStatus": typeof controllers_ref_controller_refDonationStatus;
  "controllers/ref_controller/refNotificationStatus": typeof controllers_ref_controller_refNotificationStatus;
  "controllers/ref_controller/refUserClothStatus": typeof controllers_ref_controller_refUserClothStatus;
  crons: typeof crons;
  "repositories/BannerRepository": typeof repositories_BannerRepository;
  "repositories/ClothRequestRepository": typeof repositories_ClothRequestRepository;
  "repositories/DonationFormDetailRepository": typeof repositories_DonationFormDetailRepository;
  "repositories/DonationFormRepository": typeof repositories_DonationFormRepository;
  "repositories/DonationRepository": typeof repositories_DonationRepository;
  "repositories/DonationRequestRepository": typeof repositories_DonationRequestRepository;
  "repositories/MapDonationFormDetailsRepository": typeof repositories_MapDonationFormDetailsRepository;
  "repositories/MapDonationRequestDetailsRepository": typeof repositories_MapDonationRequestDetailsRepository;
  "repositories/NotificationRepository": typeof repositories_NotificationRepository;
  "repositories/RefClothCategoryRepository": typeof repositories_RefClothCategoryRepository;
  "repositories/RefDonationFormStatusRepository": typeof repositories_RefDonationFormStatusRepository;
  "repositories/RefDonationRequestStatusRepository": typeof repositories_RefDonationRequestStatusRepository;
  "repositories/RefDonationStatusRepository": typeof repositories_RefDonationStatusRepository;
  "repositories/RefNotificationStatusRepository": typeof repositories_RefNotificationStatusRepository;
  "repositories/RefUserClothStatusRepository": typeof repositories_RefUserClothStatusRepository;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
