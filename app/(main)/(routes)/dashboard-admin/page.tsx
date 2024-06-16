"use client";

import { useState } from "react";

import DashboardAdminNavigation from "@/app/(main)/(routes)/dashboard-admin/_components/dashboardAdminNavigation";
import DonationRequestContent from "@/app/(main)/(routes)/dashboard-admin/_components/(donation-request)/donationRequestContent";

const DashboardAdmin = () => {
  const [activeContent, setActiveContent] = useState(
    <DonationRequestContent />,
  );
  const [activeButton, setActiveButton] = useState("request");

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <DashboardAdminNavigation
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setActiveContent={setActiveContent}
        />
      </div>
      <div className="col-span-4">
        {/*<div*/}
        {/*  className={`${activeButton !== "user" && "rounded-md border bg-card text-card-foreground shadow p-4"}`}*/}
        {/*>*/}
        {activeContent}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default DashboardAdmin;
