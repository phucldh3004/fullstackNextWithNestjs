"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/axios';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/logout');
      // Redirect to login page
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Có lỗi xảy ra khi đăng xuất');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  );
}

