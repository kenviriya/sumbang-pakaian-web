import Navbar from './_components/navbar';

const MarketingLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="h-full bg-[#f8f7f4]">
      <Navbar />
      <main className="h-full pt-20">{children}</main>
    </div>
  );
};

export default MarketingLayout;
