"use client";

import { useState } from "react";
import DashboardNavigation from "./_components/dashboardNavigation";
import SumbangContent from "./_components/(user-clothes)/clothNavContent";

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState(<SumbangContent />);
  const [activeButton, setActiveButton] = useState("sumbang");

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <DashboardNavigation
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setActiveContent={setActiveContent}
        />
      </div>
      <div className="col-span-4">
        <div
          className={`${activeButton !== "user" && "rounded-md border bg-card text-card-foreground shadow p-4"}`}
        >
          {activeContent}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
