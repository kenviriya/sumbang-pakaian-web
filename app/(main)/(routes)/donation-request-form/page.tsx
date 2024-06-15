"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CirclePlus,
  MinusCircle,
  SendHorizonal,
  Trash2,
  Loader2,
} from "lucide-react";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import * as React from "react";
import { SingleImageDropzone } from "@/components/single-image-dropzone";

const FormSchema = z.object({
  imageUrl: z.string().optional(),
  title: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(5, {
      message: "Judul minimal 5 karakter.",
    }),
  duration: z.string({
    required_error: "Tidak boleh kosong",
  }),
  desc: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(10, {
      message: "Deskripsi minimal 10 karakter.",
    })
    .max(160, {
      message: "Deskripsi maksimal 160 karakter.",
    }),
  name: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(2, {
      message: "Wajib diisi minimal 2 karakter.",
    }),
  address: z
    .string({
      required_error: "Tidak boleh kosong",
    })
    .min(5, {
      message: "Alamat minimal 5 karakter.",
    }),
  clothes: z
    .array(
      z.object({
        category: z.string({
          required_error: "Tidak boleh kosong",
        }),
        gender: z.string({
          required_error: "Tidak boleh kosong",
        }),
        size: z.string({
          required_error: "Tidak boleh kosong",
        }),
        quantity: z.string({
          required_error: "Tidak boleh kosong",
        }),
      }),
    )
    .optional(),
});

const ArrangeClothes = () => {
  const [cloth, setCloth] = useState(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [clothCategories, setClothCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const addCloth = () => {
    setCloth(cloth + 1);
  };

  const removeCloth = () => {
    const clothes = form.getValues("clothes");
    if (clothes) {
      form.setValue("clothes", clothes.slice(0, -1));
      setCloth(cloth - 1);
    }
  };

  const insertDonationRequest = useMutation(
    api.controllers.donation_request_controller.createDonationRequest,
  );

  const getClothCategory = useQuery(
    api.controllers.ref_controller.refClothCategory.getAllCategory,
  );

  useEffect(() => {
    if (getClothCategory) {
      setClothCategories(getClothCategory.map((category) => category.name));
    }
  }, [getClothCategory]);

  const { edgestore } = useEdgeStore();

  const onFileChange = async (file?: File) => {
    if (file) {
      setFile(file);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    let clothes: {
      categoryId: Id<"ref_cloth_category">;
      gender: string;
      size: string;
      quantity: number;
    }[] = [];

    if (file) {
      const res = await edgestore.publicFiles.upload({ file });
      if (res.url) {
        data.imageUrl = res.url;
        toast.success("Gambar berhasil diunggah!");
      }
    }

    if (data.clothes && cloth) {
      clothes = data.clothes.map((cloth) => {
        const getCategoryId = getClothCategory?.find(
          (category) => category.name === cloth.category,
        );
        return {
          categoryId: getCategoryId?.id as Id<"ref_cloth_category">,
          gender: cloth.gender,
          size: cloth.size,
          quantity: Number(cloth.quantity),
        };
      });
    }

    try {
      const createRequest = insertDonationRequest({
        imageUrl: data.imageUrl,
        title: data.title,
        duration: Number(data.duration),
        description: data.desc,
        address: data.address,
        clothRequest: clothes,
      }).then(() => {
        router.push("/");
      });

      toast.promise(createRequest, {
        loading: "Sedang mengirim permintaan...",
        success: "Permintaan berhasil dikirim!",
      });
    } catch (error) {
      console.log(error);
      toast.error("Permintaan gagal dikirim!");
    }
  };
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
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={() => (
                    <FormItem>
                      <div className={"mt-10 mb-10"}>
                        <div className="h-[220px] flex items-center justify-center">
                          <SingleImageDropzone
                            onChange={onFileChange}
                            value={file}
                            height={300}
                            width={800}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={"destructive"}
                        onClick={() => setFile(undefined)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                      <FormDescription>
                        * banner campaign opsional
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                        berkesempatan mendapatkan sumbang yang lebih banyak.
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
              {Array.from({ length: cloth }).map((_, index) => (
                <div
                  className="grid grid-cols-4 gap-x-5 gap-y-2 col-span-3 mb-2"
                  key={index}
                >
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`clothes.${index}.category`}
                      render={({ field }) => (
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
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name={`clothes.${index}.gender`}
                      render={({ field }) => (
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
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="UNISEX">Unisex</SelectItem>
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
                      render={({ field }) => (
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
                      render={({ field }) => (
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
                  variant={"destructive"}
                  className="col-span-3"
                  onClick={() => removeCloth()}
                  type="button"
                >
                  Hapus Pakaian <MinusCircle className="ml-2 h-4 w-4" />
                </Button>
              )}

              <Button
                variant={"outline"}
                className="col-span-3"
                onClick={() => addCloth()}
                type="button"
              >
                Tambah Pakaian <CirclePlus className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
  );
};

export default ArrangeClothes;
