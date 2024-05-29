import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import CardCloth from './clothCard';
import {useRouter} from 'next/navigation';
import {api} from '@/convex/_generated/api';
import {useQuery} from 'convex/react';
import {useConvexAuth} from 'convex/react';
import {useUser} from '@clerk/clerk-react';
import {Spinner} from '@/components/spinner';

const UserClothes = () => {
  const router = useRouter();
  const {isLoading} = useConvexAuth();
  const {user} = useUser();
  const requestData = useQuery(api.userDonation.getUserClothDonation);
  const sortedData = requestData
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
    )
    .filter((data) => data?.userId === user?.id)
    .filter((data) => data?.status === 'PENDING');

  return (
    <div>
      <h2 className="mb-2 font-medium">
        Upload foto baju kamu disini. Kamu akan mendapatkan notifikasi jika baju
        kamu dibutuhkan.
      </h2>
      <Button
        className="mb-4"
        onClick={() => router.push(`/dashboard/add-clothes`)}
      >
        Tambah Pakaian
      </Button>

      <Separator />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {sortedData?.length === 0 && (
          <h2 className="text-muted-foreground col-span-4">
            Belum ada pakaian yang di upload.
          </h2>
        )}
        {isLoading && <Spinner />}
        <div>
          {!isLoading && sortedData?.length !== 0 && (
            <>
              {sortedData?.map((item) => (
                <CardCloth
                  key={item?.clothId ?? ''}
                  clothId={item?.clothId ?? ''}
                  imageUrl={item?.image ?? ''}
                  title={item?.name ?? ''}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserClothes;
