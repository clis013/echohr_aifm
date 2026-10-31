// Interactive SVG Donut Chart for Concern Distribution with 7 Categories

import { CATEGORIES } from './data.js';

export class ConcernDonutChart {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = Object.assign({
      size: 260,
      strokeWidth: 42,
      innerRadiusRatio: 0.62,
      onSegmentHover: null,
      onSegmentClick: null,
    }, options);
    
    this.activeCategory = null;
    this.data = [];
    this.totalCount = 0;
  }

  setData(distributionData) {
    this.data = distributionData;
    this.totalCount = distributionData.reduce((sum, item) => sum + item.count, 0);
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const width = this.options.size;
    const height = this.options.size;
    const center = width / 2;
    const outerRadius = (width - 20) / 2;
    const innerRadius = outerRadius * this.options.innerRadiusRatio;

    // Filter categories with count > 0 for angles calculation
    const activeData = this.data.filter(d => d.count > 0);
    const total = this.totalCount || 1;

    // SVG wrapper
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("class", "donut-svg");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.overflow = "visible";

    // Defs for filters (soft glow on hover)
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="segment-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.35"/>
      </filter>
    `;
    svg.appendChild(defs);

    const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    chartGroup.setAttribute("class", "donut-segments-group");
    svg.appendChild(chartGroup);

    let startAngle = -90; // Start at top 12 o'clock

    activeData.forEach((item, index) => {
      const category = CATEGORIES[item.categoryId];
      if (!category) return;

      const angleSpan = (item.count / total) * 360;
      // Add tiny gap between slices
      const gap = activeData.length > 1 ? 2.5 : 0;
      const arcStart = startAngle + gap / 2;
      const arcEnd = startAngle + angleSpan - gap / 2;

      const pathData = this.describeDonutArc(center, center, innerRadius, outerRadius, arcStart, arcEnd);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", category.color);
      path.setAttribute("class", `donut-segment segment-${category.id}`);
      path.setAttribute("data-category-id", category.id);
      path.style.cursor = "pointer";
      path.style.transition = "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, filter 0.2s ease";
      path.style.transformOrigin = `${center}px ${center}px`;

      // Mid-angle for outward explosion translation
      const midAngle = (arcStart + arcEnd) / 2;
      const rad = (midAngle * Math.PI) / 180;
      const hoverOffsetX = Math.cos(rad) * 6;
      const hoverOffsetY = Math.sin(rad) * 6;

      path.addEventListener("mouseenter", (e) => {
        this.highlightCategory(category.id, hoverOffsetX, hoverOffsetY);
        this.showTooltip(e, category, item);
      });

      path.addEventListener("mousemove", (e) => {
        this.positionTooltip(e);
      });

      path.addEventListener("mouseleave", () => {
        this.resetHighlight();
        this.hideTooltip();
      });

      path.addEventListener("click", () => {
        if (typeof this.options.onSegmentClick === "function") {
          this.options.onSegmentClick(category);
        }
      });

      chartGroup.appendChild(path);
      startAngle += angleSpan;
    });

    // Center Display
    const centerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    centerGroup.setAttribute("class", "donut-center-group");
    centerGroup.style.pointerEvents = "none";

    const centerValue = document.createElementNS("http://www.w3.org/2000/svg", "text");
    centerValue.setAttribute("x", center);
    centerValue.setAttribute("y", center - 4);
    centerValue.setAttribute("text-anchor", "middle");
    centerValue.setAttribute("class", "donut-center-value");
    centerValue.textContent = this.totalCount;

    const centerLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    centerLabel.setAttribute("x", center);
    centerLabel.setAttribute("y", center + 16);
    centerLabel.setAttribute("text-anchor", "middle");
    centerLabel.setAttribute("class", "donut-center-label");
    centerLabel.textContent = "Total Concerns";

    const centerSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
    centerSub.setAttribute("x", center);
    centerSub.setAttribute("y", center + 30);
    centerSub.setAttribute("text-anchor", "middle");
    centerSub.setAttribute("class", "donut-center-sub");
    centerSub.textContent = "1.08 Risk Index";

    centerGroup.appendChild(centerValue);
    centerGroup.appendChild(centerLabel);
    centerGroup.appendChild(centerSub);
    svg.appendChild(centerGroup);

    this.container.appendChild(svg);
    this.createTooltipElement();
  }

  describeDonutArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    const toRad = deg => (deg * Math.PI) / 180;
    
    // Ensure we don't exceed full circle
    const safeEnd = Math.min(endAngle, startAngle + 359.99);

    const startOuter = {
      x: x + outerRadius * Math.cos(toRad(startAngle)),
      y: y + outerRadius * Math.sin(toRad(startAngle))
    };
    const endOuter = {
      x: x + outerRadius * Math.cos(toRad(safeEnd)),
      y: y + outerRadius * Math.sin(toRad(safeEnd))
    };
    const startInner = {
      x: x + innerRadius * Math.cos(toRad(safeEnd)),
      y: y + innerRadius * Math.sin(toRad(safeEnd))
    };
    const endInner = {
      x: x + innerRadius * Math.cos(toRad(startAngle)),
      y: y + innerRadius * Math.sin(toRad(startAngle))
    };

    const largeArcFlag = safeEnd - startAngle > 180 ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      "Z"
    ].join(" ");
  }

  highlightCategory(categoryId, offsetX = 0, offsetY = 0) {
    this.activeCategory = categoryId;
    const paths = this.container.querySelectorAll(".donut-segment");
    paths.forEach(p => {
      const isMatch = p.getAttribute("data-category-id") === categoryId;
      if (isMatch) {
        p.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.04)`;
        p.style.filter = "url(#segment-glow)";
        p.style.opacity = "1";
      } else {
        p.style.transform = "none";
        p.style.filter = "none";
        p.style.opacity = "0.38";
      }
    });

    // Update center text dynamically
    const category = CATEGORIES[categoryId];
    const item = this.data.find(d => d.categoryId === categoryId);
    const centerVal = this.container.querySelector(".donut-center-value");
    const centerLbl = this.container.querySelector(".donut-center-label");
    const centerSub = this.container.querySelector(".donut-center-sub");
    
    if (centerVal && item) centerVal.textContent = item.count;
    if (centerLbl && category) centerLbl.textContent = category.code + ". " + category.shortName;
    if (centerSub && item) centerSub.textContent = `${item.percentage}% of early concerns`;

    // Highlight corresponding legend item
    document.querySelectorAll(".legend-item").forEach(leg => {
      if (leg.getAttribute("data-cat-id") === categoryId) {
        leg.classList.add("active-highlight");
      } else {
        leg.classList.remove("active-highlight");
      }
    });
  }

  resetHighlight() {
    this.activeCategory = null;
    const paths = this.container.querySelectorAll(".donut-segment");
    paths.forEach(p => {
      p.style.transform = "none";
      p.style.filter = "none";
      p.style.opacity = "1";
    });

    const centerVal = this.container.querySelector(".donut-center-value");
    const centerLbl = this.container.querySelector(".donut-center-label");
    const centerSub = this.container.querySelector(".donut-center-sub");
    
    if (centerVal) centerVal.textContent = this.totalCount;
    if (centerLbl) centerLbl.textContent = "Total Concerns";
    if (centerSub) centerSub.textContent = "1.08 Risk Index";

    document.querySelectorAll(".legend-item").forEach(leg => {
      leg.classList.remove("active-highlight");
    });
  }

  createTooltipElement() {
    if (document.getElementById("chart-tooltip")) return;
    const tooltip = document.createElement("div");
    tooltip.id = "chart-tooltip";
    tooltip.className = "chart-floating-tooltip";
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);
  }

  showTooltip(e, category, item) {
    const tooltip = document.getElementById("chart-tooltip");
    if (!tooltip) return;

    tooltip.innerHTML = `
      <div class="tt-header">
        <span class="tt-badge" style="background-color: ${category.color}">${category.code}</span>
        <span class="tt-title">${category.name}</span>
      </div>
      <div class="tt-stats">
        <span class="tt-count">${item.count} Flags</span>
        <span class="tt-percentage">${item.percentage}%</span>
      </div>
      <div class="tt-desc">${category.description}</div>
    `;
    tooltip.style.display = "block";
    this.positionTooltip(e);
  }

  positionTooltip(e) {
    const tooltip = document.getElementById("chart-tooltip");
    if (!tooltip || tooltip.style.display === "none") return;

    const x = e.clientX + 16;
    const y = e.clientY + 16;
    
    // Bounds check
    const rect = tooltip.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 20;
    const maxY = window.innerHeight - rect.height - 20;

    tooltip.style.left = `${Math.min(x, maxX)}px`;
    tooltip.style.top = `${Math.min(y, maxY)}px`;
  }

  hideTooltip() {
    const tooltip = document.getElementById("chart-tooltip");
    if (tooltip) {
      tooltip.style.display = "none";
    }
  }
}
