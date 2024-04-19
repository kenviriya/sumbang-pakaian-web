import {Poppins} from 'next/font/google';

import {cn} from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
});

interface Props {
  text: boolean;
}

const Logo = ({text}: Props) => {
  return (
    <>
      {text ? (
        <Link href={'/'}>
          <div className="hidden md:flex items-center gap-x-2">
            <p className={cn('font-bold text-[#0085FF]', font.className)}>
              Sumbang
            </p>
            <Image src="/Logo-icon.svg" alt="Logo" width={40} height={40} />
            <p className={cn('font-bold text-[#ff7a00]', font.className)}>
              Pakaian
            </p>
          </div>
        </Link>
      ) : (
        <Link href={'/'}>
          <div className="hidden md:flex items-center gap-x-2">
            <Image src="/Logo-icon.svg" alt="Logo" width={40} height={40} />
          </div>
        </Link>
      )}
    </>
  );
};

export default Logo;
