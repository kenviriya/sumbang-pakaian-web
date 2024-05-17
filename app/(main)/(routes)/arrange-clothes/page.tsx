'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Separator} from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {CirclePlus, MinusCircle, SendHorizonal} from 'lucide-react';

import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {useState} from 'react';

import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

// import {Calendar} from '@/components/ui/calendar';
// import {Check, ChevronsUpDown} from 'lucide-react';
// import {format} from 'date-fns';
// import {CalendarIcon} from 'lucide-react';
// import {cn} from '@/lib/utils';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from '@/components/ui/command';
// import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

const FormSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  duration: z.string({
    required_error: 'A campaign duration is required.',
  }),
  desc: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
  name: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  address: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  clothes: z.array(
    z.object({
      category: z.string(),
      gender: z.string(),
      size: z.string(),
      quantity: z.string({
        required_error: 'Tidak boleh kosong',
        invalid_type_error: 'Quantity harus angka',
      }),
    })
  ),
});

const ArrangeClothes = () => {
  const [cloth, setCloth] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const addCloth = () => {
    setCloth(cloth + 1);
  };

  const removeCloth = () => {
    form.setValue('clothes', form.getValues('clothes').slice(0, -1));
    setCloth(cloth - 1);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // const promise = create({title: 'Untitled'}).then((documentId) =>
    //   router.push(`/documents/${documentId}`)
    // );
    // toast.promise(promise, {
    //   loading: 'Creating a new note...',
    //   success: 'New note created!',
    //   error: 'Failed to create a new note.',
    // });

    toast.success('Berhasil');
    console.log(data);
    console.log('click');
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0085FF] font-bold text-xl">
          Galang Pakaian Sekarang !
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="min-h-[65vh]">
            <div className="grid grid-cols-3 gap-x-5 gap-y-2">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Judul Campaign</FormLabel>
                      <br />
                      <FormControl>
                        <Input
                          placeholder="Cth : Bantu panti asuhan suka bakti"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Beri judul untuk galang dana ini.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Durasi Campaign</FormLabel>
                      <br />
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih durasi campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Hari</SelectLabel>
                            <SelectItem value="30">30 Hari</SelectItem>
                            <SelectItem value="60">60 Hari</SelectItem>
                            <SelectItem value="90">90 Hari</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Tentukan lama galang pakaian berlangsung.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="desc"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Deskripsi </FormLabel>
                      <br />
                      <FormControl>
                        <Textarea
                          placeholder="Tuliskan deskripsi mengapa kamu membutuhkan pakaian."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Dengan membuat deskripsi yang lengkap, kamu akan
                        berkesempatan mendapatkan donasi yang lebih banyak.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Nama Penerima</FormLabel>
                      <br />
                      <FormControl>
                        <Input placeholder="Cth : Bpk. Budi" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nama penerima yang akan menerima pakaian.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Alamat Pengiriman</FormLabel>
                      <br />
                      <FormControl>
                        <Input
                          placeholder="Cth : Jl. Kalibata timur No.1 RT/RW: 003/02, Kec. Cipinang, Kab. Tangerang 13590"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Alamat yang akan digunakan untuk pengiriman.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="col-span-3 mt-2" />

              <div className="col-span-3">
                <FormLabel className="text-[#ff7a00] font-bold ">
                  Request Jenis Pakaian
                </FormLabel>
                <FormDescription>
                  Kamu bisa request pakaian apa saja yang di butuhkan.
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
                          <FormLabel>Kategori Baju</FormLabel>
                          <br />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori Baju" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Kategori</SelectLabel>
                                <SelectItem value="30">Baju Tidur</SelectItem>
                                <SelectItem value="60">Kemeja</SelectItem>
                                <SelectItem value="90">Celana</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Pilih kategori baju yang sesuai.
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
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tentukan jumlah pakaian
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {cloth >= 1 && (
                <Button
                  variant={'destructive'}
                  className="col-span-3"
                  onClick={() => removeCloth()}
                  type="button"
                >
                  Hapus Pakaian <MinusCircle className="ml-2 h-4 w-4" />
                </Button>
              )}

              <Button
                variant={'outline'}
                className="col-span-3"
                onClick={() => addCloth()}
                type="button"
              >
                Tambah Pakaian <CirclePlus className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              Kirim Request <SendHorizonal className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ArrangeClothes;
