import {Button} from '@/components/ui/button';
import Logo from './logo';

const Footer = () => {
  return (
    <div className="flex items-center w-full py-6 px-[4%] z-50">
      <Logo text={false} />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Tentang Kami
        </Button>
      </div>
    </div>
  );
};

export default Footer;
