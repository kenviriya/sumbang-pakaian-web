import { cronJobs } from "convex/server";
import { api } from "@/convex/_generated/api";

const crons = cronJobs();

crons.daily(
  "update expired donation status",
  { hourUTC: 0, minuteUTC: 0 },
  api.controllers.donation_controller.updateExpiredDonation,
);

crons.daily(
  "update expired donation form status",
  { hourUTC: 0, minuteUTC: 0 },
  api.controllers.donation_form_controller.updateExpiredDonationForm,
);
export default crons;
