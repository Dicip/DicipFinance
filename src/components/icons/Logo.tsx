import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
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
      {/* Coordenadas Y ajustadas para dar más margen vertical */}
      <text x="10" y="32" className="logo-text">
        Dicip
      </text>
      <text x="98" y="32" className="logo-text" fill="hsl(var(--accent))">
        Finance
      </text>
      <circle cx="90" cy="12" r="5" className="logo-dot" />
    </svg>
  );
}
