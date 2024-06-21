'use client';

import ContributionCard from '@/app/(main)/(routes)/dashboard/(routes)/arrange-detail/_components/contributionCard';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {api} from '@/convex/_generated/api';
import {Id} from '@/convex/_generated/dataModel';
import {useMutation, useQuery} from 'convex/react';
import {CircleX, Loader2} from 'lucide-react';
import Image from 'next/image';
import {useParams} from 'next/navigation';
import {useState} from 'react';
import {toast} from 'sonner';

const DonationDetailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const getDonation = useQuery(
    api.controllers.donation_controller.getDonationById,
    {
      donationId: params.donationId as Id<'donation'>,
    }
  );

  const updateDonationStatus = useMutation(
    api.controllers.donation_controller.updateDonationStatus
  );

  const handleCancel = () => {
    setIsLoading(true);
    try {
      const promise = updateDonationStatus({
        donationId: params.donationId as Id<'donation'>,
        status: 'CANCELED',
      }).finally(() => {
        setIsLoading(false);
      });

      toast.promise(promise, {
        loading: 'Membatalkan donasi...',
        success: 'Berhasil membatalkan donasi',
        error: 'Gagal membatalkan donasi',
      });
    } catch (error) {
      console.log(error);
      toast.error('Gagal membatalkan donasi');
    }
  };

  return (
    <div className="mt-2 min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[900px]">
          <CardHeader>
            <CardTitle>{getDonation?.donationTitle || 'Kosong'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image
                src={getDonation?.imageUrl || '/'}
                alt="donation-image"
                width={800}
                height={300}
                className="mb-2"
              />
            </div>

            <h3 className="font-semibold">Deskripsi</h3>
            <CardDescription className="mb-2">
              <p>{getDonation?.donationDescription || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Lokasi Penerima</h3>
            <CardDescription className="mb-3">
              <p>{getDonation?.address || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Durasi Campaign:</h3>
            <CardDescription className="mb-3">
              <p>{getDonation?.duration || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Status Request:</h3>
            <CardDescription className="mb-3">
              <p>{getDonation?.requestStatus || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Status Donasi:</h3>
            <CardDescription className="mb-3">
              <p>{getDonation?.donationStatus || 'Kosong'}</p>
            </CardDescription>

            <Separator className="my-2" />
            <h3 className="font-semibold mb-2">Baju yang di request</h3>

            {getDonation?.clothRequests?.map((clothRequests, index) => (
              <div className="grid grid-cols-4 gap-4 mb-2" key={index}>
                <div className="col-span-1">
                  <h4 className="font-medium">Kategori</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequests?.category || 'Kosong'}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Gender</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequests?.gender || 'Kosong'}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Ukuran</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequests?.size || 'Kosong'}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Quantity</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequests?.quantity || 'Kosong'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {isLoading && (
            <CardFooter>
              <Button disabled variant={'destructive'}>
                Mohon tunggu...
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              </Button>
            </CardFooter>
          )}

          {!isLoading && getDonation?.donationStatus !== 'CANCELED' && (
            <CardFooter>
              <Button variant={'destructive'} onClick={handleCancel}>
                Batalkan Donasi
                <CircleX className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DonationDetailPage;
