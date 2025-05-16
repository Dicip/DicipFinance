import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5" // Adjusted to maintain aspect ratio for 150 width
      aria-label="DicipFinance Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: 'Geist', 'Arial', sans-serif;
            font-size: 30px;
            font-weight: 600;
            fill: hsl(var(--primary));
          }
          .logo-dot {
            fill: hsl(var(--accent));
          }
          @media (prefers-color-scheme: dark) {
            .logo-text {
              fill: hsl(var(--primary)); /* Keep primary for dark mode or adjust if needed */
            }
            .logo-dot {
                fill: hsl(var(--accent));
            }
          }
        `}
      </style>
      <text x="10" y="35" className="logo-text">
        Dicip
      </text>
      <text x="98" y="35" className="logo-text" fill="hsl(var(--accent))">
        Finance
      </text>
      <circle cx="90" cy="15" r="5" className="logo-dot" />
    </svg>
  );
}
