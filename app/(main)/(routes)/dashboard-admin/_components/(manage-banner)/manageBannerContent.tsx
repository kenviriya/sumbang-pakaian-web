import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ManageBannerContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [banner1, setBanner1] = useState<File | undefined>(undefined);
  const [banner2, setBanner2] = useState<File | undefined>(undefined);
  const [banner3, setBanner3] = useState<File | undefined>(undefined);

  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const onChangeBanner1 = async (file?: File) => {
    if (file) {
      setBanner1(file);
    }
  };

  const onChangeBanner2 = async (file?: File) => {
    if (file) {
      setBanner2(file);
    }
  };

  const onChangeBanner3 = async (file?: File) => {
    if (file) {
      setBanner3(file);
    }
  };

  const updateBannerUrl = useMutation(
    api.controllers.banner_controller.updateBanner,
  );

  const handleSaveBanner1 = async () => {
    setIsLoading(true);
    let imageUrl = "";
    if (banner1) {
      const res = await edgestore.publicFiles.upload({ file: banner1 });
      if (res.url) {
        imageUrl = res.url;
        toast.success("Gambar berhasil diunggah!");
      }

      try {
        await updateBannerUrl({
          title: "BANNER 1",
          imageUrl: imageUrl,
        })
          .then(() => {
            setBanner1(undefined);
            router.push("/");
          })
          .finally(() => {
            setIsLoading(false);
          });

        toast.success("Berhasil update banner!");
      } catch (e) {
        toast.error("Gagal mengupdate banner!");
      }
    }
  };

  const handleSaveBanner2 = async () => {
    setIsLoading2(true);
    let imageUrl = "";
    if (banner2) {
      const res = await edgestore.publicFiles.upload({ file: banner2 });
      if (res.url) {
        imageUrl = res.url;
        toast.success("Gambar berhasil diunggah!");
      }

      try {
        await updateBannerUrl({
          title: "BANNER 2",
          imageUrl: imageUrl,
        })
          .then(() => {
            setBanner2(undefined);
            router.push("/");
          })
          .finally(() => {
            setIsLoading2(false);
          });

        toast.success("Berhasil update banner!");
      } catch (e) {
        toast.error("Gagal mengupdate banner!");
      }
    }
  };

  const handleSaveBanner3 = async () => {
    setIsLoading3(true);
    let imageUrl = "";
    if (banner3) {
      const res = await edgestore.publicFiles.upload({ file: banner3 });
      if (res.url) {
        imageUrl = res.url;
        toast.success("Gambar berhasil diunggah!");
      }

      try {
        await updateBannerUrl({
          title: "BANNER 3",
          imageUrl: imageUrl,
        })
          .then(() => {
            setBanner3(undefined);
            router.push("/");
          })
          .finally(() => {
            setIsLoading3(false);
          });

        toast.success("Berhasil update banner!");
      } catch (e) {
        toast.error("Gagal mengupdate banner!");
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mengelola Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={"mb-2"}>
          <h2 className="text-lg font-semibold">Banner 1</h2>
          <div className={"m-4"}>
            <SingleImageDropzone
              onChange={onChangeBanner1}
              value={banner1}
              height={300}
              width={800}
            />
          </div>
          {isLoading && (
            <Button disabled>
              Mohon tunggu...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </Button>
          )}
          {!isLoading && (
            <Button onClick={handleSaveBanner1}>
              Simpan <Save className={"h-4 w-4 ml-2"} />
            </Button>
          )}
        </div>
        <Separator />
        <div className={"mb-2"}>
          <h2 className="text-lg font-semibold">Banner 2</h2>
          <div className={"m-4"}>
            <SingleImageDropzone
              onChange={onChangeBanner2}
              value={banner2}
              height={300}
              width={800}
            />
          </div>
          {isLoading2 && (
            <Button disabled>
              Mohon tunggu...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </Button>
          )}
          {!isLoading2 && (
            <Button onClick={handleSaveBanner2}>
              Simpan <Save className={"h-4 w-4 ml-2"} />
            </Button>
          )}
        </div>
        <Separator />
        <div>
          <h2 className="text-lg font-semibold">Banner 3</h2>
          <div className={"m-4"}>
            <SingleImageDropzone
              onChange={onChangeBanner3}
              value={banner3}
              height={300}
              width={800}
            />
          </div>
          {isLoading3 && (
            <Button disabled>
              Mohon tunggu...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </Button>
          )}
          {!isLoading3 && (
            <Button onClick={handleSaveBanner3}>
              Simpan <Save className={"h-4 w-4 ml-2"} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ManageBannerContent;
