import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function Carousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay("delay = 3000"),
  ]);

  const banners = useQuery(api.controllers.banner_controller.getAllBanners, {});

  if (banners === undefined) {
    return <Skeleton className={"h-[1080px] width-[1920px]"} />;
  }

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {banners?.map((banner) => (
          <>
            <div className="embla__slide">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                width={1920}
                height={1080}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
