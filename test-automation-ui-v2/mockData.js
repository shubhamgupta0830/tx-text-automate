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
  VARIABLES: 'trinamix_variables'
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
  scenarios: [
    {
      id: 'scenario-001',
      folderId: 'folder-test-scenarios',
      objective: 'Verify that Supply Plans are correctly configured and can be opened',
      description: 'End-to-end validation of Oracle Fusion Cloud Supply Planning module configuration',
      tags: ['oracle', 'supply-chain', 'critical'],
      createdAt: '2026-01-20T10:00:00Z',
      updatedAt: '2026-01-22T14:30:00Z',
      createdBy: 'admin@trinamix.com',
      status: 'passed',
      lastRun: {
        executionId: 'exec-001',
        status: 'passed',
        date: '2026-01-22T14:30:00Z',
        duration: 245000
      },
      configuration: {
        timeout: 300,
        retryOnFailure: true,
        maxRetries: 2,
        captureScreenshots: true,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      // User-defined Steps
      steps: [
        {
          id: 'step-001',
          order: 1,
          description: 'Login to Oracle Fusion Cloud',
          status: 'passed',
          duration: 35000,
          startTime: '2026-01-22T14:30:00Z',
          endTime: '2026-01-22T14:30:35Z'
        },
        {
          id: 'step-002',
          order: 2,
          description: 'Click Navigator (☰) → Supply Chain Planning → Supply Planning',
          status: 'passed',
          duration: 28000,
          startTime: '2026-01-22T14:30:35Z',
          endTime: '2026-01-22T14:31:03Z'
        },
        {
          id: 'step-003',
          order: 3,
          description: 'Click Tasks → Manage Plans',
          status: 'passed',
          duration: 18000,
          startTime: '2026-01-22T14:31:03Z',
          endTime: '2026-01-22T14:31:21Z'
        },
        {
          id: 'step-004',
          order: 4,
          description: 'Click Search',
          status: 'passed',
          duration: 12000,
          startTime: '2026-01-22T14:31:21Z',
          endTime: '2026-01-22T14:31:33Z'
        },
        {
          id: 'step-005',
          order: 5,
          description: 'Enter the Plan Name in "Name" field: Alyasra ABP Base Plan & Verify plan exists',
          status: 'passed',
          duration: 25000,
          startTime: '2026-01-22T14:31:33Z',
          endTime: '2026-01-22T14:31:58Z'
        },
        {
          id: 'step-006',
          order: 6,
          description: 'Select the plan',
          status: 'passed',
          duration: 8000,
          startTime: '2026-01-22T14:31:58Z',
          endTime: '2026-01-22T14:32:06Z'
        },
        {
          id: 'step-007',
          order: 7,
          description: 'Click Actions → Open',
          status: 'passed',
          duration: 22000,
          startTime: '2026-01-22T14:32:06Z',
          endTime: '2026-01-22T14:32:28Z'
        }
      ]
    },
    {
      id: 'scenario-002',
      folderId: 'folder-test-scenarios',
      objective: 'Create and validate a new Purchase Order in Oracle ERP',
      description: 'Test the complete purchase order creation workflow including approvals',
      tags: ['oracle', 'procurement', 'erp'],
      createdAt: '2026-01-18T09:00:00Z',
      updatedAt: '2026-01-21T11:45:00Z',
      createdBy: 'admin@trinamix.com',
      status: 'failed',
      lastRun: {
        executionId: 'exec-002',
        status: 'failed',
        date: '2026-01-21T11:45:00Z',
        duration: 180000
      },
      configuration: {
        timeout: 300,
        retryOnFailure: true,
        maxRetries: 2,
        captureScreenshots: true,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      steps: [
        {
          id: 'step-001',
          order: 1,
          description: 'Login to Oracle Fusion Cloud',
          status: 'passed',
          duration: 32000
        },
        {
          id: 'step-002',
          order: 2,
          description: 'Navigate to Procurement → Purchase Orders',
          status: 'passed',
          duration: 25000
        },
        {
          id: 'step-003',
          order: 3,
          description: 'Click Create Purchase Order button',
          status: 'passed',
          duration: 15000
        },
        {
          id: 'step-004',
          order: 4,
          description: 'Fill in supplier details and line items',
          status: 'failed',
          duration: 45000,
          error: 'Supplier dropdown not populated - timeout waiting for elements'
        },
        {
          id: 'step-005',
          order: 5,
          description: 'Submit for approval',
          status: 'pending',
          duration: null
        },
        {
          id: 'step-006',
          order: 6,
          description: 'Verify PO status shows "Pending Approval"',
          status: 'pending',
          duration: null
        }
      ]
    },
    {
      id: 'scenario-003',
      objective: 'Validate Inventory Transfer between warehouses',
      description: 'Test inventory movement from main warehouse to distribution center',
      tags: ['oracle', 'inventory', 'warehouse'],
      createdAt: '2026-01-19T14:00:00Z',
      updatedAt: '2026-01-22T10:00:00Z',
      createdBy: 'admin@trinamix.com',
      status: 'running',
      lastRun: {
        executionId: 'exec-003',
        status: 'running',
        date: '2026-01-22T10:00:00Z',
        duration: null
      },
      configuration: {
        timeout: 240,
        retryOnFailure: true,
        maxRetries: 1,
        captureScreenshots: true,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      steps: [
        {
          id: 'step-001',
          order: 1,
          description: 'Login to Oracle Fusion Cloud',
          status: 'passed',
          duration: 30000
        },
        {
          id: 'step-002',
          order: 2,
          description: 'Navigate to Inventory Management → Transfers',
          status: 'passed',
          duration: 22000
        },
        {
          id: 'step-003',
          order: 3,
          description: 'Create new transfer request',
          status: 'running',
          duration: null
        },
        {
          id: 'step-004',
          order: 4,
          description: 'Select source and destination warehouses',
          status: 'pending',
          duration: null
        },
        {
          id: 'step-005',
          order: 5,
          description: 'Add items and quantities',
          status: 'pending',
          duration: null
        },
        {
          id: 'step-006',
          order: 6,
          description: 'Submit and verify transfer status',
          status: 'pending',
          duration: null
        }
      ]
    }
  ],

  // ===== EXECUTIONS (Detailed run data with sub-steps) =====
  executions: [
    {
      id: 'exec-001',
      scenarioId: 'scenario-001',
      scenarioObjective: 'Verify that Supply Plans are correctly configured and can be opened',
      status: 'passed',
      startTime: '2026-01-22T14:30:00Z',
      endTime: '2026-01-22T14:34:05Z',
      duration: 245000,
      progress: {
        currentStep: 7,
        totalSteps: 7,
        percentage: 100
      },
      metadata: {
        executedBy: 'admin@trinamix.com',
        environment: 'production',
        triggeredBy: 'manual',
        browser: 'chrome'
      },
      // Steps with their sub-steps (browser actions) - FULL EXECUTION DETAILS
      stepResults: [
        {
          stepId: 'step-001',
          stepOrder: 1,
          stepDescription: 'Login to Oracle Fusion Cloud',
          status: 'passed',
          duration: 35000,
          startTime: '2026-01-22T14:30:00Z',
          endTime: '2026-01-22T14:30:35Z',
          // Sub-steps from browser_use API with FULL execution details
          subSteps: [
            {
              id: 'substep-001-1',
              order: 1,
              stepNumber: 1,
              action: 'go_to_url',
              description: 'Navigate to Oracle Fusion login page',
              status: 'success',
              duration: 8000,
              timestamp: '2026-01-22T14:30:00Z',
              // Agent action details
              agentAction: {
                type: 'go_to_url',
                parameters: { url: 'https://fa-xxxx.oraclecloud.com' },
                evaluation: 'Successfully loaded Oracle Fusion Cloud login page. Login form is visible and ready for input.',
                nextGoal: 'Enter username credentials in the login form',
                memory: 'Arrived at Oracle Fusion Cloud login page. The page has loaded completely with the login form visible.'
              },
              // Result details
              result: {
                success: true,
                extractedContent: 'Oracle Fusion Cloud login page loaded successfully',
                error: null,
                isDone: false
              },
              // Browser state
              browserState: {
                url: 'https://fa-xxxx.oraclecloud.com',
                title: 'Sign In - Oracle Applications',
                timestamp: '2026-01-22T14:30:08Z'
              },
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23f0f0f0" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666">Oracle Login Page</text></svg>'
            },
            {
              id: 'substep-001-2',
              order: 2,
              stepNumber: 2,
              action: 'input_text',
              description: 'Enter username in the login field',
              status: 'success',
              duration: 3000,
              timestamp: '2026-01-22T14:30:08Z',
              agentAction: {
                type: 'input_text',
                parameters: { selector: 'input#userid', value: '[MASKED]' },
                evaluation: 'Located username input field with ID userid. Field is visible and ready for interaction.',
                nextGoal: 'Enter password in the password field',
                memory: 'Username field filled successfully. Next step is to enter the password.'
              },
              result: {
                success: true,
                extractedContent: 'Username entered successfully',
                error: null,
                isDone: false
              },
              browserState: {
                url: 'https://fa-xxxx.oraclecloud.com',
                title: 'Sign In - Oracle Applications',
                timestamp: '2026-01-22T14:30:11Z'
              },
              screenshot: null
            },
            {
              id: 'substep-001-3',
              order: 3,
              stepNumber: 3,
              action: 'input_text',
              description: 'Enter password in the password field',
              status: 'success',
              duration: 2000,
              timestamp: '2026-01-22T14:30:11Z',
              agentAction: {
                type: 'input_text',
                parameters: { selector: 'input#password', value: '[MASKED]' },
                evaluation: 'Password field located and filled securely. Form is ready for submission.',
                nextGoal: 'Click the Sign In button to submit credentials',
                memory: 'Both username and password have been entered. Ready to submit the login form.'
              },
              result: {
                success: true,
                extractedContent: 'Password entered securely',
                error: null,
                isDone: false
              },
              browserState: {
                url: 'https://fa-xxxx.oraclecloud.com',
                title: 'Sign In - Oracle Applications',
                timestamp: '2026-01-22T14:30:13Z'
              },
              screenshot: null
            },
            {
              id: 'substep-001-4',
              order: 4,
              stepNumber: 4,
              action: 'click',
              description: 'Click Sign In button',
              status: 'success',
              duration: 12000,
              timestamp: '2026-01-22T14:30:13Z',
              agentAction: {
                type: 'click',
                parameters: { selector: 'button#signin' },
                evaluation: 'Sign In button clicked successfully. Waiting for authentication and page redirect.',
                nextGoal: 'Wait for home page to load after authentication',
                memory: 'Login form submitted. Authentication in progress.'
              },
              result: {
                success: true,
                extractedContent: 'Login form submitted, authenticating...',
                error: null,
                isDone: false
              },
              browserState: {
                url: 'https://fa-xxxx.oraclecloud.com/fscmUI/faces/FuseWelcome',
                title: 'Welcome - Oracle Applications',
                timestamp: '2026-01-22T14:30:25Z'
              },
              screenshot: null
            },
            {
              id: 'substep-001-5',
              order: 5,
              stepNumber: 5,
              action: 'wait_for_element',
              description: 'Wait for home page to load',
              status: 'success',
              duration: 10000,
              timestamp: '2026-01-22T14:30:25Z',
              agentAction: {
                type: 'wait_for_element',
                parameters: { selector: '.home-page-content', timeout: 15000 },
                evaluation: 'Home page loaded successfully. User is now authenticated and can access Oracle Fusion Cloud.',
                nextGoal: 'Navigate to Supply Chain Planning module',
                memory: 'Login completed successfully. Home page is displaying user dashboard and navigation options.'
              },
              result: {
                success: true,
                extractedContent: 'Home page loaded - user authenticated as admin@trinamix.com',
                error: null,
                isDone: false
              },
              browserState: {
                url: 'https://fa-xxxx.oraclecloud.com/fscmUI/faces/FuseWelcome',
                title: 'Home - Oracle Applications',
                timestamp: '2026-01-22T14:30:35Z'
              },
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23d4edda" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23155724">Oracle Home</text></svg>'
            }
          ]
        },
        {
          stepId: 'step-002',
          stepOrder: 2,
          stepDescription: 'Click Navigator (☰) → Supply Chain Planning → Supply Planning',
          status: 'passed',
          duration: 28000,
          startTime: '2026-01-22T14:30:35Z',
          endTime: '2026-01-22T14:31:03Z',
          subSteps: [
            {
              id: 'substep-002-1',
              order: 1,
              action: 'click',
              description: 'Click on Navigator hamburger menu (☰)',
              parameters: { selector: 'button.navigator-menu-button' },
              status: 'success',
              duration: 4000,
              timestamp: '2026-01-22T14:30:35Z',
              evaluation: 'Navigator menu opened',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e8f4f8" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666">Navigator Open</text></svg>'
            },
            {
              id: 'substep-002-2',
              order: 2,
              action: 'click',
              description: 'Click on "Supply Chain Planning" menu item',
              parameters: { selector: 'a[title="Supply Chain Planning"]' },
              status: 'success',
              duration: 6000,
              timestamp: '2026-01-22T14:30:39Z',
              evaluation: 'Supply Chain Planning submenu expanded',
              screenshot: null
            },
            {
              id: 'substep-002-3',
              order: 3,
              action: 'click',
              description: 'Click on "Supply Planning" option',
              parameters: { selector: 'a[title="Supply Planning"]' },
              status: 'success',
              duration: 8000,
              timestamp: '2026-01-22T14:30:45Z',
              evaluation: 'Navigating to Supply Planning module',
              screenshot: null
            },
            {
              id: 'substep-002-4',
              order: 4,
              action: 'wait_for_element',
              description: 'Wait for Supply Planning page to load',
              parameters: { selector: '.supply-planning-workspace', timeout: 15000 },
              status: 'success',
              duration: 10000,
              timestamp: '2026-01-22T14:30:53Z',
              evaluation: 'Supply Planning workspace loaded successfully',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23cce5ff" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23004085">Supply Planning</text></svg>'
            }
          ]
        },
        {
          stepId: 'step-003',
          stepOrder: 3,
          stepDescription: 'Click Tasks → Manage Plans',
          status: 'passed',
          duration: 18000,
          startTime: '2026-01-22T14:31:03Z',
          endTime: '2026-01-22T14:31:21Z',
          subSteps: [
            {
              id: 'substep-003-1',
              order: 1,
              action: 'click',
              description: 'Click on Tasks panel',
              parameters: { selector: 'button[title="Tasks"]' },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-22T14:31:03Z',
              evaluation: 'Tasks panel opened',
              screenshot: null
            },
            {
              id: 'substep-003-2',
              order: 2,
              action: 'click',
              description: 'Click on "Manage Plans" link',
              parameters: { selector: 'a[title="Manage Plans"]' },
              status: 'success',
              duration: 8000,
              timestamp: '2026-01-22T14:31:08Z',
              evaluation: 'Manage Plans selected',
              screenshot: null
            },
            {
              id: 'substep-003-3',
              order: 3,
              action: 'wait_for_element',
              description: 'Wait for Manage Plans page',
              parameters: { selector: '.manage-plans-container', timeout: 10000 },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-22T14:31:16Z',
              evaluation: 'Manage Plans page loaded with search form visible',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23fff3cd" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23856404">Manage Plans</text></svg>'
            }
          ]
        },
        {
          stepId: 'step-004',
          stepOrder: 4,
          stepDescription: 'Click Search',
          status: 'passed',
          duration: 12000,
          startTime: '2026-01-22T14:31:21Z',
          endTime: '2026-01-22T14:31:33Z',
          subSteps: [
            {
              id: 'substep-004-1',
              order: 1,
              action: 'click',
              description: 'Click the Search button',
              parameters: { selector: 'button[title="Search"]' },
              status: 'success',
              duration: 3000,
              timestamp: '2026-01-22T14:31:21Z',
              evaluation: 'Search button clicked',
              screenshot: null
            },
            {
              id: 'substep-004-2',
              order: 2,
              action: 'wait_for_element',
              description: 'Wait for search results panel',
              parameters: { selector: '.search-results-panel', timeout: 10000 },
              status: 'success',
              duration: 9000,
              timestamp: '2026-01-22T14:31:24Z',
              evaluation: 'Search results panel is now visible and ready for input',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e2e3e5" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23383d41">Search Panel</text></svg>'
            }
          ]
        },
        {
          stepId: 'step-005',
          stepOrder: 5,
          stepDescription: 'Enter the Plan Name in "Name" field: Alyasra ABP Base Plan & Verify plan exists',
          status: 'passed',
          duration: 25000,
          startTime: '2026-01-22T14:31:33Z',
          endTime: '2026-01-22T14:31:58Z',
          subSteps: [
            {
              id: 'substep-005-1',
              order: 1,
              action: 'input_text',
              description: 'Enter plan name in the Name field',
              parameters: { selector: 'input[name="planName"]', value: 'Alyasra ABP Base Plan' },
              status: 'success',
              duration: 4000,
              timestamp: '2026-01-22T14:31:33Z',
              evaluation: 'Plan name entered in search field',
              screenshot: null
            },
            {
              id: 'substep-005-2',
              order: 2,
              action: 'click',
              description: 'Click Search button to find the plan',
              parameters: { selector: 'button[title="Search"]' },
              status: 'success',
              duration: 3000,
              timestamp: '2026-01-22T14:31:37Z',
              evaluation: 'Search initiated',
              screenshot: null
            },
            {
              id: 'substep-005-3',
              order: 3,
              action: 'wait_for_element',
              description: 'Wait for search results to load',
              parameters: { selector: '.results-table tbody tr', timeout: 15000 },
              status: 'success',
              duration: 12000,
              timestamp: '2026-01-22T14:31:40Z',
              evaluation: 'Search results loaded',
              screenshot: null
            },
            {
              id: 'substep-005-4',
              order: 4,
              action: 'extract_content',
              description: 'Verify plan exists in search results',
              parameters: { selector: '.results-table tbody tr:first-child td:first-child' },
              status: 'success',
              duration: 6000,
              timestamp: '2026-01-22T14:31:52Z',
              evaluation: 'Found plan "Alyasra ABP Base Plan" in results - verification passed',
              extractedContent: 'Alyasra ABP Base Plan',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23d4edda" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23155724">Plan Found</text></svg>'
            }
          ]
        },
        {
          stepId: 'step-006',
          stepOrder: 6,
          stepDescription: 'Select the plan',
          status: 'passed',
          duration: 8000,
          startTime: '2026-01-22T14:31:58Z',
          endTime: '2026-01-22T14:32:06Z',
          subSteps: [
            {
              id: 'substep-006-1',
              order: 1,
              action: 'click',
              description: 'Click on the plan row to select it',
              parameters: { selector: '.results-table tbody tr:first-child' },
              status: 'success',
              duration: 3000,
              timestamp: '2026-01-22T14:31:58Z',
              evaluation: 'Plan row clicked',
              screenshot: null
            },
            {
              id: 'substep-006-2',
              order: 2,
              action: 'wait_for_element',
              description: 'Verify row is selected (highlighted)',
              parameters: { selector: '.results-table tbody tr.selected', timeout: 5000 },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-22T14:32:01Z',
              evaluation: 'Plan row is now selected and highlighted',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23cce5ff" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23004085">Plan Selected</text></svg>'
            }
          ]
        },
        {
          stepId: 'step-007',
          stepOrder: 7,
          stepDescription: 'Click Actions → Open',
          status: 'passed',
          duration: 22000,
          startTime: '2026-01-22T14:32:06Z',
          endTime: '2026-01-22T14:32:28Z',
          subSteps: [
            {
              id: 'substep-007-1',
              order: 1,
              action: 'click',
              description: 'Click on Actions menu button',
              parameters: { selector: 'button[title="Actions"]' },
              status: 'success',
              duration: 4000,
              timestamp: '2026-01-22T14:32:06Z',
              evaluation: 'Actions dropdown menu opened',
              screenshot: null
            },
            {
              id: 'substep-007-2',
              order: 2,
              action: 'click',
              description: 'Click on "Open" option from Actions menu',
              parameters: { selector: 'li[title="Open"]' },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-22T14:32:10Z',
              evaluation: 'Open action selected',
              screenshot: null
            },
            {
              id: 'substep-007-3',
              order: 3,
              action: 'wait_for_element',
              description: 'Wait for plan details page to load',
              parameters: { selector: '.plan-details-container', timeout: 15000 },
              status: 'success',
              duration: 13000,
              timestamp: '2026-01-22T14:32:15Z',
              evaluation: 'Plan opened successfully - details page loaded',
              screenshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23d4edda" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23155724">Plan Opened</text></svg>'
            }
          ]
        }
      ],
      logs: [
        { timestamp: '2026-01-22T14:30:00.000Z', level: 'info', message: 'Execution started for scenario: Verify Supply Plans configuration' },
        { timestamp: '2026-01-22T14:30:00.050Z', level: 'debug', message: 'Browser session initialized (Chrome)' },
        { timestamp: '2026-01-22T14:30:35.000Z', level: 'info', message: 'Step 1 completed: Login to Oracle Fusion Cloud' },
        { timestamp: '2026-01-22T14:31:03.000Z', level: 'info', message: 'Step 2 completed: Navigator → Supply Chain Planning → Supply Planning' },
        { timestamp: '2026-01-22T14:31:21.000Z', level: 'info', message: 'Step 3 completed: Tasks → Manage Plans' },
        { timestamp: '2026-01-22T14:31:33.000Z', level: 'info', message: 'Step 4 completed: Click Search' },
        { timestamp: '2026-01-22T14:31:58.000Z', level: 'info', message: 'Step 5 completed: Plan found - Alyasra ABP Base Plan' },
        { timestamp: '2026-01-22T14:32:06.000Z', level: 'info', message: 'Step 6 completed: Plan selected' },
        { timestamp: '2026-01-22T14:32:28.000Z', level: 'info', message: 'Step 7 completed: Plan opened successfully' },
        { timestamp: '2026-01-22T14:32:28.100Z', level: 'info', message: 'All steps completed successfully' },
        { timestamp: '2026-01-22T14:34:05.000Z', level: 'info', message: 'Execution finished - PASSED' }
      ]
    },
    {
      id: 'exec-002',
      scenarioId: 'scenario-002',
      scenarioObjective: 'Create and validate a new Purchase Order in Oracle ERP',
      status: 'failed',
      startTime: '2026-01-21T11:30:00Z',
      endTime: '2026-01-21T11:45:00Z',
      duration: 180000,
      progress: {
        currentStep: 4,
        totalSteps: 6,
        percentage: 67
      },
      metadata: {
        executedBy: 'admin@trinamix.com',
        environment: 'staging',
        triggeredBy: 'manual',
        browser: 'chrome'
      },
      stepResults: [
        {
          stepId: 'step-001',
          stepOrder: 1,
          stepDescription: 'Login to Oracle Fusion Cloud',
          status: 'passed',
          duration: 32000,
          startTime: '2026-01-21T11:30:00Z',
          endTime: '2026-01-21T11:30:32Z',
          subSteps: [
            {
              id: 'substep-001-1',
              order: 1,
              action: 'go_to_url',
              description: 'Navigate to Oracle Fusion login page',
              parameters: { url: 'https://fa-xxxx.oraclecloud.com' },
              status: 'success',
              duration: 8000,
              timestamp: '2026-01-21T11:30:00Z',
              evaluation: 'Login page loaded'
            },
            {
              id: 'substep-001-2',
              order: 2,
              action: 'input_text',
              description: 'Enter credentials and sign in',
              parameters: { selector: 'input#userid', value: '[MASKED]' },
              status: 'success',
              duration: 24000,
              timestamp: '2026-01-21T11:30:08Z',
              evaluation: 'Successfully authenticated'
            }
          ]
        },
        {
          stepId: 'step-002',
          stepOrder: 2,
          stepDescription: 'Navigate to Procurement → Purchase Orders',
          status: 'passed',
          duration: 25000,
          startTime: '2026-01-21T11:30:32Z',
          endTime: '2026-01-21T11:30:57Z',
          subSteps: [
            {
              id: 'substep-002-1',
              order: 1,
              action: 'click',
              description: 'Open Navigator menu',
              parameters: { selector: 'button.navigator-menu-button' },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-21T11:30:32Z',
              evaluation: 'Navigator opened'
            },
            {
              id: 'substep-002-2',
              order: 2,
              action: 'click',
              description: 'Navigate to Procurement → Purchase Orders',
              parameters: { selector: 'a[title="Purchase Orders"]' },
              status: 'success',
              duration: 20000,
              timestamp: '2026-01-21T11:30:37Z',
              evaluation: 'Purchase Orders page loaded'
            }
          ]
        },
        {
          stepId: 'step-003',
          stepOrder: 3,
          stepDescription: 'Click Create Purchase Order button',
          status: 'passed',
          duration: 15000,
          startTime: '2026-01-21T11:30:57Z',
          endTime: '2026-01-21T11:31:12Z',
          subSteps: [
            {
              id: 'substep-003-1',
              order: 1,
              action: 'click',
              description: 'Click Create button',
              parameters: { selector: 'button[title="Create"]' },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-21T11:30:57Z',
              evaluation: 'Create button clicked'
            },
            {
              id: 'substep-003-2',
              order: 2,
              action: 'wait_for_element',
              description: 'Wait for PO creation form',
              parameters: { selector: '.po-creation-form', timeout: 15000 },
              status: 'success',
              duration: 10000,
              timestamp: '2026-01-21T11:31:02Z',
              evaluation: 'PO creation form loaded'
            }
          ]
        },
        {
          stepId: 'step-004',
          stepOrder: 4,
          stepDescription: 'Fill in supplier details and line items',
          status: 'failed',
          duration: 45000,
          startTime: '2026-01-21T11:31:12Z',
          endTime: '2026-01-21T11:31:57Z',
          error: 'Supplier dropdown not populated - timeout waiting for elements',
          subSteps: [
            {
              id: 'substep-004-1',
              order: 1,
              action: 'click',
              description: 'Click on Supplier dropdown',
              parameters: { selector: 'select#supplierList' },
              status: 'success',
              duration: 5000,
              timestamp: '2026-01-21T11:31:12Z',
              evaluation: 'Supplier dropdown clicked'
            },
            {
              id: 'substep-004-2',
              order: 2,
              action: 'wait_for_element',
              description: 'Wait for supplier options to load',
              parameters: { selector: 'select#supplierList option', timeout: 30000 },
              status: 'failed',
              duration: 30000,
              timestamp: '2026-01-21T11:31:17Z',
              evaluation: 'FAILED: Timeout waiting for supplier dropdown options to populate',
              error: 'TimeoutError: Element not found within 30 seconds'
            },
            {
              id: 'substep-004-3',
              order: 3,
              action: 'input_text',
              description: 'Enter supplier name',
              parameters: { selector: 'input#supplierName', value: 'Acme Corp' },
              status: 'skipped',
              duration: 0,
              timestamp: '2026-01-21T11:31:47Z',
              evaluation: 'Skipped due to previous failure'
            }
          ]
        }
      ],
      logs: [
        { timestamp: '2026-01-21T11:30:00.000Z', level: 'info', message: 'Execution started for scenario: Create Purchase Order' },
        { timestamp: '2026-01-21T11:30:32.000Z', level: 'info', message: 'Step 1 completed: Login successful' },
        { timestamp: '2026-01-21T11:30:57.000Z', level: 'info', message: 'Step 2 completed: Navigated to Purchase Orders' },
        { timestamp: '2026-01-21T11:31:12.000Z', level: 'info', message: 'Step 3 completed: Create PO form opened' },
        { timestamp: '2026-01-21T11:31:47.000Z', level: 'error', message: 'Step 4 FAILED: Supplier dropdown timeout' },
        { timestamp: '2026-01-21T11:45:00.000Z', level: 'info', message: 'Execution finished - FAILED' }
      ]
    },
    {
      id: 'exec-003',
      scenarioId: 'scenario-003',
      scenarioObjective: 'Validate Inventory Transfer between warehouses',
      status: 'running',
      startTime: '2026-01-22T10:00:00Z',
      endTime: null,
      duration: null,
      progress: {
        currentStep: 3,
        totalSteps: 6,
        percentage: 50
      },
      metadata: {
        executedBy: 'admin@trinamix.com',
        environment: 'production',
        triggeredBy: 'scheduled',
        browser: 'chrome'
      },
      stepResults: [
        {
          stepId: 'step-001',
          stepOrder: 1,
          stepDescription: 'Login to Oracle Fusion Cloud',
          status: 'passed',
          duration: 30000,
          subSteps: [
            {
              id: 'substep-001-1',
              order: 1,
              action: 'go_to_url',
              description: 'Navigate to Oracle login',
              status: 'success',
              duration: 30000,
              evaluation: 'Login completed'
            }
          ]
        },
        {
          stepId: 'step-002',
          stepOrder: 2,
          stepDescription: 'Navigate to Inventory Management → Transfers',
          status: 'passed',
          duration: 22000,
          subSteps: [
            {
              id: 'substep-002-1',
              order: 1,
              action: 'click',
              description: 'Navigate to Inventory Transfers',
              status: 'success',
              duration: 22000,
              evaluation: 'Transfers page loaded'
            }
          ]
        },
        {
          stepId: 'step-003',
          stepOrder: 3,
          stepDescription: 'Create new transfer request',
          status: 'running',
          duration: null,
          subSteps: [
            {
              id: 'substep-003-1',
              order: 1,
              action: 'click',
              description: 'Click Create Transfer button',
              status: 'success',
              duration: 5000,
              evaluation: 'Create button clicked'
            },
            {
              id: 'substep-003-2',
              order: 2,
              action: 'wait_for_element',
              description: 'Waiting for transfer form to load...',
              status: 'running',
              duration: null,
              evaluation: 'In progress...'
            }
          ]
        }
      ],
      logs: [
        { timestamp: '2026-01-22T10:00:00.000Z', level: 'info', message: 'Scheduled execution started' },
        { timestamp: '2026-01-22T10:00:30.000Z', level: 'info', message: 'Step 1 completed: Login successful' },
        { timestamp: '2026-01-22T10:00:52.000Z', level: 'info', message: 'Step 2 completed: Navigated to Transfers' },
        { timestamp: '2026-01-22T10:00:57.000Z', level: 'info', message: 'Step 3 in progress: Creating transfer...' }
      ]
    }
  ],

  // Dashboard Stats
  stats: {
    totalScenarios: 3,
    passedScenarios: 1,
    failedScenarios: 1,
    runningScenarios: 1,
    totalExecutions: 3,
    passRate: 33,
    avgDuration: 202000,
    activeRuns: 1
  },

  // Recent Activity
  recentActivity: [
    { id: 1, type: 'execution', message: 'Inventory Transfer scenario started', timestamp: '2026-01-22T10:00:00Z' },
    { id: 2, type: 'success', message: 'Supply Plans verification completed', timestamp: '2026-01-22T14:34:05Z' },
    { id: 3, type: 'failure', message: 'Purchase Order creation failed', timestamp: '2026-01-21T11:45:00Z' }
  ]
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.MOCK_DATA = MOCK_DATA;
}
