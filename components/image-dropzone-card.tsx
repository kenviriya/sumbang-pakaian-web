"use client";

import * as React from "react";

import { SingleImageDropzone } from "./single-image-dropzone";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { FormLabel } from "@/components/ui/form";

interface IImageDropzoneCard {
  file: File | undefined;
  setFile: React.Dispatch<File | undefined>;
}

const ImageDropzoneCard = ({ file, setFile }: IImageDropzoneCard) => {
  const { edgestore } = useEdgeStore();
  const onChange = async (file?: File) => {
    if (file) {
      setFile(file);
    }
  };

  return (
    <>
      <Card className="h-[400px] w-[300px]">
        <CardHeader></CardHeader>
        <CardContent className="h-[280px]">
          <SingleImageDropzone onChange={onChange} value={file} height={250} />
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => setFile(undefined)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ImageDropzoneCard;
