"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

const FormSchema = z.object({
  donationId: z.string(),
});

const ClothDonationPage = () => {
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const donationId = searchParams.get("donationId");
  const clothId = searchParams.get("clothId");

  useEffect(() => {
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 7);

    const formattedDeadline = format(deadlineDate, "MM-dd-yyyy");
    setDeadline(formattedDeadline);
  }, []);

  const donation = useQuery(
    api.controllers.donation_controller.getDonationById,
    {
      donationId: donationId as Id<"donation">,
    },
  );

  const cloth = useQuery(api.controllers.cloth_controller.getUserClothById, {
    clothId: clothId as Id<"user_cloth">,
  });

  const updateClothStatus = useMutation(
    api.controllers.cloth_controller.updateUserClothStatus,
  );

  const getClothCategory = useQuery(
    api.controllers.ref_controller.refClothCategory.getAllCategory,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      donationId: donationId?.toString() || "",
    },
  });

  const insertDonationForm = useMutation(
    api.controllers.donation_form_controller.createDonationForm,
  );

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    console.log(data);
    setIsLoading(true);

    let clothes: {
      categoryId: Id<"ref_cloth_category">;
      gender: string;
      size: string;
      quantity: number;
    }[] = [];

    if (cloth) {
      const getCategoryId = getClothCategory?.find(
        (category) => category.name === cloth.category,
      );
      clothes = [
        {
          categoryId: getCategoryId?.id as Id<"ref_cloth_category">,
          gender: cloth.gender,
          size: cloth.size,
          quantity: 1,
        },
      ];
    }

    try {
      const updateCloth = updateClothStatus({
        clothId: clothId as Id<"user_cloth">,
        status: "DONATED",
      });
      const createDonationForm = insertDonationForm({
        donationId: data.donationId as Id<"donation">,
        deadlineDate: deadline,
        clothDonation: clothes,
      }).then((formId) => {
        router.push(`/dashboard/campaign-detail/${formId}`);
      });

      const promise = Promise.all([updateCloth, createDonationForm]);

      toast.promise(promise, {
        loading: "Sedang mengirim permintaan...",
        success: "Permintaan berhasil dikirim!",
      });
    } catch (error) {
      console.log(error);
      toast.error("Permintaan gagal dikirim!");
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
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-2">
                <FormLabel>Nama Pakaian</FormLabel>
                <div className="border-2 border-gray-200 p-2 rounded-md">
                  {cloth?.name}
                </div>
                <FormDescription>
                  Nama pakaian yang akan kamu kirimkan.
                </FormDescription>
              </div>

              <div className="mb-2">
                <FormLabel>Deskripsi Pakaian</FormLabel>
                <div className="border-2 border-gray-200 p-2 rounded-md">
                  {cloth?.description}
                </div>
                <FormDescription>
                  Deskripsi pakaian yang akan kamu kirimkan.
                </FormDescription>
              </div>

              <div className={"grid grid-cols-3 gap-2"}>
                <div>
                  <h3 className={"font-semibold"}>Kategori Pakaian</h3>
                  <div className="border-2 border-gray-200 p-2 rounded-md">
                    {cloth?.category}
                  </div>
                </div>
                <div>
                  <h3 className={"font-semibold"}>Gender</h3>
                  <div className="border-2 border-gray-200 p-2 rounded-md">
                    {cloth?.gender}
                  </div>
                </div>
                <div>
                  <h3 className={"font-semibold"}>Ukuran Pakaian</h3>
                  <div className="border-2 border-gray-200 p-2 rounded-md">
                    {cloth?.size}
                  </div>
                </div>
              </div>

              <Separator className={"my-4"} />

              <div className="mb-2">
                <FormLabel>Judul Campaign</FormLabel>
                <div className="border-2 border-gray-200 p-2 rounded-md">
                  {donation?.donationTitle}
                </div>
                <FormDescription>
                  Judul campaign yang akan kamu sumbang.
                </FormDescription>
              </div>

              <div className="mb-2">
                <FormLabel>Deskripsi Campaign</FormLabel>
                <div className="border-2 border-gray-200 p-2 rounded-md">
                  {donation?.donationDescription}
                </div>
                <FormDescription>
                  Deskripsi campaign yang akan kamu sumbang.
                </FormDescription>
              </div>

              <div className="mb-2">
                <FormLabel>Kirim pakaian sebelum tanggal</FormLabel>
                <div className="border-2 border-gray-200 p-2 rounded-md">
                  {deadline}
                </div>
                <FormDescription>
                  Deadline untuk mengirimkan pakaian.
                </FormDescription>
              </div>

              {isLoading && (
                <Button disabled>
                  Mohon tunggu...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </Button>
              )}
              {!isLoading && (
                <Button type="submit">
                  Kirim Pakaian <SendHorizonal className="ml-2 h-4 w-4" />
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default ClothDonationPage;
