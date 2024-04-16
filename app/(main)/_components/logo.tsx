import {Poppins} from 'next/font/google';

import {cn} from '@/lib/utils';
import Image from 'next/image';

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
      {/* if text true then show text logo, else show icon logo  */}
      {text ? (
        <div className="hidden md:flex items-center gap-x-2">
          <p className={cn('font-bold text-[#0085FF]', font.className)}>
            Sumbang
          </p>
          <Image src="/Logo-icon.svg" alt="Logo" width={40} height={40} />
          <p className={cn('font-bold text-[#ff7a00]', font.className)}>
            Pakaian
          </p>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-x-2">
          <Image src="/Logo-icon.svg" alt="Logo" width={40} height={40} />
        </div>
      )}
    </>
  );
};

export default Logo;
