import * as React from 'react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Image from 'next/image';

const DonationDetailPage = () => {
  return (
    <div className="mt-2 px-[4%] min-h-[74vh]">
      <div className="flex flex-col items-center">
        <Card className="max-w-[1000px]">
          <CardHeader>
            <CardTitle>Lorem ipsum dolor sit amet.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2">
                <Image
                  src="/carousel-1.jpg"
                  alt="carousel-1"
                  width={400}
                  height={300}
                />
                <CardDescription>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ratione facere libero nemo magnam esse deleniti, enim nam quo
                  sit corrupti debitis quod incidunt cum ipsa iusto praesentium.
                  Nemo laborum in ullam quasi molestias tenetur officia nostrum
                  ipsum eos aliquam quibusdam earum a hic officiis, autem saepe
                  doloremque quo ex ad, nobis iste id modi animi totam. Nulla
                  temporibus ducimus aspernatur illum molestias perspiciatis
                  dignissimos cum, eveniet inventore, provident laboriosam
                  impedit quasi ad voluptate delectus similique ipsa molestiae.
                  Officiis ab quibusdam quas? Beatae ab quidem, aut odio ullam,
                  voluptatum rerum veniam illo modi temporibus maiores velit
                  enim, eos earum! Nihil, veniam.
                </CardDescription>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex">
            <div className="w-full">
              <Button className="w-full">Donate</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DonationDetailPage;
