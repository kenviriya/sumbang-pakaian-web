'use client';

import useScrollTop from '@/hooks/use-scroll-top';
import {cn} from '@/lib/utils';
import {useConvexAuth} from 'convex/react';
import {SignInButton, UserButton, useUser} from '@clerk/clerk-react';
import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/spinner';

import {LogIn} from 'lucide-react';
import Logo from './logo';
import Notification from './notification';
import Link from 'next/link';

const Navbar = () => {
  const {isAuthenticated, isLoading} = useConvexAuth();
  const scrolled = useScrollTop();
  const user = useUser();
  const userRole = user.user?.organizationMemberships[0]?.role;
  const userEmail = user.user?.emailAddresses[0]?.emailAddress;
  // org:admin
  // console.log('user role', userRole);

  return (
    <div
      className={cn(
        'z-50 bg-background fixed top-0 flex items-center w-full px-[10%] py-5 bg-[#f8f7f4]',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo text={true} />
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
            <Notification />
            <Button className="mr-3" variant={'secondary'}>
              <Link href={'/arrange-clothes'}>Galang Pakaian</Link>
            </Button>
            <Button className="mr-3">
              <Link href={'/dashboard'}>Dashboard</Link>
            </Button>
            {userRole === 'org:admin' && (
              <>
                <Button className="mr-3">
                  <Link href={'/admin-dashboard'}>Admin Dashboard</Link>
                </Button>
              </>
            )}
            <div className="hidden md:flex">
              <UserButton afterSignOutUrl="/" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
