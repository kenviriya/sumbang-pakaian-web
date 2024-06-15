"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

const DonationFormLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useUser();
  const userRole = user.user?.organizationMemberships[0]?.role;

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (!isAuthenticated || userRole === "org:admin") {
    return redirect("/");
  }

  return (
    <div className="min-h-[75vh] bg-[#f8f7f4] px-[20%]">
      <main className="h-full">{children}</main>
    </div>
  );
};

export default DonationFormLayout;
