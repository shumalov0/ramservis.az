'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hər gün üçün unikal fake rəqəm yarat
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // 15-50 arası təsadüfi rəqəm (seed əsasında)
    const fakeCount = 15 + (seed % 36);
    
    // Animasiya effekti
    let current = 0;
    const increment = Math.ceil(fakeCount / 20);
    const timer = setInterval(() => {
      current += increment;
      if (current >= fakeCount) {
        setCount(fakeCount);
        setLoading(false);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Onlayn ziyarətçi</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? '...' : count}
          </p>
        </div>
      </div>
    </div>
  );
}
