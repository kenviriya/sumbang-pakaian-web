import {Separator} from '@/components/ui/separator';
import HistoryCard from './historyCard';

const userClothesHistory = [
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
    clothId: '2',
    imageUrl: '/baju-kemeja.jpg',
    title: 'Baju Sweater',
  },
];

const UserClothesHistory = () => {
  return (
    <>
      <h2 className="mb-2 font-medium text-gray-800">
        History pakaian yang kamu sumbang.
      </h2>
      <div className="grid gap-y-4">
        {userClothesHistory.map((cloth, index) => (
          <div key={index}>
            <HistoryCard
              id={cloth.clothId}
              title={cloth.title}
              description={''}
              status={''}
            />
            <Separator className="mt-2" />
          </div>
        ))}
      </div>
    </>
  );
};

export default UserClothesHistory;
