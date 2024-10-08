"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface IDonationCardProps {
  imageUrl: string;
  title: string;
  description: string;
  userId: string;
  donationId: string;
  donationRequestId: string;
}

const DonationCard = ({
  imageUrl,
  title,
  description,
  donationId,
  userId,
  donationRequestId,
}: IDonationCardProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const user = useUser();
  const userIdLogin = user.user?.id;

  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return description;
  };

  return (
    <Card className="w-[250px] h-[400px]">
      <CardContent className="p-0">
        <AspectRatio ratio={4 / 3}>
          <Image
            quality={100}
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </AspectRatio>
      </CardContent>
      <div className="flex flex-col justify-between h-[150px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{truncateDescription(description)}</CardDescription>
        </CardHeader>
      </div>
      <CardFooter>
        {isLoading && <Skeleton className="w-full h-10" />}
        {isAuthenticated && !isLoading && userId !== userIdLogin && (
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/donation-details/${donationId}`);
            }}
          >
            <Shirt className="mr-2 h-4 w-4" />
            Sumbang
          </Button>
        )}
        {isAuthenticated && !isLoading && userId === userIdLogin && (
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/dashboard/arrange-detail/${donationRequestId}`);
            }}
          >
            <Shirt className="mr-2 h-4 w-4" />
            Manage
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button className="w-full">
              <Shirt className="mr-2 h-4 w-4" />
              Sumbang
            </Button>
          </SignInButton>
        )}
      </CardFooter>
    </Card>
  );
};

export default DonationCard;
