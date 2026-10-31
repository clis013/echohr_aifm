import React, { useState } from 'react';
import { CATEGORIES } from '../../data/mockData';

export default function DonutChart({
  distribution,
  departmentName = '',
  isDepartmentView = false,
  selectedCategoryId = null,
  onSelectCategory,
}) {
  const [hoveredCatId, setHoveredCatId] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, cat: null, item: null });

  const size = 150;
  const center = size / 2;
  const outerRadius = (size - 16) / 2;
  const innerRadius = outerRadius * 0.62;

  // Filter out items with 0% or no percentage
  const validItems = distribution
    .filter((d) => d.percentage && d.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  const activeThemesCount = validItems.length;
  const displayItems = validItems;
  const totalPercentage = displayItems.reduce((sum, d) => sum + d.percentage, 0) || 100;

  // SVG arc calculation helper
  const describeArc = (x, y, innerR, outerR, startAngle, endAngle) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const safeEnd = Math.min(endAngle, startAngle + 359.99);

    const startOuter = {
      x: x + outerR * Math.cos(toRad(startAngle)),
      y: y + outerR * Math.sin(toRad(startAngle)),
    };
    const endOuter = {
      x: x + outerR * Math.cos(toRad(safeEnd)),
      y: y + outerR * Math.sin(toRad(safeEnd)),
    };
    const startInner = {
      x: x + innerR * Math.cos(toRad(safeEnd)),
      y: y + innerR * Math.sin(toRad(safeEnd)),
    };
    const endInner = {
      x: x + innerR * Math.cos(toRad(startAngle)),
      y: y + innerR * Math.sin(toRad(startAngle)),
    };

    const largeArc = safeEnd - startAngle > 180 ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ');
  };

  let currentAngle = -90;

  const activeCategoryObj = hoveredCatId ? CATEGORIES[hoveredCatId] : null;
  const activeItemObj = hoveredCatId ? displayItems.find((d) => d.categoryId === hoveredCatId) : null;

  return (
    <div className="bg-[#F8F9FD] border border-[#EBECEF] rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3 shadow-inner/10">
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 items-center flex-1">
        {/* SVG Donut Chart */}
        <div className="relative w-[140px] h-[140px] mx-auto flex items-center justify-center flex-shrink-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full overflow-visible"
            onMouseLeave={() => {
              setHoveredCatId(null);
              setTooltip({ visible: false, x: 0, y: 0, cat: null, item: null });
            }}
          >
            <defs>
              <filter id="svg-slice-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.25" />
              </filter>
            </defs>

            <g>
              {displayItems.map((item) => {
                const cat = CATEGORIES[item.categoryId] || CATEGORIES.other;
                const angleSpan = (item.percentage / totalPercentage) * 360;
                const gap = displayItems.length > 1 ? 2.5 : 0;
                const arcStart = currentAngle + gap / 2;
                const arcEnd = currentAngle + angleSpan - gap / 2;

                const pathData = describeArc(center, center, innerRadius, outerRadius, arcStart, arcEnd);

                const midAngle = (arcStart + arcEnd) / 2;
                const rad = (midAngle * Math.PI) / 180;
                const offsetX = Math.cos(rad) * 4;
                const offsetY = Math.sin(rad) * 4;

                const isHovered = hoveredCatId === cat.id;
                const isDimmed = hoveredCatId && !isHovered;

                currentAngle += angleSpan;

                return (
                  <path
                    key={cat.id}
                    d={pathData}
                    fill={cat.color}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transform: isHovered ? `translate(${offsetX}px, ${offsetY}px) scale(1.04)` : 'none',
                      transformOrigin: `${center}px ${center}px`,
                      filter: isHovered ? 'url(#svg-slice-glow)' : 'none',
                      opacity: isDimmed ? 0.35 : 1,
                    }}
                    onMouseEnter={(e) => {
                      setHoveredCatId(cat.id);
                      setTooltip({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        cat,
                        item,
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
                    }}
                    onClick={() => {
                      if (cat.id !== 'other' && onSelectCategory) {
                        onSelectCategory(cat.id);
                      }
                    }}
                  />
                );
              })}
            </g>

            {/* Center: Number of concern by theme */}
            <g className="pointer-events-none select-none">
              <text
                x={center}
                y={center - 1}
                textAnchor="middle"
                className="text-2xl font-extrabold fill-slate-900"
              >
                {hoveredCatId && activeItemObj ? `${activeItemObj.percentage}%` : activeThemesCount}
              </text>
              <text
                x={center}
                y={center + 14}
                textAnchor="middle"
                className="text-[9px] font-bold fill-slate-400 uppercase tracking-wider"
              >
                {hoveredCatId && activeCategoryObj ? activeCategoryObj.name : 'Concerns'}
              </text>
            </g>
          </svg>
        </div>

        {/* Legend container */}
        <div className="flex flex-col h-full justify-center">
          <div className="flex flex-col gap-1.5">
            {displayItems.map((item) => {
              const cat = CATEGORIES[item.categoryId] || CATEGORIES.other;
              const isHovered = hoveredCatId === cat.id;
              const isActiveFilter = selectedCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCatId(cat.id)}
                  onMouseLeave={() => setHoveredCatId(null)}
                  onClick={() => {
                    if (cat.id !== 'other' && onSelectCategory) {
                      onSelectCategory(cat.id);
                    }
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all border ${
                    isActiveFilter
                      ? 'bg-[#EEF0FF] border-[#5455EE]/40 ring-2 ring-[#5455EE]/10 shadow-xs'
                      : isHovered
                      ? 'bg-[#F8F9FD] border-transparent translate-x-0.5'
                      : 'hover:bg-[#F8F9FD] border-transparent'
                  }`}
                  title={`${cat.name}\n${cat.description}`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {cat.name}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-slate-800 bg-[#F4F5FA] px-2 py-0.5 rounded-lg border border-[#EBECEF] ml-2 flex-shrink-0">
                    {item.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip.visible && tooltip.cat && tooltip.item && (
        <div
          className="fixed z-50 bg-slate-900 text-white p-3 rounded-xl shadow-2xl max-w-xs border border-slate-700 pointer-events-none transition-transform"
          style={{
            left: `${Math.min(tooltip.x + 16, window.innerWidth - 300)}px`,
            top: `${Math.min(tooltip.y + 16, window.innerHeight - 150)}px`,
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">{tooltip.cat.name}</span>
            <span className="text-xs font-extrabold text-sky-400">{tooltip.item.percentage}%</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{tooltip.cat.description}</p>
        </div>
      )}
    </div>
  );
}
