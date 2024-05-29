import Footer from './_components/footer';
import Navbar from './_components/navbar';

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-full bg-[#f8f7f4]">
      <Navbar />
      <main className="h-full pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
