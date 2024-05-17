import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import CardCloth from './clothCard';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

const userClothes = [
  {
    clothId: '1',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '2',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '3',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '4',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '5',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '6',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '7',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
  {
    clothId: '8',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
];

const UserClothes = () => {
  const router = useRouter();
  return (
    <>
      <h2 className="mb-2 font-medium text-gray-800">
        Upload foto baju kamu disini. Kamu akan mendapatkan notifikasi jika baju
        kamu dibutuhkan.
      </h2>
      <Button className="mb-4">
        <Link href="/add-clothes">Tambah Pakaian</Link>
      </Button>
      <Separator />

      <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-y-5 auto-rows-[240px] auto-cols-[220px]">
        {userClothes.map((cloth) => (
          <div key={cloth.clothId} className="flex flex-col items-center mt-5">
            <CardCloth
              clothId={cloth.clothId}
              imageUrl={cloth.imageUrl}
              title={cloth.title}
            />
          </div>
        ))}
      </div>

      {userClothes.length === 0 && (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 font-medium">
            Belum ada baju yang kamu upload
          </p>
        </div>
      )}
    </>
  );
};

export default UserClothes;
