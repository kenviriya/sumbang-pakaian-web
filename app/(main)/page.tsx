'use client';
import * as React from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import {Carousel} from './_components/carousel';
import ItemCard from './_components/itemCard';

const HomePage = () => {
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  const items = [
    {
      imageUrl: '/carousel-1.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro vero perspiciatis aut eius. Tempore ex iusto voluptatibus architecto earum velit quisquam ab ducimus repellendus, provident quae magnam illo. At architecto amet sapiente obcaecati nulla enim vel repellat sit iste nihil nesciunt necessitatibus, molestiae provident, ab rem, mollitia consequatur expedita excepturi incidunt. Nemo a voluptatum fugiat est qui ipsam doloribus eius expedita modi asperiores quasi at cumque maiores aperiam ut, corrupti laboriosam tempora accusantium nihil veniam, saepe harum. Sequi nulla, quae, rerum labore beatae aliquam iusto placeat explicabo minima reprehenderit minus. Harum quasi dolor, similique magni ut cum! Consequatur, nemo quia.',
    },
    {
      imageUrl: '/carousel-2.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque accusamus aliquid facilis illo quidem itaque blanditiis error maiores necessitatibus exercitationem dolores, ex magnam excepturi fuga minima repudiandae? Itaque minus necessitatibus porro consequuntur, corrupti tempora nemo possimus harum. Nostrum neque odit animi dolores ea repellat, minus similique, laudantium quasi, architecto ullam molestiae eaque eveniet omnis dolorum voluptates beatae temporibus quas debitis! Hic possimus vitae, iure a dicta, ut molestias ipsum non consequuntur at dolores alias qui. Est provident blanditiis perferendis nisi dicta debitis dolorum praesentium expedita perspiciatis rerum vel cum fuga doloremque non aliquam, ea, voluptatibus nobis. Aliquid id porro neque.',
    },
    {
      imageUrl: '/carousel-3.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore!',
    },
    {
      imageUrl: '/carousel-1.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore!',
    },
    {
      imageUrl: '/carousel-1.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore!',
    },
    {
      imageUrl: '/carousel-2.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore!',
    },
    {
      imageUrl: '/carousel-3.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore!',
    },
    {
      imageUrl: '/carousel-1.jpg',
      title: 'Lorem ipsum dolor sit amet.',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore!',
    },
  ];
  return (
    <div className="h-full w-full">
      <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <button
        onClick={async () => {
          if (file) {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });
            }
        }}
      >
        Upload
      </button>
    </div>
      <div className="flex flex-col items-center">
        <Carousel />
      </div>
      <div className="px-[4%] bg-[#f8f7f4] flex flex-row flex-wrap justify-start gap-x-9 gap-y-6 pt-9">
        {items.map((item, index) => (
          <ItemCard
            key={index}
            imageUrl={item.imageUrl}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
