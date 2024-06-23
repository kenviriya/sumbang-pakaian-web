"use client";

import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeX } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const RequestDetailPage = () => {
  const router = useRouter();
  const params = useParams();

  const getRequest = useQuery(
    api.controllers.donation_request_controller.getDonationRequestById,
    { donationRequestId: params.requestId as Id<"donation_request"> },
  );

  const updateDonationRequestMut = useMutation(
    api.controllers.donation_request_controller.updateDonationRequestStatus,
  );

  const insertDonation = useMutation(
    api.controllers.donation_controller.createDonation,
  );

  const updateDonationRequestStatus = async (status: string) => {
    await updateDonationRequestMut({
      donationRequestId: params.requestId as Id<"donation_request">,
      statusId: status as Id<"ref_donation_request_status">,
    });
  };

  const sendNotif = useMutation(
    api.controllers.notification_controller.sendNotificationClothMatch,
  );

  const getStatusApprovedId = useQuery(
    api.controllers.ref_controller.refDonationRequestStatus
      .filterDonationRequestStatus,
    {
      status: "APPROVED",
    },
  );

  const getStatusDeclineId = useQuery(
    api.controllers.ref_controller.refDonationRequestStatus
      .filterDonationRequestStatus,
    {
      status: "DECLINED",
    },
  );

  const approvedId = getStatusApprovedId as Id<"ref_donation_request_status">;

  const declineId = getStatusDeclineId as Id<"ref_donation_request_status">;

  const approveRequest = () => {
    const startDate = new Date();
    let endDate = new Date();

    if (getRequest) {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + getRequest.duration);
    }
    try {
      const updateStatus = updateDonationRequestStatus(approvedId);

      const createDonation = insertDonation({
        donationRequestId: params.requestId as Id<"donation_request">,
        startDate: format(startDate, "MM-dd-yyyy"),
        endDate: format(endDate, "MM-dd-yyyy"),
      });

      const updating = Promise.all([updateStatus, createDonation])
        .then(() => {
          router.push("/dashboard-admin");
        })
        .finally(sendNotif);

      toast.promise(updating, {
        loading: "Sedang update status...",
        success: "Status berhasil di update",
      });
    } catch (error) {
      console.log(error);
      toast.error("Gagal update status");
    }
  };

  const declineRequest = () => {
    try {
      const updateStatus = updateDonationRequestStatus(declineId).then(() => {
        router.push("/dashboard-admin");
      });

      toast.promise(updateStatus, {
        loading: "Sedang update status...",
        success: "Status berhasil di update",
      });
    } catch (error) {
      console.log(error);
      toast.error("Gagal update status");
    }
  };
  console.log(getRequest?.requestId);
  return (
    <div className="mt-2 px-[10%] min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[800px]">
          <CardHeader>
            <CardTitle>{getRequest?.title || "Kosong"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image
                src={getRequest?.imageUrl || "/"}
                alt="donation-image"
                width={800}
                height={300}
                className="mb-2"
              />
            </div>
            <h3 className="font-semibold">Deskripsi</h3>
            <CardDescription className="mb-2">
              <p>{getRequest?.description || "Kosong"}</p>
            </CardDescription>
            <h3 className="font-semibold">Durasi</h3>
            <CardDescription className="mb-3">
              <p>{getRequest?.duration || "Kosong"}</p>
            </CardDescription>
            <h3 className="font-semibold">Lokasi Penerima</h3>
            <CardDescription className="mb-3">
              <p>{getRequest?.address || "Kosong"}</p>
            </CardDescription>
            <Separator className="my-2" />
            <h3 className="font-semibold mb-2">Baju yang di Request</h3>
            {getRequest?.clothRequests?.length === 0 && (
              <div className="text-muted-foreground">Tidak ada request</div>
            )}
            {getRequest?.clothRequests?.map((clothRequest, index) => (
              <div className="grid grid-cols-4 gap-4 mb-2" key={index}>
                <div className="col-span-1">
                  <h4 className="font-medium">Kategori</h4>
                  <div className={"border-2 border-muted rounded p-1"}>
                    <div className={"text-muted-foreground"}>
                      {clothRequest?.category || "Kosong"}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Gender</h4>
                  <div className={"border-2 border-muted rounded p-1"}>
                    <div className={"text-muted-foreground"}>
                      {clothRequest?.gender || "Kosong"}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Ukuran</h4>
                  <div className={"border-2 border-muted rounded p-1"}>
                    <div className={"text-muted-foreground"}>
                      {clothRequest?.size || "Kosong"}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Quantity</h4>
                  <div className={"border-2 border-muted rounded p-1"}>
                    <div className={"text-muted-foreground"}>
                      {clothRequest?.quantity || "Kosong"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex">
            <div className="grid grid-cols-3 gap-x-5">
              <div>
                <Button className="w-full" onClick={approveRequest}>
                  Approve
                  <BadgeCheck className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div>
                <Button
                  variant={"destructive"}
                  className="w-full"
                  onClick={declineRequest}
                >
                  Decline
                  <BadgeX className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RequestDetailPage;
