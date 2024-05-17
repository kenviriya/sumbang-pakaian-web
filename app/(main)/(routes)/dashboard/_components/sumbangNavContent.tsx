import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import UserClothes from './userClothes';
import UserClothesHistory from './userClothesHistory';

const SumbangContent = () => {
  return (
    <div>
      <Tabs defaultValue="sumbang" className="w-full">
        <TabsList>
          <TabsTrigger value="sumbang">Sumbang pakaian</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="sumbang">
          <UserClothes />
        </TabsContent>
        <TabsContent value="history">
          <UserClothesHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SumbangContent;
