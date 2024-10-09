'use client';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboardComponent } from '@/components/admin-dashboard';
import { AdminLogin } from '@/components/AdminLogin';
import { Loader2 } from 'lucide-react';

export function Home() {
  const { currentEmail, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-800" />
      </div>
    );
  }

  if (currentEmail === 'admin123@gmail.com') {
    return <AdminDashboardComponent />;
  } else {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <AdminLogin />
      </div>
    );
  }
}