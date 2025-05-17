import type { SVGProps } from 'react';

export function DicipFinanceLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50" // Manteniendo el viewBox original
      aria-label="DicipFinance Logo"
      {...props}
    >
      <style>
        {`
          .logo-text {
            font-family: 'Geist', 'Arial', sans-serif;
            font-size: 24px; /* Reducido desde 28px */
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
      <text x="10" y="32" className="logo-text"> {/* y ajustado a 32 */}
        Dicip
      </text>
      <text x="92" y="32" className="logo-text" fill="hsl(var(--accent))"> {/* x ajustado ligeramente, y ajustado a 32 */}
        Finance
      </text>
      <circle cx="84" cy="14" r="4" className="logo-dot" /> {/* cx ajustado para estar sobre la 'i' de Dicip, cy ajustado a 14, r a 4 */}
    </svg>
  );
}
