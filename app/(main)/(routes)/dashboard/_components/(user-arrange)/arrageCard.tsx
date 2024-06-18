import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Eye} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';
import {useRouter} from 'next/navigation';

interface ArrangeCardProps {
  title: string;
  description: string;
  requestId: string;
}

const ArrangeCard = ({title, description, requestId}: ArrangeCardProps) => {
  const router = useRouter();

  return (
    <Card>
      <div className={'grid grid-cols-4'}>
        <div className={'col-span-3'}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>{description}</CardContent>
        </div>
        <div className={'flex justify-center items-center row-span-2'}>
          <Button
            onClick={() => {
              router.push(`/dashboard/arrange-detail/${requestId}`);
            }}
          >
            Lihat Detail
            <Eye className={'h-5 w-5 ml-2'} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

ArrangeCard.Skeleton = function RequestCardSkeleton() {
  return <Skeleton className={'h-32 rounded-lg'} />;
};

export default ArrangeCard;
