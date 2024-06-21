"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { Shirt, Package2, HandHeart } from "lucide-react";
import DashboardNavigationButton from "./dashboardNavigationButton";
import React from "react";
import UserContent from "./(user-profile)/userNavContent";
import SumbangContent from "./(user-clothes)/clothNavContent";
import DonasiContent from "./(user-donation)/donationNavContent";
import ArrangeContent from "@/app/(main)/(routes)/dashboard/_components/(user-arrange)/arrangeNavContent";

interface INavigationProps {
  activeButton: React.ReactNode;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
  setActiveContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

const DashboardNavigation = ({
  activeButton,
  setActiveButton,
  setActiveContent,
}: INavigationProps) => {
  const { user } = useUser();

  const contentCards = {
    user: <UserContent />,
    sumbang: <SumbangContent />,
    donasi: <DonasiContent />,
    galang: <ArrangeContent />,
    // points: <PointsContent />,
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow p-2">
      <DashboardNavigationButton
        icon={<Shirt className="h-5 w-5" />}
        text="Sumbang Pakaian"
        isActive={activeButton === "sumbang" && true}
        onClick={() => {
          setActiveButton("sumbang");
          setActiveContent(contentCards.sumbang);
        }}
      />
      <DashboardNavigationButton
        icon={<Package2 className="h-5 w-5" />}
        text="Donasi Pakian"
        isActive={activeButton === "donasi" && true}
        onClick={() => {
          setActiveButton("donasi");
          setActiveContent(contentCards.donasi);
        }}
      />
      <DashboardNavigationButton
        icon={<HandHeart className="h-5 w-5" />}
        text={"Galang Pakaian"}
        isActive={activeButton === "galang" && true}
        onClick={() => {
          setActiveButton("galang");
          setActiveContent(contentCards.galang);
        }}
      />
      <DashboardNavigationButton
        icon={
          <Avatar className="h-5 w-5">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
        }
        text={user?.fullName}
        isActive={activeButton === "user" && true}
        onClick={() => {
          setActiveButton("user");
          setActiveContent(contentCards.user);
        }}
      />
    </div>
  );
};

export default DashboardNavigation;
