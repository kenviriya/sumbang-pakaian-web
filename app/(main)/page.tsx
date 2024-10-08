'use client';

import Heading from './_components/heading';
import ItemCard from './_components/donationCard';
import {api} from '@/convex/_generated/api';
import {useQuery} from 'convex/react';
import {useConvexAuth} from 'convex/react';

// Disabling SSR for this component because it causes a mismatch between the server and client rendered content
import dynamic from 'next/dynamic';

const CardSkeleton = dynamic(
  () => import('@/app/(main)/_components/(skeleton)/cardSkeleton'),
  {ssr: false}
);

const HomePage = () => {
  const {isLoading} = useConvexAuth();

  const fetchData = useQuery(
    api.controllers.donation_controller.filterDonation,
    {
      status: 'ACTIVE',
    }
  );

  return (
    <div className="h-full w-full">
      <Heading />
      <div className="px-[10%] mt-5 bg-[#f8f7f4] grid grid-cols-4 justify-items-center gap-y-10 gap-x-5">
        {isLoading && <CardSkeleton quantity={10} />}
        {!isLoading && fetchData?.length === 0 && (
          <div className={'col-span-4'}>
            <h2 className="text-muted-foreground text-center">
              Belum ada yang request pakaian :)
            </h2>
          </div>
        )}
        {!isLoading && (
          <>
            {fetchData?.map((item) => (
              <ItemCard
                key={item?.id}
                imageUrl={item?.imageUrl || ''}
                title={item?.donationTitle || ''}
                description={item?.donationDescription || ''}
                donationId={item?.id || ''}
                userId={item?.userId || ''}
                donationRequestId={item?.donationRequestId || ''}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
