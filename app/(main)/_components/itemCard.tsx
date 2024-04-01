import {Button} from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import {Shirt} from 'lucide-react';

interface ItemCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
}) => {
  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return description;
  };

  return (
    <>
      <Card className="w-[250px] h-[380px]">
        <CardContent className="p-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={250}
            height={300}
            className="rounded-t-lg"
          />
        </CardContent>
        <div className="flex flex-col justify-between h-[150px]">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {truncateDescription(description)}
            </CardDescription>
          </CardHeader>
        </div>
        <CardFooter>
          <Button className="w-full">
            <Shirt className="mr-2 h-4 w-4" />
            Donate
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ItemCard;
