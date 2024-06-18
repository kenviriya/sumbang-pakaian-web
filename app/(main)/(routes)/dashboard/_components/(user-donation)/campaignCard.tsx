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
import {Eye} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useConvexAuth} from 'convex/react';
import {Skeleton} from '@/components/ui/skeleton';
import {AspectRatio} from '@/components/ui/aspect-ratio';

interface IDonationCardProps {
  imageUrl: string;
  title: string;
  description: string;
  formId: string;
  status: string;
}

const CampaignCard = ({
  imageUrl,
  title,
  description,
  formId,
  status,
}: IDonationCardProps) => {
  const {isAuthenticated, isLoading} = useConvexAuth();
  const router = useRouter();

  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return description;
  };

  let formStatus;

  if (status === 'PENDING') {
    formStatus = 'Perlu dikirim';
  }

  if (status === 'ON DELIVERY') {
    formStatus = 'Sedang dikirim';
  }

  if (status === 'DONE') {
    formStatus = 'Selesai';
  }

  if (status === 'CANCELED') {
    formStatus = 'Dibatalkan';
  }

  if (status === 'ON VERIFICATION') {
    formStatus = 'Sedang di verifikasi';
  }

  return (
    <Card className="w-[200px] h-[360px]">
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
      <div className="flex flex-col justify-between h-[160px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{truncateDescription(description)}</CardDescription>
          <CardDescription>
            Status: <span className="font-bold">{formStatus}</span>
          </CardDescription>
        </CardHeader>
      </div>
      <CardFooter>
        {isLoading && <Skeleton className="w-full h-20" />}
        {isAuthenticated && !isLoading && (
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/dashboard/campaign-detail/${formId}`);
            }}
          >
            Lihat Detail
            <Eye className="ml-2 h-5 w-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

CampaignCard.Skeleton = function RequestCardSkeleton() {
  return <Skeleton className={'h-[360px] w-[200px] rounded-lg'} />;
};

export default CampaignCard;
