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
import { ScrollArea } from "@/components/ui/scroll-area";

const DonationRequestContent = () => {
  const fetchDonationRequest = useQuery(
    api.controllers.donation_request_controller.getAllDonationRequest,
    {
      status: "PENDING",
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
      <ScrollArea className="h-[500px]">
        <CardContent>
          {fetchDonationRequest && fetchDonationRequest.length <= 0 && (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-center">
                Tidak ada galang pakaian yang perlu di tinjau
              </p>
            </div>
          )}
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
