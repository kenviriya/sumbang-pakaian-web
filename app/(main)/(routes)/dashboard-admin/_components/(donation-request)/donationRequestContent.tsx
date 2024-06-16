import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestCard from "@/app/(main)/(routes)/dashboard-admin/_components/(donation-request)/requestCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";

const DonationRequestContent = () => {
  const getStatusPendingId = useQuery(
    api.controllers.ref_controller.refDonationRequestStatus
      .filterDonationRequestStatus,
    {
      status: "PENDING",
    },
  );

  const fetchDonationRequest = useQuery(
    api.controllers.donation_request_controller.getAllDonationRequest,
    {
      statusId: getStatusPendingId as Id<"ref_donation_request_status">,
    },
  );

  if (fetchDonationRequest === undefined) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Galang Pakaian yang Perlu di Tinjau</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[700px]">
            <CardContent>
              {Array.from({ length: 6 }, (_, i) => (
                <div className="mb-4" key={i}>
                  <RequestCard.Skeleton />
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galang Pakaian yang Perlu di Tinjau</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[700px]">
        <CardContent>
          {fetchDonationRequest?.map((donationRequest) => (
            <div className={"mb-4"} key={donationRequest.requestId}>
              <RequestCard
                title={donationRequest.title || "Tidak ada judul"}
                description={
                  donationRequest.description || "Tidak ada deskripsi"
                }
                requestId={donationRequest.requestId}
              />
            </div>
          ))}
        </CardContent>
      </ScrollArea>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default DonationRequestContent;
