import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Eye} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';

interface IClothCardProps {
  title: string;
  description: string;
  clothId: string;
  status: string | undefined;
}

const CardCloth = ({title, clothId, description, status}: IClothCardProps) => {
  const router = useRouter();

  return (
    <Card>
      <div className={'grid grid-cols-4'}>
        <div className={'col-span-3'}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            Status:{' '}
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-green-600 text-primary-foreground shadow h-9 px-4 py-2">
              {status}
            </div>
          </CardContent>
        </div>
        <div className={'flex justify-center items-center row-span-2'}>
          <Button
            onClick={() => {
              router.push(`/dashboard/cloth-detail/${clothId}`);
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

CardCloth.Skeleton = function CardClothSkeleton() {
  return <Skeleton className={'h-32 rounded-lg'} />;
};
export default CardCloth;
