'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeroNav } from './Frontend/navbar';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/auth/login');
  }, [router]);

  return (
    <>
    <HeroNav/>
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
    </>
  );
}

;
