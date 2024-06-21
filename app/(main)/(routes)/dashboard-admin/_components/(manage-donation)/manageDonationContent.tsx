import DonationCard from './donationCard';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';

const ManageDonationContent = () => {
  const getDonations = useQuery(
    api.controllers.donation_controller.getAllDonations
  );

  if (getDonations === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage donation card</CardTitle>
        </CardHeader>
        <CardContent
          className={
            'w-full grid grid-cols-1 gap-4  justify-center justify-items-center sm:grid-cols-2 md:grid-cols-4 md:gap-y-8'
          }
        >
          <DonationCard.Skeleton />
          <DonationCard.Skeleton />
          <DonationCard.Skeleton />
          <DonationCard.Skeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage donation card</CardTitle>
      </CardHeader>
      <CardContent
        className={
          'w-full grid grid-cols-1 gap-4  justify-center justify-items-center sm:grid-cols-2 md:grid-cols-4 md:gap-y-8'
        }
      >
        {getDonations && getDonations.length <= 0 && (
          <div className="flex justify-center items-center h-full w-full">
            <p className="text-center">Belum Ada Donasi</p>
          </div>
        )}
        {getDonations?.map((donation) => (
          <div key={donation?.id}>
            <DonationCard
              imageUrl={donation?.imageUrl || '/No image'}
              title={donation?.donationTitle || 'No title'}
              description={donation?.donationDescription || 'No description'}
              donationId={donation?.id || 'No id'}
              status={donation?.donationStatus || 'No status'}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ManageDonationContent;
