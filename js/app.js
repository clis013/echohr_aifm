// Application Bootstrap

import { NavigationManager } from './navigation.js';
import { DashboardApp } from './dashboard.js';

document.addEventListener("DOMContentLoaded", () => {
  const navigationManager = new NavigationManager();
  const dashboardApp = new DashboardApp(navigationManager);

  // Expose to window for debugging or inline triggers if needed
  window.__AIFM_APP__ = {
    navigation: navigationManager,
    dashboard: dashboardApp
  };
});
