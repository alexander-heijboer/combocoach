import type { LucideProps } from 'lucide-react';
import { GiHighPunch } from 'react-icons/gi';
import { PiBoxingGlove, PiBoxingGloveFill } from 'react-icons/pi';

export const HeavyBag = ({ size = 24, color = 'currentColor', ...props }: LucideProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 2h4" />
    <path d="M12 2v3" />
    <path d="M6 5h12a1 1 0 0 1 1 1v12a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a1 1 0 0 1 1-1Z" />
    <path d="M5 9h14" />
    <path d="M5 14h14" />
  </svg>
);

export const BoxingGlove = ({ size = 24, color = 'currentColor', ...props }: LucideProps) => (
  <PiBoxingGloveFill 
    size={size} 
    color={color} 
    {...props} 
  />
);

export const Shadowbox = ({ size = 24, color = 'currentColor', ...props }: LucideProps) => (
  <GiHighPunch 
    size={size} 
    color={color} 
    {...props} 
  />
);

export const BoxingPads = ({ size = 24, color = 'currentColor', ...props }: LucideProps) => (
  <PiBoxingGlove 
    size={size} 
    color={color} 
    {...props} 
  />
);
