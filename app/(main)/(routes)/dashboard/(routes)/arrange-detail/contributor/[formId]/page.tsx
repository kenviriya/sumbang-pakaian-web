'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {api} from '@/convex/_generated/api';
import {Id} from '@/convex/_generated/dataModel';
import {Separator} from '@radix-ui/react-separator';
import {useMutation, useQuery} from 'convex/react';
import {BadgeCheck, Loader2} from 'lucide-react';
import {useParams} from 'next/navigation';
import {useState} from 'react';
import {toast} from 'sonner';

const UserDonationFormDetailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const getDonationForm = useQuery(
    api.controllers.donation_form_controller.getDonationFormById,
    {
      donationFormId: params.formId as Id<'donation_form'>,
    }
  );

  const updateFormStatus = useMutation(
    api.controllers.donation_form_controller.updateDonationForm
  );

  const verfiedReciept = () => {
    setIsLoading(true);
    try {
      const updateStatus = updateFormStatus({
        donationFormId: params.formId as Id<'donation_form'>,
        status: 'ON DELIVERY',
      }).finally(() => {
        setIsLoading(false);
      });

      toast.promise(updateStatus, {
        loading: 'Sedang update status...',
        success: 'Status berhasil di update',
      });
    } catch (error) {
      console.log(error);
      toast.error('Gagal update status');
    }
  };

  const doneReciept = () => {
    setIsLoading(true);
    try {
      const updateStatus = updateFormStatus({
        donationFormId: params.formId as Id<'donation_form'>,
        status: 'DONE',
      }).finally(() => {
        setIsLoading(false);
      });

      toast.promise(updateStatus, {
        loading: 'Sedang update status...',
        success: 'Status berhasil di update',
      });
    } catch (error) {
      console.log(error);
      toast.error('Gagal update status');
    }
  };

  return (
    <div className="mt-2 min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="w-[800px]">
          <CardHeader>
            <CardTitle>{getDonationForm?.donationTitle || 'Kosong'}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Deskripsi</h3>
            <CardDescription className="mb-2">
              <p>{getDonationForm?.donationDescription || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Pengirim</h3>
            <CardDescription className="mb-3">
              <p>{getDonationForm?.userName || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Nomor form</h3>
            <CardDescription className="mb-3">
              <p>{getDonationForm?.formId || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Nomor Resi</h3>
            <CardDescription className="mb-3">
              <p>{getDonationForm?.formReceipt || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Status</h3>
            <CardDescription className="mb-3">
              <p>{getDonationForm?.formStatus || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Kirimkan sebelum tanggal:</h3>
            <CardDescription className="mb-3">
              <p>{getDonationForm?.deadlineDate || 'Kosong'}</p>
            </CardDescription>

            <Separator className="my-2" />
            <h3 className="font-semibold mb-2">Baju yang akan dikirimkan</h3>

            {getDonationForm?.donationClothRequest?.map(
              (clothDonation, index) => (
                <div className="grid grid-cols-4 gap-4 mb-2" key={index}>
                  <div className="col-span-1">
                    <h4 className="font-medium">Kategori</h4>
                    <div className={'border-2 border-muted rounded p-1'}>
                      <div className={'text-muted-foreground'}>
                        {clothDonation?.category || 'Kosong'}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium">Gender</h4>
                    <div className={'border-2 border-muted rounded p-1'}>
                      <div className={'text-muted-foreground'}>
                        {clothDonation?.gender || 'Kosong'}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium">Ukuran</h4>
                    <div className={'border-2 border-muted rounded p-1'}>
                      <div className={'text-muted-foreground'}>
                        {clothDonation?.size || 'Kosong'}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium">Quantity</h4>
                    <div className={'border-2 border-muted rounded p-1'}>
                      <div className={'text-muted-foreground'}>
                        {clothDonation?.quantity || 'Kosong'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </CardContent>

          {isLoading && getDonationForm?.formStatus === 'ON VERIFICATION' && (
            <CardFooter>
              <h3 className="font-semibold">
                Tekan tombol disamping jika kamu sudah memverifikasi nomor resi
              </h3>
              <Button className="w-full" onClick={verfiedReciept} disabled>
                Mohon tunggu...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </Button>
            </CardFooter>
          )}

          {!isLoading && getDonationForm?.formStatus === 'ON VERIFICATION' && (
            <CardFooter>
              <h3 className="font-semibold">
                Tekan tombol disamping jika kamu sudah memverifikasi nomor resi
              </h3>
              <Button className="w-full" onClick={verfiedReciept}>
                Verifikasi Nomor Resi
                <BadgeCheck className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          )}

          {isLoading && getDonationForm?.formStatus === 'ON DELIVERY' && (
            <CardFooter>
              <h3 className="font-semibold">
                Tekan Tombol disamping jika kamu sudah menerima pakaian
              </h3>
              <Button className="w-full" onClick={verfiedReciept} disabled>
                Mohon tunggu...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </Button>
            </CardFooter>
          )}

          {!isLoading && getDonationForm?.formStatus === 'ON DELIVERY' && (
            <CardFooter>
              <h3 className="font-semibold">
                Tekan Tombol disamping jika kamu sudah menerima pakaian
              </h3>
              <Button className="w-full" onClick={doneReciept}>
                Pakaian Telah Diterima
                <BadgeCheck className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserDonationFormDetailPage;
