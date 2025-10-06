'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  lightSrc?: string;
  darkSrc?: string;
  alt?: string;
  heightClass?: string; // e.g. 'h-8'
  lightHeightClass?: string; // separate height for light mode
  darkHeightClass?: string; // separate height for dark mode
  lightWidthClass?: string; // separate width for light mode
  darkWidthClass?: string; // separate width for dark mode
}

export default function Logo({
  href = '/',
  lightSrc = '/icons/logowhite.png',
  darkSrc = '/icons/logosyellow.png',
  alt = 'Ram Servis',
  heightClass = 'h-8',
  lightHeightClass,
  darkHeightClass,
  lightWidthClass,
  darkWidthClass,
}: LogoProps) {
  // Use separate heights if provided, otherwise use the common heightClass
  const lightHeight = lightHeightClass || heightClass;
  const darkHeight = darkHeightClass || heightClass;
  
  // Use separate widths if provided, otherwise use default
  const lightWidth = lightWidthClass || 'w-[150px] md:w-[150px]';
  const darkWidth = darkWidthClass || 'w-[150px] md:w-[150px]';
  
  return (
    <Link href={href} className="flex items-center group">
      <div className="relative h-[150px] w-[150px]">
        {/* Light mode logo (white/black logo) - shows in light mode */}
        <div className="absolute inset-0 block dark:hidden">
          <Image src={lightSrc} alt={alt} fill sizes="150px" className="object-contain" priority />
        </div>
        {/* Dark mode logo (yellow logo) - shows in dark mode */}
        <div className="absolute inset-0 hidden dark:block">
          <Image src={darkSrc} alt={alt} fill sizes="150px" className="object-contain" priority />
        </div>
      </div>
    </Link>
  );
}


