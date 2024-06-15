import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

const RequestCard = () => {
  return (
    <Card>
      <div className={"grid grid-cols-4"}>
        <div className={"col-span-3"}>
          <CardHeader>
            <CardTitle>Judul Campaign</CardTitle>
          </CardHeader>
          <CardContent>Desc</CardContent>
        </div>
        <div className={"flex justify-center items-center row-span-2"}>
          <Button>
            <MessageSquarePlus className={"h-4 w-4 mr-2"} />
            Lihat Detail
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RequestCard;
