"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { Shirt } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const DonationDetailPage = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="mt-2 px-[10%] min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[800px]">
          <CardHeader>
            <CardTitle>Lorem ipsum dolor sit amet.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image
                src="/carousel-1.jpg"
                alt="carousel-1"
                width={400}
                height={300}
                className="mb-2"
              />
            </div>
            <h3 className="font-semibold">Deskripsi</h3>
            <CardDescription className="mb-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione
              facere libero nemo magnam esse deleniti, enim nam quo sit corrupti
              debitis quod incidunt cum ipsa iusto praesentium. Nemo laborum in
              ullam quasi molestias tenetur officia nostrum ipsum eos aliquam
              quibusdam earum a hic officiis, autem saepe doloremque quo ex ad,
              nobis iste id modi animi totam. Nulla temporibus ducimus
              aspernatur illum molestias perspiciatis dignissimos cum, eveniet
              inventore, provident laboriosam impedit quasi ad voluptate
              delectus similique ipsa molestiae. Officiis ab quibusdam quas?
              Beatae ab quidem, aut odio ullam, voluptatum rerum veniam illo
              modi temporibus maiores velit enim, eos earum! Nihil, veniam.
            </CardDescription>
            <h3 className="font-semibold">Alamat Pengiriman</h3>
            <CardDescription className="mb-2">
              <Input
                type="email"
                placeholder="Email"
                disabled
                value={
                  "Jl. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione"
                }
              />
            </CardDescription>
            <Separator className="my-2" />
            <h3 className="font-semibold mb-2">Baju yang di Request</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <h4 className="font-medium">Kategori</h4>
                <Input
                  type="email"
                  placeholder="Email"
                  disabled
                  value={"Kemeja"}
                />
              </div>
              <div className="col-span-1">
                <h4 className="font-medium">Gender</h4>
                <Input
                  type="email"
                  placeholder="Email"
                  disabled
                  value={"Male"}
                />
              </div>
              <div className="col-span-1">
                <h4 className="font-medium">Ukuran</h4>
                <Input type="email" placeholder="Email" disabled value={"S"} />
              </div>
              <div className="col-span-1">
                <h4 className="font-medium">Quantity</h4>
                <Input
                  type="email"
                  placeholder="Email"
                  disabled
                  value={"100"}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex">
            <div className="w-full">
              <Button
                className="w-full"
                onClick={() => {
                  router.push(`/donation-form?donationId=${params.donationId}`);
                }}
              >
                <Shirt className="mr-2 h-4 w-4" />
                Sumbang
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DonationDetailPage;
