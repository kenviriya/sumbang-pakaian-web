import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CampaignCard from "./campaignCard";

const DonationContent = () => {
  const getDonationForms = useQuery(
    api.controllers.donation_form_controller.getUserDonationForm,
    {},
  );

  if (getDonationForms === undefined) {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <h1>Campaign yang Kamu Ikut Serta</h1>
          </CardTitle>
        </CardHeader>

        <CardContent
          className={
            "w-full grid grid-cols-1 gap-4  justify-center justify-items-center sm:grid-cols-2 md:grid-cols-4 md:gap-y-8 min-h-[450px]"
          }
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div className="mb-4" key={i}>
              <CampaignCard.Skeleton />
            </div>
          ))}
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1>Campaign yang Kamu Ikut Serta</h1>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={
          "w-full grid grid-cols-1 gap-4 justify-center justify-items-center sm:grid-cols-2 md:grid-cols-4 md:gap-y-8 min-h-[450px]"
        }
      >
        {getDonationForms?.length === 0 && (
          <h2 className="text-muted-foreground col-span-4 justify-center flex">
            Kamu belum ikut serta dalam campaign apapun
          </h2>
        )}
        {getDonationForms?.map((donationForm) => {
          return (
            <div key={donationForm.formId}>
              <CampaignCard
                title={donationForm.donationTitle || ""}
                description={donationForm.donationDescription || ""}
                imageUrl={donationForm.donationImageUrl || ""}
                formId={donationForm.formId || ""}
                status={donationForm.formStatus || "DONE"}
              />
            </div>
          );
        })}
      </CardContent>
    </>
  );
};

export default DonationContent;
