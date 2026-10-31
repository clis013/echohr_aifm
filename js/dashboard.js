// Dashboard Controller for Early Disengagement HR Hub

import { CATEGORIES, DEPARTMENTS_DATA, COMMUNITY_POSTS } from './data.js';
import { ConcernDonutChart } from './chart.js';

export class DashboardApp {
  constructor(navigationManager) {
    this.nav = navigationManager;
    this.currentDeptKey = "all";
    this.concernFilter = "all";
    this.reportFilter = "all";
    this.donutChart = null;

    this.init();
  }

  init() {
    this.setupDonutChart();
    this.setupDepartmentDropdown();
    this.setupConcernFilterPills();
    this.setupReportFilterPills();
    this.setupSearch();
    this.setupActionListeners();

    // Initial render
    this.renderAll();
    this.renderReportsView();
    this.renderCommunityView();
  }

  setupDonutChart() {
    this.donutChart = new ConcernDonutChart("donut-chart-container", {
      size: 240,
      onSegmentClick: (category) => {
        this.filterConcernsByCategory(category.id);
      }
    });
  }

  setupDepartmentDropdown() {
    const deptSelect = document.getElementById("dept-selector");
    if (deptSelect) {
      deptSelect.addEventListener("change", (e) => {
        this.currentDeptKey = e.target.value;
        this.renderAll();
        this.showToast(`Switched view to: ${DEPARTMENTS_DATA[this.currentDeptKey].name}`);
      });
    }
  }

  setupConcernFilterPills() {
    const pills = document.querySelectorAll(".concern-filter-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.concernFilter = pill.getAttribute("data-filter");
        this.renderPriorityConcerns();
      });
    });
  }

  setupReportFilterPills() {
    const pills = document.querySelectorAll(".report-filter-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.reportFilter = pill.getAttribute("data-report-filter");
        this.renderFollowUpReports();
      });
    });
  }

  setupSearch() {
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.handleGlobalSearch(query);
      });
    }
  }

  handleGlobalSearch(query) {
    const concernCards = document.querySelectorAll(".concern-card");
    const reportRows = document.querySelectorAll(".report-card-item");

    if (!query) {
      concernCards.forEach(c => c.style.display = "");
      reportRows.forEach(r => r.style.display = "");
      return;
    }

    concernCards.forEach(c => {
      const text = c.textContent.toLowerCase();
      c.style.display = text.includes(query) ? "" : "none";
    });

    reportRows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(query) ? "" : "none";
    });
  }

  setupActionListeners() {
    // Quick action: New report or export
    const newReportBtn = document.getElementById("action-new-checkin");
    if (newReportBtn) {
      newReportBtn.addEventListener("click", () => {
        this.openNewCheckinModal();
      });
    }

    const gotoAllReportsBtn = document.getElementById("goto-all-reports-btn");
    if (gotoAllReportsBtn) {
      gotoAllReportsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.nav.navigateTo("reports");
      });
    }

    const createPulseBtn = document.getElementById("btn-create-pulse");
    if (createPulseBtn) {
      createPulseBtn.addEventListener("click", () => {
        this.showToast("Scheduled new 60-day Role Clarity Pulse Survey for early joiners.");
      });
    }

    // Ctrl/Cmd + K shortcut for search
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }

  renderAll() {
    const data = DEPARTMENTS_DATA[this.currentDeptKey] || DEPARTMENTS_DATA.all;

    this.renderDepartmentMeta(data);
    this.renderMetricCards(data.metrics);
    this.renderChartAndLegend(data.distribution);
    this.renderPriorityConcerns();
    this.renderFollowUpReports();
  }

  renderDepartmentMeta(data) {
    const deptBadge = document.getElementById("current-dept-badge");
    const deptHeadcount = document.getElementById("current-dept-headcount");
    if (deptBadge) deptBadge.textContent = data.name;
    if (deptHeadcount) {
      deptHeadcount.textContent = `${data.headcount} Total Staff • ${data.newHires90d} New Hires (<90d)`;
    }
  }

  renderMetricCards(metrics) {
    // Metric 1: Emerging Concerns
    const ecVal = document.getElementById("metric-emerging-value");
    const ecTrend = document.getElementById("metric-emerging-trend");
    const ecStatus = document.getElementById("metric-emerging-status");
    if (ecVal) ecVal.textContent = metrics.emergingConcerns.value;
    if (ecTrend) ecTrend.textContent = metrics.emergingConcerns.trend;
    if (ecStatus) ecStatus.textContent = metrics.emergingConcerns.status;

    // Metric 2: Reports to Review
    const rrVal = document.getElementById("metric-review-value");
    const rrTrend = document.getElementById("metric-review-trend");
    const rrStatus = document.getElementById("metric-review-status");
    if (rrVal) rrVal.textContent = metrics.reportsToReview.value;
    if (rrTrend) rrTrend.textContent = metrics.reportsToReview.trend;
    if (rrStatus) rrStatus.textContent = metrics.reportsToReview.status;

    // Metric 3: Overdue Actions
    const oaVal = document.getElementById("metric-overdue-value");
    const oaTrend = document.getElementById("metric-overdue-trend");
    const oaStatus = document.getElementById("metric-overdue-status");
    if (oaVal) oaVal.textContent = metrics.overdueActions.value;
    if (oaTrend) oaTrend.textContent = metrics.overdueActions.trend;
    if (oaStatus) oaStatus.textContent = metrics.overdueActions.status;

    // Metric 4: Voluntary Feedback
    const vfVal = document.getElementById("metric-feedback-value");
    const vfTrend = document.getElementById("metric-feedback-trend");
    const vfStatus = document.getElementById("metric-feedback-status");
    if (vfVal) vfVal.textContent = metrics.voluntaryFeedback.value;
    if (vfTrend) vfTrend.textContent = metrics.voluntaryFeedback.trend;
    if (vfStatus) vfStatus.textContent = metrics.voluntaryFeedback.status;
  }

  renderChartAndLegend(distribution) {
    if (this.donutChart) {
      this.donutChart.setData(distribution);
    }

    const legendContainer = document.getElementById("donut-legend-container");
    if (!legendContainer) return;
    legendContainer.innerHTML = "";

    distribution.forEach(item => {
      const cat = CATEGORIES[item.categoryId];
      if (!cat) return;

      const row = document.createElement("div");
      row.className = "legend-item";
      row.setAttribute("data-cat-id", cat.id);
      row.title = `${cat.name}\n${cat.description}`;

      row.innerHTML = `
        <div class="legend-left">
          <span class="legend-dot" style="background-color: ${cat.color}"></span>
          <span class="legend-code">${cat.code}.</span>
          <span class="legend-name">${cat.shortName}</span>
        </div>
        <div class="legend-right">
          <span class="legend-count">${item.count}</span>
          <span class="legend-pct">${item.percentage}%</span>
        </div>
      `;

      row.addEventListener("mouseenter", () => {
        if (this.donutChart) {
          this.donutChart.highlightCategory(cat.id);
        }
      });

      row.addEventListener("mouseleave", () => {
        if (this.donutChart) {
          this.donutChart.resetHighlight();
        }
      });

      row.addEventListener("click", () => {
        this.filterConcernsByCategory(cat.id);
      });

      legendContainer.appendChild(row);
    });
  }

  filterConcernsByCategory(catId) {
    const cards = document.querySelectorAll(".concern-card");
    let found = false;
    cards.forEach(card => {
      const cardCat = card.getAttribute("data-category");
      if (cardCat === catId) {
        card.style.display = "";
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("highlight-pulse");
        setTimeout(() => card.classList.remove("highlight-pulse"), 2000);
        
        // Auto expand this card if collapsed
        const accordionBody = card.querySelector(".accordion-body");
        const chevron = card.querySelector(".chevron-icon");
        if (accordionBody && accordionBody.classList.contains("collapsed")) {
          accordionBody.classList.remove("collapsed");
          if (chevron) chevron.classList.add("rotated");
        }
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    if (found) {
      this.showToast(`Filtered concerns by Category ${catId}`);
    } else {
      // Revert filter if none found in this dept
      cards.forEach(card => card.style.display = "");
      this.showToast(`No specific high-priority flags for Category ${catId} in this department.`);
    }
  }

  renderPriorityConcerns() {
    const container = document.getElementById("priority-concerns-list");
    if (!container) return;

    const data = DEPARTMENTS_DATA[this.currentDeptKey] || DEPARTMENTS_DATA.all;
    let list = data.priorityConcerns || [];

    // Filter
    if (this.concernFilter !== "all") {
      list = list.filter(item => item.priority.toLowerCase() === this.concernFilter.toLowerCase());
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✓</div>
          <p class="empty-title">No ${this.concernFilter} priority concerns for this department</p>
          <span class="empty-subtitle">Great job! All indicators within safe thresholds.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    list.forEach((item, index) => {
      const cat = CATEGORIES[item.categoryKey] || CATEGORIES.A;
      const isExpandedFirst = index === 0; // expand first item by default for rich preview

      const card = document.createElement("div");
      card.className = "concern-card";
      card.setAttribute("data-category", cat.id);
      card.setAttribute("data-priority", item.priority.toLowerCase());

      const priorityBadgeClass = item.priority === "High" ? "badge-danger" : item.priority === "Medium" ? "badge-warning" : "badge-info";

      card.innerHTML = `
        <div class="concern-header" role="button" tabindex="0" aria-expanded="${isExpandedFirst}">
          <div class="concern-header-left">
            <span class="cat-pill" style="color: ${cat.color}; background-color: ${cat.lightBg}; border-color: ${cat.color}20;">
              Cat ${cat.code} • ${cat.shortName}
            </span>
            <h4 class="concern-title">${item.title}</h4>
            <p class="concern-short-desc">${item.shortDesc}</p>
          </div>
          <div class="concern-header-right">
            <span class="priority-pill ${priorityBadgeClass}">
              <span class="priority-dot"></span>
              ${item.priority} Priority
            </span>
            <span class="tenure-pill">${item.affectedTenure}</span>
            <button class="chevron-btn" aria-label="Expand details">
              <svg class="chevron-icon ${isExpandedFirst ? 'rotated' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="accordion-body ${isExpandedFirst ? '' : 'collapsed'}">
          <div class="details-grid">
            <div class="detail-box pattern-box">
              <div class="detail-box-head">
                <span class="box-icon">🔍</span>
                <span class="box-title">Observed Pattern</span>
              </div>
              <p class="box-text">${item.pattern}</p>
            </div>

            <div class="detail-box evidence-box">
              <div class="detail-box-head">
                <span class="box-icon">📊</span>
                <span class="box-title">Evidence & Signals</span>
              </div>
              <p class="box-text">${item.evidence}</p>
            </div>

            <div class="detail-box analysis-box">
              <div class="detail-box-head">
                <span class="box-icon">💡</span>
                <span class="box-title">Root Cause Analysis</span>
              </div>
              <p class="box-text">${item.analysis}</p>
            </div>

            <div class="detail-box recommendation-box">
              <div class="detail-box-head">
                <span class="box-icon">🎯</span>
                <span class="box-title">HR Action Recommendation</span>
              </div>
              <p class="box-text">${item.recommendation}</p>
            </div>
          </div>

          <div class="concern-card-footer">
            <div class="footer-meta">
              <span class="meta-label">Signal Intensity:</span>
              <span class="meta-count">${item.affectedCount}</span>
            </div>
            <div class="footer-actions">
              <button class="btn btn-secondary btn-sm link-reports-btn" data-cat-id="${cat.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                View Linked Reports
              </button>
              <button class="btn btn-primary btn-sm action-plan-btn" data-concern-id="${item.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                Launch Intervention Plan
              </button>
            </div>
          </div>
        </div>
      `;

      // Accordion toggle
      const header = card.querySelector(".concern-header");
      const body = card.querySelector(".accordion-body");
      const chevron = card.querySelector(".chevron-icon");

      header.addEventListener("click", () => {
        const isCollapsed = body.classList.contains("collapsed");
        if (isCollapsed) {
          body.classList.remove("collapsed");
          chevron.classList.add("rotated");
          header.setAttribute("aria-expanded", "true");
        } else {
          body.classList.add("collapsed");
          chevron.classList.remove("rotated");
          header.setAttribute("aria-expanded", "false");
        }
      });

      // Button: View Linked Reports
      const linkReportsBtn = card.querySelector(".link-reports-btn");
      if (linkReportsBtn) {
        linkReportsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.nav.navigateTo("reports");
          this.showToast(`Navigated to Feedback & Reports for Cat ${cat.code}`);
        });
      }

      // Button: Action plan
      const actionPlanBtn = card.querySelector(".action-plan-btn");
      if (actionPlanBtn) {
        actionPlanBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openInterventionModal(item, cat);
        });
      }

      container.appendChild(card);
    });
  }

  renderFollowUpReports() {
    const container = document.getElementById("reports-followup-list");
    if (!container) return;

    const data = DEPARTMENTS_DATA[this.currentDeptKey] || DEPARTMENTS_DATA.all;
    let reports = data.reports || [];

    // Filter
    if (this.reportFilter !== "all") {
      reports = reports.filter(r => {
        if (this.reportFilter === "urgent") return r.statusType === "urgent";
        if (this.reportFilter === "overdue") return r.statusType === "overdue";
        if (this.reportFilter === "review") return r.statusType === "review" || r.statusType === "urgent";
        return true;
      });
    }

    if (reports.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✓</div>
          <p class="empty-title">All reports caught up</p>
          <span class="empty-subtitle">No pending follow-ups in this filter criteria.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    reports.forEach(report => {
      const cat = CATEGORIES[report.concernCategory] || CATEGORIES.A;
      const itemEl = document.createElement("div");
      itemEl.className = `report-card-item status-${report.statusType}`;
      itemEl.setAttribute("data-report-id", report.id);

      const statusBadgeClass = report.statusType === "urgent" ? "pill-urgent" : report.statusType === "overdue" ? "pill-overdue" : "pill-normal";

      itemEl.innerHTML = `
        <div class="report-row-top">
          <div class="report-identity">
            <span class="report-id">${report.id}</span>
            <span class="report-tenure-tag">Tenure: ${report.tenure}</span>
            <span class="report-dept-tag">${report.department}</span>
          </div>
          <span class="report-status-badge ${statusBadgeClass}">${report.status}</span>
        </div>
        <div class="report-title-area">
          <span class="report-cat-indicator" style="background-color: ${cat.color}" title="${cat.name}"></span>
          <h5 class="report-concern-heading">${report.concernTitle}</h5>
        </div>
        <p class="report-snippet">"${report.snippet}"</p>
        <div class="report-row-bottom">
          <span class="report-action-hint">
            <strong>Suggested:</strong> ${report.suggestedAction}
          </span>
          <button class="review-link-btn" title="Open full report in Feedback & Reports page">
            <span>Review</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      `;

      // Click to navigate to Feedback & Reports page!
      itemEl.addEventListener("click", () => {
        this.nav.navigateTo("reports", { highlightReportId: report.id });
      });

      const btn = itemEl.querySelector(".review-link-btn");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.nav.navigateTo("reports", { highlightReportId: report.id });
        });
      }

      container.appendChild(itemEl);
    });
  }

  renderReportsView() {
    const fullContainer = document.getElementById("full-reports-tbody");
    if (!fullContainer) return;

    // Collect all reports from all departments
    const allReports = DEPARTMENTS_DATA.all.reports.concat(
      DEPARTMENTS_DATA.engineering.reports,
      DEPARTMENTS_DATA.sales.reports
    );

    // Deduplicate by id
    const unique = [];
    const seen = new Set();
    allReports.forEach(r => {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        unique.push(r);
      }
    });

    fullContainer.innerHTML = "";

    unique.forEach(r => {
      const cat = CATEGORIES[r.concernCategory] || CATEGORIES.A;
      const tr = document.createElement("tr");
      tr.className = "report-table-row";
      tr.setAttribute("data-full-report-id", r.id);

      tr.innerHTML = `
        <td class="font-medium text-dark">${r.id}</td>
        <td>
          <span class="tenure-badge">${r.tenure}</span>
          <span class="subtext d-block">${r.department}</span>
        </td>
        <td>
          <div class="cat-cell">
            <span class="mini-cat-dot" style="background-color: ${cat.color}"></span>
            <span>${cat.name}</span>
          </div>
        </td>
        <td class="snippet-cell">
          <div class="table-snippet font-medium">${r.concernTitle}</div>
          <div class="subtext">${r.snippet}</div>
        </td>
        <td>
          <span class="priority-pill ${r.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${r.priority}</span>
        </td>
        <td>
          <span class="report-status-badge ${r.statusType === 'urgent' ? 'pill-urgent' : r.statusType === 'overdue' ? 'pill-overdue' : 'pill-normal'}">${r.status}</span>
        </td>
        <td class="text-right">
          <button class="btn btn-secondary btn-sm action-row-btn" data-id="${r.id}">Take Action</button>
        </td>
      `;

      tr.querySelector(".action-row-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.openReportDetailModal(r, cat);
      });

      fullContainer.appendChild(tr);
    });
  }

  renderCommunityView() {
    const container = document.getElementById("community-posts-container");
    if (!container) return;
    container.innerHTML = "";

    COMMUNITY_POSTS.forEach(post => {
      const card = document.createElement("div");
      card.className = "community-post-card";
      card.innerHTML = `
        <div class="post-header">
          <div class="post-author-avatar">
            ${post.author.charAt(0)}
          </div>
          <div class="post-meta">
            <div class="author-name">${post.author}</div>
            <div class="author-sub">${post.role} • ${post.department} • <span class="text-muted">${post.time}</span></div>
          </div>
          <span class="post-badge">${post.badge}</span>
        </div>
        <h4 class="post-title">${post.title}</h4>
        <p class="post-content">${post.content}</p>
        <div class="post-footer">
          <button class="post-btn post-like-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            <span class="like-count">${post.likes}</span> Appreciations
          </button>
          <button class="post-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>${post.comments} Comments</span>
          </button>
          <span class="post-tag">#${post.tag}</span>
        </div>
      `;

      const likeBtn = card.querySelector(".post-like-btn");
      const countEl = card.querySelector(".like-count");
      let liked = false;
      likeBtn.addEventListener("click", () => {
        liked = !liked;
        post.likes += liked ? 1 : -1;
        countEl.textContent = post.likes;
        likeBtn.classList.toggle("liked", liked);
      });

      container.appendChild(card);
    });
  }

  openInterventionModal(concern, category) {
    const modal = document.getElementById("action-modal");
    if (!modal) return;

    const modalBody = document.getElementById("action-modal-body");
    modalBody.innerHTML = `
      <div class="modal-concern-intro">
        <span class="cat-pill" style="color: ${category.color}; background-color: ${category.lightBg}">
          ${category.code}. ${category.name}
        </span>
        <h3 class="mt-2 font-bold">${concern.title}</h3>
        <p class="text-muted mt-1">${concern.shortDesc}</p>
      </div>

      <div class="form-group mt-4">
        <label class="form-label font-semibold">Recommended Intervention Strategy</label>
        <div class="recommendation-preview-box">
          ${concern.recommendation}
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="form-col">
          <label class="form-label font-semibold">Assign Lead HR Partner</label>
          <select class="form-input">
            <option>Sarah Jenkins (Senior HRBP)</option>
            <option>Marcus Vance (People & Culture Lead)</option>
            <option>David K. (Onboarding Specialist)</option>
          </select>
        </div>
        <div class="form-col">
          <label class="form-label font-semibold">Target Resolution Window</label>
          <select class="form-input">
            <option>Within 3 Business Days (High Priority)</option>
            <option>Within 7 Business Days</option>
            <option>Next Sprint Cycle</option>
          </select>
        </div>
      </div>

      <div class="form-group mt-3">
        <label class="form-label font-semibold">Custom Intervention Note</label>
        <textarea class="form-input" rows="3" placeholder="Enter specific instructions or schedule a meeting with department director..."></textarea>
      </div>
    `;

    modal.classList.add("modal-open");

    const closeBtn = document.getElementById("modal-close-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const confirmBtn = document.getElementById("modal-confirm-btn");

    const closeModal = () => modal.classList.remove("modal-open");
    closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    confirmBtn.onclick = () => {
      closeModal();
      this.showToast(`Intervention plan launched for "${concern.title}"`);
    };
  }

  openReportDetailModal(report, category) {
    const modal = document.getElementById("action-modal");
    if (!modal) return;

    const modalBody = document.getElementById("action-modal-body");
    modalBody.innerHTML = `
      <div class="modal-concern-intro">
        <div class="d-flex justify-between items-center">
          <span class="report-id font-bold">${report.id}</span>
          <span class="priority-pill ${report.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${report.priority} Priority</span>
        </div>
        <h3 class="mt-2 font-bold">${report.concernTitle}</h3>
        <p class="subtext mt-1">Tenure: <strong>${report.tenure}</strong> • Department: <strong>${report.department}</strong></p>
      </div>

      <div class="feedback-quote-box mt-3">
        <span class="quote-icon">“</span>
        <p class="quote-content">${report.snippet}</p>
      </div>

      <div class="timeline-area mt-4">
        <h5 class="font-semibold mb-2">Automated Early Disengagement Signals</h5>
        <ul class="signal-list">
          <li>✓ Pulse survey sentiment drop from 8.5 to 5.2 in Week 4</li>
          <li>✓ 2 Rescheduled 1-on-1s logged in Google Calendar sync</li>
          <li>✓ Flagged under Category ${category.code}: ${category.name}</li>
        </ul>
      </div>

      <div class="form-group mt-3">
        <label class="form-label font-semibold">Update Status</label>
        <select class="form-input" id="report-modal-status">
          <option value="In Progress">Move to In Progress (HR Sync scheduled)</option>
          <option value="Resolved">Mark Resolved (Manager check-in completed)</option>
          <option value="Escalated">Escalate to VP of Department</option>
        </select>
      </div>
    `;

    modal.classList.add("modal-open");

    const closeBtn = document.getElementById("modal-close-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const confirmBtn = document.getElementById("modal-confirm-btn");

    const closeModal = () => modal.classList.remove("modal-open");
    closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    confirmBtn.onclick = () => {
      const newStatus = document.getElementById("report-modal-status")?.value || "Updated";
      report.status = newStatus;
      closeModal();
      this.renderReportsView();
      this.renderFollowUpReports();
      this.showToast(`Report ${report.id} updated to "${newStatus}"`);
    };
  }

  openNewCheckinModal() {
    this.showToast("Quick action: New 30-Day Check-in pulse triggered for all new joiners!");
  }

  showToast(message) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "app-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }
}
