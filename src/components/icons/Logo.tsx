import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50" // Manteniendo el viewBox
      aria-label="DicipFinance Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: 'Geist', 'Arial', sans-serif;
            font-size: 28px; /* Reducido desde 30px */
            font-weight: 600;
            fill: hsl(var(--primary));
          }
          .logo-dot {
            fill: hsl(var(--accent));
          }
          @media (prefers-color-scheme: dark) {
            .logo-text {
              fill: hsl(var(--primary)); 
            }
            .logo-dot {
                fill: hsl(var(--accent));
            }
          }
        `}
      </style>
      {/* Ajuste de coordenadas para mejor centrado y visibilidad */}
      <text x="10" y="35" className="logo-text"> {/* y ajustado a 35 desde 32 */}
        Dicip
      </text>
      <text x="98" y="35" className="logo-text" fill="hsl(var(--accent))"> {/* y ajustado a 35 desde 32 */}
        Finance
      </text>
      <circle cx="90" cy="15" r="5" className="logo-dot" /> {/* cy ajustado a 15 desde 12 */}
    </svg>
  );
}
