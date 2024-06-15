import Notification from "@/app/(main)/_components/notification";
import { Skeleton } from "@/components/ui/skeleton";

const NavbarSkeleton = () => {
  return (
    <>
      <Notification />
      <Skeleton className="w-[120px] h-9" />
      <Skeleton className="w-[100px] h-9" />
      <div className="hidden md:flex">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </>
  );
};

export default NavbarSkeleton;
