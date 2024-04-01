import {Poppins} from 'next/font/google';

import {cn} from '@/lib/utils';
import Image from 'next/image';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <p className={cn('font-bold text-[#0085FF]', font.className)}>Sumbang</p>
      <Image src="/Logo-icon.svg" alt="Logo" width={40} height={40} />
      <p className={cn('font-bold text-[#ff7a00]', font.className)}>Pakaian</p>
    </div>
  );
};

export default Logo;
