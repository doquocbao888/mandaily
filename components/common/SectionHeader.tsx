'use client';

import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'center' | 'left';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = 'center',
  className = 'mb-10 sm:mb-14',
  titleClassName = '',
  subtitleClassName = '',
  children,
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`w-full ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <span className="block text-xs sm:text-sm font-bold tracking-[0.2em] text-[#a6741b] uppercase mb-2">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-neutral-900 tracking-tight leading-[1.15] whitespace-pre-line ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-neutral-600 text-sm sm:text-base font-medium max-w-2xl ${
            isCenter ? 'mx-auto' : ''
          } ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
