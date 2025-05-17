import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 75" // Adjusted viewBox for stacked layout
      aria-label="DicipFinance Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: 'Geist', 'Arial', sans-serif;
            font-size: 28px; /* Increased font size */
            font-weight: 600;
            fill: hsl(var(--primary));
            text-anchor: middle; /* Center align text */
          }
          .logo-dot {
            fill: hsl(var(--accent));
          }
          /* Dark mode colors are handled by HSL variables */
        `}
      </style>
      {/* Centered dot above "Dicip" */}
      <circle cx="50%" cy="8" r="3.5" className="logo-dot" /> 
      <text x="50%" y="38" className="logo-text"> {/* "Dicip" text, y adjusted for baseline */}
        Dicip
      </text>
      <text x="50%" y="66" className="logo-text" fill="hsl(var(--accent))"> {/* "Finance" text, y adjusted for baseline, accent color */}
        Finance
      </text>
    </svg>
  );
}
