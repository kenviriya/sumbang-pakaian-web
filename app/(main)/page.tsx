"use client";

import Heading from "./_components/heading";
import ItemCard from "./_components/donationCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { useState } from "react";

const HomePage = () => {
  const { isLoading } = useConvexAuth();
  const [donationData, setDonationData] = useState([]);
  try {
    const fetchData = useQuery(api.donationRequests.getAllRequestDonation);
    console.log(fetchData);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="h-full w-full">
      <Heading />
      <div className="px-[10%] mt-5 bg-[#f8f7f4]">
        <div className="flex flex-row flex-wrap gap-5 justify-center">
          {isLoading && <Spinner />}
          {donationData?.length === 0 && (
            <h2 className="text-muted-foreground">
              Belum ada yang request donasi :)
            </h2>
          )}
          {!isLoading && (
            <>
              {donationData?.map((item) => (
                <ItemCard
                  key={""}
                  imageUrl={""}
                  title={""}
                  description={""}
                  donationId={""}
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
