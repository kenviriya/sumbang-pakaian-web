import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import UserClothesTab from './userClothesTab';
import UserClothesHistoryTab from './userClothesHistoryTab';

const SumbangContent = () => {
  return (
    <div>
      <Tabs defaultValue="sumbang" className="w-full">
        <TabsList>
          <TabsTrigger value="sumbang">Sumbang pakaian</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="sumbang">
          <UserClothesTab />
        </TabsContent>
        <TabsContent value="history">
          <UserClothesHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SumbangContent;
