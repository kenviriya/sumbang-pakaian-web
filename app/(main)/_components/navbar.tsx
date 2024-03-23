'use client';

import useScrollTop from '@/hooks/use-scroll-top';
import {cn} from '@/lib/utils';
import {useConvexAuth} from 'convex/react';
import {SignInButton, UserButton} from '@clerk/clerk-react';
import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/spinner';

import {LogIn} from 'lucide-react';

const Navbar = () => {
  const {isAuthenticated, isLoading} = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        'z-50 bg-background fixed top-0 flex items-center w-full px-[4%] py-6',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost">
                Log in
                <LogIn className="h-4 w-4 ml-2" />
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            {/* <Button variant={'ghost'} size={'sm'} asChild>
              <Link href={'/documents'}>Enter Jotion</Link>
            </Button> */}
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
