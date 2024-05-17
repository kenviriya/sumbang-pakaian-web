import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {Button} from '@/components/ui/button';

interface IHistoryCardProps {
  id: string;
  title: string;
  imageUrl: string;
}

const HistoryCard = ({id, title, imageUrl}: IHistoryCardProps) => {
  const route = useRouter();

  return (
    <div
      role="button"
      className="w-full rounded-xl"
      onClick={() => route.push(`/baju/${id}`)}
    >
      <div className="grid grid-cols-5">
        <div className="col-span-1">
          <Image
            src={imageUrl}
            alt={title}
            width={120}
            height={120}
            className="rounded-xl"
          />
        </div>
        <div className="col-span-4">
          <h2 className="font-bold text-gray-800">{title}</h2>
          <h2 className="font-medium text-gray-800">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
            perferendis voluptate qui iusto dignissimos consequuntur sapiente
            fuga, temporibus delectus culpa.
          </h2>
          <br />
          <h2 className="font-semibold text-gray-800">
            Status: <span className="text-green-700 font-medium">Diterima</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
