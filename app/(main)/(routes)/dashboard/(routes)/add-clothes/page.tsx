'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {zodResolver} from '@hookform/resolvers/zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import {z} from 'zod';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Loader2, SaveIcon} from 'lucide-react';
import {useMutation, useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Input} from '@/components/ui/input';
import {Id} from '@/convex/_generated/dataModel';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';

const FormSchema = z.object({
  title: z.string({
    required_error: 'Tidak boleh kosong',
  }),
  description: z.string({
    required_error: 'Tidak boleh kosong',
  }),
  category: z.string({
    required_error: 'Pilih salah satu',
  }),
  gender: z.string({
    required_error: 'Pilih salah satu',
  }),
  size: z.string({
    required_error: 'Pilih salah satu',
  }),
});

const AddCloth = () => {
  const router = useRouter();

  const [clothCategories, setClothCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getClothCategory = useQuery(
    api.controllers.ref_controller.refClothCategory.getAllCategory
  );

  const sendNotif = useMutation(
    api.controllers.notification_controller.sendNotificationClothMatch
  );

  useEffect(() => {
    if (getClothCategory) {
      setClothCategories(getClothCategory.map((category) => category.name));
    }
  }, [getClothCategory]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const insertUserCloth = useMutation(
    api.controllers.cloth_controller.createUserCloth
  );

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);

    const getCategoryId = getClothCategory?.find(
      (category) => category.name === data.category
    );

    try {
      const createUserCloth = insertUserCloth({
        name: data.title,
        categoryId: getCategoryId?.id as Id<'ref_cloth_category'>,
        gender: data.gender,
        size: data.size,
        description: data.description,
      })
        .then(() => {
          router.push('/dashboard');
        })
        .finally(sendNotif);
      toast.promise(createUserCloth, {
        loading: 'Sedang mengirim permintaan...',
        success: 'Permintaan berhasil dikirim!',
      });
    } catch (error) {
      console.log(error);
      toast.error('Permintaan gagal dikirim!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Baju Kamu Untuk di Donasikan</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="min-h-[65vh]">
            <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nama Pakaian</FormLabel>
                  <br />
                  <FormControl>
                    <Input placeholder="Cth : Baju tidur" {...field} />
                  </FormControl>
                  <FormDescription>Beri nama untuk baju ini.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Deskripsi Pakaian</FormLabel>
                  <br />
                  <FormControl>
                    <Input placeholder="Cth : Baju tidur pria" {...field} />
                  </FormControl>
                  <FormDescription>
                    Beri deskripsi untuk baju ini.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`category`}
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
                    Pilih kategori pakaian yang sesuai.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`gender`}
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
                        <SelectItem value="MALE">Laki Laki</SelectItem>
                        <SelectItem value="FEMALE">Perempuan</SelectItem>
                        <SelectItem value="UNISEX">Unisex</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>Pilih gender untuk pakaian</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`size`}
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
                  <FormDescription>Pilih ukuran pakaian</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                Simpan <SaveIcon className={'ml-2 h-4 w-4'} />
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default AddCloth;

// const uploadImage = async (file: File) => {
//   await edgestore.publicFiles.upload({
//     file,
// options: {
//   replaceTargetUrl: coverImage.url,
// },
//   });
// };

// function onSubmit(data: z.infer<typeof FormSchema>) {
// const promise = create({title: 'Untitled'}).then((documentId) =>
//   router.push(`/documents/${documentId}`)
// );
// toast.promise(promise, {
//   loading: 'Creating a new note...',
//   success: 'New note created!',
//   error: 'Failed to create a new note.',
// });

// const uploadImage = async (file: File) => {
//   const res = await uploadImage(file);
//   console.log(res);
// };

// await update({
//   id: params.documentId as Id<'documents'>,
//   coverImage: res.url,
// });
//   toast.success("Success");
// }

// const handleSubmit = async (e: { preventDefault: () => void }) => {
//   e.preventDefault();

// await uploadImage(file).then((error) => console.log(error));
//   onSubmit(form.getValues());
// };
