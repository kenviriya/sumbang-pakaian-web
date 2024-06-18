'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {api} from '@/convex/_generated/api';
import {Id} from '@/convex/_generated/dataModel';

import {useQuery} from 'convex/react';
import Image from 'next/image';
import {useParams} from 'next/navigation';

const UserRequestDetailPage = () => {
  const params = useParams();

  const getDonationRequest = useQuery(
    api.controllers.donation_request_controller.getDonationRequestById,
    {
      donationRequestId: params.requestId as Id<'donation_request'>,
    }
  );

  return (
    <div className="mt-2 min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[800px]">
          <CardHeader>
            <CardTitle>{getDonationRequest?.title || 'Kosong'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image
                src={getDonationRequest?.imageUrl || '/'}
                alt="donation-image"
                width={800}
                height={300}
                className="mb-2"
              />
            </div>

            <h3 className="font-semibold">Deskripsi</h3>
            <CardDescription className="mb-2">
              <p>{getDonationRequest?.description || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Lokasi Penerima</h3>
            <CardDescription className="mb-3">
              <p>{getDonationRequest?.address || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Durasi Campaign:</h3>
            <CardDescription className="mb-3">
              <p>{getDonationRequest?.duration || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Status Request:</h3>
            <CardDescription className="mb-3">
              <p>{getDonationRequest?.requestStatus || 'Kosong'}</p>
            </CardDescription>

            <Separator className="my-2" />
            <h3 className="font-semibold mb-2">Baju yang kamu harus request</h3>

            {getDonationRequest?.clothRequests?.map((clothRequests, index) => (
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
        </Card>
      </div>
    </div>
  );
};

export default UserRequestDetailPage;
