import DonationCard from "./donationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageDonationContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage donation card</CardTitle>
      </CardHeader>
      <CardContent
        className={
          "w-full grid grid-cols-1 gap-4  justify-center justify-items-center sm:grid-cols-2 md:grid-cols-4 md:gap-y-8"
        }
      >
        <DonationCard
          imageUrl={"/asdf"}
          title={"lorem"}
          description={"lorems"}
          donationId={"asdfl"}
        />
        <DonationCard
          imageUrl={"/asdf"}
          title={"lorem"}
          description={"lorems"}
          donationId={"asdfl"}
        />
        <DonationCard
          imageUrl={"/asdf"}
          title={"lorem"}
          description={"lorems"}
          donationId={"asdfl"}
        />
        <DonationCard
          imageUrl={"/asdf"}
          title={"lorem"}
          description={"lorems"}
          donationId={"asdfl"}
        />
        <DonationCard
          imageUrl={"/asdf"}
          title={"lorem"}
          description={"lorems"}
          donationId={"asdfl"}
        />
      </CardContent>
    </Card>
  );
};

export default ManageDonationContent;
