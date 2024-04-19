'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import {Shirt} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useConvexAuth} from 'convex/react';
import {SignInButton} from '@clerk/clerk-react';
import {Skeleton} from '@/components/ui/skeleton';

interface ItemCardProps {
  imageUrl: string;
  title: string;
  description: string;
  donationId: string;
}

<<<<<<< HEAD
const ItemCard: React.FC<ItemCardProps> = ({imageUrl, title, description}) => {
=======
const ItemCard = ({
  imageUrl,
  title,
  description,
  donationId,
}: ItemCardProps) => {
  const {isAuthenticated, isLoading} = useConvexAuth();
  const router = useRouter();

>>>>>>> develop
  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return description;
  };

  return (
<<<<<<< HEAD
    <>
      <Card className="w-[250px] h-[380px]">
        <CardContent className="p-0">
          <Image
            src={imageUrl}
            alt={imageUrl}
            width={250}
            height={300}
            className="rounded-t-lg"
          />
        </CardContent>
        <div className="flex flex-col justify-between h-[150px]">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {truncateDescription(description)}
            </CardDescription>
          </CardHeader>
        </div>
        <div className="position-absolute">
          <CardFooter>
            <Button className="w-full">
              <Shirt className="mr-2 h-4 w-4" />
              Donate
            </Button>
          </CardFooter>
        </div>
      </Card>
    </>
=======
    <Card className="w-[250px] h-[380px]">
      <CardContent className="p-0">
        <Image
          src={imageUrl}
          alt={title}
          width={250}
          height={300}
          className="rounded-t-lg"
        />
      </CardContent>
      <div className="flex flex-col justify-between h-[150px]">
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
              router.push(`/donation/${donationId}`);
            }}
          >
            <Shirt className="mr-2 h-4 w-4" />
            Sumbang
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
>>>>>>> develop
  );
};

export default ItemCard;
