'use client';

import {Spinner} from '@/components/spinner';
import {useConvexAuth} from 'convex/react';
import {redirect} from 'next/navigation';

const ContributionLayout = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated, isLoading} = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={'lg'} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-[4%]">
      <main className="h-full">{children}</main>
    </div>
  );
};

export default ContributionLayout;
