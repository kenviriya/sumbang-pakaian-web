"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, MinusCircle, SendHorizonal } from "lucide-react";

const FormSchema = z.object({
  title: z.string(),
  clothes: z.array(
    z.object({
      category: z.string(),
      gender: z.string(),
      size: z.string(),
      quantity: z.string({
        required_error: "Tidak boleh kosong",
      }),
    }),
  ),
});

const DonationFormPage = () => {
  const [cloth, setCloth] = useState(1);

  const searchParams = useSearchParams();
  const donationId = searchParams.get("donationId");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: donationId ? donationId : "Donation Title",
    },
  });

  const addCloth = () => {
    setCloth(cloth + 1);
  };

  const removeCloth = () => {
    form.setValue("clothes", form.getValues("clothes").slice(0, -1));
    cloth !== 1 && setCloth(cloth - 1);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {};

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
              <FormField
                disabled={true}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Campaign</FormLabel>
                    <br />
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Judul campaign yang akan di donasikan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                                <SelectItem value="30">Baju Tidur</SelectItem>
                                <SelectItem value="60">Kemeja</SelectItem>
                                <SelectItem value="90">Celana</SelectItem>
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
                  variant={"destructive"}
                  className={"mr-4"}
                  onClick={() => removeCloth()}
                  type="button"
                >
                  Hapus Pakaian <MinusCircle className="ml-2 h-4 w-4" />
                </Button>
              )}

              <Button
                variant={"outline"}
                onClick={() => addCloth()}
                type="button"
              >
                Tambah Pakaian <CirclePlus className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
            <CardFooter>
              <Button type="submit">
                Kirim Request <SendHorizonal className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default DonationFormPage;
