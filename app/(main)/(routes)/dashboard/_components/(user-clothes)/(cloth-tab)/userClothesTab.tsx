import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CardCloth from "./clothCard";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserClothes = () => {
  const router = useRouter();
  const { isLoading } = useConvexAuth();

  const requestData = useQuery(
    api.controllers.cloth_controller.getUserClothes,
    {
      status: "AVAILABLE",
    },
  );

  if (requestData === undefined) {
    return (
      <>
        <h2 className="mb-2 font-medium">
          Masukan baju kamu ke dalam sistem kami. Kamu akan mendapatkan
          notifikasi jika baju kamu dibutuhkan.
        </h2>
        <Button
          className="mb-4"
          onClick={() => router.push(`/dashboard/add-clothes`)}
        >
          Tambah Pakaian
        </Button>
        <ScrollArea className="h-[500px]">
          <CardContent>
            {Array.from({ length: 6 }, (_, i) => (
              <div className="mb-4" key={i}>
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
      <h2 className="mb-2 font-medium">
        Masukan baju kamu ke dalam sistem kami. Kamu akan mendapatkan notifikasi
        jika baju kamu dibutuhkan.
      </h2>
      <Button
        className="mb-4"
        onClick={() => router.push(`/dashboard/add-clothes`)}
      >
        Tambah Pakaian
      </Button>

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

export default UserClothes;
