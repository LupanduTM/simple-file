'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const AuthLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = pathname === '/login' || pathname === '/register';

    if (user && isPublicRoute) {
      router.replace('/dashboard');
    } else if (!user && !isPublicRoute) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
};

export default AuthLayout;
