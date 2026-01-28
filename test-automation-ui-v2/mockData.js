/**
 * Mock Data for Test Automation UI v2
 * 
 * HIERARCHY:
 * - Scenario (Top Level): Contains the overall objective/goal
 *   - Steps (User-defined): The steps provided by the user
 *     - Sub-steps (Browser Actions): Actions executed by browser_use API
 * 
 * Each sub-step contains FULL execution details:
 * - agentAction: { type, parameters, evaluation, memory, nextGoal }
 * - result: { success, extractedContent, error, isDone }
 * - browserState: { url, title, timestamp }
 * - screenshot (optional)
 */

// ===== LocalStorage Helper Functions =====
const STORAGE_KEYS = {
  SCENARIOS: 'trinamix_scenarios',
  EXECUTIONS: 'trinamix_executions',
  STATS: 'trinamix_stats',
  FOLDERS: 'trinamix_folders',
  DATA_VERSION: 'trinamix_data_version',
  FLOW_RUNS: 'trinamix_flow_runs',
  VARIABLES: 'trinamix_variables',
  ACTIVE_TASKS: 'trinamix_active_tasks'
};

// Increment this when folder structure changes to force refresh
const CURRENT_DATA_VERSION = 4;

const StorageHelper = {
  // Save scenarios to localStorage
  saveScenarios: (scenarios) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
    } catch (e) {
      console.error('Error saving scenarios to localStorage:', e);
    }
  },
  
  // Load scenarios from localStorage
  loadScenarios: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error loading scenarios from localStorage:', e);
      return null;
    }
  },
  
  // Save executions to localStorage
  saveExecutions: (executions) => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(executions));
    } catch (e) {
      console.error('Error saving executions to localStorage:', e);
    }
  },
  
  // Load executions from localStorage
  loadExecutions: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXECUTIONS);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error loading executions from localStorage:', e);
      return null;
    }
  },
  
  // Save stats to localStorage
  saveStats: (stats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats to localStorage:', e);
    }
  },
  
  // Load stats from localStorage
  loadStats: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error loading stats from localStorage:', e);
      return null;
    }
  },
  
  // Save folders to localStorage
  saveFolders: (folders) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.error('Error saving folders to localStorage:', e);
    }
  },
  
  // Load folders from localStorage
  loadFolders: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error loading folders from localStorage:', e);
      return null;
    }
  },
  
  // Save flow runs to localStorage
  saveFlowRuns: (flowRuns) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLOW_RUNS, JSON.stringify(flowRuns));
    } catch (e) {
      console.error('Error saving flow runs to localStorage:', e);
    }
  },
  
  // Load flow runs from localStorage
  loadFlowRuns: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FLOW_RUNS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading flow runs from localStorage:', e);
      return [];
    }
  },
  
  // Save variables to localStorage
  saveVariables: (variables) => {
    try {
      localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(variables));
    } catch (e) {
      console.error('Error saving variables to localStorage:', e);
    }
  },
  
  // Load variables from localStorage
  loadVariables: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VARIABLES);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error loading variables from localStorage:', e);
      return null;
    }
  },
  
  // Clear all stored data
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SCENARIOS);
      localStorage.removeItem(STORAGE_KEYS.EXECUTIONS);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.FOLDERS);
      localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
      localStorage.removeItem(STORAGE_KEYS.FLOW_RUNS);
      localStorage.removeItem(STORAGE_KEYS.VARIABLES);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  },
  
  // Check and update data version (returns true if version changed)
  checkDataVersion: () => {
    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      if (storedVersion !== String(CURRENT_DATA_VERSION)) {
        // Version changed - clear folders to use new defaults
        localStorage.removeItem(STORAGE_KEYS.FOLDERS);
        
        // Migrate existing scenarios to the default folder (folder-test-scenarios)
        const storedScenarios = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
        if (storedScenarios) {
          const scenarios = JSON.parse(storedScenarios);
          const validFolderIds = ['folder-test-scenarios', 'folder-oracle', 'folder-erp', 'folder-inventory'];
          scenarios.forEach(s => {
            if (!s.folderId || !validFolderIds.includes(s.folderId)) {
              s.folderId = 'folder-test-scenarios';
            }
          });
          localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
        }
        
        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(CURRENT_DATA_VERSION));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error checking data version:', e);
      return false;
    }
  },

  // Save active tasks (running in background) to localStorage
  saveActiveTasks: (activeTasks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASKS, JSON.stringify(activeTasks));
    } catch (e) {
      console.error('Error saving active tasks to localStorage:', e);
    }
  },

  // Load active tasks from localStorage
  loadActiveTasks: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TASKS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading active tasks from localStorage:', e);
      return [];
    }
  },

  // Remove a specific active task
  removeActiveTask: (taskId) => {
    try {
      const activeTasks = StorageHelper.loadActiveTasks();
      const filtered = activeTasks.filter(t => t.taskId !== taskId);
      StorageHelper.saveActiveTasks(filtered);
    } catch (e) {
      console.error('Error removing active task:', e);
    }
  }
};

const MOCK_DATA = {
  // ===== VARIABLES (Platform Credentials & Configuration) =====
  // Variables store sensitive configuration like URLs, usernames, passwords for different platforms
  // These can be referenced in scenarios using \variableName syntax
  variables: [
    {
      id: 'var-oracle-fusion',
      name: 'Oracle Fusion Cloud',
      description: 'Oracle Fusion Cloud platform credentials for Supply Chain Planning',
      category: 'ERP',
      fields: [
        { key: 'url', label: 'URL', value: 'https://fusion.oracle.com', type: 'url', isSecret: false },
        { key: 'username', label: 'Username', value: 'admin@company.com', type: 'text', isSecret: false },
        { key: 'password', label: 'Password', value: '', type: 'password', isSecret: true }
      ],
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-20T14:30:00Z'
    },
    {
      id: 'var-oracle-scm',
      name: 'Oracle Supply Chain',
      description: 'Oracle Supply Chain Management platform',
      category: 'SCM',
      fields: [
        { key: 'url', label: 'URL', value: 'https://scm.oracle.com', type: 'url', isSecret: false },
        { key: 'username', label: 'Username', value: 'scm_user@company.com', type: 'text', isSecret: false },
        { key: 'password', label: 'Password', value: '', type: 'password', isSecret: true },
        { key: 'tenantId', label: 'Tenant ID', value: 'TENANT001', type: 'text', isSecret: false }
      ],
      createdAt: '2026-01-12T09:00:00Z',
      updatedAt: '2026-01-18T11:00:00Z'
    },
    {
      id: 'var-sap-erp',
      name: 'SAP ERP',
      description: 'SAP Enterprise Resource Planning system',
      category: 'ERP',
      fields: [
        { key: 'url', label: 'URL', value: 'https://sap.company.com', type: 'url', isSecret: false },
        { key: 'client', label: 'Client', value: '100', type: 'text', isSecret: false },
        { key: 'username', label: 'Username', value: 'sap_user', type: 'text', isSecret: false },
        { key: 'password', label: 'Password', value: '', type: 'password', isSecret: true }
      ],
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-01-15T08:00:00Z'
    }
  ],

  // ===== FOLDERS STRUCTURE =====
  // All folders are at the root level (parentId: null), shown under "All Scenarios"
  folders: [
    {
      id: 'folder-test-scenarios',
      name: 'Test Scenarios',
      parentId: null,
      isExpanded: true,
      isDefault: true,
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'folder-oracle',
      name: 'Oracle Cloud HCM',
      parentId: null,
      isExpanded: true,
      isDefault: false,
      createdAt: '2026-01-15T10:00:00Z'
    },
    {
      id: 'folder-erp',
      name: 'Oracle ERP',
      parentId: null,
      isExpanded: false,
      isDefault: false,
      createdAt: '2026-01-16T10:00:00Z'
    },
    {
      id: 'folder-inventory',
      name: 'Inventory Management',
      parentId: 'folder-erp',
      isExpanded: false,
      isDefault: false,
      createdAt: '2026-01-17T10:00:00Z'
    }
  ],
  
  // ===== SCENARIOS (Objectives) =====
  scenarios: [],

  // ===== EXECUTIONS (Detailed run data with sub-steps) =====
  executions: [
    // Demo scenarios will be loaded here
    // To add your own demo scenario:
    // 1. Run exportDemoScenario("your-scenario-id") in browser console
    // 2. Share the exported JSON
    // 3. Add it here as default data
  ],

  // Flow runs (from Flow Builder)
  flowRuns: [
  ],

  // Dashboard Stats
  stats: {
    totalScenarios: 0,
    passedScenarios: 0,
    failedScenarios: 0,
    runningScenarios: 0,
    totalExecutions: 0,
    passRate: 0,
    avgDuration: 0,
    activeRuns: 0
  },

  // Recent Activity
  recentActivity: []
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.MOCK_DATA = MOCK_DATA;
  
  // Demo Scenario Export Utility
  // Run this in the browser console to export your current data as a demo scenario
  window.exportDemoScenario = function(scenarioId) {
    const scenarios = StorageHelper.loadScenarios() || [];
    const executions = StorageHelper.loadExecutions() || [];
    
    if (!scenarioId) {
      console.log('Available scenarios:');
      scenarios.forEach(s => {
        console.log(`  - ID: ${s.id}, Name: ${s.name || s.objective}`);
      });
      console.log('\nUsage: exportDemoScenario("scenario-id")');
      return;
    }
    
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      console.error(`Scenario ${scenarioId} not found`);
      return;
    }
    
    const execution = executions.find(e => e.scenarioId === scenarioId);
    
    const exportData = {
      scenario: scenario,
      execution: execution || null,
      exportedAt: new Date().toISOString(),
      note: 'Copy this entire object and share it to add as a demo scenario'
    };
    
    console.log('=== DEMO SCENARIO EXPORT ===');
    console.log(JSON.stringify(exportData, null, 2));
    console.log('\n=== END EXPORT ===');
    
    // Also copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
        .then(() => console.log('✓ Copied to clipboard!'))
        .catch(() => console.log('Could not copy to clipboard'));
    }
    
    return exportData;
  };
  
  // Quick export all scenarios and executions
  window.exportAllData = function() {
    const exportData = {
      scenarios: StorageHelper.loadScenarios() || [],
      executions: StorageHelper.loadExecutions() || [],
      variables: StorageHelper.loadVariables() || [],
      folders: StorageHelper.loadFolders() || [],
      exportedAt: new Date().toISOString()
    };
    
    console.log('=== ALL DATA EXPORT ===');
    console.log(JSON.stringify(exportData, null, 2));
    console.log('\n=== END EXPORT ===');
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
        .then(() => console.log('✓ Copied to clipboard!'))
        .catch(() => console.log('Could not copy to clipboard'));
    }
    
    return exportData;
  };
  
  console.log('📤 Demo export utilities loaded!');
  console.log('  - exportDemoScenario() - List available scenarios');
  console.log('  - exportDemoScenario("scenario-id") - Export specific scenario');
  console.log('  - exportAllData() - Export all scenarios and executions');
}
