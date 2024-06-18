'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {z} from 'zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {CirclePlus, Loader2, MinusCircle, SendHorizonal} from 'lucide-react';
import {useMutation, useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Id} from '@/convex/_generated/dataModel';
import {toast} from 'sonner';
import {format} from 'date-fns';
import * as React from 'react';

const FormSchema = z.object({
  donationId: z.string(),
  clothes: z.array(
    z.object({
      category: z.string(),
      gender: z.string(),
      size: z.string(),
      quantity: z.string({
        required_error: 'Tidak boleh kosong',
      }),
    })
  ),
});

const DonationFormPage = () => {
  const [cloth, setCloth] = useState(1);
  const [clothCategories, setClothCategories] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donationId');

  const getDonation = useQuery(
    api.controllers.donation_controller.getDonationById,
    {
      donationId: donationId as Id<'donation'>,
    }
  );

  useEffect(() => {
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 7);

    const formattedDeadline = format(deadlineDate, 'yyyy-MM-dd HH:mm:ss');
    setDeadline(formattedDeadline);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      donationId: donationId?.toString() || '',
    },
  });

  const addCloth = () => {
    setCloth(cloth + 1);
  };

  const removeCloth = () => {
    form.setValue('clothes', form.getValues('clothes').slice(0, -1));
    cloth !== 1 && setCloth(cloth - 1);
  };

  const insertDonationForm = useMutation(
    api.controllers.donation_form_controller.createDonationForm
  );

  const getClothCategory = useQuery(
    api.controllers.ref_controller.refClothCategory.getAllCategory
  );

  useEffect(() => {
    if (getClothCategory) {
      setClothCategories(getClothCategory.map((category) => category.name));
    }
  }, [getClothCategory]);

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);

    let clothes: {
      categoryId: Id<'ref_cloth_category'>;
      gender: string;
      size: string;
      quantity: number;
    }[] = [];

    if (data.clothes && cloth) {
      clothes = data.clothes.map((cloth) => {
        const getCategoryId = getClothCategory?.find(
          (category) => category.name === cloth.category
        );
        return {
          categoryId: getCategoryId?.id as Id<'ref_cloth_category'>,
          gender: cloth.gender,
          size: cloth.size,
          quantity: Number(cloth.quantity),
        };
      });
    }

    try {
      const createRequest = insertDonationForm({
        donationId: data.donationId as Id<'donation'>,
        clothDonation: clothes,
      }).then(() => {
        router.push('/');
      });
      toast.promise(createRequest, {
        loading: 'Sedang mengirim permintaan...',
        success: 'Permintaan berhasil dikirim!',
      });
    } catch (error) {
      console.log(error);
      toast.error('Permintaan gagal dikirim!');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#ff7a00] font-bold text-xl">
            Sumbang Pakaian Mu Sekarang!
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="min-h-[55vh]">
              <div className="mb-2">
                <FormLabel>Judul Campaign</FormLabel>
                <div className="border-2 border-gray-200 p-2 rounded-md">
                  {getDonation?.donationTitle}
                </div>
                <FormDescription>
                  Judul campaign yang akan kamu sumbang.
                </FormDescription>
              </div>
              {Array.from({length: cloth}).map((_, index) => (
                <div
                  className="grid grid-cols-4 gap-x-5 gap-y-2 col-span-3 mb-2"
                  key={index}
                >
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`clothes.${index}.category`}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Kategori Pakaian</FormLabel>
                          <br />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori Pakaian" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Kategori</SelectLabel>
                                {clothCategories.map((value, index) => (
                                  <SelectItem key={index} value={value}>
                                    {value.charAt(0).toUpperCase() +
                                      value.slice(1).toLowerCase()}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Pilih kategori pakaian
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`clothes.${index}.gender`}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <br />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Gender</SelectLabel>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="unisex">Unisex</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Pilih gender untuk pakaian
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`clothes.${index}.size`}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Ukuran</FormLabel>
                          <br />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Ukuran" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Ukuran</SelectLabel>
                                <SelectItem value="S">S</SelectItem>
                                <SelectItem value="M">M</SelectItem>
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="XL">XL</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Pilih ukuran pakaian
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`clothes.${index}.quantity`}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <br />
                          <FormControl>
                            <Input
                              placeholder="Masukkan jumlah"
                              type="number"
                              min={1}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Masukkan jumlah pakaian yang akan didonasikan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              {cloth > 1 && (
                <Button
                  variant={'destructive'}
                  className={'mr-4'}
                  onClick={() => removeCloth()}
                  type="button"
                >
                  Hapus Pakaian <MinusCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button
                variant={'outline'}
                onClick={() => addCloth()}
                type="button"
              >
                Tambah Pakaian <CirclePlus className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
            {isLoading && (
              <CardFooter>
                <Button disabled>
                  Mohon tunggu...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </Button>
              </CardFooter>
            )}
            {!isLoading && (
              <CardFooter>
                <Button type="submit">
                  Kirim Request <SendHorizonal className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </>
  );
};

export default DonationFormPage;
