'use client';

import * as React from 'react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Image from 'next/image';
import {Shirt} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Id} from '@/convex/_generated/dataModel';

const DonationDetailPage = () => {
  const router = useRouter();
  const params = useParams();

  const getDonation = useQuery(
    api.controllers.donation_controller.getDonationById,
    {donationId: params.donationId as Id<'donation'>}
  );

  console.log('getDonation', getDonation);

  return (
    <div className="mt-2 px-[10%] min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[800px]">
          <CardHeader>
            <CardTitle>{getDonation?.title}</CardTitle>
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
              <p>{getDonation?.description}</p>
            </CardDescription>
            <h3 className="font-semibold">Lokasi Penerima</h3>
            <CardDescription className="mb-3">
              <p>{getDonation?.address}</p>
            </CardDescription>
            <Separator className="my-2" />

            <h3 className="font-semibold mb-2">Baju yang di Request</h3>
            {getDonation?.clothRequest?.map((clothRequest, index) => (
              <div className="grid grid-cols-4 gap-4 mb-2" key={index}>
                <div className="col-span-1">
                  <h4 className="font-medium">Kategori</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequest.category}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Gender</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequest.gender}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Ukuran</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequest.size}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="font-medium">Quantity</h4>
                  <div className={'border-2 border-muted rounded p-1'}>
                    <div className={'text-muted-foreground'}>
                      {clothRequest.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex">
            <div className="w-full">
              <Button
                className="w-full"
                onClick={() => {
                  router.push(`/donation-form?donationId=${params.donationId}`);
                }}
              >
                <Shirt className="mr-2 h-4 w-4" />
                Sumbang
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DonationDetailPage;
