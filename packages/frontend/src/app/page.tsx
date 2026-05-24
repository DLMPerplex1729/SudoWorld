'use client';

import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20">
          <h1 className="text-5xl font-bold text-white text-center mb-6">🎮 Welcome to SudoWorld</h1>
          <p className="text-xl text-blue-100 text-center mb-12 max-w-2xl mx-auto">
            Master Sudoku in multiple dimensions! Challenge yourself with 9x9, 6x6 irregular, 16x16
            hexadecimal, and 3D cubic puzzles. Compete with friends, earn rewards, and create your
            own variants.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Classic 9x9</h3>
              <p className="text-gray-600">The traditional Sudoku with 13 difficulty levels</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">6x6 Irregular</h3>
              <p className="text-gray-600">Unique block configurations every puzzle</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🔯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">16x16 Hex</h3>
              <p className="text-gray-600">Massive puzzles with hexadecimal digits</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🧊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3D Cube</h3>
              <p className="text-gray-600">Four-dimensional puzzle solving</p>
            </div>
          </div>

          <div className="text-center space-x-4">
            <Link
              href="/play"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Start Playing
            </Link>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
