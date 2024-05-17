'use client';

import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {useUser} from '@clerk/clerk-react';
import {Shirt} from 'lucide-react';
import NavigationButton from './navigationButton';
import React from 'react';
import UserContent from './userNavContent';
import SumbangContent from './sumbangNavContent';

interface INavigationProps {
  activeButton: React.ReactNode;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
  setActiveContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

const Navigation = ({
  activeButton,
  setActiveButton,
  setActiveContent,
}: INavigationProps) => {
  const {user} = useUser();

  const contentCards = {
    user: <UserContent />,
    sumbang: <SumbangContent />,
    // history: <HistoryContent />,
    // points: <PointsContent />,
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow p-2">
      <NavigationButton
        icon={<Shirt className="h-5 w-5" />}
        text="Sumbang Pakaian"
        isActive={activeButton === 'sumbang' && true}
        onClick={() => {
          setActiveButton('sumbang');
          setActiveContent(contentCards.sumbang);
        }}
      />
      <NavigationButton
        icon={
          <Avatar className="h-5 w-5">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
        }
        text={user?.fullName}
        isActive={activeButton === 'user' && true}
        onClick={() => {
          setActiveButton('user');
          setActiveContent(contentCards.user);
        }}
      />
    </div>
  );
};

export default Navigation;
