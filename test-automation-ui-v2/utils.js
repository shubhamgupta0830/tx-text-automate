/**
 * Utility Functions for Test Automation UI v2
 */

const Utils = {
  // Format duration in milliseconds to human-readable string
  formatDuration: (ms) => {
    if (!ms && ms !== 0) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  },

  // Format date to relative time
  formatRelativeTime: (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  },

  // Format date to full date string
  formatDate: (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get status class for styling
  getStatusClass: (status) => {
    const statusMap = {
      'passed': 'success',
      'success': 'success',
      'failed': 'error',
      'error': 'error',
      'running': 'info',
      'in-progress': 'info',
      'pending': 'warning',
      'skipped': 'warning'
    };
    return statusMap[status?.toLowerCase()] || 'default';
  },

  // Get status icon
  getStatusIcon: (status) => {
    const iconMap = {
      'passed': 'fa-check-circle',
      'success': 'fa-check-circle',
      'failed': 'fa-times-circle',
      'error': 'fa-times-circle',
      'running': 'fa-spinner fa-spin',
      'in-progress': 'fa-spinner fa-spin',
      'pending': 'fa-clock',
      'skipped': 'fa-forward'
    };
    return iconMap[status?.toLowerCase()] || 'fa-question-circle';
  },

  // Get action type icon
  getActionIcon: (action) => {
    const actionMap = {
      'go_to_url': 'fa-globe',
      'click': 'fa-mouse-pointer',
      'input_text': 'fa-keyboard',
      'extract_content': 'fa-file-alt',
      'wait_for_element': 'fa-hourglass-half',
      'scroll': 'fa-arrows-alt-v',
      'screenshot': 'fa-camera'
    };
    return actionMap[action?.toLowerCase()] || 'fa-cog';
  },

  // Calculate progress percentage
  calculateProgress: (current, total) => {
    if (!total || total === 0) return 0;
    return Math.round((current / total) * 100);
  },

  // Truncate text
  truncateText: (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  },

  // Generate unique ID
  generateId: () => {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }
};

// ===== Browser Use API Service =====
const BrowserUseAPI = {
  // API Configuration
  API_KEY: 'bu_sq01V2GsXGttkJDhHj2xFpMtfsDkfGWWYh37fR6rSmY',
  BASE_URL: 'https://api.browser-use.com/api/v2',

  // Create headers for API requests
  getHeaders: () => ({
    'X-Browser-Use-API-Key': BrowserUseAPI.API_KEY,
    'Content-Type': 'application/json'
  }),

  /**
   * Create and start a new task
   * @param {string} task - The task prompt/instruction for the agent
   * @param {Object} options - Optional parameters
   * @returns {Promise<{id: string, sessionId: string}>}
   */
  createTask: async (task, options = {}) => {
    const payload = {
      task: task,
      llm: options.llm || 'gpt-4o',
      maxSteps: options.maxSteps || 50,
      highlightElements: options.highlightElements ?? true,
      vision: options.vision ?? true,
      ...(options.startUrl && { startUrl: options.startUrl }),
      ...(options.sessionId && { sessionId: options.sessionId }),
      ...(options.metadata && { metadata: options.metadata })
    };

    const response = await fetch(`${BrowserUseAPI.BASE_URL}/tasks`, {
      method: 'POST',
      headers: BrowserUseAPI.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to create task: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Get task details including status, progress, steps, and outputs
   * @param {string} taskId - The task UUID
   * @returns {Promise<Object>} Task details
   */
  getTask: async (taskId) => {
    const response = await fetch(`${BrowserUseAPI.BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: BrowserUseAPI.getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to get task: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Stop a running task
   * @param {string} taskId - The task UUID
   * @returns {Promise<Object>}
   */
  stopTask: async (taskId) => {
    const response = await fetch(`${BrowserUseAPI.BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: BrowserUseAPI.getHeaders(),
      body: JSON.stringify({ status: 'stopped' })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to stop task: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Poll task until completion
   * @param {string} taskId - The task UUID
   * @param {Function} onUpdate - Callback for status updates
   * @param {number} interval - Polling interval in ms
   * @param {number} timeout - Max wait time in ms
   * @returns {Promise<Object>} Final task result
   */
  pollTaskUntilComplete: async (taskId, onUpdate = null, interval = 2000, timeout = 600000) => {
    const startTime = Date.now();
    
    while (true) {
      const task = await BrowserUseAPI.getTask(taskId);
      
      if (onUpdate) {
        onUpdate(task);
      }
      
      // Check if task is complete (finished or stopped)
      if (task.status === 'finished' || task.status === 'stopped') {
        return task;
      }
      
      // Check timeout
      if (Date.now() - startTime > timeout) {
        throw new Error('Task polling timeout exceeded');
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  },

  /**
   * Transform Browser Use API steps to our sub-step format
   * @param {Array} apiSteps - Steps from Browser Use API
   * @param {string} executionId - Our execution ID
   * @param {number} stepIndex - Parent step index
   * @returns {Array} Transformed sub-steps
   */
  transformStepsToSubSteps: (apiSteps, executionId, stepIndex) => {
    if (!apiSteps || !Array.isArray(apiSteps)) return [];
    
    return apiSteps.map((step, subIndex) => {
      // Parse actions - they may come as strings or objects
      const actions = step.actions || [];
      const actionTypes = actions.map(action => {
        if (typeof action === 'string') {
          // Extract action type from string like "click(selector='...')"
          const match = action.match(/^(\w+)/);
          return match ? match[1] : 'unknown';
        }
        return action.type || 'unknown';
      });
      
      const primaryAction = actionTypes[0] || 'unknown';
      
      return {
        id: `${executionId}-substep-${String(stepIndex + 1).padStart(3, '0')}-${subIndex + 1}`,
        order: subIndex + 1,
        action: primaryAction,
        status: 'success', // API steps are completed
        duration: null, // API doesn't provide per-step duration
        agentAction: {
          type: primaryAction,
          parameters: {
            actions: actions,
            url: step.url
          },
          evaluation: step.evaluationPreviousGoal || null,
          memory: step.memory || null,
          nextGoal: step.nextGoal || null
        },
        result: {
          success: true,
          extractedContent: null,
          error: null,
          isDone: false
        },
        browserState: {
          url: step.url || null,
          title: null,
          timestamp: new Date().toISOString()
        },
        screenshot: step.screenshotUrl || null
      };
    });
  },

  /**
   * Transform complete task result to our execution format
   * @param {Object} taskResult - Complete task from Browser Use API
   * @param {Object} scenario - Our scenario object
   * @param {string} executionId - Our execution ID
   * @returns {Object} Transformed execution data
   */
  transformTaskToExecution: (taskResult, scenario, executionId) => {
    const startTime = taskResult.startedAt || taskResult.createdAt;
    const endTime = taskResult.finishedAt || new Date().toISOString();
    const duration = startTime && endTime 
      ? new Date(endTime).getTime() - new Date(startTime).getTime() 
      : null;
    
    // Determine overall status
    let status = 'pending';
    if (taskResult.status === 'finished') {
      status = taskResult.isSuccess || taskResult.judgeVerdict ? 'passed' : 'failed';
    } else if (taskResult.status === 'stopped') {
      status = 'failed';
    } else if (taskResult.status === 'started') {
      status = 'running';
    }
    
    // Transform API steps to our step results
    const stepResults = scenario.steps.map((step, index) => {
      // Distribute API steps across our scenario steps
      const apiSteps = taskResult.steps || [];
      const stepsPerScenarioStep = Math.ceil(apiSteps.length / scenario.steps.length);
      const startIdx = index * stepsPerScenarioStep;
      const endIdx = Math.min(startIdx + stepsPerScenarioStep, apiSteps.length);
      const relevantSteps = apiSteps.slice(startIdx, endIdx);
      
      const subSteps = BrowserUseAPI.transformStepsToSubSteps(
        relevantSteps, 
        executionId, 
        index
      );
      
      const stepStatus = subSteps.length > 0 ? 'passed' : (status === 'running' ? 'pending' : status);
      
      return {
        stepId: step.id,
        status: stepStatus,
        startTime: startTime,
        endTime: relevantSteps.length > 0 ? endTime : null,
        duration: relevantSteps.length > 0 ? Math.round(duration / scenario.steps.length) : null,
        subSteps: subSteps
      };
    });
    
    const completedSteps = stepResults.filter(sr => sr.status === 'passed').length;
    
    return {
      id: executionId,
      scenarioId: scenario.id,
      scenarioObjective: scenario.objective,
      status: status,
      startTime: startTime,
      endTime: taskResult.status === 'finished' || taskResult.status === 'stopped' ? endTime : null,
      duration: duration,
      progress: {
        currentStep: completedSteps,
        totalSteps: scenario.steps.length,
        percentage: Math.round((completedSteps / scenario.steps.length) * 100)
      },
      metadata: {
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080,
        triggeredBy: 'manual',
        browserUseTaskId: taskResult.id,
        browserUseSessionId: taskResult.sessionId,
        llm: taskResult.llm,
        browserUseVersion: taskResult.browserUseVersion
      },
      stepResults: stepResults,
      logs: [
        {
          timestamp: startTime,
          level: 'info',
          message: `Task started with Browser Use API (Task ID: ${taskResult.id})`
        },
        ...(taskResult.output ? [{
          timestamp: endTime,
          level: taskResult.isSuccess ? 'success' : 'error',
          message: `Task output: ${taskResult.output}`
        }] : []),
        ...(taskResult.judgement ? [{
          timestamp: endTime,
          level: 'info',
          message: `Judge verdict: ${taskResult.judgeVerdict ? 'Passed' : 'Failed'} - ${taskResult.judgement}`
        }] : [])
      ],
      output: taskResult.output,
      judgement: taskResult.judgement,
      judgeVerdict: taskResult.judgeVerdict,
      // Store raw API response for the Raw View
      rawApiResponse: {
        id: taskResult.id,
        sessionId: taskResult.sessionId,
        llm: taskResult.llm,
        task: taskResult.task,
        status: taskResult.status,
        createdAt: taskResult.createdAt,
        startedAt: taskResult.startedAt,
        finishedAt: taskResult.finishedAt,
        steps: taskResult.steps || [],
        outputFiles: taskResult.outputFiles || [],
        output: taskResult.output,
        browserUseVersion: taskResult.browserUseVersion,
        isSuccess: taskResult.isSuccess,
        judgement: taskResult.judgement,
        judgeVerdict: taskResult.judgeVerdict
      }
    };
  }
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.Utils = Utils;
  window.BrowserUseAPI = BrowserUseAPI;
}
