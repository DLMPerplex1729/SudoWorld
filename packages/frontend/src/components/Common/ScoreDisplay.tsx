'use client';

import React from 'react';

interface ScoreDisplayProps {
  points: number;
  difficulty: string;
  mistakes: number;
  hintsUsed: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ points, difficulty, mistakes, hintsUsed }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{points}</div>
        <div className="text-xs text-gray-600">Points</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 capitalize">{difficulty}</div>
        <div className="text-xs text-gray-600">Difficulty</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{mistakes}/3</div>
        <div className="text-xs text-gray-600">Mistakes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-600">{hintsUsed}</div>
        <div className="text-xs text-gray-600">Hints Used</div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
