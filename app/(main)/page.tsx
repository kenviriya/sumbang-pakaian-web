"use client";

import Heading from "./_components/heading";
import ItemCard from "./_components/donationCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";

// Disabling SSR for this component because it causes a mismatch between the server and client rendered content
import dynamic from "next/dynamic";
const CardSkeleton = dynamic(
  () => import("@/app/(main)/_components/cardSkeleton"),
  { ssr: false },
);

const HomePage = () => {
  const { isLoading } = useConvexAuth();

  const fetchData = useQuery(api.donationRequests.getAllRequestDonation);

  return (
    <div className="h-full w-full">
      <Heading />
      <div className="px-[10%] mt-5 bg-[#f8f7f4]">
        <div className="flex flex-row flex-wrap gap-5 justify-center">
          {isLoading && <CardSkeleton quantity={4} />}
          {!isLoading && fetchData?.length === 0 && (
            <h2 className="text-muted-foreground">
              Belum ada yang request pakaian :)
            </h2>
          )}
          {!isLoading && (
            <>
              {fetchData?.map((item) => (
                <ItemCard
                  key={item.donationId}
                  imageUrl={item?.image || ""}
                  title={item?.title || ""}
                  description={item?.description || ""}
                  donationId={item.donationId}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
