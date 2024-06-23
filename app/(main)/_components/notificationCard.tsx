import { CircleX } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface NotificationCardProps {
  title: string;
  message: string;
  status: string | undefined;
  id: string;
  donationId: string | undefined;
  clothId: string | undefined;
  donationRequestId: string | undefined;
}

const NotificationCard = ({
  title,
  message,
  status,
  id,
  donationId,
  clothId,
  donationRequestId,
}: NotificationCardProps) => {
  const router = useRouter();

  const donation = donationId;
  const cloth = clothId;

  const updateNotificationStatus = useMutation(
    api.controllers.notification_controller.updateUserNotificationstatus,
  );

  const handleRead = async () => {
    await updateNotificationStatus({
      notificationId: id as Id<"notification">,
      status: "READ",
    });
  };

  const handleDonation = () => {
    handleRead().then(() => {
      router.push(`/cloth-donation?donationId=${donation}&clothId=${cloth}`);
    });
  };

  return (
    <div
      className={
        "rounded-md border bg-card text-card-foreground shadow relative hover:shadow-lg transition duration-300 ease-in-out"
      }
    >
      <div className={"absolute top-0 right-0 mt-2 mr-2 "}>
        <CircleX
          className={"h-4 w-4 cursor-pointer"}
          color="#979595"
          onClick={handleRead}
        />
      </div>
      <div className={"p-3"} onClick={handleDonation}>
        <h4 className="font-medium leading-none text-sm">{title}</h4>
        <p className={"text-muted-foreground text-sm mt-1"}>{message}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
