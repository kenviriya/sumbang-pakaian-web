import DonationCard from "./donationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const ManageDonationContent = () => {
  const getDonationStatusActiveId = useQuery(
    api.controllers.ref_controller.refDonationStatus.filterDonationStatus,
    {
      status: "ACTIVE",
    },
  );

  const getDonations = useQuery(
    api.controllers.donation_controller.filterDonation,
    {
      statusId: getDonationStatusActiveId as Id<"ref_donation_status">,
    },
  );

  if (getDonations === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage donation card</CardTitle>
      </CardHeader>
      <CardContent
        className={
          "w-full grid grid-cols-1 gap-4  justify-center justify-items-center sm:grid-cols-2 md:grid-cols-4 md:gap-y-8"
        }
      >
        {getDonations?.map((donation) => (
          <div key={donation.donationId}>
            <DonationCard
              imageUrl={donation?.imageUrl || "/No image"}
              title={donation?.title || "No title"}
              description={donation?.description || "No description"}
              donationId={donation.donationId}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ManageDonationContent;
