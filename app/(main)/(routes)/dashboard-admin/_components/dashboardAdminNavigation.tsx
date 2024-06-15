"use client";

import { useUser } from "@clerk/clerk-react";
import { Shirt } from "lucide-react";
import DashboardAdminNavigationButton from "./dashboardAdminNavigationButton";
import React from "react";
import ManageDonationContent from "@/app/(main)/(routes)/dashboard-admin/_components/(manage-donation)/manageDonationContent";
import DonationRequestContent from "@/app/(main)/(routes)/dashboard-admin/_components/(donation-request)/donationRequestContent";

interface INavigationProps {
  activeButton: React.ReactNode;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
  setActiveContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

const DashboardAdminNavigation = ({
  activeButton,
  setActiveButton,
  setActiveContent,
}: INavigationProps) => {
  const { user } = useUser();

  const contentCards = {
    donation: <ManageDonationContent />,
    request: <DonationRequestContent />,
    // points: <PointsContent />,
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow p-2">
      <DashboardAdminNavigationButton
        icon={<Shirt className="h-5 w-5" />}
        text="Manage Donation"
        isActive={activeButton === "donation" && true}
        onClick={() => {
          setActiveButton("donation");
          setActiveContent(contentCards.donation);
        }}
      />
      <DashboardAdminNavigationButton
        icon={<Shirt className="h-5 w-5" />}
        text="Donation Request"
        isActive={activeButton === "request" && true}
        onClick={() => {
          setActiveButton("request");
          setActiveContent(contentCards.request);
        }}
      />
    </div>
  );
};

export default DashboardAdminNavigation;
