'use client';

import Link from 'next/link';

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h1 className="text-xl font-bold text-primary">Something went wrong!</h1>
      <h3>We could not find the page you were looking for</h3>
      <h3>
        Go back to{' '}
        <span className="text-primary underline font-medium">
          <Link href="/">Home</Link>
        </span>
      </h3>
    </div>
  );
};

export default Error;
