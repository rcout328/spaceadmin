'use client';
import { AuthProvider } from '@/contexts/AuthContext';
import { Home } from '@/components/Home';

export default function Page() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}