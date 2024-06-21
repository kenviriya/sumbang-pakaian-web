import {CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import ArrangeCard from './arrageCard';
import {ScrollArea} from '@/components/ui/scroll-area';
import {api} from '@/convex/_generated/api';
import {useQuery} from 'convex/react';
import {useUser} from '@clerk/clerk-react';

const ArrangeContent = () => {
  const user = useUser();

  const getUserDonationRequest = useQuery(
    api.controllers.donation_request_controller.getAllDonationRequest,
    {
      userId: user.user?.id,
    }
  );

  if (getUserDonationRequest === undefined) {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <h1>Galang Pakaian yang Kamu Buat</h1>
          </CardTitle>
        </CardHeader>
        <ScrollArea className="h-[700px]">
          <CardContent>
            {Array.from({length: 6}, (_, i) => (
              <div className="mb-4" key={i}>
                <ArrangeCard.Skeleton />
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1>Galang Pakaian yang Kamu Buat</h1>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[500px]">
        <CardContent>
          {getUserDonationRequest?.length === 0 && (
            <h2 className="text-muted-foreground col-span-4 justify-center flex">
              Kamu belum membuat galang pakaian
            </h2>
          )}
          {getUserDonationRequest?.map((item) => (
            <div className={'mb-4'} key={item?.requestId}>
              <ArrangeCard
                title={item?.title}
                description={item?.description}
                requestId={item?.requestId}
                status={item?.requestStatus}
              />
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </>
  );
};

export default ArrangeContent;
