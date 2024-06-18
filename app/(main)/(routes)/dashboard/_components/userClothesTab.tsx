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
  const requestData = useQuery(
    api.controllers.cloth_controller.getUserClothes,
    {}
  );

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
        {requestData?.length === 0 && (
          <h2 className="text-muted-foreground col-span-4">
            Belum ada pakaian yang di upload.
          </h2>
        )}
        {isLoading && <Spinner />}
        <div>
          {!isLoading && requestData?.length !== 0 && (
            <>
              {requestData?.map((item) => (
                <CardCloth
                  key={item?._id ?? ''}
                  clothId={item?._id ?? ''}
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
