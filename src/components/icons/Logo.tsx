import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50" // Adjusted viewBox for a more horizontal layout
      aria-label="DicipFinance Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: 'Geist', 'Arial', sans-serif;
            font-size: 28px; 
            font-weight: 600;
            fill: hsl(var(--primary));
          }
          .logo-dot {
            fill: hsl(var(--accent));
          }
          /* Dark mode colors are handled by HSL variables */
        `}
      </style>
      {/* Adjusted dot and text positions for new font size and viewBox */}
      <circle cx="15" cy="25" r="5" className="logo-dot" />
      <text x="35" y="35" className="logo-text">
        DicipFinance
      </text>
    </svg>
  );
}
