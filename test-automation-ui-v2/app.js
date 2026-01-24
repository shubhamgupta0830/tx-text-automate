/**
 * Test Automation UI v2 - Main React Application
 * 
 * HIERARCHY:
 * - Scenario/Objective (Top Level)
 *   - Steps (User-defined)
 *     - Sub-steps (Browser Actions from browser_use API)
 */

const { useState, useEffect, useMemo, useCallback } = React;

// ===== Sidebar Component =====
const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <i className="fas fa-robot"></i>
        </div>
        <span className="sidebar-logo-text">Trinamix</span>
        <span className="version-badge">v2</span>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <a 
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </a>
          <a 
            className={`nav-item ${activePage === 'scenarios' ? 'active' : ''}`}
            onClick={() => onNavigate('scenarios')}
          >
            <i className="fas fa-bullseye"></i>
            Scenarios
          </a>
          <a 
            className={`nav-item ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
          >
            <i className="fas fa-history"></i>
            Run History
            <span className="nav-item-badge">{MOCK_DATA.stats.activeRuns}</span>
          </a>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Actions</div>
          <a className="nav-item" onClick={() => onNavigate('create-scenario')}>
            <i className="fas fa-plus-circle"></i>
            New Scenario
          </a>
          <a className="nav-item">
            <i className="fas fa-calendar"></i>
            Schedules
          </a>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Settings</div>
          <a className="nav-item">
            <i className="fas fa-cog"></i>
            Configuration
          </a>
        </div>
      </nav>
      
      {/* Hierarchy Legend */}
      <div className="hierarchy-legend">
        <div className="legend-title">Hierarchy</div>
        <div className="legend-item">
          <i className="fas fa-bullseye"></i>
          <span>Objective/Scenario</span>
        </div>
        <div className="legend-item level-1">
          <i className="fas fa-list-ol"></i>
          <span>Steps (User Input)</span>
        </div>
        <div className="legend-item level-2">
          <i className="fas fa-cogs"></i>
          <span>Sub-steps (Browser)</span>
        </div>
      </div>
    </aside>
  );
};

// ===== Header Component =====
const Header = ({ breadcrumb }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {index === breadcrumb.length - 1 ? (
                <span className="breadcrumb-current">{item}</span>
              ) : (
                <a href="#">{item}</a>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="header-right">
        <div className="search-bar">
          <i className="fas fa-search" style={{color: 'var(--text-tertiary)'}}></i>
          <input type="text" placeholder="Search scenarios, executions..." />
        </div>
        
        <button className="icon-button">
          <i className="fas fa-bell"></i>
        </button>
        
        <div className="user-avatar">TM</div>
      </div>
    </header>
  );
};

// ===== Stats Card Component =====
const StatCard = ({ icon, iconColor, label, value, trend, trendDirection }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${iconColor}`}>
          <i className={`fas ${icon}`}></i>
        </div>
        {trend && (
          <div className={`stat-card-trend ${trendDirection}`}>
            <i className={`fas fa-arrow-${trendDirection}`}></i>
            {trend}%
          </div>
        )}
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
};

// ===== Status Badge Component =====
const StatusBadge = ({ status }) => {
  const statusClass = Utils.getStatusClass(status);
  return (
    <span className={`status-badge ${statusClass}`}>
      <span className="status-dot"></span>
      {status}
    </span>
  );
};

// ===== Progress Bar Component =====
const ProgressBar = ({ percentage, status }) => {
  const statusClass = Utils.getStatusClass(status);
  return (
    <div className="progress-bar-container">
      <div 
        className={`progress-bar-fill ${statusClass}`} 
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="progress-bar-text">{percentage}%</span>
    </div>
  );
};

// ===== Sub-Step Item Component (Browser Actions) - FULL EXECUTION DETAILS =====
const SubStepItem = ({ subStep, isLast, isExpanded, onToggle }) => {
  const actionIcon = Utils.getActionIcon(subStep.action || subStep.agentAction?.type);
  const statusIcon = Utils.getStatusIcon(subStep.status);
  const statusClass = Utils.getStatusClass(subStep.status);
  const [showDetails, setShowDetails] = useState(isExpanded || false);
  
  // Get data from either new format (agentAction/result/browserState) or old format
  const agentAction = subStep.agentAction || {
    type: subStep.action,
    parameters: subStep.parameters,
    evaluation: subStep.evaluation,
    nextGoal: null,
    memory: null
  };
  const result = subStep.result || {
    success: subStep.status === 'success',
    extractedContent: subStep.extractedContent,
    error: subStep.error,
    isDone: false
  };
  const browserState = subStep.browserState || null;
  
  return (
    <div className={`substep-item ${statusClass} ${showDetails ? 'expanded' : ''}`}>
      <div className="substep-connector">
        <div className="substep-line-top"></div>
        <div className={`substep-dot ${statusClass}`}>
          <i className={`fas ${actionIcon}`}></i>
        </div>
        {!isLast && <div className="substep-line-bottom"></div>}
      </div>
      
      <div className="substep-content">
        <div className="substep-header" onClick={() => setShowDetails(!showDetails)}>
          <div className="substep-header-left">
            <span className="substep-order">#{subStep.order || subStep.stepNumber}</span>
            <span className="substep-action-type">{(subStep.action || agentAction.type)?.replace(/_/g, ' ')}</span>
          </div>
          <div className="substep-meta">
            {subStep.duration && (
              <span className="substep-duration">
                <i className="fas fa-clock"></i>
                {Utils.formatDuration(subStep.duration)}
              </span>
            )}
            <span className={`substep-status ${statusClass}`}>
              <i className={`fas ${statusIcon}`}></i>
            </span>
            <button className="substep-expand-btn">
              <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        
        <p className="substep-description">{subStep.description}</p>
        
        {/* Agent Evaluation (always shown) */}
        {(subStep.evaluation || agentAction.evaluation) && (
          <div className={`substep-evaluation ${statusClass}`}>
            <i className="fas fa-robot"></i>
            <span>{subStep.evaluation || agentAction.evaluation}</span>
          </div>
        )}
        
        {/* Expanded Details Panel */}
        {showDetails && (
          <div className="substep-details-panel">
            {/* Action Details */}
            <div className="detail-section">
              <div className="detail-section-header">
                <i className="fas fa-mouse-pointer"></i>
                <span>Action Taken</span>
              </div>
              <div className="detail-section-content">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <code className="detail-value action-type">{agentAction.type}</code>
                </div>
                {agentAction.parameters && (
                  <div className="detail-row">
                    <span className="detail-label">Parameters:</span>
                    <code className="detail-value parameters">
                      {JSON.stringify(agentAction.parameters, null, 2)}
                    </code>
                  </div>
                )}
              </div>
            </div>
            
            {/* Result */}
            <div className="detail-section">
              <div className="detail-section-header">
                <i className={`fas ${result.success ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Result</span>
                <span className={`result-badge ${result.success ? 'success' : 'error'}`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <div className="detail-section-content">
                {result.extractedContent && (
                  <div className="detail-row">
                    <span className="detail-label">Extracted Content:</span>
                    <code className="detail-value extracted">{result.extractedContent}</code>
                  </div>
                )}
                {result.error && (
                  <div className="detail-row error">
                    <span className="detail-label">Error:</span>
                    <span className="detail-value error-text">{result.error}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Browser State */}
            {browserState && (
              <div className="detail-section">
                <div className="detail-section-header">
                  <i className="fas fa-globe"></i>
                  <span>Browser State</span>
                </div>
                <div className="detail-section-content">
                  <div className="detail-row">
                    <span className="detail-label">URL:</span>
                    <a href={browserState.url} className="detail-value url" target="_blank" rel="noopener noreferrer">
                      {browserState.url}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{browserState.title}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Agent Memory */}
            {agentAction.memory && (
              <div className="detail-section">
                <div className="detail-section-header">
                  <i className="fas fa-brain"></i>
                  <span>Agent Memory</span>
                </div>
                <div className="detail-section-content">
                  <p className="memory-text">{agentAction.memory}</p>
                </div>
              </div>
            )}
            
            {/* Next Goal */}
            {agentAction.nextGoal && (
              <div className="detail-section">
                <div className="detail-section-header">
                  <i className="fas fa-arrow-right"></i>
                  <span>Next Goal</span>
                </div>
                <div className="detail-section-content">
                  <p className="next-goal-text">{agentAction.nextGoal}</p>
                </div>
              </div>
            )}
            
            {/* Screenshot */}
            {subStep.screenshot && (
              <div className="detail-section">
                <div className="detail-section-header">
                  <i className="fas fa-camera"></i>
                  <span>Screenshot</span>
                </div>
                <div className="detail-section-content screenshot-container">
                  <img 
                    src={subStep.screenshot} 
                    alt={`Screenshot for step ${subStep.order}`}
                    className="substep-screenshot"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Error display (always visible if error) */}
        {(subStep.error || result.error) && !showDetails && (
          <div className="substep-error">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{subStep.error || result.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Step Item Component (User-defined Steps) - WITH FULL DETAILS =====
const StepItem = ({ step, stepResult, isExpanded, onToggle, executionId, onViewStepDetail }) => {
  const statusIcon = Utils.getStatusIcon(step.status);
  const statusClass = Utils.getStatusClass(step.status);
  const subSteps = stepResult?.subSteps || [];
  const [activeSubStep, setActiveSubStep] = useState(null);
  
  // Get all screenshots from sub-steps
  const screenshots = subSteps
    .filter(ss => ss.screenshot)
    .map(ss => ({
      subStepOrder: ss.order || ss.stepNumber,
      screenshot: ss.screenshot,
      description: ss.description
    }));
  
  // Handler to view step detail (internal navigation)
  const handleViewStepDetail = (e) => {
    e.stopPropagation(); // Prevent triggering the expand/collapse
    if (onViewStepDetail) {
      onViewStepDetail(executionId, step.id);
    }
  };
  
  return (
    <div className={`step-item ${statusClass} ${isExpanded ? 'expanded' : ''}`}>
      <div className="step-header" onClick={onToggle}>
        <div className="step-indicator">
          <div className={`step-number ${statusClass}`}>
            <i className={`fas ${statusIcon}`}></i>
          </div>
          <div className="step-order">Step {step.order}</div>
        </div>
        
        <div className="step-info">
          <p className="step-description">{step.description}</p>
          <div className="step-meta">
            {step.duration && (
              <span className="step-duration">
                <i className="fas fa-clock"></i>
                {Utils.formatDuration(step.duration)}
              </span>
            )}
            {subSteps.length > 0 && (
              <span className="step-substeps-count">
                <i className="fas fa-cogs"></i>
                {subSteps.length} browser actions
              </span>
            )}
            {screenshots.length > 0 && (
              <span className="step-screenshots-count">
                <i className="fas fa-camera"></i>
                {screenshots.length} screenshots
              </span>
            )}
          </div>
        </div>
        
        <div className="step-actions">
          <StatusBadge status={step.status} />
          {/* View Details Button - Opens step detail view within same page */}
          {executionId && subSteps.length > 0 && (
            <button 
              className="btn btn-primary btn-sm view-detail-btn"
              onClick={handleViewStepDetail}
              title="View step execution details"
            >
              <i className="fas fa-eye"></i>
              View Details
            </button>
          )}
          {subSteps.length > 0 && (
            <button className="expand-btn">
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          )}
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="step-expanded-content">
          {/* Screenshots Gallery (if any) */}
          {screenshots.length > 0 && (
            <div className="step-screenshots-gallery">
              <div className="screenshots-header">
                <i className="fas fa-images"></i>
                <span>Screenshots ({screenshots.length})</span>
              </div>
              <div className="screenshots-grid">
                {screenshots.map((ss, idx) => (
                  <div key={idx} className="screenshot-thumb">
                    <img src={ss.screenshot} alt={ss.description} />
                    <div className="screenshot-label">Sub-step #{ss.subStepOrder}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sub-steps Panel (Browser Actions) */}
          {subSteps.length > 0 && (
            <div className="substeps-panel">
              <div className="substeps-header">
                <i className="fas fa-cogs"></i>
                <span>Browser Actions (from browser_use API)</span>
                <span className="substeps-count-badge">{subSteps.length}</span>
              </div>
              <div className="substeps-list">
                {subSteps.map((subStep, index) => (
                  <SubStepItem 
                    key={subStep.id} 
                    subStep={subStep} 
                    isLast={index === subSteps.length - 1}
                    isExpanded={activeSubStep === subStep.id}
                    onToggle={() => setActiveSubStep(activeSubStep === subStep.id ? null : subStep.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Error display */}
      {step.error && (
        <div className="step-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{step.error}</span>
        </div>
      )}
    </div>
  );
};

// ===== Scenario Card Component =====
const ScenarioCard = ({ scenario, onClick, onDelete }) => {
  const statusIcon = Utils.getStatusIcon(scenario.status);
  const statusClass = Utils.getStatusClass(scenario.status);
  const stepsSummary = scenario.steps?.reduce((acc, step) => {
    acc[step.status] = (acc[step.status] || 0) + 1;
    return acc;
  }, {});
  
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onDelete && confirm(`Are you sure you want to delete the scenario "${scenario.objective}"?`)) {
      onDelete(scenario.id);
    }
  };
  
  return (
    <div className="scenario-card" onClick={() => onClick(scenario.id)}>
      <div className="scenario-card-header">
        <div className={`scenario-status-icon ${statusClass}`}>
          <i className={`fas ${statusIcon}`}></i>
        </div>
        <div className="scenario-card-actions">
          <div className="scenario-tags">
            {scenario.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          {onDelete && (
            <button 
              className="delete-btn" 
              onClick={handleDelete}
              title="Delete scenario"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </div>
      </div>
      
      <h3 className="scenario-objective">{scenario.objective}</h3>
      <p className="scenario-description">{scenario.description}</p>
      
      <div className="scenario-steps-summary">
        <div className="steps-bar">
          {scenario.steps?.map((step, i) => (
            <div 
              key={i} 
              className={`step-segment ${Utils.getStatusClass(step.status)}`}
              title={`Step ${step.order}: ${step.description}`}
            ></div>
          ))}
        </div>
        <span className="steps-count">{scenario.steps?.length || 0} steps</span>
      </div>
      
      <div className="scenario-card-footer">
        {scenario.lastRun && (
          <span className="last-run">
            <i className="fas fa-clock"></i>
            {Utils.formatRelativeTime(scenario.lastRun.date)}
          </span>
        )}
        {scenario.lastRun?.duration && (
          <span className="duration">
            <i className="fas fa-stopwatch"></i>
            {Utils.formatDuration(scenario.lastRun.duration)}
          </span>
        )}
      </div>
    </div>
  );
};

// ===== Dashboard Page =====
const Dashboard = ({ onNavigate, onViewScenario, onViewExecution }) => {
  const { stats, scenarios, executions, recentActivity } = MOCK_DATA;
  
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your test automation scenarios</p>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon="fa-bullseye" 
          iconColor="blue" 
          label="Total Scenarios" 
          value={stats.totalScenarios}
        />
        <StatCard 
          icon="fa-check-circle" 
          iconColor="green" 
          label="Passed" 
          value={stats.passedScenarios}
        />
        <StatCard 
          icon="fa-times-circle" 
          iconColor="red" 
          label="Failed" 
          value={stats.failedScenarios}
        />
        <StatCard 
          icon="fa-spinner" 
          iconColor="orange" 
          label="Running" 
          value={stats.runningScenarios}
        />
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions mb-4">
        <div className="quick-action" onClick={() => onNavigate('create-scenario')}>
          <div className="quick-action-icon blue">
            <i className="fas fa-plus"></i>
          </div>
          <span className="quick-action-label">New Scenario</span>
        </div>
        <div className="quick-action" onClick={() => onNavigate('scenarios')}>
          <div className="quick-action-icon green">
            <i className="fas fa-play"></i>
          </div>
          <span className="quick-action-label">Run Scenario</span>
        </div>
        <div className="quick-action" onClick={() => onNavigate('history')}>
          <div className="quick-action-icon purple">
            <i className="fas fa-history"></i>
          </div>
          <span className="quick-action-label">View History</span>
        </div>
      </div>
      
      {/* Scenarios Grid */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-bullseye"></i>
            Scenarios (Objectives)
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('scenarios')}>
            View All
          </button>
        </div>
        <div className="scenarios-grid">
          {scenarios.map(scenario => (
            <ScenarioCard 
              key={scenario.id} 
              scenario={scenario} 
              onClick={onViewScenario}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Executions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-history"></i>
            Recent Executions
          </h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Scenario Objective</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Duration</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {executions.map(exec => (
                <tr 
                  key={exec.id} 
                  className="clickable-row"
                  onClick={() => onViewExecution(exec.id)}
                >
                  <td>
                    <div className="objective-cell">
                      <i className="fas fa-bullseye"></i>
                      {Utils.truncateText(exec.scenarioObjective, 60)}
                    </div>
                  </td>
                  <td><StatusBadge status={exec.status} /></td>
                  <td>
                    <ProgressBar 
                      percentage={exec.progress.percentage} 
                      status={exec.status}
                    />
                  </td>
                  <td>{Utils.formatDuration(exec.duration)}</td>
                  <td>{Utils.formatRelativeTime(exec.startTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ===== Scenarios List Page =====
const ScenariosPage = ({ onViewScenario, onNavigate, onDeleteScenario }) => {
  const { scenarios } = MOCK_DATA;
  const [filter, setFilter] = useState('all');
  
  const filteredScenarios = useMemo(() => {
    if (filter === 'all') return scenarios;
    return scenarios.filter(s => s.status === filter);
  }, [scenarios, filter]);
  
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Scenarios</h1>
          <p className="page-subtitle">All test automation objectives</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('create-scenario')}>
          <i className="fas fa-plus"></i>
          New Scenario
        </button>
      </div>
      
      {/* Filters */}
      <div className="filters-bar mb-4">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({scenarios.length})
        </button>
        <button 
          className={`filter-btn success ${filter === 'passed' ? 'active' : ''}`}
          onClick={() => setFilter('passed')}
        >
          Passed ({scenarios.filter(s => s.status === 'passed').length})
        </button>
        <button 
          className={`filter-btn error ${filter === 'failed' ? 'active' : ''}`}
          onClick={() => setFilter('failed')}
        >
          Failed ({scenarios.filter(s => s.status === 'failed').length})
        </button>
        <button 
          className={`filter-btn info ${filter === 'running' ? 'active' : ''}`}
          onClick={() => setFilter('running')}
        >
          Running ({scenarios.filter(s => s.status === 'running').length})
        </button>
      </div>
      
      {/* Scenarios Grid */}
      <div className="scenarios-grid">
        {filteredScenarios.map(scenario => (
          <ScenarioCard 
            key={scenario.id} 
            scenario={scenario} 
            onClick={onViewScenario}
            onDelete={onDeleteScenario}
          />
        ))}
      </div>
    </div>
  );
};

// ===== Scenario Detail Page =====
const ScenarioDetailPage = ({ scenarioId, onBack, onViewExecution, onViewStepDetail }) => {
  const scenario = MOCK_DATA.scenarios.find(s => s.id === scenarioId);
  const execution = MOCK_DATA.executions.find(e => e.scenarioId === scenarioId);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState(null);
  const [, forceUpdate] = useState(0);
  
  if (!scenario) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Scenario not found</h3>
          <button className="btn btn-secondary" onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }
  
  // Function to run the scenario via Browser Use API
  const handleRunScenario = async () => {
    setIsRunning(true);
    setRunStatus('Creating task with Browser Use API...');
    
    const newExecutionId = `exec-run-${Date.now()}`;
    const currentTime = new Date().toISOString();
    
    try {
      // Build the task prompt from objective and steps
      const stepsText = scenario.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n');
      const taskPrompt = `Objective: ${scenario.objective}\n\nSteps to execute:\n${stepsText}`;
      
      // Create initial execution entry
      const initialExecution = {
        id: newExecutionId,
        scenarioId: scenario.id,
        scenarioObjective: scenario.objective,
        status: 'running',
        startTime: currentTime,
        endTime: null,
        duration: null,
        progress: {
          currentStep: 0,
          totalSteps: scenario.steps.length,
          percentage: 0
        },
        metadata: {
          browser: 'chrome',
          viewportWidth: 1920,
          viewportHeight: 1080,
          triggeredBy: 'manual'
        },
        stepResults: scenario.steps.map(step => ({
          stepId: step.id,
          status: 'running',
          startTime: currentTime,
          endTime: null,
          duration: null,
          subSteps: []
        })),
        logs: [{
          timestamp: currentTime,
          level: 'info',
          message: 'Starting Browser Use API task execution...'
        }]
      };
      
      // Add to executions
      MOCK_DATA.executions.unshift(initialExecution);
      
      // Update scenario status
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = 'running';
        MOCK_DATA.scenarios[scenarioIndex].lastRun = {
          executionId: newExecutionId,
          status: 'running',
          date: currentTime,
          duration: 0
        };
      }
      
      MOCK_DATA.stats.runningScenarios += 1;
      forceUpdate(n => n + 1);
      
      // Create the task
      const createResult = await BrowserUseAPI.createTask(taskPrompt, {
        maxSteps: Math.max(50, scenario.steps.length * 10),
        highlightElements: true,
        vision: true,
        metadata: {
          scenarioId: scenario.id,
          executionId: newExecutionId
        }
      });
      
      setRunStatus(`Task created (ID: ${createResult.id}). Executing...`);
      
      // Update execution with task ID
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].metadata.browserUseTaskId = createResult.id;
        MOCK_DATA.executions[execIndex].metadata.browserUseSessionId = createResult.sessionId;
      }
      
      // Poll for completion with progress updates
      const finalResult = await BrowserUseAPI.pollTaskUntilComplete(
        createResult.id,
        (taskUpdate) => {
          const stepCount = taskUpdate.steps?.length || 0;
          setRunStatus(`Executing... (${stepCount} browser actions completed)`);
          
          // Update the execution in MOCK_DATA with live progress
          const execIdx = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
          if (execIdx >= 0) {
            const updatedExecution = BrowserUseAPI.transformTaskToExecution(
              taskUpdate, 
              scenario, 
              newExecutionId
            );
            MOCK_DATA.executions[execIdx] = updatedExecution;
            forceUpdate(n => n + 1);
          }
        },
        2000,
        600000
      );
      
      // Transform final result
      const finalExecution = BrowserUseAPI.transformTaskToExecution(
        finalResult, 
        scenario, 
        newExecutionId
      );
      
      // Update MOCK_DATA with final result
      const finalExecIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
      if (finalExecIndex >= 0) {
        MOCK_DATA.executions[finalExecIndex] = finalExecution;
      }
      
      // Update scenario status
      const finalScenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
      if (finalScenarioIndex >= 0) {
        MOCK_DATA.scenarios[finalScenarioIndex].status = finalExecution.status;
        MOCK_DATA.scenarios[finalScenarioIndex].lastRun = {
          executionId: newExecutionId,
          status: finalExecution.status,
          date: finalExecution.endTime || new Date().toISOString(),
          duration: finalExecution.duration || 0
        };
        
        MOCK_DATA.scenarios[finalScenarioIndex].steps = MOCK_DATA.scenarios[finalScenarioIndex].steps.map((step, i) => ({
          ...step,
          status: finalExecution.stepResults[i]?.status || step.status,
          duration: finalExecution.stepResults[i]?.duration || step.duration,
          endTime: finalExecution.stepResults[i]?.endTime || step.endTime
        }));
      }
      
      // Update stats
      MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
      if (finalExecution.status === 'passed') {
        MOCK_DATA.stats.passedScenarios += 1;
      } else if (finalExecution.status === 'failed') {
        MOCK_DATA.stats.failedScenarios += 1;
      }
      
      setIsRunning(false);
      setRunStatus(null);
      forceUpdate(n => n + 1);
      
      const statusEmoji = finalExecution.status === 'passed' ? '✅' : '❌';
      alert(`${statusEmoji} Scenario execution complete!\n\nStatus: ${finalExecution.status.toUpperCase()}\nSteps: ${finalResult.steps?.length || 0} browser actions\n${finalResult.output ? `\nOutput: ${finalResult.output}` : ''}`);
      
    } catch (error) {
      console.error('Browser Use API error:', error);
      
      // Update execution status to failed
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].status = 'failed';
        MOCK_DATA.executions[execIndex].endTime = new Date().toISOString();
        MOCK_DATA.executions[execIndex].logs.push({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `Browser Use API error: ${error.message}`
        });
      }
      
      // Update scenario status
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = 'failed';
        MOCK_DATA.scenarios[scenarioIndex].lastRun = {
          executionId: newExecutionId,
          status: 'failed',
          date: new Date().toISOString(),
          duration: 0
        };
      }
      
      MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
      MOCK_DATA.stats.failedScenarios += 1;
      
      setIsRunning(false);
      setRunStatus(null);
      forceUpdate(n => n + 1);
      
      alert(`❌ Error executing scenario: ${error.message}`);
    }
  };
  
  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };
  
  const expandAll = () => {
    const allExpanded = {};
    scenario.steps.forEach(step => {
      allExpanded[step.id] = true;
    });
    setExpandedSteps(allExpanded);
  };
  
  const collapseAll = () => {
    setExpandedSteps({});
  };
  
  const getStepResult = (stepId) => {
    return execution?.stepResults?.find(sr => sr.stepId === stepId);
  };
  
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1 className="page-title">Scenario Details</h1>
        </div>
        <div className="header-actions">
          {isRunning ? (
            <div className="running-status-inline">
              <i className="fas fa-spinner fa-spin"></i>
              <span>{runStatus || 'Running...'}</span>
            </div>
          ) : (
            <>
              <button className="btn btn-secondary">
                <i className="fas fa-edit"></i>
                Edit
              </button>
              <button className="btn btn-primary" onClick={handleRunScenario}>
                <i className="fas fa-play"></i>
                Run Now
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Objective Card */}
      <div className="objective-card card mb-4">
        <div className="objective-header">
          <div className={`objective-status ${Utils.getStatusClass(scenario.status)}`}>
            <i className={`fas ${Utils.getStatusIcon(scenario.status)}`}></i>
            <span>{scenario.status}</span>
          </div>
          <div className="objective-tags">
            {scenario.tags?.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="objective-content">
          <div className="hierarchy-indicator">
            <i className="fas fa-bullseye"></i>
            <span>OBJECTIVE</span>
          </div>
          <h2 className="objective-title">{scenario.objective}</h2>
          <p className="objective-description">{scenario.description}</p>
        </div>
        
        <div className="objective-meta">
          <div className="meta-item">
            <i className="fas fa-list-ol"></i>
            <span>{scenario.steps?.length || 0} Steps</span>
          </div>
          {scenario.lastRun && (
            <>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>Last run: {Utils.formatRelativeTime(scenario.lastRun.date)}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-stopwatch"></i>
                <span>{Utils.formatDuration(scenario.lastRun.duration)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Steps Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <div className="hierarchy-indicator small">
              <i className="fas fa-list-ol"></i>
              <span>STEPS</span>
            </div>
            User-defined Steps
          </h3>
          <div className="card-actions">
            <button className="btn btn-ghost btn-sm" onClick={expandAll}>
              <i className="fas fa-expand-alt"></i>
              Expand All
            </button>
            <button className="btn btn-ghost btn-sm" onClick={collapseAll}>
              <i className="fas fa-compress-alt"></i>
              Collapse All
            </button>
          </div>
        </div>
        
        <div className="steps-list">
          {scenario.steps?.map((step) => (
            <StepItem
              key={step.id}
              step={step}
              stepResult={getStepResult(step.id)}
              isExpanded={expandedSteps[step.id]}
              onToggle={() => toggleStep(step.id)}
              executionId={execution?.id}
              onViewStepDetail={onViewStepDetail}
            />
          ))}
        </div>
      </div>
      
      {/* View Execution Link */}
      {execution && (
        <div className="execution-link-card card mt-4">
          <div className="card-content clickable" onClick={() => onViewExecution(execution.id)}>
            <i className="fas fa-external-link-alt"></i>
            <span>View Full Execution Details</span>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Agent View Tab Component - Raw Browser Use API Response =====
const AgentViewTab = ({ execution }) => {
  const [expandedSteps, setExpandedSteps] = useState({});
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  
  // Get raw API response if available
  const rawResponse = execution.rawApiResponse;
  const agentSteps = rawResponse?.steps || [];
  
  const toggleStep = (stepNumber) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };
  
  const expandAll = () => {
    const allExpanded = {};
    agentSteps.forEach(step => {
      allExpanded[step.number] = true;
    });
    setExpandedSteps(allExpanded);
  };
  
  const collapseAll = () => {
    setExpandedSteps({});
  };
  
  if (!rawResponse || agentSteps.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <i className="fas fa-robot"></i>
            <h3>No Agent Data Available</h3>
            <p>This execution doesn't have raw Browser Use API data. This may be a demo execution or older data.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="agent-view-container">
      {/* Task Summary Card */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-robot"></i>
            Browser Use Task Summary
          </h3>
        </div>
        <div className="card-body">
          <div className="agent-task-summary">
            <div className="summary-row">
              <div className="summary-item">
                <span className="summary-label">Task ID</span>
                <span className="summary-value mono">{rawResponse.id}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Session ID</span>
                <span className="summary-value mono">{rawResponse.sessionId}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">LLM Model</span>
                <span className="summary-value">{rawResponse.llm || 'N/A'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Status</span>
                <span className={`summary-value status-badge ${rawResponse.status === 'finished' ? 'success' : 'info'}`}>
                  {rawResponse.status}
                </span>
              </div>
            </div>
            <div className="summary-row">
              <div className="summary-item">
                <span className="summary-label">Total Agent Steps</span>
                <span className="summary-value">{agentSteps.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Success</span>
                <span className={`summary-value ${rawResponse.isSuccess ? 'text-success' : 'text-error'}`}>
                  {rawResponse.isSuccess ? 'Yes' : 'No'}
                </span>
              </div>
              {rawResponse.browserUseVersion && (
                <div className="summary-item">
                  <span className="summary-label">Browser Use Version</span>
                  <span className="summary-value mono">{rawResponse.browserUseVersion}</span>
                </div>
              )}
            </div>
            {rawResponse.task && (
              <div className="summary-row full-width">
                <div className="summary-item">
                  <span className="summary-label">Task Prompt</span>
                  <div className="summary-value task-prompt">{rawResponse.task}</div>
                </div>
              </div>
            )}
            {rawResponse.output && (
              <div className="summary-row full-width">
                <div className="summary-item">
                  <span className="summary-label">Final Output</span>
                  <div className="summary-value task-output">{rawResponse.output}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Agent Steps Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-brain"></i>
            Agent Steps ({agentSteps.length})
          </h3>
          <div className="card-actions">
            <button className="btn btn-ghost btn-sm" onClick={expandAll}>
              <i className="fas fa-expand-alt"></i>
              Expand All
            </button>
            <button className="btn btn-ghost btn-sm" onClick={collapseAll}>
              <i className="fas fa-compress-alt"></i>
              Collapse All
            </button>
          </div>
        </div>
        
        <div className="agent-steps-list">
          {agentSteps.map((step, index) => (
            <div key={step.number || index} className="agent-step-item">
              <div 
                className="agent-step-header"
                onClick={() => toggleStep(step.number || index)}
              >
                <div className="agent-step-number">
                  <i className="fas fa-brain"></i>
                  <span>Step {step.number || index + 1}</span>
                </div>
                <div className="agent-step-meta">
                  {step.url && (
                    <span className="agent-step-url" title={step.url}>
                      <i className="fas fa-globe"></i>
                      {step.url.length > 50 ? step.url.substring(0, 50) + '...' : step.url}
                    </span>
                  )}
                  {step.actions && step.actions.length > 0 && (
                    <span className="agent-step-actions-count">
                      <i className="fas fa-mouse-pointer"></i>
                      {step.actions.length} action{step.actions.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {step.screenshotUrl && (
                    <span className="agent-step-has-screenshot">
                      <i className="fas fa-camera"></i>
                    </span>
                  )}
                </div>
                <i className={`fas fa-chevron-${expandedSteps[step.number || index] ? 'up' : 'down'}`}></i>
              </div>
              
              {expandedSteps[step.number || index] && (
                <div className="agent-step-content">
                  {/* Screenshot */}
                  {step.screenshotUrl && (
                    <div className="agent-step-section">
                      <div className="section-label">
                        <i className="fas fa-camera"></i>
                        Screenshot
                      </div>
                      <div className="agent-screenshot-container">
                        <img 
                          src={step.screenshotUrl} 
                          alt={`Step ${step.number || index + 1} screenshot`}
                          className="agent-screenshot"
                          onClick={() => setSelectedScreenshot(step.screenshotUrl)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Memory */}
                  {step.memory && (
                    <div className="agent-step-section">
                      <div className="section-label">
                        <i className="fas fa-memory"></i>
                        Agent Memory
                      </div>
                      <div className="section-content memory">{step.memory}</div>
                    </div>
                  )}
                  
                  {/* Evaluation of Previous Goal */}
                  {step.evaluationPreviousGoal && (
                    <div className="agent-step-section">
                      <div className="section-label">
                        <i className="fas fa-check-circle"></i>
                        Evaluation of Previous Goal
                      </div>
                      <div className="section-content evaluation">{step.evaluationPreviousGoal}</div>
                    </div>
                  )}
                  
                  {/* Next Goal */}
                  {step.nextGoal && (
                    <div className="agent-step-section">
                      <div className="section-label">
                        <i className="fas fa-bullseye"></i>
                        Next Goal
                      </div>
                      <div className="section-content next-goal">{step.nextGoal}</div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  {step.actions && step.actions.length > 0 && (
                    <div className="agent-step-section">
                      <div className="section-label">
                        <i className="fas fa-play-circle"></i>
                        Actions ({step.actions.length})
                      </div>
                      <div className="section-content actions-list">
                        {step.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="action-item">
                            <span className="action-index">{actionIndex + 1}</span>
                            <code className="action-code">{typeof action === 'string' ? action : JSON.stringify(action)}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* URL */}
                  {step.url && (
                    <div className="agent-step-section">
                      <div className="section-label">
                        <i className="fas fa-link"></i>
                        Current URL
                      </div>
                      <div className="section-content url">
                        <a href={step.url} target="_blank" rel="noopener noreferrer">{step.url}</a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={() => setSelectedScreenshot(null)}>
          <div className="screenshot-modal-content">
            <button className="close-modal" onClick={() => setSelectedScreenshot(null)}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedScreenshot} alt="Full size screenshot" />
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Execution Detail Page =====
const ExecutionDetailPage = ({ executionId, onBack, onViewStepDetail }) => {
  const execution = MOCK_DATA.executions.find(e => e.id === executionId);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [activeTab, setActiveTab] = useState('steps');
  
  if (!execution) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Execution not found</h3>
          <button className="btn btn-secondary" onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }
  
  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };
  
  const expandAll = () => {
    const allExpanded = {};
    execution.stepResults?.forEach(step => {
      allExpanded[step.stepId] = true;
    });
    setExpandedSteps(allExpanded);
  };
  
  const collapseAll = () => {
    setExpandedSteps({});
  };
  
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1 className="page-title">Execution Details</h1>
        </div>
      </div>
      
      {/* Execution Summary */}
      <div className="execution-summary card mb-4">
        <div className="execution-header">
          <div className={`execution-status-large ${Utils.getStatusClass(execution.status)}`}>
            <i className={`fas ${Utils.getStatusIcon(execution.status)}`}></i>
            <span>{execution.status.toUpperCase()}</span>
          </div>
          <div className="execution-id">ID: {execution.id}</div>
        </div>
        
        <div className="objective-content">
          <div className="hierarchy-indicator">
            <i className="fas fa-bullseye"></i>
            <span>OBJECTIVE</span>
          </div>
          <h2 className="objective-title">{execution.scenarioObjective}</h2>
        </div>
        
        <div className="execution-progress">
          <ProgressBar 
            percentage={execution.progress.percentage} 
            status={execution.status}
          />
          <span className="progress-label">
            Step {execution.progress.currentStep} of {execution.progress.totalSteps}
          </span>
        </div>
        
        <div className="execution-meta">
          <div className="meta-item">
            <i className="fas fa-clock"></i>
            <span>Started: {Utils.formatDate(execution.startTime)}</span>
          </div>
          {execution.endTime && (
            <div className="meta-item">
              <i className="fas fa-flag-checkered"></i>
              <span>Ended: {Utils.formatDate(execution.endTime)}</span>
            </div>
          )}
          <div className="meta-item">
            <i className="fas fa-stopwatch"></i>
            <span>Duration: {Utils.formatDuration(execution.duration)}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-user"></i>
            <span>{execution.metadata?.executedBy}</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs mb-4">
        <button 
          className={`tab ${activeTab === 'steps' ? 'active' : ''}`}
          onClick={() => setActiveTab('steps')}
        >
          <i className="fas fa-list-ol"></i>
          Steps & Sub-steps
        </button>
        <button 
          className={`tab ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          <i className="fas fa-robot"></i>
          Agent View
        </button>
        <button 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <i className="fas fa-terminal"></i>
          Logs
        </button>
      </div>
      
      {/* Steps Tab Content */}
      {activeTab === 'steps' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <div className="hierarchy-indicator small">
                <i className="fas fa-list-ol"></i>
                <span>STEPS</span>
              </div>
              Execution Steps
            </h3>
            <div className="card-actions">
              <button className="btn btn-ghost btn-sm" onClick={expandAll}>
                <i className="fas fa-expand-alt"></i>
                Expand All
              </button>
              <button className="btn btn-ghost btn-sm" onClick={collapseAll}>
                <i className="fas fa-compress-alt"></i>
                Collapse All
              </button>
            </div>
          </div>
          
          <div className="steps-list">
            {execution.stepResults?.map((stepResult) => (
              <StepItem
                key={stepResult.stepId}
                step={{
                  id: stepResult.stepId,
                  order: stepResult.stepOrder,
                  description: stepResult.stepDescription,
                  status: stepResult.status,
                  duration: stepResult.duration,
                  error: stepResult.error
                }}
                stepResult={stepResult}
                isExpanded={expandedSteps[stepResult.stepId]}
                onToggle={() => toggleStep(stepResult.stepId)}
                executionId={execution.id}
                onViewStepDetail={onViewStepDetail}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Agent View Tab Content - Raw Browser Use API Steps */}
      {activeTab === 'agent' && (
        <AgentViewTab execution={execution} />
      )}
      
      {/* Logs Tab Content */}
      {activeTab === 'logs' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-terminal"></i>
              Execution Logs
            </h3>
          </div>
          <div className="logs-container">
            {execution.logs?.map((log, index) => (
              <div key={index} className={`log-entry ${log.level}`}>
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`log-level ${log.level}`}>{log.level.toUpperCase()}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== History Page =====
const HistoryPage = ({ onViewExecution }) => {
  const { executions } = MOCK_DATA;
  
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Run History</h1>
        <p className="page-subtitle">All scenario executions</p>
      </div>
      
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Objective</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Duration</th>
                <th>Started</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {executions.map(exec => (
                <tr key={exec.id}>
                  <td>
                    <code className="execution-id-cell">{exec.id}</code>
                  </td>
                  <td>
                    <div className="objective-cell">
                      <i className="fas fa-bullseye"></i>
                      {Utils.truncateText(exec.scenarioObjective, 45)}
                    </div>
                  </td>
                  <td><StatusBadge status={exec.status} /></td>
                  <td>
                    <ProgressBar 
                      percentage={exec.progress.percentage} 
                      status={exec.status}
                    />
                  </td>
                  <td>{Utils.formatDuration(exec.duration)}</td>
                  <td>{Utils.formatRelativeTime(exec.startTime)}</td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => onViewExecution(exec.id)}
                    >
                      <i className="fas fa-eye"></i>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ===== Create Scenario Page =====
const CreateScenarioPage = ({ onBack, onNavigate, onScenarioCreated }) => {
  const [objective, setObjective] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [parsedSteps, setParsedSteps] = useState([]);
  const [stepsMode, setStepsMode] = useState(null); // 'demo' or 'custom'
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState(null);
  const [runProgress, setRunProgress] = useState(null);
  
  // Demo steps from supply chain example
  const demoStepsText = `Login to Oracle Fusion Cloud
Click Navigator (☰) → Supply Chain Planning → Supply Planning
Click Tasks → Manage Plans
Click Search
Enter the Plan Name in "Name" field: Alyasra ABP Base Plan & Verify plan exists
Select the plan
Click Actions → Open`;
  
  // Handle steps mode selection
  const handleStepsModeSelect = (mode) => {
    setStepsMode(mode);
    if (mode === 'demo') {
      setStepsText(demoStepsText);
    } else {
      setStepsText('');
    }
  };
  
  // Parse steps from text
  useEffect(() => {
    if (!stepsText.trim()) {
      setParsedSteps([]);
      return;
    }
    
    const lines = stepsText.split('\n').filter(line => line.trim());
    const steps = lines.map((line, index) => ({
      id: `step-${index + 1}`,
      order: index + 1,
      description: line.replace(/^\d+[\.\)]\s*/, '').trim(), // Remove leading numbers
      status: 'pending'
    }));
    setParsedSteps(steps);
  }, [stepsText]);
  
  const handleSubmit = async () => {
    // Generate unique IDs for the new scenario and execution
    const timestamp = Date.now();
    const isDemo = stepsMode === 'demo';
    const newScenarioId = `scenario-${isDemo ? 'demo' : 'custom'}-${timestamp}`;
    const newExecutionId = `exec-${isDemo ? 'demo' : 'custom'}-${timestamp}`;
    const currentTime = new Date().toISOString();
    
    // Get the reference scenario and execution data (scenario-001 and exec-001)
    const referenceScenario = MOCK_DATA.scenarios.find(s => s.id === 'scenario-001');
    const referenceExecution = MOCK_DATA.executions.find(e => e.id === 'exec-001');
    
    if (isDemo && (!referenceScenario || !referenceExecution)) {
      alert('Error: Reference data not found for demo mode');
      return;
    }
    
    let newSteps;
    let newStepResults;
    let newExecution;
    
    if (isDemo) {
      // DEMO MODE: Use steps from the reference supply chain scenario
      newSteps = referenceScenario.steps.map((step, index) => ({
        ...step,
        id: `${newScenarioId}-step-${String(index + 1).padStart(3, '0')}`,
        startTime: currentTime,
        endTime: currentTime
      }));
      
      // Create new step results with new IDs but same sub-steps from reference
      newStepResults = referenceExecution.stepResults.map((stepResult, stepIndex) => {
        const newStepId = `${newScenarioId}-step-${String(stepIndex + 1).padStart(3, '0')}`;
        
        // Clone sub-steps with new IDs
        const newSubSteps = stepResult.subSteps ? stepResult.subSteps.map((subStep, subIndex) => ({
          ...subStep,
          id: `${newExecutionId}-substep-${String(stepIndex + 1).padStart(3, '0')}-${subIndex + 1}`,
          agentAction: subStep.agentAction ? { ...subStep.agentAction, parameters: { ...subStep.agentAction.parameters } } : null,
          result: subStep.result ? { ...subStep.result } : null,
          browserState: subStep.browserState ? { ...subStep.browserState } : null
        })) : [];
        
        return {
          ...stepResult,
          stepId: newStepId,
          startTime: currentTime,
          endTime: currentTime,
          subSteps: newSubSteps
        };
      });
      
      // Create new execution with full details from reference
      newExecution = {
        id: newExecutionId,
        scenarioId: newScenarioId,
        scenarioObjective: objective,
        status: 'passed',
        startTime: currentTime,
        endTime: currentTime,
        duration: referenceExecution.duration,
        progress: { ...referenceExecution.progress },
        metadata: {
          ...referenceExecution.metadata,
          triggeredBy: 'manual'
        },
        stepResults: newStepResults,
        logs: referenceExecution.logs ? [...referenceExecution.logs] : []
      };
    } else {
      // CUSTOM MODE: Use steps provided by the user
      newSteps = parsedSteps.map((step, index) => ({
        id: `${newScenarioId}-step-${String(index + 1).padStart(3, '0')}`,
        order: index + 1,
        description: step.description,
        status: 'running',
        duration: null,
        startTime: currentTime,
        endTime: null
      }));
      
      // Create initial step results for custom scenarios
      newStepResults = newSteps.map((step) => ({
        stepId: step.id,
        status: 'running',
        startTime: currentTime,
        endTime: null,
        duration: null,
        subSteps: []
      }));
      
      // Create new execution placeholder for custom scenarios - status is 'running'
      newExecution = {
        id: newExecutionId,
        scenarioId: newScenarioId,
        scenarioObjective: objective,
        status: 'running',
        startTime: currentTime,
        endTime: null,
        duration: null,
        progress: {
          currentStep: 0,
          totalSteps: newSteps.length,
          percentage: 0
        },
        metadata: {
          browser: 'chrome',
          viewportWidth: 1920,
          viewportHeight: 1080,
          triggeredBy: 'manual'
        },
        stepResults: newStepResults,
        logs: [{
          timestamp: currentTime,
          level: 'info',
          message: 'Starting Browser Use API task execution...'
        }]
      };
    }
    
    // Create new scenario
    const newScenario = {
      id: newScenarioId,
      objective: objective,
      description: isDemo ? `Demo scenario created from: ${objective}` : `Custom scenario: ${objective}`,
      tags: isDemo ? ['demo', ...(referenceScenario?.tags || [])] : ['custom'],
      createdAt: currentTime,
      updatedAt: currentTime,
      createdBy: 'admin@trinamix.com',
      status: isDemo ? 'passed' : 'running',
      lastRun: {
        executionId: newExecutionId,
        status: isDemo ? 'passed' : 'running',
        date: currentTime,
        duration: isDemo ? referenceScenario?.lastRun?.duration || 0 : 0
      },
      configuration: referenceScenario ? { ...referenceScenario.configuration } : {
        timeout: 300,
        retryOnFailure: true,
        maxRetries: 2,
        captureScreenshots: true,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      steps: newSteps
    };
    
    // Add to MOCK_DATA
    MOCK_DATA.scenarios.unshift(newScenario);
    MOCK_DATA.executions.unshift(newExecution);
    
    // Update stats
    MOCK_DATA.stats.totalScenarios += 1;
    if (isDemo) {
      MOCK_DATA.stats.passedScenarios += 1;
    } else {
      MOCK_DATA.stats.runningScenarios += 1;
    }
    
    // Notify parent
    if (onScenarioCreated) {
      onScenarioCreated(newScenarioId);
    }
    
    // For demo mode, just navigate
    if (isDemo) {
      alert(`Scenario "${objective}" created successfully with ${newSteps.length} steps (with demo execution data)!`);
      onNavigate('scenarios');
      return;
    }
    
    // For custom mode, call Browser Use API
    setIsRunning(true);
    setRunStatus('Creating task with Browser Use API...');
    
    try {
      // Build the task prompt from objective and steps
      const taskStepsText = newSteps.map((s, i) => `${i + 1}. ${s.description}`).join('\n');
      const taskPrompt = `Objective: ${objective}\n\nSteps to execute:\n${taskStepsText}`;
      
      // Create the task
      const createResult = await BrowserUseAPI.createTask(taskPrompt, {
        maxSteps: Math.max(50, newSteps.length * 10),
        highlightElements: true,
        vision: true,
        metadata: {
          scenarioId: newScenarioId,
          executionId: newExecutionId
        }
      });
      
      setRunStatus(`Task created (ID: ${createResult.id}). Executing...`);
      setRunProgress({ taskId: createResult.id, steps: 0 });
      
      // Update execution with task ID
      newExecution.metadata.browserUseTaskId = createResult.id;
      newExecution.metadata.browserUseSessionId = createResult.sessionId;
      
      // Poll for completion with progress updates
      const finalResult = await BrowserUseAPI.pollTaskUntilComplete(
        createResult.id,
        (taskUpdate) => {
          const stepCount = taskUpdate.steps?.length || 0;
          setRunProgress({ taskId: createResult.id, steps: stepCount, status: taskUpdate.status });
          setRunStatus(`Executing... (${stepCount} browser actions completed)`);
          
          // Update the execution in MOCK_DATA with live progress
          const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
          if (execIndex >= 0) {
            const updatedExecution = BrowserUseAPI.transformTaskToExecution(taskUpdate, newScenario, newExecutionId);
            MOCK_DATA.executions[execIndex] = updatedExecution;
          }
        },
        2000,
        600000
      );
      
      // Transform final result
      const finalExecution = BrowserUseAPI.transformTaskToExecution(finalResult, newScenario, newExecutionId);
      
      // Update MOCK_DATA with final result
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex] = finalExecution;
      }
      
      // Update scenario status
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === newScenarioId);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = finalExecution.status;
        MOCK_DATA.scenarios[scenarioIndex].lastRun = {
          executionId: newExecutionId,
          status: finalExecution.status,
          date: finalExecution.endTime || new Date().toISOString(),
          duration: finalExecution.duration || 0
        };
        
        MOCK_DATA.scenarios[scenarioIndex].steps = MOCK_DATA.scenarios[scenarioIndex].steps.map((step, i) => ({
          ...step,
          status: finalExecution.stepResults[i]?.status || step.status,
          duration: finalExecution.stepResults[i]?.duration || step.duration,
          endTime: finalExecution.stepResults[i]?.endTime || step.endTime
        }));
      }
      
      // Update stats
      MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
      if (finalExecution.status === 'passed') {
        MOCK_DATA.stats.passedScenarios += 1;
      } else if (finalExecution.status === 'failed') {
        MOCK_DATA.stats.failedScenarios += 1;
      }
      
      setIsRunning(false);
      setRunStatus(null);
      
      const statusEmoji = finalExecution.status === 'passed' ? '✅' : '❌';
      alert(`${statusEmoji} Scenario "${objective}" execution complete!\n\nStatus: ${finalExecution.status.toUpperCase()}\nSteps: ${finalResult.steps?.length || 0} browser actions\n${finalResult.output ? `\nOutput: ${finalResult.output}` : ''}`);
      
      onNavigate('scenarios');
      
    } catch (error) {
      console.error('Browser Use API error:', error);
      
      // Update execution status to failed
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].status = 'failed';
        MOCK_DATA.executions[execIndex].endTime = new Date().toISOString();
        MOCK_DATA.executions[execIndex].logs.push({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `Browser Use API error: ${error.message}`
        });
      }
      
      // Update scenario status
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === newScenarioId);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = 'failed';
        MOCK_DATA.scenarios[scenarioIndex].lastRun = {
          executionId: newExecutionId,
          status: 'failed',
          date: new Date().toISOString(),
          duration: 0
        };
      }
      
      // Update stats
      MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
      MOCK_DATA.stats.failedScenarios += 1;
      
      setIsRunning(false);
      setRunStatus(null);
      
      alert(`❌ Error executing scenario: ${error.message}\n\nThe scenario has been created but execution failed.`);
      onNavigate('scenarios');
    }
  };
  
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1 className="page-title">Create New Scenario</h1>
          <p className="page-subtitle">Define your test objective and steps</p>
        </div>
      </div>
      
      <div className="create-scenario-layout">
        {/* Input Section */}
        <div className="input-section">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">
                <div className="hierarchy-indicator small">
                  <i className="fas fa-bullseye"></i>
                  <span>OBJECTIVE</span>
                </div>
                Define Objective
              </h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>What do you want to verify or accomplish?</label>
                <textarea
                  className="form-input objective-input"
                  placeholder="e.g., Verify that Supply Plans are correctly configured and can be opened"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <div className="hierarchy-indicator small">
                  <i className="fas fa-list-ol"></i>
                  <span>STEPS</span>
                </div>
                Define Steps
              </h3>
            </div>
            <div className="card-body">
              {/* Steps Mode Selection */}
              {!stepsMode && (
                <div className="steps-mode-selection">
                  <label className="mode-label">How would you like to define your steps?</label>
                  <div className="mode-buttons">
                    <button 
                      className="mode-btn demo-btn"
                      onClick={() => handleStepsModeSelect('demo')}
                    >
                      <div className="mode-btn-icon">
                        <i className="fas fa-magic"></i>
                      </div>
                      <div className="mode-btn-content">
                        <strong>Use Demo Steps</strong>
                        <span>Copy steps from Supply Chain example</span>
                      </div>
                    </button>
                    <button 
                      className="mode-btn custom-btn"
                      onClick={() => handleStepsModeSelect('custom')}
                    >
                      <div className="mode-btn-icon">
                        <i className="fas fa-edit"></i>
                      </div>
                      <div className="mode-btn-content">
                        <strong>Custom Steps</strong>
                        <span>Write your own test steps</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Steps Input (shown after mode selection) */}
              {stepsMode && (
                <>
                  <div className="steps-mode-header">
                    <span className="mode-badge">
                      <i className={`fas ${stepsMode === 'demo' ? 'fa-magic' : 'fa-edit'}`}></i>
                      {stepsMode === 'demo' ? 'Demo Steps' : 'Custom Steps'}
                    </span>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => setStepsMode(null)}
                    >
                      <i className="fas fa-undo"></i>
                      Change Mode
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Enter each step on a new line:</label>
                    <textarea
                      className="form-input steps-input mono"
                      placeholder={`1. Login to Oracle Fusion Cloud\n2. Click Navigator (☰) → Supply Chain Planning\n3. Click Tasks → Manage Plans\n...`}
                      value={stepsText}
                      onChange={(e) => setStepsText(e.target.value)}
                      rows={10}
                      readOnly={stepsMode === 'demo'}
                    />
                  </div>
                  <p className="form-hint">
                    <i className="fas fa-info-circle"></i>
                    {stepsMode === 'demo' 
                      ? 'Demo steps and execution details from the Supply Chain example are pre-filled..'
                      : 'Each step will be resolved by browser_use API into sub-steps (browser actions)'
                    }
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="preview-section">
          <div className="card sticky-preview">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-eye"></i>
                Preview
              </h3>
            </div>
            <div className="card-body">
              {objective && (
                <div className="preview-objective">
                  <div className="hierarchy-indicator">
                    <i className="fas fa-bullseye"></i>
                    <span>OBJECTIVE</span>
                  </div>
                  <h4>{objective}</h4>
                </div>
              )}
              
              {parsedSteps.length > 0 && (
                <div className="preview-steps">
                  <div className="hierarchy-indicator small">
                    <i className="fas fa-list-ol"></i>
                    <span>STEPS ({parsedSteps.length})</span>
                  </div>
                  <div className="preview-steps-list">
                    {parsedSteps.map((step) => (
                      <div key={step.id} className="preview-step-item">
                        <span className="step-number">{step.order}</span>
                        <span className="step-text">{step.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!objective && parsedSteps.length === 0 && (
                <div className="preview-empty">
                  <i className="fas fa-edit"></i>
                  <p>Enter an objective and steps to see preview</p>
                </div>
              )}
            </div>
            
            <div className="card-footer">
              {isRunning ? (
                <div className="running-status">
                  <div className="running-indicator">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span className="running-text">{runStatus || 'Executing...'}</span>
                  </div>
                  {runProgress && (
                    <div className="running-progress">
                      <span className="progress-detail">
                        <i className="fas fa-cogs"></i>
                        {runProgress.steps} browser actions
                      </span>
                      {runProgress.taskId && (
                        <span className="task-id">
                          Task: {runProgress.taskId.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="btn btn-primary btn-block"
                  disabled={!objective || parsedSteps.length === 0}
                  onClick={handleSubmit}
                >
                  <i className="fas fa-rocket"></i>
                  {stepsMode === 'demo' ? 'Create Demo Scenario' : 'Create & Run Scenario'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Step Detail Header Component =====
const StepDetailHeader = ({ step, stepResult, execution, onBack }) => {
  const statusClass = Utils.getStatusClass(stepResult?.status || step.status);
  const statusIcon = Utils.getStatusIcon(stepResult?.status || step.status);
  
  const subSteps = stepResult?.subSteps || [];
  const completedSubSteps = subSteps.filter(ss => ss.status === 'success').length;
  const percentage = subSteps.length > 0 ? Math.round((completedSubSteps / subSteps.length) * 100) : 0;
  
  return (
    <div className="step-detail-header">
      <div className="header-top">
        <button className="back-button" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Scenario</span>
        </button>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-redo"></i>
            Retry Step
          </button>
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>
      
      <div className="header-main">
        <div className="step-title-section">
          <div className="step-order-badge">Step {step.order}</div>
          <h1 className="step-title">{step.description}</h1>
        </div>
        
        <div className={`step-status-display ${statusClass}`}>
          <i className={`fas ${statusIcon}`}></i>
          <span>{(stepResult?.status || step.status).toUpperCase()}</span>
        </div>
      </div>
      
      <div className="header-meta">
        <div className="meta-row">
          <div className="meta-item">
            <i className="fas fa-clock"></i>
            <span>Started:</span>
            <strong>{Utils.formatDate(stepResult?.startTime || step.startTime)}</strong>
          </div>
          <div className="meta-item">
            <i className="fas fa-stopwatch"></i>
            <span>Duration:</span>
            <strong>{Utils.formatDuration(stepResult?.duration || step.duration)}</strong>
          </div>
          <div className="meta-item">
            <i className="fas fa-cogs"></i>
            <span>Sub-steps:</span>
            <strong>{completedSubSteps}/{subSteps.length}</strong>
          </div>
        </div>
        
        <div className="progress-section">
          <label>Step Progress</label>
          <ProgressBar percentage={percentage} status={stepResult?.status || step.status} />
        </div>
      </div>
      
      {(stepResult?.status === 'passed' || stepResult?.status === 'failed') && (
        <div className={`judge-verdict ${stepResult?.status === 'passed' ? 'success' : 'error'}`}>
          <div className="verdict-icon">
            <i className={`fas ${stepResult?.status === 'passed' ? 'fa-gavel' : 'fa-exclamation-triangle'}`}></i>
          </div>
          <div className="verdict-content">
            <strong>Step Verdict:</strong>
            <span>{stepResult?.status === 'passed' ? 'All sub-steps completed successfully' : 'Step failed during execution'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Step Detail Tab Navigation Component =====
const StepDetailTabNavigation = ({ activeTab, onTabChange, errorCount, screenshotCount }) => {
  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: 'fa-stream' },
    { id: 'screenshots', label: 'Screenshots', icon: 'fa-camera', badge: screenshotCount },
    { id: 'data', label: 'Data', icon: 'fa-database' },
    { id: 'errors', label: 'Errors', icon: 'fa-exclamation-triangle', badge: errorCount, badgeClass: 'error' },
    { id: 'logs', label: 'Logs', icon: 'fa-terminal' },
    { id: 'metrics', label: 'Metrics', icon: 'fa-chart-line' }
  ];
  
  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`fas ${tab.icon}`}></i>
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span className={`tab-badge ${tab.badgeClass || ''}`}>{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
};

// ===== Timeline Sub-Step Item =====
const TimelineSubStep = ({ subStep, isExpanded, onToggle, isLast }) => {
  const statusClass = Utils.getStatusClass(subStep.status);
  const statusIcon = Utils.getStatusIcon(subStep.status);
  const actionIcon = Utils.getActionIcon(subStep.action || subStep.agentAction?.type);
  
  const agentAction = subStep.agentAction || {
    type: subStep.action,
    parameters: subStep.parameters,
    evaluation: subStep.evaluation,
    nextGoal: null,
    memory: null
  };
  const result = subStep.result || {
    success: subStep.status === 'success',
    extractedContent: subStep.extractedContent,
    error: subStep.error,
    isDone: false
  };
  const browserState = subStep.browserState || null;
  
  return (
    <div className={`timeline-substep ${statusClass} ${isExpanded ? 'expanded' : ''}`}>
      <div className="timeline-connector">
        <div className="timeline-line-top"></div>
        <div className={`timeline-dot ${statusClass}`}>
          <i className={`fas ${statusIcon}`}></i>
        </div>
        {!isLast && <div className="timeline-line-bottom"></div>}
      </div>
      
      <div className="timeline-content">
        <div className="timeline-header" onClick={onToggle}>
          <div className="timeline-header-left">
            <span className="substep-number">#{subStep.order || subStep.stepNumber}</span>
            <div className="action-badge">
              <i className={`fas ${actionIcon}`}></i>
              <span>{(subStep.action || agentAction.type)?.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <div className="timeline-header-right">
            <span className="substep-time">
              <i className="fas fa-clock"></i>
              {Utils.formatDuration(subStep.duration)}
            </span>
            <StatusBadge status={subStep.status} />
            <button className="expand-toggle">
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        
        <p className="substep-description">{subStep.description}</p>
        
        {(subStep.evaluation || agentAction.evaluation) && (
          <div className={`agent-evaluation ${statusClass}`}>
            <i className="fas fa-robot"></i>
            <span>{subStep.evaluation || agentAction.evaluation}</span>
          </div>
        )}
        
        {isExpanded && (
          <div className="substep-details">
            <div className="detail-card">
              <div className="detail-card-header">
                <i className="fas fa-mouse-pointer"></i>
                <span>Action Taken</span>
              </div>
              <div className="detail-card-body">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <code className="detail-value action-code">{agentAction.type}</code>
                </div>
                {agentAction.parameters && (
                  <div className="detail-row">
                    <span className="detail-label">Parameters:</span>
                    <pre className="detail-value code-block">
                      {JSON.stringify(agentAction.parameters, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-card-header">
                <i className={`fas ${result.success ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>Result</span>
                <span className={`result-indicator ${result.success ? 'success' : 'error'}`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <div className="detail-card-body">
                {result.extractedContent && (
                  <div className="detail-row">
                    <span className="detail-label">Extracted Content:</span>
                    <div className="extracted-content-box">{result.extractedContent}</div>
                  </div>
                )}
                {result.error && (
                  <div className="detail-row error-row">
                    <span className="detail-label">Error:</span>
                    <div className="error-message-box">{result.error}</div>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Is Done:</span>
                  <span className="detail-value">{result.isDone ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            
            {browserState && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <i className="fas fa-globe"></i>
                  <span>Browser State</span>
                </div>
                <div className="detail-card-body">
                  <div className="detail-row">
                    <span className="detail-label">URL:</span>
                    <a href={browserState.url} className="url-link" target="_blank" rel="noopener noreferrer">
                      {browserState.url}
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Page Title:</span>
                    <span className="detail-value">{browserState.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Captured At:</span>
                    <span className="detail-value">{Utils.formatDate(browserState.timestamp)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {agentAction.memory && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <i className="fas fa-brain"></i>
                  <span>Agent Memory</span>
                </div>
                <div className="detail-card-body">
                  <p className="memory-text">{agentAction.memory}</p>
                </div>
              </div>
            )}
            
            {agentAction.nextGoal && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <i className="fas fa-arrow-right"></i>
                  <span>Next Goal</span>
                </div>
                <div className="detail-card-body">
                  <p className="next-goal-text">{agentAction.nextGoal}</p>
                </div>
              </div>
            )}
            
            {subStep.screenshot && (
              <div className="detail-card screenshot-card">
                <div className="detail-card-header">
                  <i className="fas fa-camera"></i>
                  <span>Screenshot</span>
                </div>
                <div className="detail-card-body">
                  <div className="screenshot-preview">
                    <img src={subStep.screenshot} alt={`Screenshot for sub-step ${subStep.order}`} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Timeline Tab Content =====
const TimelineTab = ({ subSteps }) => {
  const [expandedSubSteps, setExpandedSubSteps] = useState({});
  
  const toggleSubStep = (id) => {
    setExpandedSubSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const expandAll = () => {
    const all = {};
    subSteps.forEach(ss => { all[ss.id] = true; });
    setExpandedSubSteps(all);
  };
  
  const collapseAll = () => setExpandedSubSteps({});
  
  if (!subSteps || subSteps.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-stream"></i>
        <h3>No Sub-steps Found</h3>
        <p>This step has no browser actions recorded</p>
      </div>
    );
  }
  
  return (
    <div className="timeline-tab">
      <div className="timeline-toolbar">
        <div className="toolbar-info">
          <i className="fas fa-cogs"></i>
          <span>{subSteps.length} Browser Actions (from browser_use API)</span>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={expandAll}>
            <i className="fas fa-expand-alt"></i>
            Expand All
          </button>
          <button className="btn btn-ghost btn-sm" onClick={collapseAll}>
            <i className="fas fa-compress-alt"></i>
            Collapse All
          </button>
        </div>
      </div>
      
      <div className="timeline-list">
        {subSteps.map((subStep, index) => (
          <TimelineSubStep
            key={subStep.id}
            subStep={subStep}
            isExpanded={expandedSubSteps[subStep.id]}
            onToggle={() => toggleSubStep(subStep.id)}
            isLast={index === subSteps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

// ===== Screenshots Tab Content =====
const ScreenshotsTab = ({ subSteps }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  
  const screenshots = subSteps
    .filter(ss => ss.screenshot)
    .map(ss => ({
      id: ss.id,
      subStepOrder: ss.order || ss.stepNumber,
      description: ss.description,
      screenshot: ss.screenshot,
      status: ss.status,
      timestamp: ss.timestamp,
      url: ss.browserState?.url
    }));
  
  if (screenshots.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-camera"></i>
        <h3>No Screenshots Available</h3>
        <p>No screenshots were captured during this step execution</p>
      </div>
    );
  }
  
  return (
    <div className="screenshots-tab">
      <div className="screenshot-timeline">
        <div className="timeline-track">
          {screenshots.map((ss) => (
            <button
              key={ss.id}
              className={`timeline-point ${selectedScreenshot === ss.id ? 'active' : ''} ${Utils.getStatusClass(ss.status)}`}
              onClick={() => setSelectedScreenshot(ss.id)}
              title={`Sub-step #${ss.subStepOrder}: ${ss.description}`}
            >
              <span className="point-number">{ss.subStepOrder}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="screenshot-grid">
        {screenshots.map(ss => (
          <div 
            key={ss.id} 
            className={`screenshot-card ${selectedScreenshot === ss.id ? 'selected' : ''}`}
            onClick={() => setSelectedScreenshot(ss.id === selectedScreenshot ? null : ss.id)}
          >
            <div className="screenshot-image">
              <img src={ss.screenshot} alt={ss.description} />
              <div className={`screenshot-status ${Utils.getStatusClass(ss.status)}`}>
                <i className={`fas ${Utils.getStatusIcon(ss.status)}`}></i>
              </div>
            </div>
            <div className="screenshot-info">
              <span className="screenshot-number">#{ss.subStepOrder}</span>
              <p className="screenshot-desc">{ss.description}</p>
              {ss.timestamp && (
                <span className="screenshot-time">
                  <i className="fas fa-clock"></i>
                  {new Date(ss.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedScreenshot && (
        <div className="screenshot-lightbox" onClick={() => setSelectedScreenshot(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedScreenshot(null)}>
              <i className="fas fa-times"></i>
            </button>
            {(() => {
              const ss = screenshots.find(s => s.id === selectedScreenshot);
              return ss ? (
                <>
                  <img src={ss.screenshot} alt={ss.description} />
                  <div className="lightbox-info">
                    <h4>Sub-step #{ss.subStepOrder}</h4>
                    <p>{ss.description}</p>
                    {ss.url && <code>{ss.url}</code>}
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Extracted Data Tab Content =====
const DataTab = ({ subSteps }) => {
  const extractedData = subSteps
    .filter(ss => ss.result?.extractedContent || ss.extractedContent)
    .map(ss => ({
      id: ss.id,
      subStepOrder: ss.order || ss.stepNumber,
      description: ss.description,
      content: ss.result?.extractedContent || ss.extractedContent,
      timestamp: ss.timestamp
    }));
  
  const [viewMode, setViewMode] = useState('formatted');
  
  if (extractedData.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-database"></i>
        <h3>No Data Extracted</h3>
        <p>No data was extracted during this step execution</p>
      </div>
    );
  }
  
  return (
    <div className="data-tab">
      <div className="data-toolbar">
        <div className="toolbar-left">
          <span className="data-count">{extractedData.length} data extraction(s)</span>
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'formatted' ? 'active' : ''}`}
              onClick={() => setViewMode('formatted')}
            >
              Formatted
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'raw' ? 'active' : ''}`}
              onClick={() => setViewMode('raw')}
            >
              Raw
            </button>
          </div>
          <button className="btn btn-secondary btn-sm">
            <i className="fas fa-download"></i>
            Export JSON
          </button>
        </div>
      </div>
      
      <div className="data-list">
        {extractedData.map(data => (
          <div key={data.id} className="data-card">
            <div className="data-card-header">
              <span className="data-substep">Sub-step #{data.subStepOrder}</span>
              <span className="data-desc">{data.description}</span>
              <button className="btn btn-ghost btn-sm copy-btn" onClick={() => navigator.clipboard.writeText(data.content)}>
                <i className="fas fa-copy"></i>
                Copy
              </button>
            </div>
            <div className="data-card-body">
              {viewMode === 'formatted' ? (
                <div className="data-content formatted">{data.content}</div>
              ) : (
                <pre className="data-content raw">{data.content}</pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== Errors Tab Content =====
const ErrorsTab = ({ subSteps, stepError }) => {
  const errors = subSteps
    .filter(ss => ss.status === 'failed' || ss.status === 'error' || ss.error || ss.result?.error)
    .map(ss => ({
      id: ss.id,
      subStepOrder: ss.order || ss.stepNumber,
      description: ss.description,
      error: ss.error || ss.result?.error,
      action: ss.action || ss.agentAction?.type,
      screenshot: ss.screenshot,
      timestamp: ss.timestamp
    }));
  
  if (stepError && !errors.some(e => e.error === stepError)) {
    errors.unshift({
      id: 'step-error',
      subStepOrder: 'Step',
      description: 'Step-level error',
      error: stepError,
      action: null,
      screenshot: null,
      timestamp: null
    });
  }
  
  if (errors.length === 0) {
    return (
      <div className="empty-state success">
        <i className="fas fa-check-circle"></i>
        <h3>No Errors</h3>
        <p>This step completed without any errors</p>
      </div>
    );
  }
  
  return (
    <div className="errors-tab">
      <div className="errors-summary">
        <div className="summary-icon error">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="summary-content">
          <h3>{errors.length} Error(s) Found</h3>
          <p>Review the errors below for details and suggested fixes</p>
        </div>
      </div>
      
      <div className="errors-list">
        {errors.map(err => (
          <div key={err.id} className="error-card">
            <div className="error-card-header">
              <div className="error-location">
                <span className="error-substep">Sub-step #{err.subStepOrder}</span>
                {err.action && <code className="error-action">{err.action}</code>}
              </div>
              {err.timestamp && (
                <span className="error-time">
                  <i className="fas fa-clock"></i>
                  {new Date(err.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <p className="error-description">{err.description}</p>
            
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{err.error}</span>
            </div>
            
            {err.screenshot && (
              <div className="error-screenshot">
                <img src={err.screenshot} alt="Error screenshot" />
              </div>
            )}
            
            <div className="suggested-fixes">
              <h5><i className="fas fa-lightbulb"></i> Suggested Fixes:</h5>
              <ul>
                <li>Check if the element selector has changed</li>
                <li>Verify the page loaded completely before the action</li>
                <li>Add a wait condition before the action</li>
                <li>Check for dynamic content loading issues</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== Logs Tab Content =====
const LogsTab = ({ subSteps, logs }) => {
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const generatedLogs = useMemo(() => {
    if (logs && logs.length > 0) return logs;
    
    return subSteps.flatMap(ss => {
      const entries = [];
      entries.push({ timestamp: ss.timestamp, level: 'info', message: `Starting: ${ss.description}` });
      if (ss.agentAction?.evaluation || ss.evaluation) {
        entries.push({ timestamp: ss.timestamp, level: 'debug', message: `Agent evaluation: ${ss.agentAction?.evaluation || ss.evaluation}` });
      }
      if (ss.result?.extractedContent || ss.extractedContent) {
        entries.push({ timestamp: ss.timestamp, level: 'debug', message: `Extracted: ${ss.result?.extractedContent || ss.extractedContent}` });
      }
      if (ss.error || ss.result?.error) {
        entries.push({ timestamp: ss.timestamp, level: 'error', message: ss.error || ss.result?.error });
      }
      entries.push({ timestamp: ss.timestamp, level: ss.status === 'success' ? 'info' : 'error', message: `Completed: ${ss.description} - ${ss.status}` });
      return entries;
    });
  }, [subSteps, logs]);
  
  const filteredLogs = useMemo(() => {
    return generatedLogs.filter(log => {
      if (levelFilter !== 'all' && log.level !== levelFilter) return false;
      if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [generatedLogs, levelFilter, searchQuery]);
  
  return (
    <div className="logs-tab">
      <div className="logs-toolbar">
        <div className="toolbar-filters">
          <div className="level-filters">
            {['all', 'debug', 'info', 'warn', 'error'].map(level => (
              <button
                key={level}
                className={`filter-btn ${level} ${levelFilter === level ? 'active' : ''}`}
                onClick={() => setLevelFilter(level)}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-secondary btn-sm">
            <i className="fas fa-download"></i>
            Download
          </button>
        </div>
      </div>
      
      <div className="logs-container">
        {filteredLogs.map((log, index) => (
          <div key={index} className={`log-entry ${log.level}`}>
            <span className="log-timestamp">
              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '--:--:--'}
            </span>
            <span className={`log-level ${log.level}`}>{log.level.toUpperCase()}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="empty-logs">
            <i className="fas fa-terminal"></i>
            <p>No logs match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Metrics Tab Content =====
const MetricsTab = ({ subSteps, stepResult }) => {
  const metrics = useMemo(() => {
    const totalDuration = subSteps.reduce((sum, ss) => sum + (ss.duration || 0), 0);
    const avgDuration = subSteps.length > 0 ? totalDuration / subSteps.length : 0;
    const successCount = subSteps.filter(ss => ss.status === 'success').length;
    const failedCount = subSteps.filter(ss => ss.status === 'failed' || ss.status === 'error').length;
    
    const actionBreakdown = {};
    subSteps.forEach(ss => {
      const action = ss.action || ss.agentAction?.type || 'unknown';
      actionBreakdown[action] = (actionBreakdown[action] || 0) + 1;
    });
    
    const slowest = [...subSteps].sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 3);
    
    return {
      totalDuration,
      avgDuration,
      successCount,
      failedCount,
      successRate: subSteps.length > 0 ? Math.round((successCount / subSteps.length) * 100) : 0,
      actionBreakdown,
      slowest
    };
  }, [subSteps]);
  
  return (
    <div className="metrics-tab">
      <div className="metrics-overview">
        <div className="metric-card">
          <div className="metric-icon blue">
            <i className="fas fa-clock"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Duration</span>
            <span className="metric-value">{Utils.formatDuration(metrics.totalDuration)}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon purple">
            <i className="fas fa-tachometer-alt"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Avg Sub-step Time</span>
            <span className="metric-value">{Utils.formatDuration(metrics.avgDuration)}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Success Rate</span>
            <span className="metric-value">{metrics.successRate}%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon orange">
            <i className="fas fa-cogs"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Actions</span>
            <span className="metric-value">{subSteps.length}</span>
          </div>
        </div>
      </div>
      
      <div className="metrics-section">
        <h3><i className="fas fa-chart-pie"></i> Action Type Breakdown</h3>
        <div className="action-breakdown">
          {Object.entries(metrics.actionBreakdown).map(([action, count]) => (
            <div key={action} className="breakdown-item">
              <div className="breakdown-label">
                <i className={`fas ${Utils.getActionIcon(action)}`}></i>
                <span>{action.replace(/_/g, ' ')}</span>
              </div>
              <div className="breakdown-bar">
                <div className="breakdown-fill" style={{ width: `${(count / subSteps.length) * 100}%` }}></div>
              </div>
              <span className="breakdown-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="metrics-section">
        <h3><i className="fas fa-hourglass-half"></i> Slowest Sub-steps</h3>
        <div className="slowest-list">
          {metrics.slowest.map((ss, index) => (
            <div key={ss.id} className="slowest-item">
              <span className="slowest-rank">#{index + 1}</span>
              <div className="slowest-info">
                <span className="slowest-action">{ss.action || ss.agentAction?.type}</span>
                <span className="slowest-desc">{ss.description}</span>
              </div>
              <span className="slowest-duration">{Utils.formatDuration(ss.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== Step Detail Page Component (In-App) =====
const StepDetailPage = ({ executionId, stepId, onBack }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  
  // Find the execution and step data from MOCK_DATA
  const execution = MOCK_DATA.executions.find(e => e.id === executionId);
  const stepResult = execution?.stepResults?.find(sr => sr.stepId === stepId);
  const scenario = MOCK_DATA.scenarios.find(s => s.id === execution?.scenarioId);
  const step = scenario?.steps?.find(s => s.id === stepId) || {
    id: stepId,
    order: stepResult?.stepOrder,
    description: stepResult?.stepDescription,
    status: stepResult?.status,
    duration: stepResult?.duration,
    error: stepResult?.error
  };
  
  const subSteps = stepResult?.subSteps || [];
  const errorCount = subSteps.filter(ss => ss.status === 'failed' || ss.status === 'error').length;
  const screenshotCount = subSteps.filter(ss => ss.screenshot).length;
  
  if (!execution || !stepResult) {
    return (
      <div className="page-content">
        <div className="step-detail-page">
          <div className="step-detail-container">
            <div className="empty-state error">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Step Not Found</h3>
              <p>The requested step execution could not be found.</p>
              <p className="debug-info">
                Execution ID: {executionId}<br/>
                Step ID: {stepId}
              </p>
              <button className="btn btn-primary" onClick={onBack}>
                <i className="fas fa-arrow-left"></i>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineTab subSteps={subSteps} />;
      case 'screenshots':
        return <ScreenshotsTab subSteps={subSteps} />;
      case 'data':
        return <DataTab subSteps={subSteps} />;
      case 'errors':
        return <ErrorsTab subSteps={subSteps} stepError={step.error} />;
      case 'logs':
        return <LogsTab subSteps={subSteps} logs={execution.logs} />;
      case 'metrics':
        return <MetricsTab subSteps={subSteps} stepResult={stepResult} />;
      default:
        return <TimelineTab subSteps={subSteps} />;
    }
  };
  
  return (
    <div className="page-content">
      <div className="step-detail-page">
        <div className="step-detail-container">
          <StepDetailHeader 
            step={step} 
            stepResult={stepResult} 
            execution={execution}
            onBack={onBack}
          />
          
          <StepDetailTabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            errorCount={errorCount}
            screenshotCount={screenshotCount}
          />
          
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Main App Component =====
const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [selectedExecutionId, setSelectedExecutionId] = useState(null);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-renders after data changes
  
  // Load data from localStorage on initial mount
  useEffect(() => {
    const savedScenarios = StorageHelper.loadScenarios();
    const savedExecutions = StorageHelper.loadExecutions();
    const savedStats = StorageHelper.loadStats();
    
    if (savedScenarios && savedScenarios.length > 0) {
      MOCK_DATA.scenarios = savedScenarios;
    }
    if (savedExecutions && savedExecutions.length > 0) {
      MOCK_DATA.executions = savedExecutions;
    }
    if (savedStats) {
      MOCK_DATA.stats = savedStats;
    }
    
    // Trigger re-render after loading data
    setRefreshKey(prev => prev + 1);
  }, []);
  
  // Save data to localStorage whenever it changes
  const persistData = useCallback(() => {
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    StorageHelper.saveExecutions(MOCK_DATA.executions);
    StorageHelper.saveStats(MOCK_DATA.stats);
  }, []);
  
  // Handle scenario deletion
  const handleDeleteScenario = useCallback((scenarioId) => {
    // Find the scenario to get its status
    const scenario = MOCK_DATA.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    // Remove scenario from list
    MOCK_DATA.scenarios = MOCK_DATA.scenarios.filter(s => s.id !== scenarioId);
    
    // Remove associated executions
    MOCK_DATA.executions = MOCK_DATA.executions.filter(e => e.scenarioId !== scenarioId);
    
    // Update stats
    MOCK_DATA.stats.totalScenarios = Math.max(0, MOCK_DATA.stats.totalScenarios - 1);
    if (scenario.status === 'passed') {
      MOCK_DATA.stats.passedScenarios = Math.max(0, MOCK_DATA.stats.passedScenarios - 1);
    } else if (scenario.status === 'failed') {
      MOCK_DATA.stats.failedScenarios = Math.max(0, MOCK_DATA.stats.failedScenarios - 1);
    } else if (scenario.status === 'running') {
      MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
    }
    
    // Persist to localStorage
    persistData();
    
    // Trigger re-render
    setRefreshKey(prev => prev + 1);
  }, [persistData]);
  
  // Handle scenario creation (persist after creation)
  const handleScenarioCreated = useCallback((scenarioId) => {
    persistData();
    setRefreshKey(prev => prev + 1);
  }, [persistData]);
  
  const handleNavigate = (page) => {
    setActivePage(page);
    setSelectedScenarioId(null);
    setSelectedExecutionId(null);
    setSelectedStepId(null);
  };
  
  const handleViewScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setActivePage('scenario-detail');
  };
  
  const handleViewExecution = (executionId) => {
    setSelectedExecutionId(executionId);
    setActivePage('execution-detail');
  };
  
  const handleViewStepDetail = (executionId, stepId) => {
    setSelectedExecutionId(executionId);
    setSelectedStepId(stepId);
    setActivePage('step-detail');
  };
  
  const getBreadcrumb = () => {
    switch (activePage) {
      case 'dashboard':
        return ['Home', 'Dashboard'];
      case 'scenarios':
        return ['Home', 'Scenarios'];
      case 'scenario-detail':
        return ['Home', 'Scenarios', 'Details'];
      case 'execution-detail':
        return ['Home', 'History', 'Execution'];
      case 'step-detail':
        return ['Home', 'Execution', 'Step Details'];
      case 'history':
        return ['Home', 'Run History'];
      case 'create-scenario':
        return ['Home', 'New Scenario'];
      default:
        return ['Home'];
    }
  };
  
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            key={refreshKey}
            onNavigate={handleNavigate}
            onViewScenario={handleViewScenario}
            onViewExecution={handleViewExecution}
          />
        );
      case 'scenarios':
        return (
          <ScenariosPage 
            key={refreshKey}
            onViewScenario={handleViewScenario}
            onNavigate={handleNavigate}
            onDeleteScenario={handleDeleteScenario}
          />
        );
      case 'scenario-detail':
        return (
          <ScenarioDetailPage 
            scenarioId={selectedScenarioId}
            onBack={() => handleNavigate('scenarios')}
            onViewExecution={handleViewExecution}
            onViewStepDetail={handleViewStepDetail}
          />
        );
      case 'execution-detail':
        return (
          <ExecutionDetailPage 
            executionId={selectedExecutionId}
            onBack={() => handleNavigate('history')}
            onViewStepDetail={handleViewStepDetail}
          />
        );
      case 'step-detail':
        return (
          <StepDetailPage
            executionId={selectedExecutionId}
            stepId={selectedStepId}
            onBack={() => {
              // Go back to the appropriate page
              if (selectedScenarioId) {
                setActivePage('scenario-detail');
              } else {
                setActivePage('execution-detail');
              }
              setSelectedStepId(null);
            }}
          />
        );
      case 'history':
        return (
          <HistoryPage 
            onViewExecution={handleViewExecution}
          />
        );
      case 'create-scenario':
        return (
          <CreateScenarioPage 
            onBack={() => handleNavigate('scenarios')}
            onNavigate={handleNavigate}
            onScenarioCreated={handleScenarioCreated}
          />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };
  
  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="main-content">
        <Header breadcrumb={getBreadcrumb()} />
        {renderPage()}
      </main>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
