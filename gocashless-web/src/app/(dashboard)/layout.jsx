
/* 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return null; // or a loading spinner
  }

  return (
    <section>
      {children}
    </section>
  );
} */

export default function DashboardLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  );
}
