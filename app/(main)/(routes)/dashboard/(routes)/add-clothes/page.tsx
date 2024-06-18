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
import ImageDropzoneCard from '@/components/image-dropzone-card';
import {zodResolver} from '@hookform/resolvers/zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import {z} from 'zod';
import {useEffect, useState} from 'react';
import {useEdgeStore} from '@/lib/edgestore';
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
import {SaveIcon} from 'lucide-react';
import {useMutation, useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Input} from '@/components/ui/input';
import {Id} from '@/convex/_generated/dataModel';

const FormSchema = z.object({
  title: z.string(),
  category: z.string(),
  gender: z.string(),
  size: z.string(),
});

const AddCloth = () => {
  const [clothCategories, setClothCategories] = useState<string[]>([]);

  const getClothCategory = useQuery(
    api.controllers.ref_controller.refClothCategory.getAllCategory
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
    const getCategoryId = getClothCategory?.find(
      (category) => category.name === data.category
    );

    const createUserCloth = await insertUserCloth({
      name: data.title,
      categoryId: getCategoryId?.id as Id<'ref_cloth_category'>,
      gender: data.gender,
      size: data.size,
      description: '',
    });
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
                    <Input placeholder="Cth : Baju tidur pria" {...field} />
                  </FormControl>
                  <FormDescription>Beri nama untuk baju ini.</FormDescription>
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
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
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
          <CardFooter>
            <Button type="submit">
              Simpan <SaveIcon className={'ml-2 h-4 w-4'} />
            </Button>
          </CardFooter>
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
