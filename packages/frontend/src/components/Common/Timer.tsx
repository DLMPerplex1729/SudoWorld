'use client';

import React, { useEffect, useState } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTick?: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isRunning, onTick }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        onTick?.(seconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onTick, seconds]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="text-2xl font-bold text-gray-800">
      {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
};

export default Timer;
