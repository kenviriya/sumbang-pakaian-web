import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RequestCard from "@/app/(main)/(routes)/dashboard-admin/_components/(donation-request)/requestCard";

const DonationRequestContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Request </CardTitle>
      </CardHeader>
      <CardContent>
        <RequestCard />
      </CardContent>
    </Card>
  );
};

export default DonationRequestContent;
