'use client';

import { useEffect, useState } from 'react';

interface VisitorSettings {
  fake_count?: number;
  use_real?: boolean;
}

export default function VisitorCounterWithSupabase() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [useReal, setUseReal] = useState(false);

  useEffect(() => {
    async function fetchVisitorCount() {
      try {
        // Supabase-dən məlumat götür
        const response = await fetch('/api/visitor-count');
        const data: VisitorSettings = await response.json();

        if (data.use_real && data.fake_count) {
          // Real rəqəm istifadə et
          setUseReal(true);
          animateCount(data.fake_count);
        } else {
          // Fake rəqəm istifadə et
          const today = new Date().toDateString();
          const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const fakeCount = 15 + (seed % 36);
          animateCount(fakeCount);
        }
      } catch (error) {
        // Xəta olarsa, fake rəqəm göstər
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const fakeCount = 15 + (seed % 36);
        animateCount(fakeCount);
      }
    }

    function animateCount(targetCount: number) {
      let current = 0;
      const increment = Math.ceil(targetCount / 20);
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetCount) {
          setCount(targetCount);
          setLoading(false);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 50);
    }

    fetchVisitorCount();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full animate-pulse ${
          useReal ? 'bg-blue-500' : 'bg-green-500'
        }`}></div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Onlayn ziyarətçi {useReal && '(real)'}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? '...' : count}
          </p>
        </div>
      </div>
    </div>
  );
}
