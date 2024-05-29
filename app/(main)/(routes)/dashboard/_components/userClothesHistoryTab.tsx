import { Separator } from "@/components/ui/separator";
import HistoryCard from "./historyCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { useUser } from "@clerk/clerk-react";

const UserClothesHistory = () => {
  const { isLoading } = useConvexAuth();
  const { user } = useUser();
  const requestData = useQuery(api.userDonation.getUserClothDonation);
  const sortedData = requestData
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
    )
    .filter((data) => data?.userId === user?.id)
    .filter(
      (data) => data?.status === "Accepted" || data?.status === "Decline"
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
            {sortedData?.map((item) => (
              <div key={item?.clothId}>
                <HistoryCard
                  id={item?.clothId}
                  imageUrl={item?.image}
                  title={item?.name}
                  description={item?.description}
                  status={item?.status ?? "Undefined"}
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
