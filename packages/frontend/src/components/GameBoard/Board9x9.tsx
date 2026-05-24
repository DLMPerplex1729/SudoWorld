'use client';

import React from 'react';

interface Board9x9Props {
  grid: number[][];
  solution?: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: number) => void;
}

const Board9x9: React.FC<Board9x9Props> = ({
  grid,
  solution,
  selectedCell,
  onCellClick,
  onCellChange
}) => {
  const getBoxIndex = (row: number, col: number) => Math.floor(row / 3) * 3 + Math.floor(col / 3);
  const selectedBox = selectedCell ? getBoxIndex(selectedCell.row, selectedCell.col) : -1;
  const selectedRow = selectedCell?.row ?? -1;
  const selectedCol = selectedCell?.col ?? -1;

  return (
    <div className="sudoku-grid inline-block">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex border-b border-gray-300" style={{
          borderBottom: (rowIdx + 1) % 3 === 0 ? '2px solid black' : undefined
        }}>
          {row.map((value, colIdx) => {
            const isSelected = rowIdx === selectedRow && colIdx === selectedCol;
            const isInSelectedBox = getBoxIndex(rowIdx, colIdx) === selectedBox;
            const isInSelectedRow = rowIdx === selectedRow;
            const isInSelectedCol = colIdx === selectedCol;
            const isError = solution && value !== 0 && solution[rowIdx][colIdx] !== value;

            return (
              <input
                key={`${rowIdx}-${colIdx}`}
                type="text"
                maxLength={1}
                value={value === 0 ? '' : value}
                onChange={(e) => {
                  const newValue = e.target.value ? parseInt(e.target.value) : 0;
                  if (newValue >= 0 && newValue <= 9) {
                    onCellChange(rowIdx, colIdx, newValue);
                  }
                }}
                onClick={() => onCellClick(rowIdx, colIdx)}
                className={`w-12 h-12 border border-gray-300 text-center font-bold text-lg ${
                  isSelected ? 'bg-blue-300' : isInSelectedBox || isInSelectedRow || isInSelectedCol ? 'bg-blue-100' : ''
                } ${isError ? 'bg-red-100' : ''}`}
                style={{
                  borderRight: (colIdx + 1) % 3 === 0 ? '2px solid black' : undefined,
                  borderBottom: (rowIdx + 1) % 3 === 0 ? '2px solid black' : undefined
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board9x9;
