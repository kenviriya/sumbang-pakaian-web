'use client';

import {useState} from 'react';
import Navigation from './_components/navigation';
import SumbangContent from './_components/sumbangNavContent';

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState(<SumbangContent />);
  const [activeButton, setActiveButton] = useState('sumbang');

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <Navigation
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setActiveContent={setActiveContent}
        />
      </div>
      <div className="col-span-4">
        <div
          className={`${activeButton !== 'user' && 'rounded-md border bg-card text-card-foreground shadow p-4'}`}
        >
          {activeContent}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
