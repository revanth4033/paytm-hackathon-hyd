interface QRMockProps {
  seed: string;
  caption: string;
}

const GRID = 11;

function pseudoRandomGrid(seed: string): boolean[][] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  let state = h || 1;
  function next() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  }
  return Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => next() > 0.5)
  );
}

function isFinderZone(r: number, c: number) {
  const inCorner = (r: number, c: number) => r < 3 && c < 3;
  return (
    inCorner(r, c) ||
    inCorner(r, GRID - 1 - c) ||
    inCorner(GRID - 1 - r, c)
  );
}

export function QRMock({ seed, caption }: QRMockProps) {
  const grid = pseudoRandomGrid(seed);
  const cell = 16;
  const size = GRID * cell;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-gray bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR code">
        <rect width={size} height={size} fill="white" />
        {grid.map((row, r) =>
          row.map((on, c) => {
            if (isFinderZone(r, c)) return null;
            if (!on) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cell}
                y={r * cell}
                width={cell}
                height={cell}
                fill="#002970"
              />
            );
          })
        )}
        {[
          [0, 0],
          [0, GRID - 3],
          [GRID - 3, 0],
        ].map(([fr, fc]) => (
          <g key={`${fr}-${fc}`}>
            <rect x={fc * cell} y={fr * cell} width={cell * 3} height={cell * 3} fill="#002970" />
            <rect
              x={fc * cell + cell * 0.5}
              y={fr * cell + cell * 0.5}
              width={cell * 2}
              height={cell * 2}
              fill="white"
            />
            <rect x={fc * cell + cell} y={fr * cell + cell} width={cell} height={cell} fill="#002970" />
          </g>
        ))}
      </svg>
      <p className="text-center text-sm font-medium text-text-secondary">{caption}</p>
    </div>
  );
}
