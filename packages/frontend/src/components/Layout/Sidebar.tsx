'use client';

import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { toggleSidebar } from '@/store/slices/uiSlice';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', auth: true },
    { name: 'Play Game', href: '/play', icon: '🎮', auth: false },
    { name: 'Daily Challenge', href: '/challenges/daily', icon: '⭐', auth: true },
    { name: 'Leaderboards', href: '/leaderboards', icon: '🏆', auth: false },
    { name: 'Profile', href: '/profile', icon: '👤', auth: true },
    { name: 'Friends', href: '/friends', icon: '👥', auth: true },
    { name: 'Proposals', href: '/proposals', icon: '💡', auth: false },
    { name: 'Tutorials', href: '/tutorials', icon: '📚', auth: false }
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            if (item.auth && !isAuthenticated) return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
