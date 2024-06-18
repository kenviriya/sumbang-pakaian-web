import {Separator} from '@/components/ui/separator';
import HistoryCard from './historyCard';
import {api} from '@/convex/_generated/api';
import {useQuery} from 'convex/react';
import {useConvexAuth} from 'convex/react';
import {Spinner} from '@/components/spinner';
import {useUser} from '@clerk/clerk-react';

const UserClothesHistory = () => {
  const {isLoading} = useConvexAuth();
  const requestData = useQuery(
    api.controllers.cloth_controller.getUserClothes,
    {}
  );

  return (
    <>
      <h2 className="mb-2 font-medium text-gray-800">
        History pakaian yang kamu sumbang.
      </h2>
      <div className="grid gap-y-4">
        {isLoading && <Spinner />}
        {!isLoading && (
          <>
            {requestData?.map((item) => (
              <div key={item?._id}>
                <HistoryCard
                  id={item?._id}
                  title={item?.name}
                  description={item?.description}
                  status={item?.status ?? 'Undefined'}
                />
                <Separator className="mt-2" />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default UserClothesHistory;
