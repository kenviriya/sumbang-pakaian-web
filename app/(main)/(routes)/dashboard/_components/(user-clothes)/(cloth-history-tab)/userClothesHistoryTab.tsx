import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import CardCloth from "@/app/(main)/(routes)/dashboard/_components/(user-clothes)/(cloth-tab)/clothCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const UserClothesHistory = () => {
  const { isLoading } = useConvexAuth();

  const requestData = useQuery(
    api.controllers.cloth_controller.getUserClothes,
    {
      status: "DONATED",
    },
  );

  if (requestData === undefined) {
    return (
      <>
        <h2 className="mb-2 font-medium">History pakaian yang kamu sumbang.</h2>
        <Separator />
        <ScrollArea className="h-[500px]">
          <CardContent>
            {Array.from({ length: 6 }, (_, i) => (
              <div className="mt-4" key={i}>
                <CardCloth.Skeleton />
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </>
    );
  }

  return (
    <>
      <h2 className="mb-2 font-medium">History pakaian yang kamu sumbang.</h2>

      <Separator />

      <div>
        {requestData?.length === 0 && (
          <h2 className="text-muted-foreground col-span-4 justify-center flex">
            Belum ada pakaian yang dimasukan ke dalam sistem
          </h2>
        )}

        <ScrollArea className="h-[450px]">
          {!isLoading && requestData?.length !== 0 && (
            <>
              {requestData?.map((item) => (
                <div key={item?.clothId} className={"mt-4"}>
                  <CardCloth
                    clothId={item?.clothId}
                    title={item?.name}
                    status={item?.status}
                  />
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default UserClothesHistory;
