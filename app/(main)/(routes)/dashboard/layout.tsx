'use client';

import {Spinner} from '@/components/spinner';
import {useConvexAuth} from 'convex/react';
import {redirect} from 'next/navigation';

const ContributionLayout = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated, isLoading} = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <Spinner size={'lg'} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="min-h-[75vh] bg-[#f8f7f4] px-[10%]">
      <main className="h-full">{children}</main>
    </div>
  );
};

export default ContributionLayout;
