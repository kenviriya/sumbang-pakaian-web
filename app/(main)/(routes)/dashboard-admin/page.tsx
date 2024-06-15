"use client";

import { useState } from "react";

import ManageDonationContent from "@/app/(main)/(routes)/dashboard-admin/_components/(manage-donation)/manageDonationContent";
import DashboardAdminNavigation from "@/app/(main)/(routes)/dashboard-admin/_components/dashboardAdminNavigation";

const DashboardAdmin = () => {
  const [activeContent, setActiveContent] = useState(<ManageDonationContent />);
  const [activeButton, setActiveButton] = useState("donation");

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
