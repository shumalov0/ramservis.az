'use client';

import { lazy, Suspense } from 'react';

// Lazy load the Three.js component to reduce initial bundle size
const ThreeBackground = lazy(() => import('./ThreeBackground'));

interface LazyThreeBackgroundProps {
  scene?: 'particles' | 'geometric' | 'minimal';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  responsive?: boolean;
}

export default function LazyThreeBackground(props: LazyThreeBackgroundProps) {
  return (
    <Suspense fallback={null}>
      <ThreeBackground {...props} />
    </Suspense>
  );
}