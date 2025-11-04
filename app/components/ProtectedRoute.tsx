'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'farmer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // Redirect if user doesn't have the required role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/farmer/dashboard');
      }
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Render children only if user is authenticated and has the required role
  if (user && (!requiredRole || user.role === requiredRole)) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}