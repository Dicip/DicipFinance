import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 75" // Keeping viewBox, content will fill it more
      aria-label="DicipFinance Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: 'Geist', 'Arial', sans-serif;
            font-size: 42px; /* Increased font size for visibility */
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
      {/* Adjusted dot and text positions for new font size */}
      <circle cx="50%" cy="7" r="3" className="logo-dot" />
      <text x="50%" y="40" className="logo-text"> {/* "Dicip" text, y adjusted */}
        Dicip
      </text>
      <text x="50%" y="70" className="logo-text" fill="hsl(var(--accent))"> {/* "Finance" text, y adjusted */}
        Finance
      </text>
    </svg>
  );
}
