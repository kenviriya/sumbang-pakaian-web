import Image from 'next/image';
import {useRouter} from 'next/navigation';

interface IClothCardProps {
  imageUrl: string;
  title: string;
  clothId: string;
}

const CardCloth = ({imageUrl, title, clothId}: IClothCardProps) => {
  const route = useRouter();

  return (
    <div
      role="button"
      className="w-[220px] h-[240px] rounded-xl"
      onClick={() => route.push(`/baju/${clothId}`)}
    >
      <Image
        src={imageUrl}
        alt={title}
        width={220}
        height={220}
        className="rounded-xl"
      />
      <h2 className="font-medium text-gray-800">{title}</h2>
    </div>
  );
};

export default CardCloth;
