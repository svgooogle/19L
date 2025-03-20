'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuthenticated');
      setIsAuthenticated(auth === 'true');
      setIsLoading(false);

      if (auth !== 'true' && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return children;
} 