import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

interface ICardSkeletonProps {
  quantity?: number;
}

const CardSkeleton = ({ quantity }: ICardSkeletonProps) => {
  const cards = Array.from({ length: quantity || 1 }, (_, i) => (
    <Card key={i} className="w-[250px] h-[400px]">
      <CardContent className="p-0">
        <AspectRatio ratio={4 / 3}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
      </CardContent>
      <div className="flex flex-col justify-between h-[150px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-20 h-5" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="w-full h-20" />
          </CardDescription>
        </CardHeader>
      </div>
      <CardFooter>
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  ));
  return <>{cards}</>;
};

export default CardSkeleton;
