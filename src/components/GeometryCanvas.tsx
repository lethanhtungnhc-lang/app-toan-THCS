import React from 'react';
import { GeometryVisual } from '../types';

interface GeometryCanvasProps {
  visual: GeometryVisual;
  className?: string;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({ visual, className = '' }) => {
  const { type, params } = visual;

  if (type === 'tam_giac_vuong') {
    // Triangle ABC right at A
    // A at bottom-left (60, 200), B at bottom-right (260, 200), C at top-left (60, 60)
    // or standard: A(60, 200), B(60, 60), C(280, 200) right at A
    const ax = 70;
    const ay = 190;
    const bx = 70;
    const by = 50;
    const cx = 270;
    const cy = 190;

    const angleC = params.gocC || (params.gocB ? 90 - params.gocB : 30);
    const angleB = params.gocB || 90 - angleC;

    return (
      <div className={`flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-xl border border-indigo-500/30 ${className}`}>
        <svg viewBox="0 0 340 230" className="w-full max-w-[320px] h-auto overflow-visible">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* Triangle Fill & Stroke */}
          <polygon
            points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
            fill="rgba(99, 102, 241, 0.12)"
            stroke="#818cf8"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Right Angle Symbol at A */}
          <path
            d={`M ${ax + 18} ${ay} L ${ax + 18} ${ay - 18} L ${ax} ${ay - 18}`}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />

          {/* Angle Arc at C */}
          <path
            d={`M ${cx - 28} ${cy} A 28 28 0 0 0 ${cx - 24} ${cy - 14}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
          {angleC && (
            <text x={cx - 52} y={cy - 8} fill="#38bdf8" fontSize="12" fontWeight="bold">
              {angleC}°
            </text>
          )}

          {/* Angle Arc at B */}
          {angleB && (
            <text x={bx + 14} y={by + 36} fill="#fbbf24" fontSize="12" fontWeight="bold">
              {angleB}°
            </text>
          )}

          {/* Vertex Labels */}
          <circle cx={ax} cy={ay} r="4" fill="#f43f5e" />
          <text x={ax - 22} y={ay + 8} fill="#f1f5f9" fontSize="15" fontWeight="bold">
            {params.tenDiemA || 'A'}
          </text>

          <circle cx={bx} cy={by} r="4" fill="#818cf8" />
          <text x={bx - 22} y={by + 4} fill="#f1f5f9" fontSize="15" fontWeight="bold">
            {params.tenDiemB || 'B'}
          </text>

          <circle cx={cx} cy={cy} r="4" fill="#818cf8" />
          <text x={cx + 12} y={cy + 8} fill="#f1f5f9" fontSize="15" fontWeight="bold">
            {params.tenDiemC || 'C'}
          </text>

          {/* Side length labels */}
          {params.canhGocVuong2 && (
            <text x={ax - 38} y={(ay + by) / 2 + 5} fill="#94a3b8" fontSize="13" fontWeight="bold">
              {params.canhGocVuong2}
            </text>
          )}
          {params.canhGocVuong1 && (
            <text x={(ax + cx) / 2} y={ay + 24} fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="middle">
              {params.canhGocVuong1}
            </text>
          )}
          {params.canhHuyen && (
            <text x={(bx + cx) / 2 + 16} y={(by + cy) / 2 - 4} fill="#34d399" fontSize="13" fontWeight="bold">
              {params.canhHuyen}
            </text>
          )}
        </svg>
        <span className="text-xs text-indigo-300/80 font-medium mt-1">
          {params.chuThich || 'Tam giác vuông tại A'}
        </span>
      </div>
    );
  }

  if (type === 'cot_co' || type === 'ngon_hai_dang') {
    // Flagpole / Lighthouse height measurement
    const h = params.chieuCao || 12;
    const d = params.khoangCach || 16;
    const angle = params.gocNang || 37;

    return (
      <div className={`flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-xl border border-indigo-500/30 ${className}`}>
        <svg viewBox="0 0 340 210" className="w-full max-w-[320px] h-auto overflow-visible">
          {/* Ground level */}
          <line x1="30" y1="180" x2="310" y2="180" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4 4" />

          {/* Flagpole / Tower (AB) */}
          <line x1="260" y1="180" x2="260" y2="40" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          {/* Flag */}
          <polygon points="260,40 295,52 260,65" fill="#ef4444" />
          <circle cx="260" cy="38" r="4" fill="#fbbf24" />

          {/* Observer / Shadow Point C */}
          <circle cx="80" cy="180" r="5" fill="#38bdf8" />
          <text x="75" y="202" fill="#38bdf8" fontSize="13" fontWeight="bold">C</text>

          {/* Tower Foot B */}
          <circle cx="260" cy="180" r="5" fill="#f59e0b" />
          <text x="265" y="202" fill="#f59e0b" fontSize="13" fontWeight="bold">B (chân cột)</text>

          {/* Tower Top A */}
          <text x="270" y="44" fill="#f59e0b" fontSize="13" fontWeight="bold">A (đỉnh)</text>

          {/* Line of Sight (AC) */}
          <line x1="80" y1="180" x2="260" y2="40" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />

          {/* Right Angle at B */}
          <path d="M 245 180 L 245 165 L 260 165" fill="none" stroke="#f43f5e" strokeWidth="2" />

          {/* Angle of elevation arc at C */}
          <path d="M 120 180 A 40 40 0 0 0 114 154" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="126" y="172" fill="#38bdf8" fontSize="13" fontWeight="bold">
            α = {angle}°
          </text>

          {/* Ground distance annotation */}
          <text x="170" y="200" fill="#94a3b8" fontSize="13" textAnchor="middle" fontWeight="bold">
            Khoảng cách d = {d} m
          </text>

          {/* Tower height annotation */}
          <text x="215" y="110" fill="#fbbf24" fontSize="13" fontWeight="bold">
            h = ?
          </text>
        </svg>
        <span className="text-xs text-amber-300/90 font-medium mt-1">
          Ứng dụng thực tế: Xác định chiều cao bằng tỉ số lượng giác góc nhọn
        </span>
      </div>
    );
  }

  if (type === 'thang_dua_tuong') {
    const angle = params.gocNang || 65;
    return (
      <div className={`flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-xl border border-indigo-500/30 ${className}`}>
        <svg viewBox="0 0 320 210" className="w-full max-w-[300px] h-auto overflow-visible">
          {/* Wall */}
          <line x1="220" y1="180" x2="220" y2="30" stroke="#cbd5e1" strokeWidth="8" />
          {/* Ground */}
          <line x1="40" y1="180" x2="280" y2="180" stroke="#64748b" strokeWidth="4" />

          {/* Ladder leaning (AB) */}
          <line x1="100" y1="180" x2="220" y2="50" stroke="#f59e0b" strokeWidth="4.5" />
          {/* Ladder steps */}
          {[0.2, 0.4, 0.6, 0.8].map((t, idx) => {
            const lx = 100 + (220 - 100) * t;
            const ly = 180 + (50 - 180) * t;
            return <circle key={idx} cx={lx} cy={ly} r="3" fill="#ffffff" />;
          })}

          {/* Angle at foot */}
          <path d="M 130 180 A 30 30 0 0 0 126 153" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="135" y="172" fill="#38bdf8" fontSize="12" fontWeight="bold">{angle}°</text>

          {/* Right angle */}
          <path d="M 205 180 L 205 165 L 220 165" fill="none" stroke="#f43f5e" strokeWidth="2" />

          <text x="90" y="200" fill="#38bdf8" fontSize="13" fontWeight="bold">Chân thang (B)</text>
          <text x="225" y="55" fill="#f59e0b" fontSize="13" fontWeight="bold">Đỉnh thang (A)</text>
          <text x="225" y="195" fill="#94a3b8" fontSize="13" fontWeight="bold">Chân tường (C)</text>
        </svg>
        <span className="text-xs text-sky-300 font-medium mt-1">Bài toán chiếc thang an toàn dựa tường</span>
      </div>
    );
  }

  // Fallback generic coordinate / visual
  return null;
};
