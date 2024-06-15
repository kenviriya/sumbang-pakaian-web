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
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IDonationCardProps {
  imageUrl: string;
  title: string;
  description: string;
  donationId: string;
}

const DonationCard = ({
  imageUrl,
  title,
  description,
  donationId,
}: IDonationCardProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return description;
  };

  return (
    <Card className="w-[200px] h-[300px]">
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
      <div className="flex flex-col justify-between h-[100px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{truncateDescription(description)}</CardDescription>
        </CardHeader>
      </div>
      <CardFooter>
        {isLoading && <Skeleton className="w-full h-10" />}
        {isAuthenticated && !isLoading && (
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/donation-details/${donationId}`);
            }}
          >
            <Shirt className="mr-2 h-4 w-4" />
            Manage
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DonationCard;
