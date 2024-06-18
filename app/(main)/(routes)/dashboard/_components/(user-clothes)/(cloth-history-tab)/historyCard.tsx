import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {Button} from '@/components/ui/button';

interface IHistoryCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
}

const HistoryCard = ({id, title, description, status}: IHistoryCardProps) => {
  const route = useRouter();

  return (
    <div
      role="button"
      className="w-full rounded-xl"
      onClick={() => route.push(`/baju/${id}`)}
    >
      <div className="grid grid-cols-5">
        <div className="col-span-4">
          <h2 className="font-bold text-gray-800">{title}</h2>
          <h2 className="font-medium text-gray-800">{description}</h2>
          <br />
          {status === 'Accepted' && (
            <h2 className="font-semibold text-gray-800">
              Status:{' '}
              <span className="text-green-700 font-medium">{status}</span>
            </h2>
          )}
          {status === 'Decline' && (
            <h2 className="font-semibold text-gray-800">
              Status: <span className="text-red-700 font-medium">{status}</span>
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
