"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageDropzoneCard from "@/components/image-dropzone-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveIcon } from "lucide-react";

const FormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string(),
  gender: z.string(),
  size: z.string(),
  category: z.string(),
  image: z.string(),
});

type FormData = z.infer<typeof FormSchema>;

const AddCloth = () => {
  const [file, setFile] = useState<File | undefined>(undefined);

  // Initialize the form with useForm hook
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      size: "",
      category: "",
      image: "",
    },
  });

  const { edgestore } = useEdgeStore();

  // Function to handle image upload
  const uploadImage = async (file: File | null) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({ file });
    }
  };

  // Function to handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (file) {
      await uploadImage(file);
    }
    console.log(data);
    console.log("submitting");
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Foto Baju Kamu</FormLabel>
                  <div className={"mt-1 mb-2"}>
                    <ImageDropzoneCard file={file} setFile={setFile} />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`category`}
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
                    Pilih kategori pakaian yang sesuai.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`gender`}
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
                  <FormDescription>Pilih gender untuk pakaian</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`size`}
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
                  <FormDescription>Pilih ukuran pakaian</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">
              Simpan <SaveIcon className={"ml-2 h-4 w-4"} />
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
