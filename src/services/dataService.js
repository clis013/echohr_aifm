import {
  DEPARTMENTS_DATA,
  CATEGORIES,
  ACTION_PLAN_AP01,
  ACTION_PLANS_LIST,
  MAYA_PROFILE,
  DANIEL_PROFILE,
  COMMUNITY_POSTS,
} from '../data/mockData';

/**
 * Data Service Layer
 * 
 * Abstract data calls so components are not directly mutation-coupled to static objects.
 * Makes it seamless to switch to real network hooks or GraphQL/REST endpoints later.
 */

export const dataService = {
  getDepartmentsData: () => DEPARTMENTS_DATA,

  getDepartmentData: (deptKey = 'all') => {
    return DEPARTMENTS_DATA[deptKey] || DEPARTMENTS_DATA.all;
  },

  getCategories: () => CATEGORIES,

  getActionPlanAP01: () => ({ ...ACTION_PLAN_AP01 }),

  getActionPlans: () => [...ACTION_PLANS_LIST],

  getMayaProfile: () => ({ ...MAYA_PROFILE }),

  getDanielProfile: () => ({ ...DANIEL_PROFILE }),

  getCommunityPosts: () => [...COMMUNITY_POSTS],

  getAllReports: () => {
    return [
      ...DEPARTMENTS_DATA.all.reports,
      ...DEPARTMENTS_DATA.engineering.reports,
      ...DEPARTMENTS_DATA.sales.reports,
    ]
      .filter((r, idx, self) => idx === self.findIndex((t) => t.id === r.id))
      .filter((r) => r.status !== 'Withdrawn' && r.resolutionStatus !== 'Withdrawn');
  },

  submitNewReport: (reportData) => {
    const all = dataService.getAllReports();
    const newId = `R00${all.length + 1}`;
    const newReport = {
      id: newId,
      employeeCode: reportData.isAnonymous ? 'EMP-ANON' : 'EMP-9204',
      department: reportData.department || 'Engineering',
      tenure: reportData.isAnonymous ? 'Hidden' : '42 Days',
      concernCategory: reportData.category,
      concernTitle: reportData.title,
      priority: 'High',
      status: 'Needs HR Review',
      statusType: 'urgent',
      date: 'Just now',
      snippet: reportData.snippet,
      suggestedAction: 'HR review scheduled for new submission',
    };

    if (DEPARTMENTS_DATA.engineering?.reports) {
      DEPARTMENTS_DATA.engineering.reports.unshift(newReport);
    }
    if (DEPARTMENTS_DATA.all?.reports) {
      DEPARTMENTS_DATA.all.reports.unshift(newReport);
    }

    return newReport;
  },
};

export default dataService;
