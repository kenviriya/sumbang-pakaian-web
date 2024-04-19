import Footer from './_components/footer';
import Navbar from './_components/navbar';
import { EdgeStoreProvider } from '@/lib/edgestore';

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-full bg-[#f8f7f4]">
      <Navbar />
<<<<<<< HEAD
        <main className="h-full pt-20">{children}</main>
=======
      <main className="h-full pt-20">{children}</main>
      <Footer />
>>>>>>> develop
    </div>
  );
};

export default MainLayout;
