// Navigation & Sidebar Management

export class NavigationManager {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.toggleBtn = document.getElementById("sidebar-toggle-btn");
    this.navLinks = document.querySelectorAll(".nav-item[data-page]");
    this.pages = document.querySelectorAll(".app-page");
    this.currentPage = "dashboard";
    this.isMinimized = false;

    this.init();
  }

  init() {
    // Toggle sidebar collapse/expand
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => {
        this.toggleSidebar();
      });
    }

    // Page navigation
    this.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute("data-page");
        if (targetPage) {
          this.navigateTo(targetPage);
        }
      });
    });

    // Check localStorage for saved collapsed state
    const savedState = localStorage.getItem("aifm_sidebar_minimized");
    if (savedState === "true") {
      this.setMinimized(true);
    }
  }

  toggleSidebar() {
    this.setMinimized(!this.isMinimized);
  }

  setMinimized(minimized) {
    this.isMinimized = minimized;
    if (this.sidebar) {
      if (this.isMinimized) {
        this.sidebar.classList.add("minimized");
        this.sidebar.setAttribute("aria-expanded", "false");
      } else {
        this.sidebar.classList.remove("minimized");
        this.sidebar.setAttribute("aria-expanded", "true");
      }
    }
    localStorage.setItem("aifm_sidebar_minimized", this.isMinimized);
  }

  navigateTo(pageId, options = {}) {
    this.currentPage = pageId;

    // Update active nav link
    this.navLinks.forEach(link => {
      if (link.getAttribute("data-page") === pageId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Show target page, hide others
    this.pages.forEach(page => {
      if (page.id === `${pageId}-view`) {
        page.classList.remove("hidden-page");
        page.classList.add("active-page");
      } else {
        page.classList.remove("active-page");
        page.classList.add("hidden-page");
      }
    });

    // Update Header Title
    const headerTitle = document.getElementById("header-title");
    if (headerTitle) {
      if (pageId === "dashboard") {
        headerTitle.textContent = "HR Dashboard";
      } else if (pageId === "reports") {
        headerTitle.textContent = "Feedback & Reports";
      } else if (pageId === "community") {
        headerTitle.textContent = "Community Board";
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Handle deep link options if any
    if (pageId === "reports" && options.highlightReportId) {
      setTimeout(() => {
        const reportCard = document.querySelector(`[data-full-report-id="${options.highlightReportId}"]`);
        if (reportCard) {
          reportCard.scrollIntoView({ behavior: "smooth", block: "center" });
          reportCard.classList.add("highlight-pulse");
          setTimeout(() => reportCard.classList.remove("highlight-pulse"), 2500);
        }
      }, 100);
    }
  }
}
