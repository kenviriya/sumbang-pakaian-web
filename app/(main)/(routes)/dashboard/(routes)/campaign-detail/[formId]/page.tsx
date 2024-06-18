'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {api} from '@/convex/_generated/api';
import {Id} from '@/convex/_generated/dataModel';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQuery} from 'convex/react';
import {Loader2, Package, SendHorizonal} from 'lucide-react';
import Image from 'next/image';
import {useParams, useRouter} from 'next/navigation';
import {useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';

const FormSchema = z.object({
  receipt: z.string({
    required_error: 'Bukti kirim tidak boleh kosong',
  }),
});

const CampaignDetailPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const getFormDetail = useQuery(
    api.controllers.donation_form_controller.getDonationFormById,
    {
      donationFormId: params.formId as Id<'donation_form'>,
    }
  );

  const updateDonationForm = useMutation(
    api.controllers.donation_form_controller.updateDonationForm
  );

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    try {
      const updateDonationFormReceipt = updateDonationForm({
        donattionFormId: params.formId as Id<'donation_form'>,
        receipt: data.receipt,
        status: 'ON VERIFICATION',
      });

      toast.promise(updateDonationFormReceipt, {
        loading: 'Sedang mengirim permintaan...',
        success: 'Permintaan berhasil dikirim!',
      });
    } catch (error) {
      console.log(error);
      toast.error('Permintaan gagal dikirim!');
    }
  };

  const kirimSendiri = () => {
    try {
      const updateDonationFormReceipt = updateDonationForm({
        donattionFormId: params.formId as Id<'donation_form'>,
        receipt: 'KIRIM SENDIRI',
        status: 'ON DELIVERY',
      });

      toast.promise(updateDonationFormReceipt, {
        loading: 'Sedang mengirim permintaan...',
        success: 'Permintaan berhasil dikirim!',
      });
    } catch (error) {
      console.log(error);
      toast.error('Permintaan gagal dikirim!');
    }
  };

  return (
    <div className="mt-2 min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[800px]">
          <CardHeader>
            <CardTitle>{getFormDetail?.donationTitle || 'Kosong'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image
                src={getFormDetail?.donationImageUrl || '/'}
                alt="donation-image"
                width={800}
                height={300}
                className="mb-2"
              />
            </div>

            <h3 className="font-semibold">Deskripsi</h3>
            <CardDescription className="mb-2">
              <p>{getFormDetail?.donationDescription || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Lokasi Penerima</h3>
            <CardDescription className="mb-3">
              <p>{getFormDetail?.donationAddress || 'Kosong'}</p>
            </CardDescription>

            <h3 className="font-semibold">Kirimkan sebelum tanggal:</h3>
            <CardDescription className="mb-3">
              <p>{getFormDetail?.deadlineDate || 'Kosong'}</p>
            </CardDescription>

            <Separator className="my-2" />
            <h3 className="font-semibold mb-2">
              Baju yang kamu harus kirimkan
            </h3>

            {getFormDetail?.donationClothRequest?.map(
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

            {!getFormDetail?.formReceipt && (
              <>
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="receipt"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Nomor Resi</FormLabel>
                            <br />
                            <FormControl>
                              <Input
                                placeholder="Cth : 90234KASDI391K103K"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Masukan nomor resi jika kamu mengirim pakaian
                              menggunakan jasa kirim.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {isLoading && (
                        <Button className="w-full" type="submit">
                          Mohon tunggu...
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </Button>
                      )}
                      {!isLoading && (
                        <Button className="w-full" type="submit">
                          Kirim Resi
                          <SendHorizonal className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </form>
                  </Form>
                </div>
                <div className="w-full mt-4">
                  <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
                    Kirim sendiri
                  </h2>
                  {isLoading && (
                    <Button
                      className="w-full"
                      type="button"
                      variant={'outline'}
                      disabled
                    >
                      Mohon tunggu...
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </Button>
                  )}
                  {!isLoading && (
                    <Button
                      className="w-full"
                      type="button"
                      variant={'outline'}
                      onClick={kirimSendiri}
                    >
                      Kirim Sendiri
                      <Package className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  <div className="mt-1">
                    <p className="text-[0.8rem] text-muted-foreground">
                      Tekan tombol kirim sendiri jika kamu ingin mengantarkan
                      pakaian langsung ke tempat tujuan.
                    </p>
                  </div>
                </div>
              </>
            )}

            {getFormDetail?.formReceipt === 'KIRIM SENDIRI' && (
              <div className="w-full mt-4">
                <h2 className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
                  Kamu harus mengirimkan pakaian ke alamat berikut:
                </h2>
                <p>{getFormDetail?.donationAddress}</p>
              </div>
            )}

            {getFormDetail?.formReceipt &&
              getFormDetail?.formReceipt !== 'KIRIM SENDIRI' && (
                <div className="w-full mt-4">
                  <h2 className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
                    Nomor Resi Kamu adalah berikut:
                  </h2>
                  <p>{getFormDetail?.formReceipt}</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
