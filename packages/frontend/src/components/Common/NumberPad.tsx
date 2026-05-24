'use client';

import React from 'react';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  disabledNumbers?: number[];
  maxValue?: number;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, disabledNumbers = [], maxValue = 9 }) => {
  const numbers = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-700">Numbers</h3>
      <div className="grid grid-cols-5 gap-1">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabledNumbers.includes(num)}
            className="w-10 h-10 rounded bg-blue-500 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onNumberClick(0)}
          className="w-10 h-10 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition col-span-5"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
