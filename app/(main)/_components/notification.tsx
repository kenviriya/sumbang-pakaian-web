"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Bell, BellDot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NotificationCard from "@/app/(main)/_components/notificationCard";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Notification = () => {
  const notifications = useQuery(
    api.controllers.notification_controller.filterUserNotification,
    {
      status: "UNREAD",
    },
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          {notifications && notifications.length <= 0 && (
            <Bell className="h-4 w-4" />
          )}
          {notifications && notifications.length > 0 && (
            <>
              <BellDot className="h-4 w-4" color="red" />
              <p className={"text-sm text-red-700 ml-2"}>
                {notifications?.length}
              </p>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifikasi</h4>
            <Separator />
            {notifications && notifications.length <= 0 && (
              <p className="text-sm text-muted-foreground">
                Kamu belum punya notifikasi
              </p>
            )}

            {notifications?.map((notification) => (
              <NotificationCard
                key={notification.notificationId}
                title={notification.title}
                message={notification.message}
                status={notification.status}
                id={notification.notificationId}
                donationId={notification.donationId}
                clothId={notification.clothId}
                donationRequestId={notification.donationRequestId}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
