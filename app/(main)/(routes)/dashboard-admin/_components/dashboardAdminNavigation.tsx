'use client';

import {useUser} from '@clerk/clerk-react';
import {Mail, Grip} from 'lucide-react';
import DashboardAdminNavigationButton from './dashboardAdminNavigationButton';
import React from 'react';
import ManageDonationContent from '@/app/(main)/(routes)/dashboard-admin/_components/(manage-donation)/manageDonationContent';
import DonationRequestContent from '@/app/(main)/(routes)/dashboard-admin/_components/(donation-request)/donationRequestContent';

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
  const contentCards = {
    donation: <ManageDonationContent />,
    request: <DonationRequestContent />,
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow p-2">
      <DashboardAdminNavigationButton
        icon={<Mail className="h-5 w-5" />}
        text="Galang Pakaian"
        isActive={activeButton === 'request' && true}
        onClick={() => {
          setActiveButton('request');
          setActiveContent(contentCards.request);
        }}
      />
      <DashboardAdminNavigationButton
        icon={<Grip className="h-5 w-5" />}
        text="Mengelola Donasi"
        isActive={activeButton === 'donation' && true}
        onClick={() => {
          setActiveButton('donation');
          setActiveContent(contentCards.donation);
        }}
      />
    </div>
  );
};

export default DashboardAdminNavigation;
