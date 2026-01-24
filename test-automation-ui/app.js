// Test Automation UI - Main React Application
// Based on test-automation-ui-design.md

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
            className={`nav-item ${activePage === 'tests' ? 'active' : ''}`}
            onClick={() => onNavigate('tests')}
          >
            <i className="fas fa-flask"></i>
            Test Library
          </a>
          <a 
            className={`nav-item ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
          >
            <i className="fas fa-history"></i>
            Run History
            <span className="nav-item-badge">3</span>
          </a>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Actions</div>
          <a className="nav-item" onClick={() => onNavigate('create-test')}>
            <i className="fas fa-plus-circle"></i>
            Create Test
          </a>
          <a className="nav-item">
            <i className="fas fa-calendar"></i>
            Schedules
          </a>
          <a className="nav-item">
            <i className="fas fa-chart-line"></i>
            Analytics
          </a>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Settings</div>
          <a className="nav-item">
            <i className="fas fa-cog"></i>
            Configuration
          </a>
          <a className="nav-item">
            <i className="fas fa-plug"></i>
            Integrations
          </a>
        </div>
      </nav>
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
          <input type="text" placeholder="Search tests, executions..." />
        </div>
        
        <button className="icon-button">
          <i className="fas fa-bell"></i>
        </button>
        
        <button className="icon-button">
          <i className="fas fa-question-circle"></i>
        </button>
        
        <div className="user-avatar">JD</div>
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

// ===== Dashboard Page =====
const Dashboard = ({ onNavigate, onViewExecution, onViewTest }) => {
  const { stats, recentExecutions, tests } = MOCK_DATA;
  
  // Calculate stats with hierarchy awareness
  const dashboardStats = useMemo(() => {
    const totalTests = tests.length;
    const totalSteps = tests.reduce((sum, t) => sum + (t.instructions?.steps?.length || 0), 0);
    const passedTests = tests.filter(t => t.lastRun?.status === 'passed').length;
    const failedTests = tests.filter(t => t.lastRun?.status === 'failed').length;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    return { totalTests, totalSteps, passedTests, failedTests, passRate };
  }, [tests]);
  
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your test automation platform</p>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon="fa-flask" 
          iconColor="blue" 
          label="Total Tests" 
          value={dashboardStats.totalTests}
          trend={12}
          trendDirection="up"
        />
        <StatCard 
          icon="fa-list-ol" 
          iconColor="purple" 
          label="Total Steps" 
          value={dashboardStats.totalSteps}
        />
        <StatCard 
          icon="fa-check-circle" 
          iconColor="green" 
          label="Pass Rate" 
          value={`${dashboardStats.passRate}%`}
          trend={5}
          trendDirection="up"
        />
        <StatCard 
          icon="fa-play-circle" 
          iconColor="orange" 
          label="Active Runs" 
          value={stats.activeRuns}
        />
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions mb-4">
        <div className="quick-action" onClick={() => onNavigate('create-test')}>
          <div className="quick-action-icon blue">
            <i className="fas fa-plus"></i>
          </div>
          <span className="quick-action-label">Create Test</span>
        </div>
        <div className="quick-action" onClick={() => onNavigate('tests')}>
          <div className="quick-action-icon green">
            <i className="fas fa-play"></i>
          </div>
          <span className="quick-action-label">Run Test</span>
        </div>
        <div className="quick-action">
          <div className="quick-action-icon orange">
            <i className="fas fa-calendar-plus"></i>
          </div>
          <span className="quick-action-label">Schedule Test</span>
        </div>
        <div className="quick-action" onClick={() => onNavigate('history')}>
          <div className="quick-action-icon purple">
            <i className="fas fa-file-alt"></i>
          </div>
          <span className="quick-action-label">View Reports</span>
        </div>
      </div>
      
      {/* Test Summary Cards */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Test Summary</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('tests')}>
            View All Tests
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Steps</th>
                <th>Last Status</th>
                <th>Last Run</th>
              </tr>
            </thead>
            <tbody>
              {tests.slice(0, 5).map(test => (
                <tr key={test.id} style={{cursor: 'pointer'}} onClick={() => onViewTest(test.id)}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)'}}>
                      <i className="fas fa-folder" style={{color: 'var(--primary)'}}></i>
                      <span className="table-link">{test.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: 'var(--background)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)'
                    }}>
                      {test.instructions?.steps?.length || 0} steps
                    </span>
                  </td>
                  <td>
                    {test.lastRun ? <StatusBadge status={test.lastRun.status} /> : <span className="text-secondary">--</span>}
                  </td>
                  <td>{test.lastRun ? Utils.formatRelativeTime(test.lastRun.date) : 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Executions Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Executions</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('history')}>
            View All
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Status</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.slice(0, 5).map(execution => (
                <tr key={execution.id}>
                  <td>
                    <span className="table-link" onClick={() => onViewExecution(execution.id)}>
                      {execution.testName}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={execution.status} />
                  </td>
                  <td>{Utils.formatRelativeTime(execution.startTime)}</td>
                  <td>{Utils.formatDuration(execution.duration)}</td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm btn-icon-only"
                      onClick={() => onViewExecution(execution.id)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn btn-ghost btn-sm btn-icon-only"
                      title="Re-run Test"
                    >
                      <i className="fas fa-redo"></i>
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

// ===== Test Library Page =====
const TestLibrary = ({ onNavigate, onViewTest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredTests = useMemo(() => {
    let result = MOCK_DATA.tests;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(test => 
        test.name.toLowerCase().includes(term) ||
        test.description.toLowerCase().includes(term) ||
        test.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(test => test.lastRun?.status === statusFilter);
    }
    
    return result;
  }, [searchTerm, statusFilter]);
  
  // Calculate stats for the library
  const libraryStats = useMemo(() => {
    const total = MOCK_DATA.tests.length;
    const withRuns = MOCK_DATA.tests.filter(t => t.lastRun);
    const passed = withRuns.filter(t => t.lastRun?.status === 'passed').length;
    const failed = withRuns.filter(t => t.lastRun?.status === 'failed').length;
    const totalSteps = MOCK_DATA.tests.reduce((sum, t) => sum + (t.instructions?.steps?.length || 0), 0);
    return { total, passed, failed, totalSteps };
  }, []);
  
  return (
    <div className="page-content">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1 className="page-title">Test Library</h1>
          <p className="page-subtitle">Select a test to view its steps and details</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('create-test')}>
          <i className="fas fa-plus"></i>
          Create Test
        </button>
      </div>
      
      {/* Library Stats */}
      <div className="stats-grid" style={{marginBottom: 'var(--spacing-4)'}}>
        <div className="stat-card">
          <div className="stat-card-icon blue"><i className="fas fa-flask"></i></div>
          <div className="stat-card-label">Total Tests</div>
          <div className="stat-card-value">{libraryStats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><i className="fas fa-check-circle"></i></div>
          <div className="stat-card-label">Passed</div>
          <div className="stat-card-value">{libraryStats.passed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{backgroundColor: 'var(--error-bg)', color: 'var(--error)'}}><i className="fas fa-times-circle"></i></div>
          <div className="stat-card-label">Failed</div>
          <div className="stat-card-value">{libraryStats.failed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon purple"><i className="fas fa-list-ol"></i></div>
          <div className="stat-card-label">Total Steps</div>
          <div className="stat-card-value">{libraryStats.totalSteps}</div>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className="filter-bar">
        <input 
          type="text" 
          className="filter-input"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>
      </div>
      
      {/* Test List - Click to view steps */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tests ({filteredTests.length})</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Steps</th>
                <th>Last Run</th>
                <th>Status</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map(test => (
                <tr key={test.id} style={{cursor: 'pointer'}} onClick={() => onViewTest(test.id)}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)'}}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-bg)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="fas fa-folder"></i>
                      </div>
                      <div>
                        <div className="table-link" style={{fontWeight: 'var(--font-semibold)'}}>
                          {test.name}
                        </div>
                        <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)'}}>
                          {Utils.truncate(test.description, 50)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: 'var(--background)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)'
                    }}>
                      {test.instructions?.steps?.length || 0} steps
                    </span>
                  </td>
                  <td>{test.lastRun ? Utils.formatRelativeTime(test.lastRun.date) : 'Never'}</td>
                  <td>
                    {test.lastRun ? <StatusBadge status={test.lastRun.status} /> : <span className="text-secondary">--</span>}
                  </td>
                  <td>{test.createdBy.split('@')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredTests.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-flask"></i>
          </div>
          <h3 className="empty-state-title">No tests found</h3>
          <p className="empty-state-description">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first test to get started'}
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('create-test')}>
            <i className="fas fa-plus"></i>
            Create Test
          </button>
        </div>
      )}
    </div>
  );
};

// ===== Test Detail Page (Shows Steps within a Test) =====
const TestDetail = ({ testId, onBack, onRunTest, onViewExecution }) => {
  const test = useMemo(() => {
    return MOCK_DATA.tests.find(t => t.id === testId);
  }, [testId]);
  
  // Find related executions for this test
  const relatedExecutions = useMemo(() => {
    return MOCK_DATA.executions.filter(e => e.testId === testId);
  }, [testId]);
  
  if (!test) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <h3 className="empty-state-title">Test not found</h3>
          <button className="btn btn-primary" onClick={onBack}>Go Back</button>
        </div>
      </div>
    );
  }
  
  const steps = test.instructions?.steps || [];
  
  return (
    <div className="page-content">
      {/* Test Header */}
      <div className="execution-header">
        <div className="execution-header-top">
          <div className="execution-title-section">
            <button className="back-button" onClick={onBack}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="execution-title">{test.name}</h1>
              <span className="execution-test-id">ID: {test.id}</span>
            </div>
          </div>
          <div className="execution-actions">
            <button className="btn btn-primary" onClick={() => onRunTest(test.id)}>
              <i className="fas fa-play"></i>
              Run Test
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-edit"></i>
              Edit
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-copy"></i>
              Clone
            </button>
          </div>
        </div>
        
        {/* Test Meta */}
        <div className="execution-meta">
          <div className="execution-meta-item">
            <span className="execution-meta-label">Status</span>
            <span className="execution-meta-value">
              {test.lastRun ? <StatusBadge status={test.lastRun.status} /> : <span className="text-secondary">Never Run</span>}
            </span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Steps</span>
            <span className="execution-meta-value">{steps.length}</span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Last Run</span>
            <span className="execution-meta-value">{test.lastRun ? Utils.formatDateTime(test.lastRun.date) : '--'}</span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Duration</span>
            <span className="execution-meta-value">{test.lastRun ? Utils.formatDuration(test.lastRun.duration) : '--'}</span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Browser</span>
            <span className="execution-meta-value">{test.configuration?.browser || 'chrome'}</span>
          </div>
        </div>
        
        {/* Description & Tags */}
        <div style={{marginTop: 'var(--spacing-4)'}}>
          <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)'}}>{test.description}</p>
          <div className="test-card-tags">
            {test.tags.map(tag => (
              <span className="tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Task Instructions */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title"><i className="fas fa-tasks" style={{marginRight: '8px'}}></i>Task Instructions</h3>
        </div>
        <div className="card-body">
          <p style={{fontSize: 'var(--text-sm)', color: 'var(--text)'}}>{test.instructions?.task}</p>
        </div>
      </div>
      
      {/* Steps List */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title"><i className="fas fa-list-ol" style={{marginRight: '8px'}}></i>Test Steps ({steps.length})</h3>
        </div>
        <div className="card-body" style={{padding: 0}}>
          {steps.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '60px'}}>#</th>
                  <th>Step Description</th>
                  <th style={{width: '120px'}}>Action</th>
                  <th>Expected Outcome</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr key={step.id}>
                    <td>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-bg)',
                        color: 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'var(--font-semibold)',
                        fontSize: 'var(--text-sm)'
                      }}>
                        {step.order || index + 1}
                      </span>
                    </td>
                    <td style={{fontWeight: 'var(--font-medium)'}}>{step.description}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: 'var(--background)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        textTransform: 'uppercase',
                        fontWeight: 'var(--font-medium)'
                      }}>
                        <i className={`fas ${Utils.getActionIcon(step.action)}`} style={{marginRight: '4px'}}></i>
                        {step.action}
                      </span>
                    </td>
                    <td style={{color: 'var(--text-secondary)'}}>{step.expectedOutcome || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{padding: 'var(--spacing-8)'}}>
              <div className="empty-state-icon"><i className="fas fa-list"></i></div>
              <h3 className="empty-state-title">No steps defined</h3>
              <p className="empty-state-description">This test will use AI to determine steps during execution</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Configuration */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title"><i className="fas fa-cog" style={{marginRight: '8px'}}></i>Configuration</h3>
        </div>
        <div className="card-body">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)'}}>
            <div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px'}}>Max Steps</div>
              <div style={{fontWeight: 'var(--font-medium)'}}>{test.configuration?.maxSteps || 25}</div>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px'}}>Timeout</div>
              <div style={{fontWeight: 'var(--font-medium)'}}>{test.configuration?.timeout || 120}s</div>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px'}}>Retry on Failure</div>
              <div style={{fontWeight: 'var(--font-medium)'}}>{test.configuration?.retryOnFailure ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px'}}>Headless</div>
              <div style={{fontWeight: 'var(--font-medium)'}}>{test.configuration?.headless ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Executions */}
      {relatedExecutions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><i className="fas fa-history" style={{marginRight: '8px'}}></i>Recent Executions</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Execution ID</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {relatedExecutions.map(exec => (
                  <tr key={exec.id}>
                    <td><span className="table-link" onClick={() => onViewExecution(exec.id)}>{exec.id}</span></td>
                    <td><StatusBadge status={exec.status} /></td>
                    <td>{Utils.formatDateTime(exec.startTime)}</td>
                    <td>{Utils.formatDuration(exec.duration)}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm btn-icon-only" onClick={() => onViewExecution(exec.id)} title="View">
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Timeline Step Component =====
const TimelineStep = ({ step, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusClass = Utils.getStatusClass(step.status);
  
  return (
    <div className={`timeline-step ${isLast ? 'last' : ''}`}>
      <div className={`timeline-step-icon ${statusClass}`}>
        <i className={`fas ${Utils.getStatusIcon(step.status)}`}></i>
      </div>
      <div className="timeline-step-content">
        <div className="timeline-step-header" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="timeline-step-info">
            <span className="timeline-step-title">
              Step {step.stepNumber}: {step.stepDescription}
            </span>
            <div className="timeline-step-meta">
              <StatusBadge status={step.status} />
              <span><i className="fas fa-clock"></i> {Utils.formatDurationShort(step.duration)}</span>
              <span><i className="fas fa-history"></i> {Utils.formatTime(step.startTime)}</span>
            </div>
          </div>
          <span className="timeline-step-expand">
            {isExpanded ? 'Collapse' : 'Expand'} <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </span>
        </div>
        
        {isExpanded && (
          <div className="timeline-step-details open animate-slide-in">
            {/* Agent Reasoning */}
            <div className="step-detail-section">
              <div className="step-detail-label">Agent Reasoning</div>
              <div className="step-detail-content">
                {step.agentAction?.evaluation || 'No evaluation available'}
              </div>
            </div>
            
            {/* Action Details */}
            <div className="step-detail-section">
              <div className="step-detail-label">Action Taken</div>
              <div className="step-detail-code">
                <pre>{`Type: ${step.agentAction?.type || 'N/A'}
Parameters: ${JSON.stringify(step.agentAction?.parameters || {}, null, 2)}`}</pre>
              </div>
            </div>
            
            {/* Result */}
            <div className="step-detail-section">
              <div className="step-detail-label">Result</div>
              <div className="step-detail-content">
                {step.result?.success ? '✓ ' : '✗ '}
                {step.result?.extractedContent || step.result?.error || 'No result'}
              </div>
            </div>
            
            {/* Browser State */}
            <div className="step-detail-section">
              <div className="step-detail-label">Browser State</div>
              <div className="step-detail-content">
                <div><strong>URL:</strong> {step.browserState?.url}</div>
                <div><strong>Title:</strong> {step.browserState?.title}</div>
              </div>
            </div>
            
            {/* Memory & Next Goal */}
            {step.agentAction?.memory && (
              <div className="step-detail-section">
                <div className="step-detail-label">Agent Memory</div>
                <div className="step-detail-content">{step.agentAction.memory}</div>
              </div>
            )}
            
            {step.agentAction?.nextGoal && (
              <div className="step-detail-section">
                <div className="step-detail-label">Next Goal</div>
                <div className="step-detail-content">{step.agentAction.nextGoal}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Screenshot Gallery Component =====
const ScreenshotGallery = ({ screenshots }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  
  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="fas fa-camera"></i>
        </div>
        <h3 className="empty-state-title">No screenshots captured</h3>
        <p className="empty-state-description">Screenshots will appear here during test execution</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="screenshot-grid">
        {screenshots.map((screenshot, index) => (
          <div 
            key={screenshot.id} 
            className="screenshot-card"
            onClick={() => setSelectedScreenshot(index)}
          >
            <div 
              className="screenshot-image"
              style={{
                backgroundImage: `url(${screenshot.thumbnailBase64})`,
                backgroundColor: '#f0f0f0'
              }}
            >
              <div className="screenshot-overlay">
                <span className="screenshot-overlay-text">
                  <i className="fas fa-expand"></i> View
                </span>
              </div>
            </div>
            <div className="screenshot-info">
              <div className="screenshot-step">Step {screenshot.stepNumber}</div>
              <div className="screenshot-meta">
                <span>{Utils.formatTime(screenshot.timestamp)}</span>
                <span>{Utils.formatFileSize(screenshot.fileSize)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {selectedScreenshot !== null && (
        <div className="lightbox" onClick={() => setSelectedScreenshot(null)}>
          <button className="lightbox-close">
            <i className="fas fa-times"></i>
          </button>
          
          {selectedScreenshot > 0 && (
            <button 
              className="lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedScreenshot(prev => prev - 1);
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          
          <img 
            className="lightbox-image" 
            src={screenshots[selectedScreenshot].thumbnailBase64}
            alt={`Step ${screenshots[selectedScreenshot].stepNumber}`}
            onClick={(e) => e.stopPropagation()}
          />
          
          {selectedScreenshot < screenshots.length - 1 && (
            <button 
              className="lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedScreenshot(prev => prev + 1);
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
          
          <div className="lightbox-info">
            Step {screenshots[selectedScreenshot].stepNumber} - {screenshots[selectedScreenshot].description || 'Screenshot'}
          </div>
        </div>
      )}
    </>
  );
};

// ===== Extracted Data Viewer Component =====
const ExtractedDataViewer = ({ extractedData }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const handleCopy = async (data, index) => {
    const success = await Utils.copyToClipboard(Utils.formatJSON(data));
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };
  
  if (!extractedData || extractedData.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="fas fa-database"></i>
        </div>
        <h3 className="empty-state-title">No data extracted</h3>
        <p className="empty-state-description">Extracted content will appear here during test execution</p>
      </div>
    );
  }
  
  return (
    <div>
      {extractedData.map((item, index) => (
        <div key={index} className="code-viewer" style={{marginBottom: 'var(--spacing-4)'}}>
          <div className="code-viewer-header">
            <span className="code-viewer-title">
              Step {item.stepNumber}: {item.dataType}
            </span>
            <div className="code-viewer-actions">
              <button 
                className="code-viewer-btn"
                onClick={() => handleCopy(item.data, index)}
              >
                <i className={`fas ${copiedIndex === index ? 'fa-check' : 'fa-copy'}`}></i>
                {copiedIndex === index ? ' Copied!' : ' Copy'}
              </button>
            </div>
          </div>
          <div className="code-viewer-content">
            <pre dangerouslySetInnerHTML={{__html: Utils.highlightJSON(item.data)}}></pre>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===== Error Panel Component =====
const ErrorPanel = ({ errors }) => {
  if (!errors || errors.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" style={{color: 'var(--success)'}}>
          <i className="fas fa-check-circle"></i>
        </div>
        <h3 className="empty-state-title">No errors!</h3>
        <p className="empty-state-description">All steps completed successfully</p>
      </div>
    );
  }
  
  const suggestedFixes = {
    'element_not_found': [
      'Check if element selector has changed',
      'Verify page loaded completely',
      'Add wait condition before action',
      'Check for dynamic content loading'
    ],
    'timeout': [
      'Increase timeout configuration',
      'Check network connectivity',
      'Verify server response time',
      'Consider adding explicit waits'
    ],
    'action_failed': [
      'Verify element is interactable',
      'Check for overlapping elements',
      'Ensure element is visible',
      'Try alternative selector'
    ]
  };
  
  return (
    <div>
      {errors.map((error, index) => (
        <div key={index} className="error-card">
          <div className="error-card-header">
            <span className="error-type">
              <i className="fas fa-exclamation-circle"></i>
              {error.errorType.replace(/_/g, ' ')}
            </span>
            <span className="error-step">Step {error.stepNumber}</span>
          </div>
          <div className="error-card-body">
            <p className="error-message">{error.message}</p>
            
            {error.recoveryAttempts > 0 && (
              <div className="error-recovery">
                <div className="error-recovery-title">Recovery Attempts: {error.recoveryAttempts}</div>
                {[...Array(error.recoveryAttempts)].map((_, i) => (
                  <div key={i} className="error-recovery-item">
                    • Retry {i + 1}: Failed - {i === error.recoveryAttempts - 1 ? 'Max retries exceeded' : 'Element still not found'}
                  </div>
                ))}
              </div>
            )}
            
            <div className="suggested-fixes">
              <div className="suggested-fixes-title">Suggested Fixes</div>
              {(suggestedFixes[error.errorType] || suggestedFixes['action_failed']).map((fix, i) => (
                <div key={i} className="fix-item">
                  <i className="fas fa-check"></i>
                  {fix}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===== Log Viewer Component =====
const LogViewer = ({ logs }) => {
  const [levelFilters, setLevelFilters] = useState(['debug', 'info', 'warn', 'error']);
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleLevel = (level) => {
    setLevelFilters(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesLevel = levelFilters.includes(log.level.toLowerCase());
      const matchesSearch = !searchTerm || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [logs, levelFilters, searchTerm]);
  
  return (
    <div className="log-viewer">
      <div className="log-viewer-toolbar">
        <div className="log-filter-buttons">
          {['debug', 'info', 'warn', 'error'].map(level => (
            <button 
              key={level}
              className={`log-filter-btn ${level} ${levelFilters.includes(level) ? 'active' : ''}`}
              onClick={() => toggleLevel(level)}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
        <input 
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: '1px solid #475569',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            color: '#e2e8f0',
            fontSize: 'var(--text-xs)'
          }}
        />
      </div>
      <div className="log-content">
        {filteredLogs.map((log, index) => (
          <div key={index} className="log-entry">
            <span className="log-timestamp">{Utils.formatLogTimestamp(log.timestamp)}</span>
            <span className={`log-level ${log.level.toLowerCase()}`}>[{log.level.toUpperCase()}]</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div style={{padding: 'var(--spacing-4)', color: '#64748b', textAlign: 'center'}}>
            No logs match your filters
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Metrics Panel Component =====
const MetricsPanel = ({ metrics, steps }) => {
  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics?.totalActions || 0}</div>
          <div className="metric-label">Total Actions</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{color: 'var(--success)'}}>{metrics?.successfulActions || 0}</div>
          <div className="metric-label">Successful</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{color: 'var(--error)'}}>{metrics?.failedActions || 0}</div>
          <div className="metric-label">Failed</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{Utils.formatDuration(metrics?.averageStepTime || 0)}</div>
          <div className="metric-label">Avg Step Time</div>
        </div>
      </div>
      
      {/* Action Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Action Distribution</h3>
        </div>
        <div className="card-body">
          {steps && steps.length > 0 ? (
            <div>
              {Object.entries(
                steps.reduce((acc, step) => {
                  const type = step.agentAction?.type || 'unknown';
                  acc[type] = (acc[type] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <div key={type} className="progress-container">
                  <div className="progress-header">
                    <span className="progress-label">
                      <i className={`fas ${Utils.getActionIcon(type)}`} style={{marginRight: '8px'}}></i>
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="progress-value">{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{width: `${(count / steps.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary text-sm">No action data available</p>
          )}
        </div>
      </div>
      
      {/* Slowest Steps */}
      {steps && steps.length > 0 && (
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">Slowest Steps</h3>
          </div>
          <div className="card-body">
            {[...steps]
              .sort((a, b) => b.duration - a.duration)
              .slice(0, 5)
              .map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-2) 0',
                  borderBottom: index < 4 ? '1px solid var(--border)' : 'none'
                }}>
                  <span className="text-sm">Step {step.stepNumber}: {Utils.truncate(step.stepDescription, 40)}</span>
                  <span className="text-sm font-semibold">{Utils.formatDuration(step.duration)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Execution Detail Page =====
const ExecutionDetail = ({ executionId, onBack }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  
  const execution = useMemo(() => {
    return MOCK_DATA.executions.find(e => e.id === executionId) || MOCK_DATA.executions[0];
  }, [executionId]);
  
  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: 'fa-list-alt', count: execution.results?.steps?.length },
    { id: 'screenshots', label: 'Screenshots', icon: 'fa-camera', count: execution.results?.screenshots?.length },
    { id: 'data', label: 'Data', icon: 'fa-database', count: execution.results?.extractedData?.length },
    { id: 'errors', label: 'Errors', icon: 'fa-exclamation-triangle', count: execution.results?.errors?.length },
    { id: 'logs', label: 'Logs', icon: 'fa-file-alt', count: execution.logs?.length },
    { id: 'metrics', label: 'Metrics', icon: 'fa-chart-bar' }
  ];
  
  return (
    <div className="page-content">
      {/* Execution Header */}
      <div className="execution-header">
        <div className="execution-header-top">
          <div className="execution-title-section">
            <button className="back-button" onClick={onBack}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="execution-title">{execution.testName}</h1>
              <span className="execution-test-id">ID: {execution.id}</span>
            </div>
          </div>
          <div className="execution-actions">
            <button className="btn btn-secondary">
              <i className="fas fa-redo"></i>
              Retry
            </button>
            {execution.status === 'running' && (
              <button className="btn btn-danger">
                <i className="fas fa-stop"></i>
                Cancel
              </button>
            )}
            <button className="btn btn-secondary">
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>
        
        {/* Meta Information */}
        <div className="execution-meta">
          <div className="execution-meta-item">
            <span className="execution-meta-label">Status</span>
            <span className="execution-meta-value">
              <StatusBadge status={execution.status} />
            </span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Started</span>
            <span className="execution-meta-value">{Utils.formatDateTime(execution.startTime)}</span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Duration</span>
            <span className="execution-meta-value">{Utils.formatDuration(execution.duration)}</span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Environment</span>
            <span className="execution-meta-value">{execution.metadata?.environment || 'N/A'}</span>
          </div>
          <div className="execution-meta-item">
            <span className="execution-meta-label">Triggered By</span>
            <span className="execution-meta-value">{execution.metadata?.triggeredBy || 'N/A'}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="execution-progress">
          <div className="progress-text">
            <span className="progress-percentage">{execution.progress?.percentage || 0}%</span>
            <span className="progress-steps">
              {execution.progress?.currentStep || 0} / {execution.progress?.totalSteps || 0} steps
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${execution.status === 'passed' ? 'success' : execution.status === 'failed' ? 'error' : ''}`}
              style={{width: `${execution.progress?.percentage || 0}%`}}
            ></div>
          </div>
        </div>
        
        {/* Judge Verdict */}
        {execution.results?.judgeVerdict && (
          <div className={`judge-verdict ${execution.results.judgeVerdict.isSuccessful ? 'success' : 'failed'}`}>
            <div className="judge-verdict-icon">
              <i className={`fas ${execution.results.judgeVerdict.isSuccessful ? 'fa-check' : 'fa-times'}`}></i>
            </div>
            <div className="judge-verdict-content">
              <div className="judge-verdict-title">
                AI Judge Verdict: {execution.results.judgeVerdict.isSuccessful ? 'Test Passed' : 'Test Failed'}
              </div>
              <div className="judge-verdict-confidence">
                Confidence: {Math.round(execution.results.judgeVerdict.confidence * 100)}%
                {execution.results.judgeVerdict.failureReason && (
                  <span> • Reason: {execution.results.judgeVerdict.failureReason}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="tab-badge">{tab.count}</span>
            )}
          </div>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'timeline' && (
          <div className="timeline">
            {execution.results?.steps?.map((step, index) => (
              <TimelineStep 
                key={step.stepNumber}
                step={step}
                isLast={index === execution.results.steps.length - 1}
              />
            )) || (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="fas fa-list"></i>
                </div>
                <h3 className="empty-state-title">No steps recorded yet</h3>
                <p className="empty-state-description">Steps will appear here as the test executes</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'screenshots' && (
          <ScreenshotGallery screenshots={execution.results?.screenshots} />
        )}
        
        {activeTab === 'data' && (
          <ExtractedDataViewer extractedData={execution.results?.extractedData} />
        )}
        
        {activeTab === 'errors' && (
          <ErrorPanel errors={execution.results?.errors} />
        )}
        
        {activeTab === 'logs' && (
          <LogViewer logs={execution.logs || []} />
        )}
        
        {activeTab === 'metrics' && (
          <MetricsPanel 
            metrics={execution.results?.metrics} 
            steps={execution.results?.steps}
          />
        )}
      </div>
    </div>
  );
};

// ===== Run History Page =====
const RunHistory = ({ onViewExecution }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const filteredExecutions = useMemo(() => {
    let result = MOCK_DATA.recentExecutions;
    
    if (statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter);
    }
    
    return result;
  }, [statusFilter, dateFilter]);
  
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Run History</h1>
        <p className="page-subtitle">View all test execution history and results</p>
      </div>
      
      {/* Filter Bar */}
      <div className="filter-bar">
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
          <option value="error">Error</option>
        </select>
        <select 
          className="filter-select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      
      {/* Executions Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Status</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Triggered By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExecutions.map(execution => (
                <tr key={execution.id}>
                  <td>
                    <span className="table-link" onClick={() => onViewExecution(execution.id)}>
                      {execution.testName}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={execution.status} />
                  </td>
                  <td>{Utils.formatDateTime(execution.startTime)}</td>
                  <td>{Utils.formatDuration(execution.duration)}</td>
                  <td>Manual</td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm btn-icon-only"
                      onClick={() => onViewExecution(execution.id)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn btn-ghost btn-sm btn-icon-only"
                      title="Re-run Test"
                    >
                      <i className="fas fa-redo"></i>
                    </button>
                    <button 
                      className="btn btn-ghost btn-sm btn-icon-only"
                      title="Download Report"
                    >
                      <i className="fas fa-download"></i>
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

// ===== Create Test Page =====
const CreateTest = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    task: '',
    tags: '',
    maxSteps: 25,
    timeout: 120,
    browser: 'chrome',
    headless: false,
    captureScreenshots: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Test created successfully! (This is a demo)');
    onNavigate('tests');
  };
  
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Create New Test</h1>
        <p className="page-subtitle">Define your automated test case</p>
      </div>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div style={{marginBottom: 'var(--spacing-6)'}}>
              <h3 style={{marginBottom: 'var(--spacing-4)', color: 'var(--text)'}}>Basic Information</h3>
              
              <div style={{marginBottom: 'var(--spacing-4)'}}>
                <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                  Test Name *
                </label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="filter-input"
                  style={{width: '100%'}}
                  placeholder="e.g., Login Flow Automation"
                  required
                />
              </div>
              
              <div style={{marginBottom: 'var(--spacing-4)'}}>
                <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                  Description
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="filter-input"
                  style={{width: '100%', minHeight: '80px', resize: 'vertical'}}
                  placeholder="Describe what this test does..."
                />
              </div>
              
              <div style={{marginBottom: 'var(--spacing-4)'}}>
                <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                  Task Instructions *
                </label>
                <textarea 
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  className="filter-input"
                  style={{width: '100%', minHeight: '120px', resize: 'vertical'}}
                  placeholder="Enter the natural language instructions for the browser agent... e.g., Navigate to example.com, log in with test credentials, verify the dashboard loads correctly"
                  required
                />
                <p style={{marginTop: 'var(--spacing-1)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)'}}>
                  Write clear, step-by-step instructions for the AI agent to follow
                </p>
              </div>
              
              <div style={{marginBottom: 'var(--spacing-4)'}}>
                <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                  Tags
                </label>
                <input 
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="filter-input"
                  style={{width: '100%'}}
                  placeholder="e.g., authentication, smoke-test, critical"
                />
                <p style={{marginTop: 'var(--spacing-1)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)'}}>
                  Comma-separated tags for organization
                </p>
              </div>
            </div>
            
            {/* Configuration */}
            <div style={{marginBottom: 'var(--spacing-6)'}}>
              <h3 style={{marginBottom: 'var(--spacing-4)', color: 'var(--text)'}}>Configuration</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)'}}>
                <div>
                  <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                    Max Steps
                  </label>
                  <input 
                    type="number"
                    name="maxSteps"
                    value={formData.maxSteps}
                    onChange={handleChange}
                    className="filter-input"
                    style={{width: '100%'}}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                    Timeout (seconds)
                  </label>
                  <input 
                    type="number"
                    name="timeout"
                    value={formData.timeout}
                    onChange={handleChange}
                    className="filter-input"
                    style={{width: '100%'}}
                    min="30"
                    max="600"
                  />
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)'}}>
                    Browser
                  </label>
                  <select 
                    name="browser"
                    value={formData.browser}
                    onChange={handleChange}
                    className="filter-select"
                    style={{width: '100%'}}
                  >
                    <option value="chrome">Chrome</option>
                    <option value="firefox">Firefox</option>
                    <option value="edge">Edge</option>
                  </select>
                </div>
              </div>
              
              <div style={{display: 'flex', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-4)'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer'}}>
                  <input 
                    type="checkbox"
                    name="headless"
                    checked={formData.headless}
                    onChange={handleChange}
                  />
                  <span style={{fontSize: 'var(--text-sm)'}}>Run headless</span>
                </label>
                
                <label style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer'}}>
                  <input 
                    type="checkbox"
                    name="captureScreenshots"
                    checked={formData.captureScreenshots}
                    onChange={handleChange}
                  />
                  <span style={{fontSize: 'var(--text-sm)'}}>Capture screenshots</span>
                </label>
              </div>
            </div>
            
            {/* Actions */}
            <div style={{display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border)'}}>
              <button type="button" className="btn btn-secondary" onClick={() => onNavigate('tests')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i>
                Create Test
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===== Main App Component =====
const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedExecutionId, setSelectedExecutionId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  
  const handleNavigate = useCallback((page) => {
    setActivePage(page);
    setSelectedExecutionId(null);
    if (page !== 'test-detail') {
      setSelectedTestId(null);
    }
  }, []);
  
  const handleViewExecution = useCallback((executionId) => {
    setSelectedExecutionId(executionId);
    setActivePage('execution-detail');
  }, []);
  
  const handleViewTest = useCallback((testId) => {
    setSelectedTestId(testId);
    setActivePage('test-detail');
  }, []);
  
  const handleRunTest = useCallback((testId) => {
    // Simulate starting a test
    alert(`Starting test: ${testId}`);
  }, []);
  
  const getBreadcrumb = () => {
    switch (activePage) {
      case 'dashboard':
        return ['Home', 'Dashboard'];
      case 'tests':
        return ['Home', 'Test Library'];
      case 'test-detail':
        const testName = MOCK_DATA.tests.find(t => t.id === selectedTestId)?.name || 'Test';
        return ['Home', 'Test Library', testName];
      case 'history':
        return ['Home', 'Run History'];
      case 'execution-detail':
        return ['Home', 'Run History', 'Execution Detail'];
      case 'create-test':
        return ['Home', 'Test Library', 'Create Test'];
      default:
        return ['Home'];
    }
  };
  
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onViewExecution={handleViewExecution}
            onViewTest={handleViewTest}
          />
        );
      case 'tests':
        return (
          <TestLibrary 
            onNavigate={handleNavigate}
            onViewTest={handleViewTest}
          />
        );
      case 'test-detail':
        return (
          <TestDetail
            testId={selectedTestId}
            onBack={() => handleNavigate('tests')}
            onRunTest={handleRunTest}
            onViewExecution={handleViewExecution}
          />
        );
      case 'history':
        return (
          <RunHistory 
            onViewExecution={handleViewExecution}
          />
        );
      case 'execution-detail':
        return (
          <ExecutionDetail 
            executionId={selectedExecutionId}
            onBack={() => handleNavigate('history')}
          />
        );
      case 'create-test':
        return (
          <CreateTest 
            onNavigate={handleNavigate}
          />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} onViewExecution={handleViewExecution} onViewTest={handleViewTest} />;
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
