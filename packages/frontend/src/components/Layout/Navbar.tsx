'use client';

import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { notificationCount } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🎮 SudoWorld
          </Link>
          <div className="flex gap-4">
            <Link href="/play" className="text-gray-700 hover:text-blue-600 transition">
              Play
            </Link>
            <Link href="/leaderboards" className="text-gray-700 hover:text-blue-600 transition">
              Leaderboards
            </Link>
            <Link href="/challenges" className="text-gray-700 hover:text-blue-600 transition">
              Challenges
            </Link>
            <Link href="/proposals" className="text-gray-700 hover:text-blue-600 transition">
              Community
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link href="/notifications" className="relative">
                🔔
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
