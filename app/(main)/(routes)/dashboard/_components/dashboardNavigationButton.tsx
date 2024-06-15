"use client";

import React from "react";

interface INavigationButtonProps {
  icon: React.ReactNode;
  text: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const DashboardNavigationButton = ({
  icon,
  text,
  isActive,
  onClick,
}: INavigationButtonProps) => {
  return (
    <div
      role="button"
      className={`flex items-center text-sm p-3 w-full mb-1 ${isActive === false && "hover:bg-primary/5 transition-colors duration-300"} ${isActive && "bg-primary/10 rounded-sm transition-colors duration-300 hover:bg-primary/10"}`}
      onClick={onClick}
    >
      <div className="gap-x-2 flex items-center max-w-[150px]">
        {icon}
        <span className="text-start font-medium line-clamp-1">{text}</span>
      </div>
    </div>
  );
};

export default DashboardNavigationButton;
