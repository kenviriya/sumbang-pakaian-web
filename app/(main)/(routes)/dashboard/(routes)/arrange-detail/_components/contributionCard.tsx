import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Eye} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';
import {useRouter} from 'next/navigation';

interface RequestCardProps {
  userName: string;
  status: string;
  formId: string;
}

const ContributionCard = ({userName, status, formId}: RequestCardProps) => {
  const router = useRouter();
  let formStatus;

  if (status === 'ON VERIFICATION') {
    formStatus = 'Butuh di verifikasi';
  }

  if (status === 'ON DELIVERY') {
    formStatus = 'Sedang dikirim';
  }

  if (status === 'DONE') {
    formStatus = 'Sudah di terima';
  }

  if (status === 'REJECTED') {
    formStatus = 'Ditolak';
  }

  if (status === 'PENDING') {
    formStatus = 'Menunggu dikirim';
  }

  return (
    <Card>
      <div className={'grid grid-cols-4'}>
        <div className={'col-span-3'}>
          <CardHeader>
            <CardTitle>{userName}</CardTitle>
          </CardHeader>
          <CardContent>{formStatus}</CardContent>
        </div>
        <div className={'flex justify-center items-center row-span-2'}>
          <Button
            onClick={() => {
              router.push(`/dashboard/arrange-detail/contributor/${formId}`);
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

ContributionCard.Skeleton = function RequestCardSkeleton() {
  return <Skeleton className={'h-32 rounded-lg'} />;
};

export default ContributionCard;
