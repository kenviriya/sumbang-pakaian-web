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

interface ItemCardProps {
  imageUrl: string;
  title: string;
  description: string;
  donationId: string;
}

const ItemCard = ({
  imageUrl,
  title,
  description,
  donationId,
}: ItemCardProps) => {
  const router = useRouter();

  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className="mt-2 flex justify-center">
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
            <CardDescription>
              {truncateDescription(description)}
            </CardDescription>
          </CardHeader>
        </div>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/donation/${donationId}`);
            }}
          >
            <Shirt className="mr-2 h-4 w-4" />
            Donate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ItemCard;
