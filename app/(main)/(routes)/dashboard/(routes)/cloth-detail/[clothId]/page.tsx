"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const ClothDetailPage = () => {
  const params = useParams();

  const getDetailCloth = useQuery(
    api.controllers.cloth_controller.getUserClothById,
    {
      clothId: params.clothId as Id<"user_cloth">,
    },
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#ff7a00] font-bold text-xl">
            Sumbang Pakaian Mu Sekarang!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={"mb-2"}>
            <h3 className={"font-semibold"}>Nama Pakaian</h3>
            <div className="border-2 border-gray-200 p-2 rounded-md">
              {getDetailCloth?.name}
            </div>
          </div>

          <div className={"mb-2"}>
            <h3 className={"font-semibold"}>Deskripsi</h3>
            <div className="border-2 border-gray-200 p-2 rounded-md">
              {getDetailCloth?.description}
            </div>
          </div>

          <div className={"grid grid-cols-3 gap-2"}>
            <div>
              <h3 className={"font-semibold"}>Kategori Pakaian</h3>
              <div className="border-2 border-gray-200 p-2 rounded-md">
                {getDetailCloth?.category}
              </div>
            </div>
            <div>
              <h3 className={"font-semibold"}>Gender</h3>
              <div className="border-2 border-gray-200 p-2 rounded-md">
                {getDetailCloth?.gender}
              </div>
            </div>
            <div>
              <h3 className={"font-semibold"}>Ukuran Pakaian</h3>
              <div className="border-2 border-gray-200 p-2 rounded-md">
                {getDetailCloth?.size}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ClothDetailPage;
