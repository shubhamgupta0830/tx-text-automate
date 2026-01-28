/**
 * Test Automation UI v2 - Main React Application
 * Version: 2.1.0 - Added Agent View Refresh Button
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
        <div className="sidebar-logo-content">
          <span className="sidebar-logo-text">TestAutomate</span>
          <span className="sidebar-logo-subtitle">by Trinamix</span>
        </div>
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
            {MOCK_DATA.scenarios.filter(s => s.status === 'running').length > 0 && (
              <span className="nav-item-badge">{MOCK_DATA.scenarios.filter(s => s.status === 'running').length}</span>
            )}
          </a>
          <a 
            className={`nav-item ${activePage === 'flow-builder' ? 'active' : ''}`}
            onClick={() => onNavigate('flow-builder')}
          >
            <i className="fas fa-project-diagram"></i>
            Flow Builder
            <span className="beta-badge">beta</span>
          </a>
          <a 
            className={`nav-item ${activePage === 'variables' ? 'active' : ''}`}
            onClick={() => onNavigate('variables')}
          >
            <i className="fas fa-key"></i>
            Variables
            <span className="beta-badge">beta</span>
          </a>
        </div>
      </nav>
    </aside>
  );
};

// ===== Variable Selector Component =====
// Provides autocomplete dropdown for inserting variables into text inputs
const VariableSelector = ({ 
  variables, 
  isOpen, 
  onClose, 
  onSelect, 
  searchTerm,
  position 
}) => {
  const [filteredVariables, setFilteredVariables] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = React.useRef(null);
  
  // Filter variables based on search term
  useEffect(() => {
    if (!variables) {
      setFilteredVariables([]);
      return;
    }
    
    const term = searchTerm?.toLowerCase() || '';
    const filtered = variables.filter(v => 
      v.name.toLowerCase().includes(term) ||
      v.category?.toLowerCase().includes(term) ||
      v.description?.toLowerCase().includes(term)
    );
    setFilteredVariables(filtered);
    setSelectedIndex(0);
  }, [variables, searchTerm]);
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredVariables.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredVariables.length > 0) {
        e.preventDefault();
        onSelect(filteredVariables[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredVariables, selectedIndex, onSelect, onClose]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current && filteredVariables.length > 0) {
      const selectedItem = dropdownRef.current.querySelector('.variable-option.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="variable-selector-dropdown"
      ref={dropdownRef}
      style={position ? { top: position.top, left: position.left } : {}}
    >
      <div className="variable-selector-header">
        <i className="fas fa-key"></i>
        <span>Insert Variable</span>
        {searchTerm && <span className="search-term">"{searchTerm}"</span>}
      </div>
      
      {filteredVariables.length === 0 ? (
        <div className="variable-selector-empty">
          <i className="fas fa-search"></i>
          <span>No variables found</span>
        </div>
      ) : (
        <div className="variable-selector-list">
          {filteredVariables.map((variable, index) => (
            <div
              key={variable.id}
              className={`variable-option ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => onSelect(variable)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="variable-option-icon">
                <i className="fas fa-cube"></i>
              </div>
              <div className="variable-option-content">
                <span className="variable-option-name">{variable.name}</span>
                {variable.category && (
                  <span className="variable-option-category">{variable.category}</span>
                )}
                <span className="variable-option-fields">
                  {variable.fields?.map(f => f.label).join(', ')}
                </span>
              </div>
              <div className="variable-option-hint">
                <code>\{variable.name.replace(/\s+/g, '_')}</code>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="variable-selector-footer">
        <span><kbd>↑↓</kbd> Navigate</span>
        <span><kbd>Enter</kbd> Select</span>
        <span><kbd>Esc</kbd> Close</span>
      </div>
    </div>
  );
};

// ===== Variable Tag Component =====
// Displays an inserted variable as a styled tag in preview
const VariableTag = ({ variableName, variable, onClick }) => {
  return (
    <span 
      className={`variable-tag ${variable ? '' : 'invalid'}`}
      onClick={onClick}
      title={variable ? `${variable.name}: ${variable.fields?.map(f => f.label).join(', ')}` : 'Variable not found'}
    >
      <i className="fas fa-key"></i>
      <span>{variableName}</span>
      {!variable && <i className="fas fa-exclamation-triangle"></i>}
    </span>
  );
};

// ===== Header Component =====
const Header = ({ breadcrumb, searchQuery, onSearchChange, searchResults, onSelectSearchResult, onClearSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = React.useRef(null);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const showResults = isSearchFocused && searchQuery && searchQuery.length > 0;
  
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
        <div className="search-bar-container" ref={searchRef}>
          <div className="search-bar">
            <i className="fas fa-search" style={{color: 'var(--text-tertiary)'}}></i>
            <input 
              type="text" 
              placeholder="Search scenarios, executions..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <button 
                className="search-clear-btn"
                onClick={() => {
                  onClearSearch();
                  setIsSearchFocused(false);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="search-results-dropdown">
              {searchResults.scenarios.length === 0 && searchResults.executions.length === 0 ? (
                <div className="search-no-results">
                  <i className="fas fa-search"></i>
                  <span>No results found for "{searchQuery}"</span>
                </div>
              ) : (
                <>
                  {searchResults.scenarios.length > 0 && (
                    <div className="search-results-section">
                      <div className="search-results-section-title">
                        <i className="fas fa-bullseye"></i>
                        Scenarios ({searchResults.scenarios.length})
                      </div>
                      {searchResults.scenarios.slice(0, 5).map(scenario => (
                        <div 
                          key={scenario.id} 
                          className="search-result-item"
                          onClick={() => {
                            onSelectSearchResult('scenario', scenario.id);
                            setIsSearchFocused(false);
                          }}
                        >
                          <div className="search-result-icon">
                            <i className="fas fa-bullseye"></i>
                          </div>
                          <div className="search-result-content">
                            <div className="search-result-title">{scenario.name || scenario.objective}</div>
                            <div className="search-result-subtitle">
                              {scenario.steps?.length || 0} steps
                            </div>
                          </div>
                          <span className={`status-badge status-${scenario.status}`}>
                            {scenario.status}
                          </span>
                        </div>
                      ))}
                      {searchResults.scenarios.length > 5 && (
                        <div className="search-results-more">
                          +{searchResults.scenarios.length - 5} more scenarios
                        </div>
                      )}
                    </div>
                  )}
                  
                  {searchResults.executions.length > 0 && (
                    <div className="search-results-section">
                      <div className="search-results-section-title">
                        <i className="fas fa-play-circle"></i>
                        Executions ({searchResults.executions.length})
                      </div>
                      {searchResults.executions.slice(0, 5).map(execution => (
                        <div 
                          key={execution.id} 
                          className="search-result-item"
                          onClick={() => {
                            onSelectSearchResult('execution', execution.scenarioId, execution.id);
                            setIsSearchFocused(false);
                          }}
                        >
                          <div className="search-result-icon">
                            <i className="fas fa-play-circle"></i>
                          </div>
                          <div className="search-result-content">
                            <div className="search-result-title">{execution.scenarioName}</div>
                            <div className="search-result-subtitle">
                              {Utils.formatRelativeTime(execution.startTime)}
                            </div>
                          </div>
                          <span className={`status-badge status-${execution.status}`}>
                            {execution.status}
                          </span>
                        </div>
                      ))}
                      {searchResults.executions.length > 5 && (
                        <div className="search-results-more">
                          +{searchResults.executions.length - 5} more executions
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
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
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(null);
  
  // Get all screenshots from sub-steps
  const screenshots = subSteps
    .filter(ss => ss.screenshot)
    .map(ss => ({
      subStepOrder: ss.order || ss.stepNumber,
      screenshot: ss.screenshot,
      description: ss.description
    }));
  
  // Screenshot navigation handlers
  const openScreenshot = (index) => setSelectedScreenshotIndex(index);
  const closeScreenshot = () => setSelectedScreenshotIndex(null);
  const goToPrevScreenshot = (e) => {
    e.stopPropagation();
    setSelectedScreenshotIndex(prev => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };
  const goToNextScreenshot = (e) => {
    e.stopPropagation();
    setSelectedScreenshotIndex(prev => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };
  
  // Keyboard navigation for screenshots
  useEffect(() => {
    if (selectedScreenshotIndex === null) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedScreenshotIndex(prev => (prev > 0 ? prev - 1 : screenshots.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedScreenshotIndex(prev => (prev < screenshots.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setSelectedScreenshotIndex(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScreenshotIndex, screenshots.length]);
  
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
                  <div 
                    key={idx} 
                    className="screenshot-thumb clickable"
                    onClick={() => openScreenshot(idx)}
                    title="Click to view full size"
                  >
                    <img src={ss.screenshot} alt={ss.description} />
                    <div className="screenshot-label">Sub-step #{ss.subStepOrder}</div>
                    <div className="screenshot-overlay">
                      <i className="fas fa-search-plus"></i>
                    </div>
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
      
      {/* Screenshot Modal with Navigation */}
      {selectedScreenshotIndex !== null && screenshots[selectedScreenshotIndex] && (
        <div className="screenshot-modal" onClick={closeScreenshot}>
          <div className="screenshot-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeScreenshot}>
              <i className="fas fa-times"></i>
            </button>
            
            {/* Left Navigation Arrow */}
            {screenshots.length > 1 && (
              <button className="screenshot-nav-btn prev" onClick={goToPrevScreenshot}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            
            <img src={screenshots[selectedScreenshotIndex].screenshot} alt="Full size screenshot" />
            
            {/* Right Navigation Arrow */}
            {screenshots.length > 1 && (
              <button className="screenshot-nav-btn next" onClick={goToNextScreenshot}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
            
            {/* Screenshot Info */}
            <div className="screenshot-modal-info">
              <span className="screenshot-counter">{selectedScreenshotIndex + 1} / {screenshots.length}</span>
              <span className="screenshot-description">Sub-step #{screenshots[selectedScreenshotIndex].subStepOrder}</span>
            </div>
          </div>
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
            {scenario.tags?.filter(tag => tag !== 'custom').slice(0, 2).map(tag => (
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
      <p className="scenario-description">{scenario.steps?.[0]?.description || scenario.description}</p>
      
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
const Dashboard = ({ onNavigate, onViewScenario, onViewExecution, savedFlows = [], flowRuns = [], onViewFlowRun }) => {
  const { stats, scenarios, executions, recentActivity } = MOCK_DATA;
  
  // Get the 5 most recent flow runs
  const recentFlowRuns = useMemo(() => {
    return [...flowRuns]
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 5);
  }, [flowRuns]);
  
  // Get flow status badge color
  const getFlowStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'running': return 'orange';
      case 'cancelled': return 'gray';
      default: return 'blue';
    }
  };
  
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
          value={scenarios.length}
        />
        <StatCard 
          icon="fa-check-circle" 
          iconColor="green" 
          label="Passed" 
          value={scenarios.filter(s => s.status === 'passed').length}
        />
        <StatCard 
          icon="fa-times-circle" 
          iconColor="red" 
          label="Failed" 
          value={scenarios.filter(s => s.status === 'failed').length}
        />
        {scenarios.filter(s => s.status === 'running').length > 0 && (
          <StatCard 
            icon="fa-spinner" 
            iconColor="orange" 
            label="Running" 
            value={scenarios.filter(s => s.status === 'running').length}
          />
        )}
        {scenarios.filter(s => s.status === 'pending').length > 0 && (
          <StatCard 
            icon="fa-clock" 
            iconColor="gray" 
            label="Pending" 
            value={scenarios.filter(s => s.status === 'pending').length}
          />
        )}
        {scenarios.filter(s => s.status === 'cancelled').length > 0 && (
          <StatCard 
            icon="fa-ban" 
            iconColor="gray" 
            label="Cancelled" 
            value={scenarios.filter(s => s.status === 'cancelled').length}
          />
        )}
        {scenarios.filter(s => s.status === 'interrupted').length > 0 && (
          <StatCard 
            icon="fa-exclamation-triangle" 
            iconColor="yellow" 
            label="Interrupted" 
            value={scenarios.filter(s => s.status === 'interrupted').length}
          />
        )}
        {scenarios.filter(s => s.status === 'skipped').length > 0 && (
          <StatCard 
            icon="fa-forward" 
            iconColor="gray" 
            label="Skipped" 
            value={scenarios.filter(s => s.status === 'skipped').length}
          />
        )}
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
          <div className="quick-action-icon orange">
            <i className="fas fa-history"></i>
          </div>
          <span className="quick-action-label">View History</span>
        </div>
      </div>
      
      {/* Two Column Layout for Scenarios */}
      <div className="dashboard-two-column mb-4">
        {/* Saved Scenarios */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-bullseye"></i>
              Saved Scenarios
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('scenarios')}>
              View All
            </button>
          </div>
          <div className="flow-list">
            {scenarios.length === 0 ? (
              <div className="empty-state-small">
                <i className="fas fa-bullseye"></i>
                <p>No scenarios created yet</p>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('create-scenario')}>
                  Create Scenario
                </button>
              </div>
            ) : (
              scenarios.slice(0, 5).map(scenario => (
                <div 
                  key={scenario.id} 
                  className="flow-list-item clickable"
                  onClick={() => onViewScenario(scenario.id)}
                >
                  <div className={`flow-list-item-icon status-${scenario.status || 'pending'}`}>
                    <i className={`fas ${scenario.status === 'passed' ? 'fa-check' : scenario.status === 'failed' ? 'fa-times' : scenario.status === 'running' ? 'fa-spinner fa-spin' : 'fa-bullseye'}`}></i>
                  </div>
                  <div className="flow-list-item-content">
                    <div className="flow-list-item-name">{scenario.name || scenario.objective}</div>
                    <div className="flow-list-item-meta">
                      <span><i className="fas fa-list-ol"></i> {scenario.steps?.length || 0} steps</span>
                      <span><i className="fas fa-clock"></i> {Utils.formatRelativeTime(scenario.lastRun?.startTime || scenario.createdAt)}</span>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right flow-list-item-arrow"></i>
                </div>
              ))
            )}
            {scenarios.length > 5 && (
              <div className="flow-list-more" onClick={() => onNavigate('scenarios')}>
                <span>View all {scenarios.length} scenarios</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Scenario Runs */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-history"></i>
              Recent Scenario Runs
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('history')}>
              View All
            </button>
          </div>
          <div className="flow-list">
            {executions.length === 0 ? (
              <div className="empty-state-small">
                <i className="fas fa-history"></i>
                <p>No scenario runs yet</p>
                <span className="text-muted">Run a scenario to see history here</span>
              </div>
            ) : (
              executions.slice(0, 5).map(exec => (
                <div 
                  key={exec.id} 
                  className="flow-list-item clickable"
                  onClick={() => onViewExecution(exec.scenarioId, exec.id)}
                >
                  <div className={`flow-list-item-icon status-${exec.status === 'passed' ? 'completed' : exec.status}`}>
                    <i className={`fas ${exec.status === 'passed' || exec.status === 'completed' ? 'fa-check' : exec.status === 'failed' ? 'fa-times' : exec.status === 'running' ? 'fa-spinner fa-spin' : 'fa-clock'}`}></i>
                  </div>
                  <div className="flow-list-item-content">
                    <div className="flow-list-item-name">{Utils.truncateText(exec.scenarioObjective || exec.scenarioName, 40)}</div>
                    <div className="flow-list-item-meta">
                      <span className={`status-text ${exec.status === 'passed' ? 'completed' : exec.status}`}>
                        {exec.status.charAt(0).toUpperCase() + exec.status.slice(1)}
                      </span>
                      <span><i className="fas fa-clock"></i> {Utils.formatRelativeTime(exec.startTime)}</span>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right flow-list-item-arrow"></i>
                </div>
              ))
            )}
            {executions.length > 5 && (
              <div className="flow-list-more" onClick={() => onNavigate('history')}>
                <span>View all {executions.length} runs</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Folder Tree Item Component =====
const FolderTreeItem = ({ folder, folders, scenarios, level = 0, selectedFolderId, onSelectFolder, onCreateFolder, onRenameFolder, onDeleteFolder, expandedFolders, onToggleExpand }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const contextMenuRef = React.useRef(null);
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };
    
    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);
  
  const childFolders = folders.filter(f => f.parentId === folder.id);
  const isExpanded = expandedFolders[folder.id] !== false; // Default to expanded
  const hasChildren = childFolders.length > 0;
  
  // Count scenarios in this folder and all subfolders
  const countScenariosInFolder = (folderId) => {
    let count = scenarios.filter(s => s.folderId === folderId).length;
    const children = folders.filter(f => f.parentId === folderId);
    children.forEach(child => {
      count += countScenariosInFolder(child.id);
    });
    return count;
  };
  
  const scenarioCount = countScenariosInFolder(folder.id);
  
  const handleRename = () => {
    if (editName.trim() && editName !== folder.name) {
      onRenameFolder(folder.id, editName.trim());
    }
    setIsEditing(false);
    setShowContextMenu(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(folder.name);
      setIsEditing(false);
    }
  };
  
  return (
    <div className="folder-tree-item">
      <div 
        className={`folder-row ${selectedFolderId === folder.id ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => onSelectFolder(folder.id)}
      >
        <span 
          className={`folder-expand-icon ${hasChildren ? '' : 'invisible'}`}
          onClick={(e) => { e.stopPropagation(); onToggleExpand(folder.id); }}
        >
          <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
        </span>
        <i className={`fas fa-folder${isExpanded && hasChildren ? '-open' : ''} folder-icon`}></i>
        {isEditing ? (
          <input
            type="text"
            className="folder-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span className="folder-name">{folder.name}</span>
        )}
        <span className="folder-count">{scenarioCount}</span>
        <div className="folder-actions">
          <button 
            className="folder-action-btn"
            onClick={(e) => { e.stopPropagation(); setShowContextMenu(!showContextMenu); }}
            title="More options"
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
        {showContextMenu && (
          <div className="folder-context-menu" ref={contextMenuRef} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { onCreateFolder(folder.id); setShowContextMenu(false); }}>
              <i className="fas fa-folder-plus"></i> New Subfolder
            </button>
            {!folder.isDefault && (
              <>
                <button onClick={() => { setIsEditing(true); setShowContextMenu(false); }}>
                  <i className="fas fa-edit"></i> Rename
                </button>
                <button className="danger" onClick={() => { onDeleteFolder(folder.id); setShowContextMenu(false); }}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="folder-children">
          {childFolders.map(childFolder => (
            <FolderTreeItem
              key={childFolder.id}
              folder={childFolder}
              folders={folders}
              scenarios={scenarios}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Scenarios List Page =====
const ScenariosPage = ({ onViewScenario, onNavigate, onDeleteScenario }) => {
  const { scenarios, folders } = MOCK_DATA;
  const [filter, setFilter] = useState('all');
  const [selectedFolderId, setSelectedFolderId] = useState(null); // null means show all
  const [expandedFolders, setExpandedFolders] = useState({});
  const [, forceUpdate] = useState(0);
  
  // Get root folders (folders without parent)
  const rootFolders = folders.filter(f => f.parentId === null);
  
  // Get all descendant folder IDs for a given folder
  const getDescendantFolderIds = (folderId) => {
    const descendants = [folderId];
    const children = folders.filter(f => f.parentId === folderId);
    children.forEach(child => {
      descendants.push(...getDescendantFolderIds(child.id));
    });
    return descendants;
  };
  
  // Scenarios filtered by folder only (for filter counts)
  const folderFilteredScenarios = useMemo(() => {
    if (!selectedFolderId) return scenarios;
    const folderIds = getDescendantFolderIds(selectedFolderId);
    return scenarios.filter(s => folderIds.includes(s.folderId));
  }, [scenarios, selectedFolderId, folders]);
  
  const filteredScenarios = useMemo(() => {
    let result = folderFilteredScenarios;
    
    // Filter by status
    if (filter !== 'all') {
      result = result.filter(s => s.status === filter);
    }
    
    return result;
  }, [folderFilteredScenarios, filter]);
  
  const handleToggleExpand = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const handleCreateFolder = (parentId) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      parentId: parentId,
      isExpanded: false,
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    MOCK_DATA.folders.push(newFolder);
    StorageHelper.saveFolders(MOCK_DATA.folders);
    // Expand parent folder
    setExpandedFolders(prev => ({ ...prev, [parentId]: true }));
    forceUpdate(n => n + 1);
  };
  
  const handleRenameFolder = (folderId, newName) => {
    const folderIndex = MOCK_DATA.folders.findIndex(f => f.id === folderId);
    if (folderIndex >= 0) {
      MOCK_DATA.folders[folderIndex].name = newName;
      StorageHelper.saveFolders(MOCK_DATA.folders);
      forceUpdate(n => n + 1);
    }
  };
  
  const handleDeleteFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder || folder.isDefault) return;
    
    // Get all descendant folders
    const descendantIds = getDescendantFolderIds(folderId);
    
    // Move all scenarios in this folder and subfolders to root
    const rootFolder = folders.find(f => f.isDefault);
    MOCK_DATA.scenarios.forEach(s => {
      if (descendantIds.includes(s.folderId)) {
        s.folderId = rootFolder?.id || null;
      }
    });
    
    // Remove the folder and all descendants
    MOCK_DATA.folders = MOCK_DATA.folders.filter(f => !descendantIds.includes(f.id));
    
    StorageHelper.saveFolders(MOCK_DATA.folders);
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
    forceUpdate(n => n + 1);
  };
  
  const getSelectedFolderName = () => {
    if (!selectedFolderId) return 'All Scenarios';
    const folder = folders.find(f => f.id === selectedFolderId);
    return folder ? folder.name : 'All Scenarios';
  };
  
  return (
    <div className="page-content scenarios-page-with-folders">
      {/* Folder Tree Panel */}
      <div className="folder-tree-panel">
        <div className="folder-tree-header">
          <h3>Folders</h3>
          <button 
            className="btn-icon" 
            onClick={() => handleCreateFolder(null)}
            title="Create new folder"
          >
            <i className="fas fa-folder-plus"></i>
          </button>
        </div>
        <div className="folder-tree">
          <div 
            className={`folder-row all-scenarios ${selectedFolderId === null ? 'selected' : ''}`}
            onClick={() => setSelectedFolderId(null)}
          >
            <i className="fas fa-layer-group folder-icon"></i>
            <span className="folder-name">All Scenarios</span>
            <span className="folder-count">{scenarios.length}</span>
          </div>
          {rootFolders.map(folder => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              folders={folders}
              scenarios={scenarios}
              level={0}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
              onCreateFolder={handleCreateFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              expandedFolders={expandedFolders}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>
      </div>
      
      {/* Scenarios Content */}
      <div className="scenarios-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">{getSelectedFolderName()}</h1>
            <p className="page-subtitle">{folderFilteredScenarios.length} scenario{folderFilteredScenarios.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('create-scenario', { folderId: selectedFolderId })}>
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
            All ({folderFilteredScenarios.length})
          </button>
          <button 
            className={`filter-btn success ${filter === 'passed' ? 'active' : ''}`}
            onClick={() => setFilter('passed')}
          >
            Passed ({folderFilteredScenarios.filter(s => s.status === 'passed').length})
          </button>
          <button 
            className={`filter-btn error ${filter === 'failed' ? 'active' : ''}`}
            onClick={() => setFilter('failed')}
          >
            Failed ({folderFilteredScenarios.filter(s => s.status === 'failed').length})
          </button>
          {folderFilteredScenarios.filter(s => s.status === 'running').length > 0 && (
            <button 
              className={`filter-btn info ${filter === 'running' ? 'active' : ''}`}
              onClick={() => setFilter('running')}
            >
              Running ({folderFilteredScenarios.filter(s => s.status === 'running').length})
            </button>
          )}
          {folderFilteredScenarios.filter(s => s.status === 'pending').length > 0 && (
            <button 
              className={`filter-btn warning ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({folderFilteredScenarios.filter(s => s.status === 'pending').length})
            </button>
          )}
          {folderFilteredScenarios.filter(s => s.status === 'cancelled').length > 0 && (
            <button 
              className={`filter-btn warning ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled ({folderFilteredScenarios.filter(s => s.status === 'cancelled').length})
            </button>
          )}
          {folderFilteredScenarios.filter(s => s.status === 'interrupted').length > 0 && (
            <button 
              className={`filter-btn warning ${filter === 'interrupted' ? 'active' : ''}`}
              onClick={() => setFilter('interrupted')}
            >
              Interrupted ({folderFilteredScenarios.filter(s => s.status === 'interrupted').length})
            </button>
          )}
          {folderFilteredScenarios.filter(s => s.status === 'skipped').length > 0 && (
            <button 
              className={`filter-btn warning ${filter === 'skipped' ? 'active' : ''}`}
              onClick={() => setFilter('skipped')}
            >
              Skipped ({folderFilteredScenarios.filter(s => s.status === 'skipped').length})
            </button>
          )}
        </div>
        
        {/* Scenarios Grid */}
        <div className="scenarios-grid">
          {filteredScenarios.length > 0 ? (
            filteredScenarios.map(scenario => (
              <ScenarioCard 
                key={scenario.id} 
                scenario={scenario} 
                onClick={onViewScenario}
                onDelete={onDeleteScenario}
              />
            ))
          ) : (
            <div className="empty-state-inline">
              <i className="fas fa-folder-open"></i>
              <p>No scenarios in this folder</p>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('create-scenario', { folderId: selectedFolderId })}>
                Create Scenario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Scenario Detail Page =====
const ScenarioDetailPage = ({ scenarioId, executionId, onBack, onViewStepDetail, onEditScenario, onCloneScenario, onViewFlowRun }) => {
  const scenario = MOCK_DATA.scenarios.find(s => s.id === scenarioId);
  // Find execution by executionId if provided, otherwise find by scenarioId
  const execution = executionId 
    ? MOCK_DATA.executions.find(e => e.id === executionId)
    : MOCK_DATA.executions.find(e => e.scenarioId === scenarioId);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [activeTab, setActiveTab] = useState('live');
  const [isRunning, setIsRunning] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [runStatus, setRunStatus] = useState(null);
  const [, forceUpdate] = useState(0);
  const currentTaskIdRef = React.useRef(null);
  const isCancelledRef = React.useRef(false);
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [editedObjective, setEditedObjective] = useState(scenario.objective);
  const [showTaskOutputModal, setShowTaskOutputModal] = useState(false);
  const [showTaskInputModal, setShowTaskInputModal] = useState(false);
  
  // Check if execution is already running and set state accordingly
  useEffect(() => {
    if (execution && execution.status === 'running' && execution.metadata?.browserUseTaskId) {
      setIsRunning(true);
      currentTaskIdRef.current = execution.metadata.browserUseTaskId;
      setRunStatus('Task running...');
    }
  }, [execution]);
  
  // Scroll to top when scenario page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scenarioId, executionId]);
  
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
    isCancelledRef.current = false;
    
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
          stepOrder: step.order,
          stepDescription: step.description,
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
      
      // Persist data immediately after starting the run
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      StorageHelper.saveStats(MOCK_DATA.stats);
      
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
      
      // Store task ID for potential cancellation
      currentTaskIdRef.current = createResult.id;
      
      // Update execution with task ID
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].metadata.browserUseTaskId = createResult.id;
        MOCK_DATA.executions[execIndex].metadata.browserUseSessionId = createResult.sessionId;
      }
      
      // Store active task info for background tracking
      const activeTasks = StorageHelper.loadActiveTasks();
      activeTasks.push({
        taskId: createResult.id,
        scenarioId: scenario.id,
        executionId: newExecutionId,
        startTime: new Date().toISOString()
      });
      StorageHelper.saveActiveTasks(activeTasks);
      
      // Poll for completion with progress updates
      const finalResult = await BrowserUseAPI.pollTaskUntilComplete(
        createResult.id,
        (taskUpdate) => {
          // Check if cancelled
          if (isCancelledRef.current) {
            throw new Error('Run cancelled by user');
          }
          
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
            
            // Persist progress updates to localStorage
            StorageHelper.saveExecutions(MOCK_DATA.executions);
            
            forceUpdate(n => n + 1);
          }
        },
        2000,
        600000
      );
      
      // Check if cancelled after polling completes
      if (isCancelledRef.current) {
        return; // Already handled in handleCancelRun
      }
      
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
      
      // Persist final results to localStorage
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      StorageHelper.saveStats(MOCK_DATA.stats);
      
      // Remove from active tasks
      if (currentTaskIdRef.current) {
        StorageHelper.removeActiveTask(currentTaskIdRef.current);
      }
      
      setIsRunning(false);
      setRunStatus(null);
      currentTaskIdRef.current = null;
      forceUpdate(n => n + 1);
      
      const statusEmoji = finalExecution.status === 'passed' ? '✅' : '❌';
      alert(`${statusEmoji} Scenario execution complete!\n\nStatus: ${finalExecution.status.toUpperCase()}\nSteps: ${finalResult.steps?.length || 0} browser actions\n${finalResult.output ? `\nOutput: ${finalResult.output}` : ''}`);
      
    } catch (error) {
      // Check if this was a cancellation
      if (error.message === 'Run cancelled by user') {
        return; // Already handled in handleCancelRun
      }
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
      
      // Persist failure state to localStorage
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      StorageHelper.saveStats(MOCK_DATA.stats);
      
      // Remove from active tasks
      if (currentTaskIdRef.current) {
        StorageHelper.removeActiveTask(currentTaskIdRef.current);
      }
      
      setIsRunning(false);
      setRunStatus(null);
      currentTaskIdRef.current = null;
      forceUpdate(n => n + 1);
      
      alert(`❌ Error executing scenario: ${error.message}`);
    }
  };
  
  // Function to cancel the running scenario
  const handleCancelRun = async () => {
    if (!currentTaskIdRef.current || isCancelling) return;
    
    setIsCancelling(true);
    setRunStatus('Cancelling run...');
    
    // Set the cancellation flag - this will stop the polling loop
    isCancelledRef.current = true;
    
    // Try to stop the task via API (best effort, may fail)
    try {
      await BrowserUseAPI.stopTask(currentTaskIdRef.current);
    } catch (apiError) {
      console.warn('Could not stop task via API (continuing with local cancellation):', apiError);
    }
    
    // Update execution status to cancelled
    const execIndex = MOCK_DATA.executions.findIndex(e => e.metadata?.browserUseTaskId === currentTaskIdRef.current);
    if (execIndex >= 0) {
      MOCK_DATA.executions[execIndex].status = 'cancelled';
      MOCK_DATA.executions[execIndex].endTime = new Date().toISOString();
      MOCK_DATA.executions[execIndex].logs.push({
        timestamp: new Date().toISOString(),
        level: 'warning',
        message: 'Run cancelled by user'
      });
    }
    
    // Update scenario status
    const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
    if (scenarioIndex >= 0) {
      MOCK_DATA.scenarios[scenarioIndex].status = 'cancelled';
      MOCK_DATA.scenarios[scenarioIndex].lastRun = {
        ...MOCK_DATA.scenarios[scenarioIndex].lastRun,
        status: 'cancelled',
        date: new Date().toISOString()
      };
    }
    
    MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
    
    // Persist cancellation state to localStorage
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    StorageHelper.saveExecutions(MOCK_DATA.executions);
    StorageHelper.saveStats(MOCK_DATA.stats);
    
    // Remove from active tasks
    if (currentTaskIdRef.current) {
      StorageHelper.removeActiveTask(currentTaskIdRef.current);
    }
    
    setIsRunning(false);
    setIsCancelling(false);
    setRunStatus(null);
    currentTaskIdRef.current = null;
    forceUpdate(n => n + 1);
    
    alert('⚠️ Run cancelled successfully');
  };
  
  // Function to save the edited objective
  const handleSaveObjective = () => {
    if (!editedObjective.trim()) {
      alert('Objective cannot be empty');
      return;
    }
    
    const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
    if (scenarioIndex >= 0) {
      MOCK_DATA.scenarios[scenarioIndex].objective = editedObjective;
      MOCK_DATA.scenarios[scenarioIndex].updatedAt = new Date().toISOString();
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      scenario.objective = editedObjective;
      setIsEditingObjective(false);
      forceUpdate(n => n + 1);
    }
  };
  
  const handleCancelEditObjective = () => {
    setEditedObjective(scenario.objective);
    setIsEditingObjective(false);
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
          {/* Cancel button - only show when actively running */}
          {isRunning && execution?.status === 'running' && (
            <button 
              className="btn btn-danger"
              onClick={handleCancelRun}
              disabled={isCancelling}
            >
              <i className={`fas ${isCancelling ? 'fa-spinner fa-spin' : 'fa-stop'}`}></i>
              {isCancelling ? 'Cancelling...' : 'Cancel Run'}
            </button>
          )}
          
          {/* Only show Edit button if scenario has NOT been run */}
          {!scenario.lastRun ? (
            <button className="btn btn-secondary" onClick={() => onEditScenario && onEditScenario(scenario)}>
              <i className="fas fa-edit"></i>
              Edit
            </button>
          ) : (
            <button className="btn btn-secondary" disabled title="Cannot edit a scenario that has been run">
              <i className="fas fa-edit"></i>
              Edit
            </button>
          )}
          
          {/* Clone button - always visible */}
          <button className="btn btn-secondary" onClick={() => onCloneScenario && onCloneScenario(scenario)}>
            <i className="fas fa-copy"></i>
            Clone
          </button>
          
          {/* Export as Demo button */}
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              if (typeof exportDemoScenario === 'function') {
                exportDemoScenario(scenario.id);
                alert('Demo scenario exported! Check the browser console for JSON output (also copied to clipboard).');
              } else {
                alert('Export function not available. Please refresh the page.');
              }
            }}
            title="Export this scenario with execution data as a demo scenario"
          >
            <i className="fas fa-download"></i>
            Export Scenario
          </button>
          
          {/* Only show Run Now button if scenario has NOT been run */}
          {!scenario.lastRun ? (
            <button className="btn btn-primary" onClick={handleRunScenario}>
              <i className="fas fa-play"></i>
              Run Now
            </button>
          ) : (
            <button className="btn btn-primary" disabled title="Scenario has already been run">
              <i className="fas fa-play"></i>
              Run Now
            </button>
          )}
        </div>
      </div>
      
      {/* Objective Card */}
      <div className="objective-card card mb-4">
        <div className="objective-content">
          {isEditingObjective ? (
            <div className="objective-edit-container">
              <input
                type="text"
                className="objective-edit-input"
                value={editedObjective}
                onChange={(e) => setEditedObjective(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveObjective();
                  } else if (e.key === 'Escape') {
                    handleCancelEditObjective();
                  }
                }}
              />
              <div className="objective-edit-actions">
                <button className="btn btn-primary btn-sm" onClick={handleSaveObjective}>
                  <i className="fas fa-check"></i>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancelEditObjective}>
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="objective-title-container">
              <div className="objective-title-left">
                <h2 className="objective-title">{scenario.objective}</h2>
                <button 
                  className="btn-icon btn-edit-objective" 
                  onClick={() => setIsEditingObjective(true)}
                  title="Edit objective"
                >
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              <div className="objective-title-right">
                <div className={`objective-status ${Utils.getStatusClass(execution?.status || scenario.status)}`}>
                  <i className={`fas ${Utils.getStatusIcon(execution?.status || scenario.status)}`}></i>
                  <span>{(execution?.status || scenario.status).toUpperCase()}</span>
                </div>
                <div className="objective-tags">
                  {scenario.tags?.filter(tag => tag !== 'custom').map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task Input/Output Section - shown when execution exists */}
        {execution && execution.rawApiResponse && (
          <div className="task-io-section">
            <div className="task-io-grid">
              {execution.rawApiResponse.task && (
                <div className="task-io-item">
                  <div className="task-io-label">
                    <i className="fas fa-inbox"></i>
                    <span>Task Input</span>
                  </div>
                  <div className="task-io-content task-input task-io-preview">
                    {execution.rawApiResponse.task.split('\n').slice(0, 3).join('\n')}
                    {execution.rawApiResponse.task.split('\n').length > 3 && '...'}
                  </div>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowTaskInputModal(true)}
                  >
                    <i className="fas fa-expand-alt"></i>
                    View Full Text
                  </button>
                </div>
              )}
              {execution.rawApiResponse.output && (
                <div className="task-io-item">
                  <div className="task-io-label">
                    <i className="fas fa-check-circle"></i>
                    <span>Task Output</span>
                  </div>
                  <div className="task-io-content task-output task-io-preview">
                    {execution.rawApiResponse.output.split('\n').slice(0, 3).join('\n')}
                    {execution.rawApiResponse.output.split('\n').length > 3 && '...'}
                  </div>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowTaskOutputModal(true)}
                  >
                    <i className="fas fa-expand-alt"></i>
                    View Full Text
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="objective-meta">
          <div className="meta-item">
            <i className="fas fa-list-ol"></i>
            <span>{scenario.steps?.length || 0} Steps</span>
          </div>
          {execution ? (
            <>
              <div className="meta-item">
                <i className="fas fa-hashtag"></i>
                <span>ID: {execution.id}</span>
              </div>
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
              {execution.flowRunId && (
                <div className="meta-item flow-run-link">
                  <button 
                    className="flow-link-btn"
                    onClick={() => onViewFlowRun && onViewFlowRun(execution.flowRunId)}
                    title="View flow run"
                  >
                    <i className="fas fa-project-diagram"></i>
                    <span>Part of Flow Run</span>
                  </button>
                </div>
              )}
              {execution.metadata?.triggeredBy && !execution.flowRunId && (
                <div className="meta-item">
                  <i className="fas fa-user"></i>
                  <span>{execution.metadata.triggeredBy}</span>
                </div>
              )}
            </>
          ) : scenario.lastRun && (
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
      
      {/* Tabs */}
      <div className="tabs mb-4">
        <button 
          className={`tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          <i className="fas fa-eye"></i>
          Live
        </button>
        <button 
          className={`tab ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          <i className="fas fa-robot"></i>
          Agent View
        </button>
        <button 
          className={`tab ${activeTab === 'screenshots' ? 'active' : ''}`}
          onClick={() => setActiveTab('screenshots')}
        >
          <i className="fas fa-camera"></i>
          Screenshots
        </button>
      </div>
      
      {/* Live Browser Tab Content */}
      {activeTab === 'live' && (
        execution ? (
          <LiveBrowserTab execution={execution} isRunning={isRunning} />
        ) : (
          <div className="card">
            <div className="empty-state">
              <i className="fas fa-eye"></i>
              <h3>No Execution Data</h3>
              <p>Run this scenario to see the live browser interaction.</p>
            </div>
          </div>
        )
      )}
      
      {/* Agent View Tab Content */}
      {activeTab === 'agent' && (
        execution ? (
          <AgentViewTab execution={execution} />
        ) : (
          <div className="card">
            <div className="empty-state">
              <i className="fas fa-robot"></i>
              <h3>No Execution Data</h3>
              <p>Run this scenario to see the agent view with browser actions.</p>
            </div>
          </div>
        )
      )}
      
      {/* Screenshots Tab Content */}
      {activeTab === 'screenshots' && (
        execution ? (
          <ScreenshotsGalleryTab execution={execution} />
        ) : (
          <div className="card">
            <div className="empty-state">
              <i className="fas fa-camera"></i>
              <h3>No Execution Data</h3>
              <p>Run this scenario to see screenshots from the agent journey.</p>
            </div>
          </div>
        )
      )}
      
      {/* Task Output Modal */}
      {showTaskOutputModal && execution?.rawApiResponse?.output && (
        <div className="modal-overlay" onClick={() => setShowTaskOutputModal(false)}>
          <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fas fa-check-circle"></i>
                Task Output
              </h3>
              <button className="modal-close" onClick={() => setShowTaskOutputModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <pre className="task-io-modal-content">{execution.rawApiResponse.output}</pre>
            </div>
          </div>
        </div>
      )}
      
      {/* Task Input Modal */}
      {showTaskInputModal && execution?.rawApiResponse?.task && (
        <div className="modal-overlay" onClick={() => setShowTaskInputModal(false)}>
          <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fas fa-inbox"></i>
                Task Input
              </h3>
              <button className="modal-close" onClick={() => setShowTaskInputModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <pre className="task-io-modal-content">{execution.rawApiResponse.task}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Live Browser Tab Component - Real-time Browser View =====
const LiveBrowserTab = ({ execution, isRunning }) => {
  const [liveUrl, setLiveUrl] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [sessionStatus, setSessionStatus] = React.useState('unknown');
  
  // Fetch session liveUrl
  React.useEffect(() => {
    const fetchLiveUrl = async () => {
      // Check if we already have liveUrl in metadata
      if (execution?.metadata?.liveUrl) {
        setLiveUrl(execution.metadata.liveUrl);
        setIsLoading(false);
        return;
      }
      
      // If we have sessionId, fetch it
      const sessionId = execution?.metadata?.browserUseSessionId || execution?.rawApiResponse?.sessionId;
      if (!sessionId) {
        setError('No session ID available');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const session = await BrowserUseAPI.getSession(sessionId);
        setLiveUrl(session.liveUrl);
        setSessionStatus(session.status);
        
        // Store liveUrl in execution metadata for future use
        if (execution?.metadata) {
          execution.metadata.liveUrl = session.liveUrl;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching session liveUrl:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchLiveUrl();
    
    // Refresh every 5 seconds if running
    let interval;
    if (isRunning) {
      interval = setInterval(fetchLiveUrl, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [execution, isRunning]);
  
  if (isLoading) {
    return (
      <div className="card">
        <div className="empty-state">
          <i className="fas fa-spinner fa-spin"></i>
          <h3>Loading Live View</h3>
          <p>Fetching session details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card">
        <div className="empty-state">
          <i className="fas fa-eye-slash"></i>
          <h3>Nothing to Display</h3>
        </div>
      </div>
    );
  }
  
  // Check if execution was cancelled
  if (execution?.status === 'cancelled') {
    return (
      <div className="card">
        <div className="empty-state">
          <i className="fas fa-eye-slash"></i>
          <h3>Nothing to Display</h3>
        </div>
      </div>
    );
  }
  
  if (!liveUrl) {
    return (
      <div className="card">
        <div className="empty-state">
          <i className="fas fa-eye-slash"></i>
          <h3>Nothing to Display</h3>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <i className="fas fa-eye"></i>
          Live Browser View
        </h3>
        <div className="card-actions">
          {isRunning && (
            <span className="status-badge running">
              <i className="fas fa-circle"></i>
              Live
            </span>
          )}
          <a 
            href={liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <i className="fas fa-external-link-alt"></i>
            Open in New Tab
          </a>
        </div>
      </div>
      <div className="live-browser-container">
        <iframe
          src={liveUrl}
          title="Live Browser View"
          className="live-browser-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
      <div className="live-view-info">
        <div className="info-item">
          <i className="fas fa-info-circle"></i>
          <span>This is a real-time view of the browser as the automation runs. You may need to authenticate if prompted.</span>
        </div>
      </div>
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
  
  // Reverse the order so latest step is first - memoized to prevent recreating on every render
  const reversedAgentSteps = React.useMemo(() => {
    return [...agentSteps].reverse();
  }, [agentSteps]);
  
  const toggleStep = (stepNumber) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };
  
  const expandAll = () => {
    const allExpanded = {};
    reversedAgentSteps.forEach((step, index) => {
      allExpanded[step.number || index] = true;
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
          {reversedAgentSteps.map((step, index) => (
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

// ===== Screenshots Gallery Tab Component =====
const ScreenshotsGalleryTab = ({ execution }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Get raw API response if available
  const rawResponse = execution.rawApiResponse;
  const agentSteps = rawResponse?.steps || [];
  
  // Collect all screenshots from agent steps - memoized to prevent recreating on every render
  const screenshots = React.useMemo(() => {
    return agentSteps
      .map((step, index) => ({
        stepNumber: step.number || index + 1,
        url: step.screenshotUrl,
        pageUrl: step.url,
        memory: step.memory,
        nextGoal: step.nextGoal
      }))
      .filter(item => item.url);
  }, [agentSteps]);
  
  const openScreenshot = (url, index) => {
    setSelectedScreenshot(url);
    setSelectedIndex(index);
  };
  
  const closeScreenshot = React.useCallback(() => {
    setSelectedScreenshot(null);
  }, []);
  
  const goToPrev = React.useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedIndex(prev => {
      if (prev > 0) {
        const newIndex = prev - 1;
        setSelectedScreenshot(screenshots[newIndex].url);
        return newIndex;
      }
      return prev;
    });
  }, [screenshots]);
  
  const goToNext = React.useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedIndex(prev => {
      if (prev < screenshots.length - 1) {
        const newIndex = prev + 1;
        setSelectedScreenshot(screenshots[newIndex].url);
        return newIndex;
      }
      return prev;
    });
  }, [screenshots]);
  
  // Keyboard navigation
  React.useEffect(() => {
    if (!selectedScreenshot) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeScreenshot();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScreenshot, goToPrev, goToNext, closeScreenshot]);
  
  if (screenshots.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <i className="fas fa-camera"></i>
          <h3>No Screenshots Available</h3>
          <p>This execution doesn't have any screenshots. Screenshots are captured during agent execution.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="screenshots-tab-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-camera"></i>
            Agent Journey Screenshots ({screenshots.length})
          </h3>
        </div>
        
        <div className="screenshots-grid">
          {screenshots.map((screenshot, index) => (
            <div 
              key={index} 
              className="screenshot-grid-item"
              onClick={() => openScreenshot(screenshot.url, index)}
            >
              <div className="screenshot-thumbnail">
                <img src={screenshot.url} alt={`Screenshot from step ${screenshot.stepNumber}`} />
                <div className="screenshot-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
              <div className="screenshot-info">
                <div className="screenshot-step-number">
                  <i className="fas fa-brain"></i>
                  Step {screenshot.stepNumber}
                </div>
                {screenshot.pageUrl && (
                  <div className="screenshot-url" title={screenshot.pageUrl}>
                    <i className="fas fa-globe"></i>
                    {screenshot.pageUrl.length > 40 ? screenshot.pageUrl.substring(0, 40) + '...' : screenshot.pageUrl}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={closeScreenshot}>
          <div className="screenshot-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeScreenshot}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-navigation">
              <button 
                className="modal-nav-btn prev" 
                onClick={goToPrev}
                disabled={selectedIndex === 0}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="modal-nav-btn next" 
                onClick={goToNext}
                disabled={selectedIndex === screenshots.length - 1}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <img src={selectedScreenshot} alt="Full size screenshot" />
            
            <div className="modal-info">
              <div className="modal-step-number">
                Step {screenshots[selectedIndex].stepNumber} of {screenshots.length}
              </div>
              {screenshots[selectedIndex].pageUrl && (
                <div className="modal-page-url">
                  <i className="fas fa-globe"></i>
                  <a href={screenshots[selectedIndex].pageUrl} target="_blank" rel="noopener noreferrer">
                    {screenshots[selectedIndex].pageUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== History Page =====
const HistoryPage = ({ onViewExecution, onViewFlowRun }) => {
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
                <th>Duration</th>
                <th>Started</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {executions.map(exec => (
                <tr 
                  key={exec.id} 
                  className="clickable-row"
                  onClick={() => onViewExecution(exec.scenarioId, exec.id)}
                >
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
                  <td>{Utils.formatDuration(exec.duration)}</td>
                  <td>{Utils.formatRelativeTime(exec.startTime)}</td>
                  <td>
                    {exec.flowRunId ? (
                      <button 
                        className="flow-link-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewFlowRun && onViewFlowRun(exec.flowRunId);
                        }}
                        title="View flow run"
                      >
                        <i className="fas fa-project-diagram"></i>
                        Flow
                      </button>
                    ) : (
                      <span className="source-manual">
                        <i className="fas fa-user"></i>
                        Manual
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewExecution(exec.scenarioId, exec.id);
                      }}
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
const CreateScenarioPage = ({ onBack, onNavigate, onScenarioCreated, editingScenario, cloningScenario, initialFolderId }) => {
  const { folders } = MOCK_DATA;
  // Pre-fill data if editing an existing scenario
  const isEditMode = !!editingScenario;
  const isCloneMode = !!cloningScenario;
  const sourceScenario = editingScenario || cloningScenario;
  
  const [objective, setObjective] = useState(
    isCloneMode && cloningScenario?.objective ? `${cloningScenario.objective} (Copy)` : sourceScenario?.objective || ''
  );
  const [selectedFolderId, setSelectedFolderId] = useState(
    sourceScenario?.folderId || initialFolderId || folders.find(f => f.isDefault)?.id || null
  );
  const [stepsText, setStepsText] = useState(
    sourceScenario?.steps?.map(s => s.description).join('\n') || ''
  );
  const [parsedSteps, setParsedSteps] = useState([]);
  const [stepsMode, setStepsMode] = useState((isEditMode || isCloneMode) ? 'custom' : null); // 'demo' or 'custom'
  const [demoModified, setDemoModified] = useState(false); // Track if demo steps were edited
  const [showDemoWarning, setShowDemoWarning] = useState(false); // Show warning modal when editing demo
  const [isRunning, setIsRunning] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [runStatus, setRunStatus] = useState(null);
  const [runProgress, setRunProgress] = useState(null);
  const currentTaskIdRef = React.useRef(null);
  const currentExecutionRef = React.useRef(null);
  const currentScenarioRef = React.useRef(null);
  const isCancelledRef = React.useRef(false);
  
  // Variable selector state
  const [variables, setVariables] = useState([]);
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [variableSearchTerm, setVariableSearchTerm] = useState('');
  const [variableSelectorPosition, setVariableSelectorPosition] = useState(null);
  const [variableTriggerIndex, setVariableTriggerIndex] = useState(-1);
  const stepsTextareaRef = React.useRef(null);
  
  // Load variables on mount
  useEffect(() => {
    const savedVariables = StorageHelper.loadVariables();
    if (savedVariables && savedVariables.length > 0) {
      setVariables(savedVariables);
    } else {
      setVariables(MOCK_DATA.variables || []);
    }
  }, []);
  
  // Handle backslash key to trigger variable selector
  const handleStepsKeyDown = (e) => {
    // Allow variable insertion for custom mode or modified demo
    if (e.key === '\\' && (stepsMode === 'custom' || demoModified)) {
      e.preventDefault();
      const textarea = stepsTextareaRef.current;
      if (!textarea) return;
      
      // Get cursor position
      const cursorPos = textarea.selectionStart;
      
      // Insert backslash
      const newText = stepsText.slice(0, cursorPos) + '\\' + stepsText.slice(cursorPos);
      setStepsText(newText);
      
      // Calculate position for dropdown
      const textareaRect = textarea.getBoundingClientRect();
      
      // Get position relative to textarea
      setVariableSelectorPosition({
        top: textareaRect.top + 30,
        left: textareaRect.left + 20
      });
      
      setVariableTriggerIndex(cursorPos);
      setVariableSearchTerm('');
      setShowVariableSelector(true);
      
      // Set cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = cursorPos + 1;
        textarea.selectionEnd = cursorPos + 1;
      }, 0);
    } else if (showVariableSelector) {
      // If variable selector is open, capture typing for search
      if (e.key === 'Escape') {
        setShowVariableSelector(false);
      } else if (e.key === 'Backspace') {
        if (variableSearchTerm.length > 0) {
          setVariableSearchTerm(prev => prev.slice(0, -1));
        } else {
          setShowVariableSelector(false);
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        // Add character to search term
        setVariableSearchTerm(prev => prev + e.key);
      }
    }
  };
  
  // Handle variable selection
  const handleVariableSelect = (variable) => {
    const textarea = stepsTextareaRef.current;
    if (!textarea) return;
    
    // Create variable reference using variable name
    const variableRef = variable.name.replace(/\s+/g, '_');
    
    // Replace from trigger index (backslash position) to current position
    const beforeTrigger = stepsText.slice(0, variableTriggerIndex);
    const afterCursor = stepsText.slice(variableTriggerIndex + 1 + variableSearchTerm.length);
    const newText = beforeTrigger + '\\' + variableRef + afterCursor;
    
    setStepsText(newText);
    setShowVariableSelector(false);
    setVariableSearchTerm('');
    
    // Set cursor position after the inserted variable
    const newCursorPos = variableTriggerIndex + variableRef.length + 1;
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };
  
  // Open variable search modal
  const handleSearchVariables = () => {
    const textarea = stepsTextareaRef.current;
    if (!textarea) return;
    
    const textareaRect = textarea.getBoundingClientRect();
    setVariableSelectorPosition({
      top: textareaRect.top + 30,
      left: textareaRect.left + 20
    });
    setVariableTriggerIndex(textarea.selectionStart);
    setVariableSearchTerm('');
    setShowVariableSelector(true);
  };
  
  // Resolve variable references in text
  // Converts \Variable_Name to actual credential information
  const resolveVariables = (text) => {
    if (!text || !variables || variables.length === 0) return text;
    
    // Find all variable references (backslash followed by word characters/underscores)
    const variablePattern = /\\([A-Za-z0-9_]+)/g;
    
    return text.replace(variablePattern, (match, varName) => {
      // Find the variable by matching the name (with underscores converted to spaces for comparison)
      const searchName = varName.replace(/_/g, ' ').toLowerCase();
      const variable = variables.find(v => 
        v.name.toLowerCase() === searchName ||
        v.name.replace(/\s+/g, '_').toLowerCase() === varName.toLowerCase()
      );
      
      if (!variable) {
        // Variable not found, keep original reference
        return match;
      }
      
      // Build the resolved text with all variable fields
      const fieldTexts = variable.fields.map(field => {
        if (field.isSecret && field.value) {
          // For secret fields, include the value (Browser Use needs it)
          return `${field.label}: ${field.value}`;
        } else if (field.value) {
          return `${field.label}: ${field.value}`;
        }
        return null;
      }).filter(Boolean);
      
      if (fieldTexts.length === 0) {
        return `[${variable.name}]`;
      }
      
      // Return formatted credentials block
      return `[${variable.name} Credentials - ${fieldTexts.join(', ')}]`;
    });
  };
  
  // Resolve variables for Browser Use API (includes sensitive data)
  const resolveVariablesForAPI = (text) => {
    if (!text || !variables || variables.length === 0) return text;
    
    const variablePattern = /\\([A-Za-z0-9_]+)/g;
    
    return text.replace(variablePattern, (match, varName) => {
      const searchName = varName.replace(/_/g, ' ').toLowerCase();
      const variable = variables.find(v => 
        v.name.toLowerCase() === searchName ||
        v.name.replace(/\s+/g, '_').toLowerCase() === varName.toLowerCase()
      );
      
      if (!variable) {
        return match;
      }
      
      // Build detailed credentials for Browser Use
      const lines = [`Platform: ${variable.name}`];
      variable.fields.forEach(field => {
        if (field.value) {
          lines.push(`${field.label}: ${field.value}`);
        }
      });
      
      return `\n--- ${variable.name} Configuration ---\n${lines.join('\n')}\n---\n`;
    });
  };
  
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
    setDemoModified(false);
    setShowDemoWarning(false);
    if (mode === 'demo') {
      setStepsText(demoStepsText);
    } else {
      setStepsText('');
    }
  };

  // Handle demo steps change with warning
  const handleDemoStepsChange = (newText) => {
    if (stepsMode === 'demo' && !demoModified && newText !== demoStepsText) {
      // First time editing demo steps - show warning
      setShowDemoWarning(true);
    }
    setStepsText(newText);
    if (stepsMode === 'demo' && newText !== demoStepsText) {
      setDemoModified(true);
    }
  };

  // Confirm editing demo - convert to custom
  const handleConfirmDemoEdit = () => {
    setShowDemoWarning(false);
    // Keep demoModified true to show the warning badge
  };

  // Cancel demo edit - restore original
  const handleCancelDemoEdit = () => {
    setStepsText(demoStepsText);
    setDemoModified(false);
    setShowDemoWarning(false);
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
  
  // Function to update existing scenario (edit mode)
  const handleUpdateScenario = () => {
    if (!editingScenario) return;
    
    const currentTime = new Date().toISOString();
    
    // Find and update the scenario
    const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === editingScenario.id);
    if (scenarioIndex === -1) {
      alert('Error: Scenario not found');
      return;
    }
    
    // Update steps
    const updatedSteps = parsedSteps.map((step, index) => ({
      id: `${editingScenario.id}-step-${String(index + 1).padStart(3, '0')}`,
      order: index + 1,
      description: step.description,
      status: 'pending',
      duration: null,
      startTime: null,
      endTime: null
    }));
    
    // Update the scenario
    MOCK_DATA.scenarios[scenarioIndex] = {
      ...MOCK_DATA.scenarios[scenarioIndex],
      objective: objective || 'Untitled Scenario',
      folderId: selectedFolderId || MOCK_DATA.scenarios[scenarioIndex].folderId,
      description: objective ? `Custom scenario: ${objective}` : 'Custom scenario',
      updatedAt: currentTime,
      steps: updatedSteps
    };
    
    // Persist data to localStorage
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    
    // Notify parent
    if (onScenarioCreated) {
      onScenarioCreated(editingScenario.id);
    }
    
    alert(`Scenario "${objective}" updated successfully with ${updatedSteps.length} steps!`);
    onNavigate('scenarios');
  };
  
  // Function to save scenario without running it
  const handleSaveOnly = () => {
    const timestamp = Date.now();
    const newScenarioId = `scenario-custom-${timestamp}`;
    const currentTime = new Date().toISOString();
    
    // Create steps from parsed input
    const newSteps = parsedSteps.map((step, index) => ({
      id: `${newScenarioId}-step-${String(index + 1).padStart(3, '0')}`,
      order: index + 1,
      description: step.description,
      status: 'pending',
      duration: null,
      startTime: null,
      endTime: null
    }));
    
    // Create new scenario without execution
    const newScenario = {
      id: newScenarioId,
      folderId: selectedFolderId || folders.find(f => f.isDefault)?.id,
      objective: objective || 'Untitled Scenario',
      description: objective ? `Custom scenario: ${objective}` : 'Custom scenario',
      tags: [],
      createdAt: currentTime,
      updatedAt: currentTime,
      createdBy: 'admin@trinamix.com',
      status: 'pending',
      lastRun: null, // No execution yet
      configuration: {
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
    
    // Update stats
    MOCK_DATA.stats.totalScenarios += 1;
    
    // Persist data to localStorage
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    StorageHelper.saveStats(MOCK_DATA.stats);
    
    // Notify parent
    if (onScenarioCreated) {
      onScenarioCreated(newScenarioId);
    }
    
    alert(`Scenario "${objective}" saved successfully with ${newSteps.length} steps!\n\nYou can run it later from the scenario details page.`);
    onNavigate('scenarios');
  };
  
  const handleSubmit = async () => {
    // Generate unique IDs for the new scenario and execution
    const timestamp = Date.now();
    const isDemo = stepsMode === 'demo' && !demoModified; // Modified demo is treated as custom
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
        scenarioObjective: objective || 'Untitled Scenario',
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
        stepOrder: step.order,
        stepDescription: step.description,
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
        scenarioObjective: objective || 'Untitled Scenario',
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
    const scenarioObjective = objective || 'Untitled Scenario';
    const newScenario = {
      id: newScenarioId,
      folderId: selectedFolderId || folders.find(f => f.isDefault)?.id,
      objective: scenarioObjective,
      description: isDemo ? `Demo scenario created from: ${scenarioObjective}` : (objective ? `Custom scenario: ${objective}` : 'Custom scenario'),
      tags: isDemo ? ['demo', ...(referenceScenario?.tags || [])] : [],
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
    
    // Persist data immediately after creation
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    StorageHelper.saveExecutions(MOCK_DATA.executions);
    StorageHelper.saveStats(MOCK_DATA.stats);
    
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
    isCancelledRef.current = false;
    
    try {
      // Build the task prompt from steps only (objective is internal heading only)
      // Resolve any variable references to their actual values
      const taskStepsText = newSteps.map((s, i) => `${i + 1}. ${s.description}`).join('\n');
      const rawPrompt = `Steps to execute:\n${taskStepsText}`;
      
      // Resolve variables - replace \Variable_Name with actual credentials/config
      const taskPrompt = resolveVariablesForAPI(rawPrompt);
      
      // Log resolved prompt for debugging (without showing in UI)
      console.log('Task prompt with resolved variables:', taskPrompt);
      
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
      
      // Store references for potential cancellation
      currentTaskIdRef.current = createResult.id;
      currentExecutionRef.current = newExecutionId;
      currentScenarioRef.current = newScenarioId;
      
      // Update execution with task ID
      newExecution.metadata.browserUseTaskId = createResult.id;
      newExecution.metadata.browserUseSessionId = createResult.sessionId;
      
      // Store active task info for background tracking
      const activeTasks = StorageHelper.loadActiveTasks();
      activeTasks.push({
        taskId: createResult.id,
        scenarioId: newScenarioId,
        executionId: newExecutionId,
        startTime: new Date().toISOString()
      });
      StorageHelper.saveActiveTasks(activeTasks);
      
      // Poll for completion with progress updates
      const finalResult = await BrowserUseAPI.pollTaskUntilComplete(
        createResult.id,
        (taskUpdate) => {
          // Check if cancelled
          if (isCancelledRef.current) {
            throw new Error('Run cancelled by user');
          }
          
          const stepCount = taskUpdate.steps?.length || 0;
          setRunProgress({ taskId: createResult.id, steps: stepCount, status: taskUpdate.status });
          setRunStatus(`Executing... (${stepCount} browser actions completed)`);
          
          // Update the execution in MOCK_DATA with live progress
          const execIndex = MOCK_DATA.executions.findIndex(e => e.id === newExecutionId);
          if (execIndex >= 0) {
            const updatedExecution = BrowserUseAPI.transformTaskToExecution(taskUpdate, newScenario, newExecutionId);
            MOCK_DATA.executions[execIndex] = updatedExecution;
            
            // Persist progress updates to localStorage
            StorageHelper.saveExecutions(MOCK_DATA.executions);
          }
        },
        2000,
        600000
      );
      
      // Check if cancelled after polling completes
      if (isCancelledRef.current) {
        return; // Already handled in handleCancelRun
      }
      
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
      
      // Persist final results to localStorage
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      StorageHelper.saveStats(MOCK_DATA.stats);
      
      // Remove from active tasks
      StorageHelper.removeActiveTask(createResult.id);
      
      setIsRunning(false);
      setRunStatus(null);
      currentTaskIdRef.current = null;
      currentExecutionRef.current = null;
      currentScenarioRef.current = null;
      
      const statusEmoji = finalExecution.status === 'passed' ? '✅' : '❌';
      alert(`${statusEmoji} Scenario "${objective}" execution complete!\n\nStatus: ${finalExecution.status.toUpperCase()}\nSteps: ${finalResult.steps?.length || 0} browser actions\n${finalResult.output ? `\nOutput: ${finalResult.output}` : ''}`);
      
      onNavigate('scenarios');
      
    } catch (error) {
      // Check if this was a cancellation
      if (error.message === 'Run cancelled by user') {
        return; // Already handled in handleCancelRun
      }
      
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
      
      // Persist failure state to localStorage
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      StorageHelper.saveStats(MOCK_DATA.stats);
      
      // Remove from active tasks if taskId exists
      if (currentTaskIdRef.current) {
        StorageHelper.removeActiveTask(currentTaskIdRef.current);
      }
      
      setIsRunning(false);
      setRunStatus(null);
      currentTaskIdRef.current = null;
      currentExecutionRef.current = null;
      currentScenarioRef.current = null;
      
      alert(`❌ Error executing scenario: ${error.message}\n\nThe scenario has been created but execution failed.`);
      onNavigate('scenarios');
    }
  };
  
  // Function to cancel the running scenario
  const handleCancelRun = async () => {
    if (!currentTaskIdRef.current || isCancelling) return;
    
    setIsCancelling(true);
    setRunStatus('Cancelling run...');
    
    // Set the cancellation flag - this will stop the polling loop
    isCancelledRef.current = true;
    
    // Try to stop the task via API (best effort, may fail)
    try {
      await BrowserUseAPI.stopTask(currentTaskIdRef.current);
    } catch (apiError) {
      console.warn('Could not stop task via API (continuing with local cancellation):', apiError);
    }
    
    const executionId = currentExecutionRef.current;
    const scenarioId = currentScenarioRef.current;
    
    // Update execution status to cancelled
    if (executionId) {
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === executionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].status = 'cancelled';
        MOCK_DATA.executions[execIndex].endTime = new Date().toISOString();
        MOCK_DATA.executions[execIndex].logs.push({
          timestamp: new Date().toISOString(),
          level: 'warning',
          message: 'Run cancelled by user'
        });
      }
    }
    
    // Update scenario status
    if (scenarioId) {
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenarioId);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = 'cancelled';
        MOCK_DATA.scenarios[scenarioIndex].lastRun = {
          ...MOCK_DATA.scenarios[scenarioIndex].lastRun,
          status: 'cancelled',
          date: new Date().toISOString()
        };
      }
    }
    
    MOCK_DATA.stats.runningScenarios = Math.max(0, MOCK_DATA.stats.runningScenarios - 1);
    
    // Persist cancellation state to localStorage
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    StorageHelper.saveExecutions(MOCK_DATA.executions);
    StorageHelper.saveStats(MOCK_DATA.stats);
    
    // Remove from active tasks
    if (currentTaskIdRef.current) {
      StorageHelper.removeActiveTask(currentTaskIdRef.current);
    }
    
    setIsRunning(false);
    setIsCancelling(false);
    setRunStatus(null);
    currentTaskIdRef.current = null;
    currentExecutionRef.current = null;
    currentScenarioRef.current = null;
    
    alert('⚠️ Run cancelled. Scenario has been created but execution was stopped.');
    onNavigate('scenarios');
  };
  
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1 className="page-title">{isEditMode ? 'Edit Scenario' : isCloneMode ? 'Clone Scenario' : 'Create New Scenario'}</h1>
          <p className="page-subtitle">{isEditMode ? 'Modify your test objective and steps' : isCloneMode ? 'Create a copy of this scenario' : 'Define your test objective and steps'}</p>
        </div>
      </div>
      
      <div className="create-scenario-layout">
        {/* Input Section */}
        <div className="input-section">
          {/* Folder Selection Card */}
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">
                <div className="hierarchy-indicator small">
                  <i className="fas fa-folder"></i>
                  <span>FOLDER</span>
                </div>
                Save Location
              </h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Select folder to save this scenario</label>
                <select
                  className="form-input folder-select"
                  value={selectedFolderId || ''}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                >
                  {folders.map(folder => {
                    // Calculate depth for indentation
                    let depth = 0;
                    let parent = folders.find(f => f.id === folder.parentId);
                    while (parent) {
                      depth++;
                      parent = folders.find(f => f.id === parent.parentId);
                    }
                    const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(depth);
                    const icon = folder.parentId ? '📁' : '📂';
                    return (
                      <option key={folder.id} value={folder.id}>
                        {indent}{icon} {folder.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          
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
                <label>What do you want to verify or accomplish? <span className="optional-label">(Optional)</span></label>
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
                    <span className={`mode-badge ${demoModified ? 'modified' : ''}`}>
                      <i className={`fas ${stepsMode === 'demo' && !demoModified ? 'fa-magic' : 'fa-edit'}`}></i>
                      {stepsMode === 'demo' 
                        ? (demoModified ? 'Demo Steps (Modified - Custom Mode)' : 'Demo Steps')
                        : 'Custom Steps'
                      }
                    </span>
                    <div className="steps-mode-actions">
                      {(stepsMode === 'custom' || demoModified) && (
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={handleSearchVariables}
                          title="Insert a variable"
                        >
                          <i className="fas fa-key"></i>
                          Search Variables
                        </button>
                      )}
                      {demoModified && (
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={handleCancelDemoEdit}
                          title="Restore original demo steps"
                        >
                          <i className="fas fa-undo-alt"></i>
                          Restore Demo
                        </button>
                      )}
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => setStepsMode(null)}
                      >
                        <i className="fas fa-undo"></i>
                        Change Mode
                      </button>
                    </div>
                  </div>
                  <div className="form-group steps-input-container">
                    <label>Enter each step on a new line:</label>
                    <div className="textarea-with-hint">
                      <textarea
                        ref={stepsTextareaRef}
                        className="form-input steps-input mono"
                        placeholder={`1. Login to Oracle Fusion Cloud\n2. Click Navigator (☰) → Supply Chain Planning\n3. Click Tasks → Manage Plans\n...\n\nTip: Type \\ to insert variables`}
                        value={stepsText}
                        onChange={(e) => handleDemoStepsChange(e.target.value)}
                        onKeyDown={handleStepsKeyDown}
                        rows={10}
                      />
                      {(stepsMode === 'custom' || demoModified) && (
                        <div className="textarea-hint">
                          <kbd>\</kbd> to insert variables
                        </div>
                      )}
                    </div>
                    
                    {/* Variable Selector Dropdown */}
                    <VariableSelector
                      variables={variables}
                      isOpen={showVariableSelector}
                      onClose={() => setShowVariableSelector(false)}
                      onSelect={handleVariableSelect}
                      searchTerm={variableSearchTerm}
                      position={variableSelectorPosition}
                    />
                  </div>
                  <p className={`form-hint ${demoModified ? 'warning' : ''}`}>
                    <i className={`fas ${demoModified ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                    {stepsMode === 'demo' && !demoModified
                      ? 'Demo steps and execution details from the Supply Chain example are pre-filled. You can edit them if needed.'
                      : demoModified
                        ? 'You have modified the demo steps. This scenario will be treated as custom and will NOT use pre-built demo data. The steps will be executed via Browser Use API.'
                        : 'Each step will be resolved by browser_use API into sub-steps (browser actions). Use \\variableName to insert credentials.'
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
                    {parsedSteps.map((step) => {
                      // Check if step contains variable references
                      const hasVariables = /\\([A-Za-z0-9_]+)/.test(step.description);
                      
                      // Render step with variable highlighting
                      const renderStepText = () => {
                        if (!hasVariables) return step.description;
                        
                        // Split by variable references and render with tags
                        const parts = step.description.split(/(\\[A-Za-z0-9_]+)/g);
                        return parts.map((part, idx) => {
                          if (part.match(/^\\([A-Za-z0-9_]+)$/)) {
                            const varName = part.slice(1);
                            const searchName = varName.replace(/_/g, ' ').toLowerCase();
                            const variable = variables.find(v => 
                              v.name.toLowerCase() === searchName ||
                              v.name.replace(/\s+/g, '_').toLowerCase() === varName.toLowerCase()
                            );
                            return (
                              <span 
                                key={idx} 
                                className={`variable-tag-inline ${variable ? '' : 'invalid'}`}
                                title={variable ? `${variable.name}: ${variable.fields.map(f => f.label).join(', ')}` : 'Variable not found'}
                              >
                                <i className="fas fa-key"></i>
                                {variable ? variable.name : varName}
                              </span>
                            );
                          }
                          return part;
                        });
                      };
                      
                      return (
                        <div key={step.id} className="preview-step-item">
                          <span className="step-number">{step.order}</span>
                          <span className="step-text">{renderStepText()}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Show resolved variables hint */}
                  {parsedSteps.some(s => /\\([A-Za-z0-9_]+)/.test(s.description)) && (
                    <div className="variables-resolved-hint">
                      <i className="fas fa-info-circle"></i>
                      <span>Variables will be replaced with their configured values when executed</span>
                    </div>
                  )}
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
                  <button 
                    className="btn btn-danger btn-cancel btn-block mt-3"
                    onClick={handleCancelRun}
                    disabled={isCancelling}
                  >
                    <i className={`fas ${isCancelling ? 'fa-spinner fa-spin' : 'fa-stop'}`}></i>
                    {isCancelling ? 'Cancelling...' : 'Cancel Run'}
                  </button>
                </div>
              ) : (
                <div className="action-buttons-group">
                  {isEditMode ? (
                    <button 
                      className="btn btn-primary btn-block"
                      disabled={parsedSteps.length === 0}
                      onClick={handleUpdateScenario}
                    >
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                  ) : (
                    <>
                      {(stepsMode !== 'demo' || demoModified) && (
                        <button 
                          className="btn btn-secondary btn-block mb-2"
                          disabled={parsedSteps.length === 0}
                          onClick={() => handleSaveOnly()}
                        >
                          <i className="fas fa-save"></i>
                          Save Scenario
                        </button>
                      )}
                      <button 
                        className="btn btn-primary btn-block"
                        disabled={parsedSteps.length === 0}
                        onClick={handleSubmit}
                      >
                        <i className="fas fa-rocket"></i>
                        {stepsMode === 'demo' && !demoModified ? 'Create Demo Scenario' : 'Create & Run Scenario'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Edit Warning Modal */}
      {showDemoWarning && (
        <div className="modal-overlay" onClick={handleCancelDemoEdit}>
          <div className="modal-content warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header warning">
              <div className="modal-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>Editing Demo Steps</h3>
            </div>
            <div className="modal-body">
              <p className="warning-message">
                <strong>Warning:</strong> You are about to edit the demo steps.
              </p>
              <p>
                If you modify these steps, the scenario will be treated as a <strong>custom scenario</strong> and will:
              </p>
              <ul className="warning-list">
                <li><i className="fas fa-times-circle"></i> NOT use pre-built demo execution data</li>
                <li><i className="fas fa-robot"></i> Execute steps via Browser Use API in real-time</li>
                <li><i className="fas fa-clock"></i> Take longer to run as it performs actual browser actions</li>
              </ul>
              <p className="warning-note">
                <i className="fas fa-info-circle"></i>
                You can click "Restore Demo" at any time to revert to the original demo steps.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelDemoEdit}>
                <i className="fas fa-undo"></i>
                Keep Original
              </button>
              <button className="btn btn-warning" onClick={handleConfirmDemoEdit}>
                <i className="fas fa-edit"></i>
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(null);
  
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
  
  // Screenshot navigation handlers
  const openScreenshot = (index) => setSelectedScreenshotIndex(index);
  const closeScreenshot = () => setSelectedScreenshotIndex(null);
  const goToPrevScreenshot = (e) => {
    e.stopPropagation();
    setSelectedScreenshotIndex(prev => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };
  const goToNextScreenshot = (e) => {
    e.stopPropagation();
    setSelectedScreenshotIndex(prev => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };
  
  // Keyboard navigation for screenshots
  useEffect(() => {
    if (selectedScreenshotIndex === null) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedScreenshotIndex(prev => (prev > 0 ? prev - 1 : screenshots.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedScreenshotIndex(prev => (prev < screenshots.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setSelectedScreenshotIndex(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScreenshotIndex, screenshots.length]);
  
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
          {screenshots.map((ss, idx) => (
            <button
              key={ss.id}
              className={`timeline-point ${selectedScreenshotIndex === idx ? 'active' : ''} ${Utils.getStatusClass(ss.status)}`}
              onClick={() => openScreenshot(idx)}
              title={`Sub-step #${ss.subStepOrder}: ${ss.description}`}
            >
              <span className="point-number">{ss.subStepOrder}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="screenshot-grid">
        {screenshots.map((ss, idx) => (
          <div 
            key={ss.id} 
            className={`screenshot-card ${selectedScreenshotIndex === idx ? 'selected' : ''}`}
            onClick={() => openScreenshot(idx)}
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
      
      {selectedScreenshotIndex !== null && screenshots[selectedScreenshotIndex] && (
        <div className="screenshot-lightbox" onClick={closeScreenshot}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeScreenshot}>
              <i className="fas fa-times"></i>
            </button>
            
            {/* Left Navigation Arrow */}
            {screenshots.length > 1 && (
              <button className="screenshot-nav-btn prev" onClick={goToPrevScreenshot}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            
            {(() => {
              const ss = screenshots[selectedScreenshotIndex];
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
            
            {/* Right Navigation Arrow */}
            {screenshots.length > 1 && (
              <button className="screenshot-nav-btn next" onClick={goToNextScreenshot}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
            
            {/* Screenshot Counter */}
            {screenshots.length > 1 && (
              <div className="screenshot-modal-info lightbox-counter">
                <span className="screenshot-counter">{selectedScreenshotIndex + 1} / {screenshots.length}</span>
              </div>
            )}
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

// ===== Variables Page Component =====
const VariablesPage = ({ onVariablesChange }) => {
  const [variables, setVariables] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // New/Edit variable form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    fields: [{ key: '', label: '', value: '', type: 'text', isSecret: false }]
  });
  
  // Load variables from storage on mount
  useEffect(() => {
    const savedVariables = StorageHelper.loadVariables();
    if (savedVariables && savedVariables.length > 0) {
      setVariables(savedVariables);
    } else {
      // Use default variables from MOCK_DATA
      setVariables(MOCK_DATA.variables || []);
    }
  }, []);
  
  // Save variables to storage whenever they change
  const saveVariables = (newVariables) => {
    setVariables(newVariables);
    MOCK_DATA.variables = newVariables;
    StorageHelper.saveVariables(newVariables);
    if (onVariablesChange) {
      onVariablesChange(newVariables);
    }
  };
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(variables.map(v => v.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [variables]);
  
  // Filter variables
  const filteredVariables = useMemo(() => {
    return variables.filter(v => {
      const matchesSearch = !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [variables, searchQuery, selectedCategory]);
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      fields: [{ key: '', label: '', value: '', type: 'text', isSecret: false }]
    });
    setEditingVariable(null);
  };
  
  // Open create modal
  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };
  
  // Open edit modal
  const handleOpenEdit = (variable) => {
    setEditingVariable(variable);
    setFormData({
      name: variable.name,
      description: variable.description || '',
      category: variable.category || '',
      fields: variable.fields.map(f => ({ ...f }))
    });
    setShowCreateModal(true);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };
  
  // Add a new field to the variable
  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { key: '', label: '', value: '', type: 'text', isSecret: false }]
    }));
  };
  
  // Remove a field from the variable
  const handleRemoveField = (index) => {
    if (formData.fields.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };
  
  // Update a field
  const handleFieldChange = (index, key, value) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, [key]: value } : field
      )
    }));
  };
  
  // Save variable (create or update)
  const handleSaveVariable = () => {
    if (!formData.name.trim()) {
      alert('Please enter a variable name');
      return;
    }
    
    // Validate fields have keys
    const invalidFields = formData.fields.filter(f => !f.key.trim() || !f.label.trim());
    if (invalidFields.length > 0) {
      alert('Please fill in all field keys and labels');
      return;
    }
    
    const now = new Date().toISOString();
    
    if (editingVariable) {
      // Update existing
      const updatedVariables = variables.map(v => 
        v.id === editingVariable.id 
          ? { ...v, ...formData, updatedAt: now }
          : v
      );
      saveVariables(updatedVariables);
    } else {
      // Create new
      const newVariable = {
        id: `var-${Date.now()}`,
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      saveVariables([...variables, newVariable]);
    }
    
    handleCloseModal();
  };
  
  // Delete variable
  const handleDeleteVariable = (variableId) => {
    if (!confirm('Are you sure you want to delete this variable?')) return;
    const updatedVariables = variables.filter(v => v.id !== variableId);
    saveVariables(updatedVariables);
  };
  
  // Duplicate variable
  const handleDuplicateVariable = (variable) => {
    const now = new Date().toISOString();
    const newVariable = {
      ...variable,
      id: `var-${Date.now()}`,
      name: `${variable.name} (Copy)`,
      fields: variable.fields.map(f => ({ ...f })),
      createdAt: now,
      updatedAt: now
    };
    saveVariables([...variables, newVariable]);
  };
  
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className="fas fa-key"></i>
            Variables
          </h1>
          <p className="page-subtitle">
            Manage platform credentials and configuration variables for use in scenarios
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <i className="fas fa-plus"></i>
            Add Variable
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="variables-filters">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input 
            type="text"
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <div className="category-filter">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Variables Grid */}
      <div className="variables-grid">
        {filteredVariables.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-key"></i>
            <h3>No variables found</h3>
            <p>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Create your first variable to store platform credentials and configuration'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <button className="btn btn-primary" onClick={handleOpenCreate}>
                <i className="fas fa-plus"></i>
                Add Variable
              </button>
            )}
          </div>
        ) : (
          filteredVariables.map(variable => (
            <div key={variable.id} className="variable-card">
              <div className="variable-card-header">
                <div className="variable-icon">
                  <i className="fas fa-cube"></i>
                </div>
                <div className="variable-info">
                  <h3 className="variable-name">{variable.name}</h3>
                  {variable.category && (
                    <span className="variable-category">{variable.category}</span>
                  )}
                </div>
                <div className="variable-actions">
                  <button 
                    className="icon-btn" 
                    title="Edit"
                    onClick={() => handleOpenEdit(variable)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="icon-btn" 
                    title="Duplicate"
                    onClick={() => handleDuplicateVariable(variable)}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                  <button 
                    className="icon-btn danger" 
                    title="Delete"
                    onClick={() => handleDeleteVariable(variable.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {variable.description && (
                <p className="variable-description">{variable.description}</p>
              )}
              
              <div className="variable-fields">
                <div className="fields-header">
                  <i className="fas fa-list"></i>
                  <span>Fields ({variable.fields.length})</span>
                </div>
                <div className="fields-list">
                  {variable.fields.map((field, idx) => (
                    <div key={idx} className="field-item">
                      <span className="field-label">{field.label}</span>
                      <span className="field-value">
                        {field.isSecret ? '••••••••' : (field.value || '(empty)')}
                      </span>
                      {field.isSecret && (
                        <i className="fas fa-lock field-secret-icon" title="Secret field"></i>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="variable-usage">
                <span className="usage-hint">
                  <i className="fas fa-info-circle"></i>
                  Use as: <code>\{variable.name.replace(/\s+/g, '_')}</code>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal variable-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-key"></i>
                {editingVariable ? 'Edit Variable' : 'Create Variable'}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Variable Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Oracle Fusion Cloud"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., ERP, SCM, CRM"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    list="category-suggestions"
                  />
                  <datalist id="category-suggestions">
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  placeholder="Describe what this variable is used for..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="form-section">
                <div className="form-section-header">
                  <h3>
                    <i className="fas fa-list"></i>
                    Fields
                  </h3>
                  <button className="btn btn-ghost btn-sm" onClick={handleAddField}>
                    <i className="fas fa-plus"></i>
                    Add Field
                  </button>
                </div>
                
                <div className="fields-editor">
                  {formData.fields.map((field, index) => (
                    <div key={index} className="field-editor-row">
                      <div className="field-editor-inputs">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Key (e.g., url)"
                          value={field.key}
                          onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Label (e.g., URL)"
                          value={field.label}
                          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                        />
                        <input
                          type={field.isSecret ? 'password' : 'text'}
                          className="form-input field-value-input"
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                        />
                        <select
                          className="form-input field-type-select"
                          value={field.type}
                          onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                        >
                          <option value="text">Text</option>
                          <option value="url">URL</option>
                          <option value="password">Password</option>
                          <option value="number">Number</option>
                        </select>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={field.isSecret}
                            onChange={(e) => handleFieldChange(index, 'isSecret', e.target.checked)}
                          />
                          <i className={`fas ${field.isSecret ? 'fa-lock' : 'fa-lock-open'}`}></i>
                        </label>
                      </div>
                      <button 
                        className="btn btn-ghost btn-sm danger"
                        onClick={() => handleRemoveField(index)}
                        disabled={formData.fields.length <= 1}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveVariable}>
                <i className="fas fa-save"></i>
                {editingVariable ? 'Save Changes' : 'Create Variable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Flow Snapshot Viewer Component =====
// Displays a read-only view of a flow diagram snapshot with execution status overlay
const FlowSnapshotViewer = ({ flowSnapshot, nodeResults, compact = false }) => {
  const { useEffect, useRef, useState } = React;
  const containerRef = useRef(null);
  const drawflowRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current || !flowSnapshot || isInitialized) return;
    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
      try {
        // Initialize Drawflow in edit mode for pan/zoom
        const editor = new Drawflow(containerRef.current);
        editor.editor_mode = 'edit'; // Allow pan/zoom
        editor.start();
        // Import the flow snapshot
        if (flowSnapshot.drawflow) {
          editor.import(flowSnapshot);
        }
        // Disable node dragging, connection creation, and context menu
        editor.container.addEventListener('contextmenu', e => e.preventDefault());
        editor.container.addEventListener('mousedown', e => {
          // Prevent node drag
          if (e.target.closest('.drawflow-node')) {
            e.stopPropagation();
          }
        }, true);
        editor.container.addEventListener('dblclick', e => e.preventDefault());
        // Remove all event listeners for node editing
        editor.container.querySelectorAll('.drawflow-node').forEach(node => {
          node.onmousedown = null;
          node.ondblclick = null;
        });
        drawflowRef.current = editor;
        setIsInitialized(true);
        // Apply execution status overlays after a short delay
        setTimeout(() => {
          applyStatusOverlays();
        }, 100);
        // Center and fit the diagram
        setTimeout(() => {
          if (compact) {
            editor.zoom_out();
            editor.zoom_out();
          }
        }, 200);
      } catch (err) {
        console.error('Error initializing flow snapshot viewer:', err);
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      if (drawflowRef.current) {
        drawflowRef.current.clear();
      }
    };
  }, [flowSnapshot, compact]);
  
  // Apply status overlays based on nodeResults
  const applyStatusOverlays = () => {
    if (!nodeResults || !containerRef.current) return;
    
    Object.entries(nodeResults).forEach(([nodeId, result]) => {
      const nodeElement = containerRef.current.querySelector(`#node-${nodeId}`);
      if (nodeElement) {
        // Remove any existing status classes
        nodeElement.classList.remove('snapshot-passed', 'snapshot-failed', 'snapshot-skipped', 'snapshot-control');
        
        // Apply appropriate status class
        if (result.type === 'start' || result.type === 'end' || result.type === 'condition') {
          nodeElement.classList.add('snapshot-control');
        } else if (result.skipped) {
          nodeElement.classList.add('snapshot-skipped');
        } else if (result.success) {
          nodeElement.classList.add('snapshot-passed');
        } else {
          nodeElement.classList.add('snapshot-failed');
        }
        
        // Add status badge
        const existingBadge = nodeElement.querySelector('.snapshot-status-badge');
        if (!existingBadge) {
          const badge = document.createElement('div');
          badge.className = 'snapshot-status-badge';
          
          if (result.type === 'start') {
            badge.innerHTML = '<i class="fas fa-play-circle"></i>';
            badge.classList.add('control');
          } else if (result.type === 'end') {
            badge.innerHTML = '<i class="fas fa-stop-circle"></i>';
            badge.classList.add('control');
          } else if (result.type === 'condition') {
            badge.innerHTML = '<i class="fas fa-code-branch"></i>';
            badge.classList.add('control');
          } else if (result.skipped) {
            badge.innerHTML = '<i class="fas fa-forward"></i>';
            badge.classList.add('skipped');
          } else if (result.success) {
            badge.innerHTML = '<i class="fas fa-check-circle"></i>';
            badge.classList.add('success');
          } else {
            badge.innerHTML = '<i class="fas fa-times-circle"></i>';
            badge.classList.add('failed');
          }
          
          nodeElement.appendChild(badge);
        }
      }
    });
  };
  
  // Re-apply overlays when nodeResults change
  useEffect(() => {
    if (isInitialized && nodeResults) {
      applyStatusOverlays();
    }
  }, [nodeResults, isInitialized]);
  
  if (!flowSnapshot) {
    return (
      <div className="flow-snapshot-empty">
        <i className="fas fa-exclamation-triangle"></i>
        <span>Flow diagram not available for this run</span>
      </div>
    );
  }
  
  return (
    <div className={`flow-snapshot-container ${compact ? 'compact' : 'fullscreen'}`}>
      <div ref={containerRef} className="flow-snapshot-canvas"></div>
      {compact && (
        <div className="flow-snapshot-hint">
          <i className="fas fa-mouse-pointer"></i> Pan to explore • Click expand for full view
        </div>
      )}
    </div>
  );
};

// ===== Flow Builder Page Component =====
const FlowBuilderPage = ({ onNavigate, onViewExecution, targetFlowRunId, onClearTargetFlowRun }) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const drawflowRef = useRef(null);
  const editorRef = useRef(null);
  const isCancelledRef = useRef(false);
  const currentTaskIdRef = useRef(null);
  const [scenarios, setScenarios] = useState(MOCK_DATA.scenarios || []);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [flows, setFlows] = useState(() => {
    // Load saved flows from localStorage
    try {
      const saved = localStorage.getItem('trinamix_flows');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [flowRuns, setFlowRuns] = useState(() => StorageHelper.loadFlowRuns() || []);
  const [flowName, setFlowName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [flowToRename, setFlowToRename] = useState(null);
  const [newFlowName, setNewFlowName] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [currentExecutingNode, setCurrentExecutingNode] = useState(null);
  const [executionResults, setExecutionResults] = useState({});
  const [currentFlowRun, setCurrentFlowRun] = useState(null);
  const [showFlowRunsPanel, setShowFlowRunsPanel] = useState(false);
  const [selectedFlowRun, setSelectedFlowRun] = useState(null);
  const [showFlowRunDetail, setShowFlowRunDetail] = useState(false);
  const [showFullScreenSnapshot, setShowFullScreenSnapshot] = useState(false);
  
  // Handle navigation from external pages to view a specific flow run
  useEffect(() => {
    if (targetFlowRunId && flowRuns.length > 0) {
      const flowRun = flowRuns.find(r => r.id === targetFlowRunId);
      if (flowRun) {
        setSelectedFlowRun(flowRun);
        setShowFlowRunsPanel(true);
        setShowFlowRunDetail(true);
      }
      // Clear the target after handling
      onClearTargetFlowRun && onClearTargetFlowRun();
    }
  }, [targetFlowRunId, flowRuns, onClearTargetFlowRun]);
  
  // Save flow runs to localStorage
  const saveFlowRunsToStorage = useCallback((runsData) => {
    StorageHelper.saveFlowRuns(runsData);
    setFlowRuns(runsData);
  }, []);
  
  // Save flows to localStorage
  const saveFlowsToStorage = useCallback((flowsData) => {
    try {
      localStorage.setItem('trinamix_flows', JSON.stringify(flowsData));
    } catch (e) {
      console.error('Error saving flows:', e);
    }
  }, []);
  
  // Initialize Drawflow editor
  useEffect(() => {
    if (drawflowRef.current && !editorRef.current) {
      const editor = new Drawflow(drawflowRef.current);
      editor.reroute = true;
      editor.reroute_fix_curvature = true;
      editor.force_first_input = false;
      
      // Custom zoom settings
      editor.zoom_max = 1.6;
      editor.zoom_min = 0.4;
      editor.zoom_value = 0.1;
      
      editor.start();
      editorRef.current = editor;
      
      // Add default Start and End nodes after a short delay
      setTimeout(() => {
        if (editorRef.current && Object.keys(editorRef.current.export().drawflow.Home.data).length === 0) {
          // Only add default nodes if canvas is empty
          addStartNode();
          addEndNode();
        }
      }, 200);
      
      // Add event listeners
      editor.on('nodeCreated', (id) => {
        console.log('Node created:', id);
      });
      
      editor.on('nodeRemoved', (id) => {
        console.log('Node removed:', id);
      });
      
      editor.on('connectionCreated', (connection) => {
        console.log('Connection created:', connection);
      });
    }
    
    return () => {
      if (editorRef.current) {
        // Cleanup if needed
      }
    };
  }, []);
  
  // Add a scenario node to the canvas
  const addScenarioNode = useCallback((scenario) => {
    if (!editorRef.current) return;
    
    const statusColor = {
      'passed': '#10b981',
      'failed': '#ef4444',
      'running': '#f59e0b',
      'pending': '#6b7280'
    }[scenario.status] || '#6b7280';
    
    const statusIcon = {
      'passed': 'fa-check-circle',
      'failed': 'fa-times-circle',
      'running': 'fa-spinner fa-spin',
      'pending': 'fa-clock'
    }[scenario.status] || 'fa-clock';
    
    const nodeHtml = `
      <div class="flow-node-content">
        <div class="flow-node-header" style="background: ${statusColor}">
          <i class="fas ${statusIcon}"></i>
          <span class="flow-node-status">${scenario.status || 'pending'}</span>
        </div>
        <div class="flow-node-body">
          <div class="flow-node-title">${scenario.objective?.substring(0, 40) || 'Untitled'}${scenario.objective?.length > 40 ? '...' : ''}</div>
          <div class="flow-node-meta">
            <span><i class="fas fa-list"></i> ${scenario.steps?.length || 0} steps</span>
            ${scenario.tags?.length ? `<span class="flow-node-tag">${scenario.tags[0]}</span>` : ''}
          </div>
        </div>
        <div class="flow-node-footer">
          <span class="flow-node-id">ID: ${scenario.id}</span>
        </div>
      </div>
    `;
    
    // Get a random position on the visible canvas area
    const x = 150 + Math.random() * 400;
    const y = 100 + Math.random() * 300;
    
    editorRef.current.addNode(
      scenario.id,           // name
      1,                     // inputs
      1,                     // outputs
      x,                     // pos_x
      y,                     // pos_y
      'scenario-node',       // class
      { scenarioId: scenario.id, objective: scenario.objective }, // data
      nodeHtml               // html
    );
  }, []);
  
  // Add START node
  const addStartNode = useCallback(() => {
    if (!editorRef.current) return;
    
    const nodeHtml = `
      <div class="flow-node-content flow-node-start">
        <div class="flow-node-body">
          <i class="fas fa-play-circle"></i>
          <span>START</span>
        </div>
      </div>
    `;
    
    editorRef.current.addNode(
      'start',
      0,
      1,
      50,
      200,
      'start-node',
      { type: 'start' },
      nodeHtml
    );
  }, []);
  
  // Add END node
  const addEndNode = useCallback(() => {
    if (!editorRef.current) return;
    
    const nodeHtml = `
      <div class="flow-node-content flow-node-end">
        <div class="flow-node-body">
          <i class="fas fa-stop-circle"></i>
          <span>END</span>
        </div>
      </div>
    `;
    
    editorRef.current.addNode(
      'end',
      1,
      0,
      800,
      200,
      'end-node',
      { type: 'end' },
      nodeHtml
    );
  }, []);
  
  // Add condition/branch node
  const addConditionNode = useCallback(() => {
    if (!editorRef.current) return;
    
    const nodeHtml = `
      <div class="flow-node-content flow-node-condition">
        <div class="flow-node-body">
          <i class="fas fa-code-branch"></i>
          <span>Condition</span>
        </div>
        <div class="flow-node-outputs">
          <span class="output-label success">Pass</span>
          <span class="output-label error">Fail</span>
        </div>
      </div>
    `;
    
    const x = 400 + Math.random() * 200;
    const y = 150 + Math.random() * 200;
    
    editorRef.current.addNode(
      'condition',
      1,
      2,
      x,
      y,
      'condition-node',
      { type: 'condition' },
      nodeHtml
    );
  }, []);
  
  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.clear();
    }
  }, []);
  
  // Save current flow
  const saveFlow = useCallback(() => {
    if (!editorRef.current || !flowName.trim()) return;
    
    const flowData = editorRef.current.export();
    const trimmedName = flowName.trim();
    
    // Count nodes in the flow (excluding empty data)
    const nodeCount = flowData?.drawflow?.Home?.data 
      ? Object.keys(flowData.drawflow.Home.data).length 
      : 0;
    
    // Check if name changed - if so, save as new flow
    const isNameChanged = selectedFlow && selectedFlow.name !== trimmedName;
    
    const newFlow = {
      id: isNameChanged ? `flow-${Date.now()}` : (selectedFlow?.id || `flow-${Date.now()}`),
      name: trimmedName,
      data: flowData,
      nodeCount: nodeCount,
      createdAt: isNameChanged ? new Date().toISOString() : (selectedFlow?.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString()
    };
    
    let updatedFlows;
    if (selectedFlow && !isNameChanged) {
      // Same name - update existing flow
      updatedFlows = flows.map(f => f.id === selectedFlow.id ? newFlow : f);
    } else {
      // New flow or name changed - add as new
      updatedFlows = [...flows, newFlow];
    }
    
    setFlows(updatedFlows);
    saveFlowsToStorage(updatedFlows);
    setSelectedFlow(newFlow);
    setShowSaveModal(false);
    setFlowName('');
  }, [flowName, flows, selectedFlow, saveFlowsToStorage]);
  
  // Load a saved flow
  const loadFlow = useCallback((flow) => {
    if (!editorRef.current || !flow) return;
    
    editorRef.current.clear();
    editorRef.current.import(flow.data);
    setSelectedFlow(flow);
    setFlowName(flow.name);
  }, []);
  
  // Delete a flow
  const deleteFlow = useCallback((flowId) => {
    const updatedFlows = flows.filter(f => f.id !== flowId);
    setFlows(updatedFlows);
    saveFlowsToStorage(updatedFlows);
    
    if (selectedFlow?.id === flowId) {
      clearCanvas();
      setSelectedFlow(null);
      setFlowName('');
    }
    setShowDeleteConfirm(false);
    setFlowToDelete(null);
  }, [flows, selectedFlow, clearCanvas, saveFlowsToStorage]);
  
  // Export flow as JSON
  const exportFlow = useCallback(() => {
    if (!editorRef.current) return;
    
    const flowData = editorRef.current.export();
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `flow-${selectedFlow?.name || 'untitled'}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [selectedFlow]);
  
  // Create new flow
  const createNewFlow = useCallback(() => {
    clearCanvas();
    setSelectedFlow(null);
    setFlowName('');
    // Add start and end nodes by default
    setTimeout(() => {
      addStartNode();
      addEndNode();
    }, 100);
  }, [clearCanvas, addStartNode, addEndNode]);
  
  // Update node visual status during execution
  const updateNodeStatus = useCallback((nodeId, status) => {
    if (!editorRef.current) return;
    
    const nodeElement = document.querySelector(`#node-${nodeId}`);
    if (nodeElement) {
      // Remove existing status classes
      nodeElement.classList.remove('node-running', 'node-success', 'node-failed', 'node-pending');
      // Add new status class
      nodeElement.classList.add(`node-${status}`);
    }
  }, []);
  
  // Execute scenario via Browser Use API
  const executeScenario = useCallback(async (scenarioId, nodeId, flowRunId) => {
    // Find the scenario
    const scenario = MOCK_DATA.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      return { success: false, nodeId, scenarioId, error: 'Scenario not found' };
    }
    
    const scenarioName = scenario.objective || scenarioId;
    const executionId = `exec-flow-${flowRunId}-${scenarioId}-${Date.now()}`;
    const currentTime = new Date().toISOString();
    
    setExecutionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      type: 'info',
      message: `🚀 Starting: ${scenarioName.substring(0, 50)}${scenarioName.length > 50 ? '...' : ''}`
    }]);
    
    try {
      // Build the task prompt from objective and steps
      const stepsText = scenario.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n');
      const taskPrompt = `Objective: ${scenario.objective}\n\nSteps to execute:\n${stepsText}`;
      
      // Create initial execution entry
      const initialExecution = {
        id: executionId,
        scenarioId: scenario.id,
        scenarioObjective: scenario.objective,
        flowRunId: flowRunId,
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
          triggeredBy: 'flow-execution'
        },
        stepResults: scenario.steps.map(step => ({
          stepId: step.id,
          stepOrder: step.order,
          stepDescription: step.description,
          status: 'pending',
          startTime: null,
          endTime: null,
          duration: null,
          subSteps: []
        })),
        logs: [{
          timestamp: currentTime,
          level: 'info',
          message: 'Starting Browser Use API task execution from flow...'
        }]
      };
      
      // Add to executions
      MOCK_DATA.executions.unshift(initialExecution);
      
      // Update scenario status
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = 'running';
        MOCK_DATA.scenarios[scenarioIndex].lastRun = {
          executionId: executionId,
          status: 'running',
          date: currentTime,
          duration: 0
        };
      }
      
      // Persist data
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      
      setExecutionLog(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        type: 'info',
        message: `📡 Creating Browser Use task...`
      }]);
      
      // Create the task via Browser Use API
      const createResult = await BrowserUseAPI.createTask(taskPrompt, {
        maxSteps: Math.max(50, scenario.steps.length * 10),
        highlightElements: true,
        vision: true,
        metadata: {
          scenarioId: scenario.id,
          executionId: executionId,
          flowRunId: flowRunId
        }
      });
      
      // Store task ID for potential cancellation
      currentTaskIdRef.current = createResult.id;
      
      // Update execution with task ID
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === executionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].metadata.browserUseTaskId = createResult.id;
        MOCK_DATA.executions[execIndex].metadata.browserUseSessionId = createResult.sessionId;
      }
      
      setExecutionLog(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        type: 'info',
        message: `⏳ Task created (${createResult.id.substring(0, 8)}...). Polling for completion...`
      }]);
      
      // Poll for completion with progress updates
      const finalResult = await BrowserUseAPI.pollTaskUntilComplete(
        createResult.id,
        (taskUpdate) => {
          // Check if cancelled
          if (isCancelledRef.current) {
            throw new Error('Flow execution cancelled by user');
          }
          
          const stepCount = taskUpdate.steps?.length || 0;
          setExecutionLog(prev => {
            // Update the last "polling" message instead of adding new ones
            const newLogs = [...prev];
            const lastIdx = newLogs.length - 1;
            if (lastIdx >= 0 && newLogs[lastIdx].message.includes('browser actions')) {
              newLogs[lastIdx] = {
                time: new Date().toLocaleTimeString(),
                type: 'info',
                message: `⏳ Executing... (${stepCount} browser actions completed)`
              };
            } else {
              newLogs.push({
                time: new Date().toLocaleTimeString(),
                type: 'info',
                message: `⏳ Executing... (${stepCount} browser actions completed)`
              });
            }
            return newLogs;
          });
          
          // Update the execution in MOCK_DATA with live progress
          const execIdx = MOCK_DATA.executions.findIndex(e => e.id === executionId);
          if (execIdx >= 0) {
            const updatedExecution = BrowserUseAPI.transformTaskToExecution(
              taskUpdate, 
              scenario, 
              executionId
            );
            updatedExecution.flowRunId = flowRunId;
            MOCK_DATA.executions[execIdx] = updatedExecution;
            StorageHelper.saveExecutions(MOCK_DATA.executions);
          }
        },
        2000,
        600000
      );
      
      // Check if cancelled
      if (isCancelledRef.current) {
        return { success: false, nodeId, scenarioId, error: 'Cancelled by user', executionId };
      }
      
      // Transform final result
      const finalExecution = BrowserUseAPI.transformTaskToExecution(
        finalResult, 
        scenario, 
        executionId
      );
      finalExecution.flowRunId = flowRunId;
      
      // Update MOCK_DATA with final result
      const finalExecIndex = MOCK_DATA.executions.findIndex(e => e.id === executionId);
      if (finalExecIndex >= 0) {
        MOCK_DATA.executions[finalExecIndex] = finalExecution;
      }
      
      // Update scenario status
      const finalScenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
      if (finalScenarioIndex >= 0) {
        MOCK_DATA.scenarios[finalScenarioIndex].status = finalExecution.status;
        MOCK_DATA.scenarios[finalScenarioIndex].lastRun = {
          executionId: executionId,
          status: finalExecution.status,
          date: finalExecution.endTime || new Date().toISOString(),
          duration: finalExecution.duration || 0
        };
      }
      
      // Persist final results
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      
      const success = finalExecution.status === 'passed';
      
      if (success) {
        setExecutionLog(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: 'success',
          message: `✓ Completed: ${scenarioName.substring(0, 40)}${scenarioName.length > 40 ? '...' : ''}`
        }]);
      } else {
        setExecutionLog(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: 'error',
          message: `✗ Failed: ${scenarioName.substring(0, 40)}${scenarioName.length > 40 ? '...' : ''}`
        }]);
      }
      
      currentTaskIdRef.current = null;
      return { 
        success, 
        nodeId, 
        scenarioId, 
        executionId,
        duration: finalExecution.duration,
        stepsCompleted: finalResult.steps?.length || 0
      };
      
    } catch (error) {
      console.error('Browser Use API error:', error);
      
      // Update execution status to failed
      const execIndex = MOCK_DATA.executions.findIndex(e => e.id === executionId);
      if (execIndex >= 0) {
        MOCK_DATA.executions[execIndex].status = 'failed';
        MOCK_DATA.executions[execIndex].endTime = new Date().toISOString();
        MOCK_DATA.executions[execIndex].logs.push({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `Browser Use API error: ${error.message}`
        });
        StorageHelper.saveExecutions(MOCK_DATA.executions);
      }
      
      // Update scenario status
      const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === scenario.id);
      if (scenarioIndex >= 0) {
        MOCK_DATA.scenarios[scenarioIndex].status = 'failed';
        StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      }
      
      setExecutionLog(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        type: 'error',
        message: `✗ Error: ${error.message}`
      }]);
      
      currentTaskIdRef.current = null;
      return { 
        success: false, 
        nodeId, 
        scenarioId, 
        executionId,
        error: error.message 
      };
    }
  }, []);
  
  // Get connected nodes from a given node
  const getConnectedNodes = useCallback((nodeId, flowData) => {
    const connections = [];
    const moduleData = flowData.drawflow?.Home?.data || {};
    
    const node = moduleData[nodeId];
    if (!node) return connections;
    
    // Check all outputs
    Object.keys(node.outputs || {}).forEach(outputKey => {
      const output = node.outputs[outputKey];
      if (output.connections) {
        output.connections.forEach(conn => {
          connections.push({
            nodeId: conn.node,
            outputIndex: outputKey
          });
        });
      }
    });
    
    return connections;
  }, []);
  
  // Find START node
  const findStartNode = useCallback((flowData) => {
    const moduleData = flowData.drawflow?.Home?.data || {};
    
    for (const [nodeId, node] of Object.entries(moduleData)) {
      if (node.data?.type === 'start' || node.name === 'start') {
        return nodeId;
      }
    }
    return null;
  }, []);
  
  // Run the flow
  const runFlow = useCallback(async () => {
    if (!editorRef.current || isRunning) return;
    
    const flowData = editorRef.current.export();
    const moduleData = flowData.drawflow?.Home?.data || {};
    
    // Find START node
    const startNodeId = findStartNode(flowData);
    if (!startNodeId) {
      alert('No START node found! Please add a START node to your flow.');
      return;
    }
    
    // Create a new flow run record
    const flowRunId = `flow-run-${Date.now()}`;
    const currentTime = new Date().toISOString();
    
    // Count scenario nodes
    const scenarioNodes = Object.values(moduleData).filter(n => n.data?.scenarioId);
    
    const newFlowRun = {
      id: flowRunId,
      flowId: selectedFlow?.id || 'unsaved-flow',
      flowName: selectedFlow?.name || 'Untitled Flow',
      status: 'running',
      startTime: currentTime,
      endTime: null,
      duration: null,
      totalNodes: Object.keys(moduleData).length,
      scenarioNodes: scenarioNodes.length,
      nodeResults: {},
      executionIds: [],
      flowSnapshot: JSON.parse(JSON.stringify(flowData)), // Save a copy of the flow diagram at execution time
      logs: [{
        timestamp: currentTime,
        level: 'info',
        message: 'Flow execution started'
      }]
    };
    
    // Save initial flow run
    const updatedFlowRuns = [newFlowRun, ...flowRuns];
    saveFlowRunsToStorage(updatedFlowRuns);
    setCurrentFlowRun(newFlowRun);
    
    // Reset state
    setIsRunning(true);
    isCancelledRef.current = false;
    setExecutionLog([{
      time: new Date().toLocaleTimeString(),
      type: 'info',
      message: `🚀 Flow execution started (${scenarioNodes.length} scenarios)`
    }]);
    setShowExecutionModal(true);
    setExecutionResults({});
    
    // Reset all node statuses
    Object.keys(moduleData).forEach(nodeId => {
      updateNodeStatus(nodeId, 'pending');
    });
    
    // BFS to execute nodes in order
    const visited = new Set();
    const queue = [startNodeId];
    const nodeResults = {};
    const executionIds = [];
    let executionOrder = 0; // Track execution sequence
    
    // Mark start node as running then success
    updateNodeStatus(startNodeId, 'running');
    setCurrentExecutingNode(startNodeId);
    await new Promise(r => setTimeout(r, 500));
    updateNodeStatus(startNodeId, 'success');
    nodeResults[startNodeId] = { success: true, type: 'start', executionOrder: executionOrder++ };
    visited.add(startNodeId);
    
    setExecutionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      type: 'success',
      message: '✓ START node initialized'
    }]);
    
    // Get nodes connected to START
    const startConnections = getConnectedNodes(startNodeId, flowData);
    startConnections.forEach(conn => queue.push(conn.nodeId));
    
    // Process nodes - wait for all parents before executing
    let lastQueueSize = -1;
    let stuckCounter = 0;
    
    while (queue.length > 0 && !isCancelledRef.current) {
      // Detect if we're stuck (queue not making progress)
      if (queue.length === lastQueueSize) {
        stuckCounter++;
        if (stuckCounter > queue.length * 2) {
          // We've cycled through the queue multiple times with no progress
          console.warn('Flow execution: Queue stuck, forcing completion');
          break;
        }
      } else {
        stuckCounter = 0;
        lastQueueSize = queue.length;
      }
      
      const currentNodeId = queue.shift();
      
      if (visited.has(currentNodeId)) continue;
      
      const node = moduleData[currentNodeId];
      if (!node) continue;
      
      // Get all parent nodes (nodes with connections to this node's inputs)
      const parentNodes = [];
      Object.keys(node.inputs || {}).forEach(inputKey => {
        const input = node.inputs[inputKey];
        if (input.connections) {
          input.connections.forEach(conn => {
            parentNodes.push(conn.node);
          });
        }
      });
      
      // Check if ALL parents have been visited (completed)
      const allParentsVisited = parentNodes.every(pId => visited.has(pId));
      
      if (!allParentsVisited) {
        // Not all parents are done yet - put this node back at the end of the queue
        queue.push(currentNodeId);
        continue;
      }
      
      // Reset stuck counter since we're making progress
      stuckCounter = 0;
      lastQueueSize = -1;
      
      // Now check if all visited parents succeeded
      const allParentsSucceeded = parentNodes.every(pId => nodeResults[pId]?.success);
      
      if (!allParentsSucceeded) {
        // Skip this node if any parent failed
        updateNodeStatus(currentNodeId, 'failed');
        nodeResults[currentNodeId] = { success: false, skipped: true, type: node.data?.type || 'scenario', executionOrder: executionOrder++ };
        visited.add(currentNodeId);
        
        setExecutionLog(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: 'warning',
          message: `⏭ Skipped node (parent failed)`
        }]);
        
        // Still add children to queue for potential condition handling
        const connections = getConnectedNodes(currentNodeId, flowData);
        connections.forEach(conn => {
          if (!visited.has(conn.nodeId)) {
            queue.push(conn.nodeId);
          }
        });
        continue;
      }
      
      // Mark as running
      updateNodeStatus(currentNodeId, 'running');
      setCurrentExecutingNode(currentNodeId);
      
      // Check node type
      if (node.data?.type === 'end' || node.name === 'end') {
        // END node
        await new Promise(r => setTimeout(r, 500));
        updateNodeStatus(currentNodeId, 'success');
        nodeResults[currentNodeId] = { success: true, type: 'end', executionOrder: executionOrder++ };
        visited.add(currentNodeId);
        
        setExecutionLog(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: 'success',
          message: '✓ END node reached - Flow completed!'
        }]);
      } else if (node.data?.type === 'condition' || node.name === 'condition') {
        // Condition node - evaluate based on previous scenario result
        await new Promise(r => setTimeout(r, 500));
        
        // Get the last executed scenario result to determine path
        const lastScenarioResult = Object.values(nodeResults)
          .filter(r => r.type === 'scenario')
          .pop();
        const conditionResult = lastScenarioResult?.success !== false;
        
        updateNodeStatus(currentNodeId, 'success');
        nodeResults[currentNodeId] = { success: true, type: 'condition', conditionResult, executionOrder: executionOrder++ };
        visited.add(currentNodeId);
        
        setExecutionLog(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: 'info',
          message: `⚡ Condition evaluated: ${conditionResult ? 'PASS path' : 'FAIL path'}`
        }]);
        
        // Add connected nodes based on condition
        const connections = getConnectedNodes(currentNodeId, flowData);
        connections.forEach(conn => {
          const isPassPath = conn.outputIndex === 'output_1';
          if ((conditionResult && isPassPath) || (!conditionResult && !isPassPath)) {
            if (!visited.has(conn.nodeId)) {
              queue.push(conn.nodeId);
            }
          }
        });
      } else if (node.data?.scenarioId) {
        // Scenario node - execute the scenario via Browser Use API
        const result = await executeScenario(node.data.scenarioId, currentNodeId, flowRunId);
        
        if (result.executionId) {
          executionIds.push(result.executionId);
        }
        
        if (result.success) {
          updateNodeStatus(currentNodeId, 'success');
          nodeResults[currentNodeId] = { 
            success: true, 
            type: 'scenario',
            scenarioId: node.data.scenarioId,
            executionId: result.executionId,
            duration: result.duration,
            stepsCompleted: result.stepsCompleted,
            executionOrder: executionOrder++
          };
        } else {
          updateNodeStatus(currentNodeId, 'failed');
          nodeResults[currentNodeId] = { 
            success: false, 
            type: 'scenario',
            scenarioId: node.data.scenarioId,
            executionId: result.executionId,
            error: result.error,
            executionOrder: executionOrder++
          };
        }
        
        visited.add(currentNodeId);
        
        // Update flow run in storage with progress
        const runIdx = updatedFlowRuns.findIndex(r => r.id === flowRunId);
        if (runIdx >= 0) {
          updatedFlowRuns[runIdx].nodeResults = { ...nodeResults };
          updatedFlowRuns[runIdx].executionIds = [...executionIds];
          saveFlowRunsToStorage(updatedFlowRuns);
        }
        
        // Add connected nodes to queue
        const connections = getConnectedNodes(currentNodeId, flowData);
        connections.forEach(conn => {
          if (!visited.has(conn.nodeId)) {
            queue.push(conn.nodeId);
          }
        });
      } else {
        // Unknown node type - mark as success and continue
        await new Promise(r => setTimeout(r, 300));
        updateNodeStatus(currentNodeId, 'success');
        nodeResults[currentNodeId] = { success: true, type: 'unknown', executionOrder: executionOrder++ };
        visited.add(currentNodeId);
        
        const connections = getConnectedNodes(currentNodeId, flowData);
        connections.forEach(conn => {
          if (!visited.has(conn.nodeId)) {
            queue.push(conn.nodeId);
          }
        });
      }
    }
    
    // Execution complete - update flow run record
    const endTime = new Date().toISOString();
    // Only count scenario nodes for summary (exclude start, end, condition)
    const scenarioResults = Object.values(nodeResults).filter(r => r.type === 'scenario');
    const successCount = scenarioResults.filter(r => r.success && !r.skipped).length;
    const failCount = scenarioResults.filter(r => !r.success && !r.skipped).length;
    const skippedCount = scenarioResults.filter(r => r.skipped).length;
    
    const finalFlowRun = {
      ...newFlowRun,
      status: isCancelledRef.current ? 'cancelled' : (failCount === 0 ? 'passed' : 'failed'),
      endTime: endTime,
      duration: new Date(endTime) - new Date(currentTime),
      nodeResults: nodeResults,
      executionIds: executionIds,
      summary: {
        passed: successCount,
        failed: failCount,
        skipped: skippedCount
      },
      logs: [
        ...newFlowRun.logs,
        {
          timestamp: endTime,
          level: failCount === 0 ? 'info' : 'error',
          message: `Flow execution ${isCancelledRef.current ? 'cancelled' : 'completed'}. Passed: ${successCount}, Failed: ${failCount}, Skipped: ${skippedCount}`
        }
      ]
    };
    
    // Save final flow run
    const finalRunIdx = updatedFlowRuns.findIndex(r => r.id === flowRunId);
    if (finalRunIdx >= 0) {
      updatedFlowRuns[finalRunIdx] = finalFlowRun;
    }
    saveFlowRunsToStorage(updatedFlowRuns);
    setCurrentFlowRun(finalFlowRun);
    
    // Update state
    setIsRunning(false);
    setCurrentExecutingNode(null);
    setExecutionResults(nodeResults);
    
    setExecutionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      type: failCount === 0 ? 'success' : 'error',
      message: `📊 Execution complete: ${successCount} passed, ${failCount} failed, ${skippedCount} skipped`
    }]);
  }, [isRunning, findStartNode, getConnectedNodes, updateNodeStatus, executeScenario, flowRuns, selectedFlow, saveFlowRunsToStorage]);
  
  // Cancel running flow
  const cancelFlowRun = useCallback(async () => {
    isCancelledRef.current = true;
    
    // If there's a current browser use task, stop it
    if (currentTaskIdRef.current) {
      try {
        await BrowserUseAPI.stopTask(currentTaskIdRef.current);
      } catch (e) {
        console.error('Error stopping task:', e);
      }
    }
    
    setExecutionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      type: 'warning',
      message: '⚠️ Flow execution cancelled by user'
    }]);
  }, []);
  
  return (
    <div className="page-content">
      <div className="flow-builder-page">
        {/* Left Panel - Scenarios List */}
        <div className="flow-builder-sidebar">
          <div className="flow-sidebar-header">
            <h3><i className="fas fa-cubes"></i> Scenarios</h3>
            <span className="scenario-count">{scenarios.length}</span>
          </div>
          
          <div className="flow-sidebar-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search scenarios..."
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                setScenarios(
                  MOCK_DATA.scenarios.filter(s => 
                    s.objective?.toLowerCase().includes(query) ||
                    s.tags?.some(t => t.toLowerCase().includes(query))
                  )
                );
              }}
            />
          </div>
          
          <div className="flow-scenarios-list">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                className="flow-scenario-item"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('scenario', JSON.stringify(scenario));
                }}
                onClick={() => addScenarioNode(scenario)}
              >
                <div className={`flow-scenario-status ${scenario.status || 'pending'}`}>
                  <i className={`fas ${
                    scenario.status === 'passed' ? 'fa-check-circle' :
                    scenario.status === 'failed' ? 'fa-times-circle' :
                    scenario.status === 'running' ? 'fa-spinner fa-spin' :
                    'fa-clock'
                  }`}></i>
                </div>
                <div className="flow-scenario-info">
                  <span className="flow-scenario-name">
                    {scenario.objective?.substring(0, 35) || 'Untitled'}
                    {scenario.objective?.length > 35 ? '...' : ''}
                  </span>
                  <span className="flow-scenario-meta">
                    {scenario.steps?.length || 0} steps • {scenario.tags?.[0] || 'No tags'}
                  </span>
                </div>
                <button className="flow-scenario-add" title="Add to canvas">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="flow-sidebar-section">
            <h4>Control Nodes</h4>
            <div className="flow-control-nodes">
              <button className="flow-control-btn start" onClick={addStartNode}>
                <i className="fas fa-play-circle"></i> Start
              </button>
              <button className="flow-control-btn end" onClick={addEndNode}>
                <i className="fas fa-stop-circle"></i> End
              </button>
              <button className="flow-control-btn condition" onClick={addConditionNode}>
                <i className="fas fa-code-branch"></i> Condition
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flow-builder-main">
          <div className="flow-builder-toolbar">
            <div className="flow-toolbar-left">
              <button className="flow-toolbar-btn" onClick={createNewFlow}>
                <i className="fas fa-file"></i> New
              </button>
              <button className="flow-toolbar-btn" onClick={() => setShowSaveModal(true)}>
                <i className="fas fa-save"></i> Save
              </button>
              <button className="flow-toolbar-btn" onClick={exportFlow}>
                <i className="fas fa-download"></i> Export
              </button>
              <div className="flow-toolbar-divider"></div>
              <button className="flow-toolbar-btn" onClick={clearCanvas}>
                <i className="fas fa-trash-alt"></i> Clear
              </button>
            </div>
            
            <div className="flow-toolbar-center">
              {selectedFlow ? (
                <span className="flow-current-name">
                  <i className="fas fa-project-diagram"></i> {selectedFlow.name}
                </span>
              ) : (
                <span className="flow-current-name untitled">
                  <i className="fas fa-project-diagram"></i> Untitled Flow
                </span>
              )}
            </div>
            
            <div className="flow-toolbar-right">
              <button 
                className={`flow-toolbar-btn ${showFlowRunsPanel ? 'active' : ''}`}
                onClick={() => setShowFlowRunsPanel(!showFlowRunsPanel)}
              >
                <i className="fas fa-history"></i> Runs
                {flowRuns.length > 0 && <span className="runs-badge">{flowRuns.length}</span>}
              </button>
              <button 
                className={`flow-toolbar-btn primary ${isRunning ? 'running' : ''}`}
                onClick={runFlow}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Running...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play"></i> Run Flow
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Drawflow Canvas */}
          <div 
            ref={drawflowRef} 
            id="drawflow"
            className="flow-canvas"
            onDrop={(e) => {
              e.preventDefault();
              const scenarioData = e.dataTransfer.getData('scenario');
              if (scenarioData) {
                const scenario = JSON.parse(scenarioData);
                addScenarioNode(scenario);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          ></div>
          
          <div className="flow-canvas-help">
            <span><i className="fas fa-mouse"></i> Drag scenarios to canvas</span>
            <span><i className="fas fa-link"></i> Connect outputs to inputs</span>
            <span><i className="fas fa-hand-paper"></i> Pan with mouse drag</span>
            <span><i className="fas fa-search-plus"></i> Scroll to zoom</span>
          </div>
        </div>
        
        {/* Right Panel - Saved Flows */}
        <div className="flow-builder-flows">
          <div className="flow-panel-header">
            <h3><i className="fas fa-folder-open"></i> Saved Flows</h3>
          </div>
          
          <div className="flow-saved-list">
            {flows.length === 0 ? (
              <div className="flow-empty-state">
                <i className="fas fa-project-diagram"></i>
                <p>No saved flows yet</p>
                <span>Create your first flow by adding scenarios and saving</span>
              </div>
            ) : (
              flows.map(flow => (
                <div 
                  key={flow.id}
                  className={`flow-saved-item ${selectedFlow?.id === flow.id ? 'active' : ''}`}
                  onClick={() => loadFlow(flow)}
                >
                  <div className="flow-saved-icon">
                    <i className="fas fa-project-diagram"></i>
                  </div>
                  <div className="flow-saved-info">
                    <span className="flow-saved-name">{flow.name}</span>
                    <span className="flow-saved-date">
                      {new Date(flow.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flow-saved-actions">
                    <button 
                      className="flow-saved-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlowToRename(flow);
                        setNewFlowName(flow.name);
                        setShowRenameModal(true);
                      }}
                      title="Rename flow"
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <button 
                      className="flow-saved-action delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlowToDelete(flow);
                        setShowDeleteConfirm(true);
                      }}
                      title="Delete flow"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Flow Runs Panel (Slide-out) */}
        {showFlowRunsPanel && (
          <div className="flow-runs-panel">
            <div className="flow-panel-header">
              <h3><i className="fas fa-history"></i> Flow Run History</h3>
              <button className="panel-close-btn" onClick={() => setShowFlowRunsPanel(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flow-runs-list">
              {flowRuns.length === 0 ? (
                <div className="flow-empty-state">
                  <i className="fas fa-play-circle"></i>
                  <p>No flow runs yet</p>
                  <span>Run a flow to see execution history</span>
                </div>
              ) : (
                flowRuns.map(run => (
                  <div 
                    key={run.id}
                    className={`flow-run-item ${run.status} clickable`}
                    onClick={() => {
                      setSelectedFlowRun(run);
                      setShowFlowRunDetail(true);
                    }}
                  >
                    <div className={`flow-run-status ${run.status}`}>
                      <i className={`fas ${
                        run.status === 'passed' ? 'fa-check-circle' :
                        run.status === 'failed' ? 'fa-times-circle' :
                        run.status === 'running' ? 'fa-spinner fa-spin' :
                        run.status === 'cancelled' ? 'fa-ban' :
                        'fa-clock'
                      }`}></i>
                    </div>
                    <div className="flow-run-info">
                      <span className="flow-run-name">{run.flowName}</span>
                      <span className="flow-run-meta">
                        {new Date(run.startTime).toLocaleString()}
                        {run.duration && ` • ${Utils.formatDuration(run.duration)}`}
                      </span>
                      {run.summary && (
                        <span className="flow-run-summary">
                          <span className="summary-passed">{run.summary.passed} passed</span>
                          {run.summary.failed > 0 && <span className="summary-failed">{run.summary.failed} failed</span>}
                          {run.summary.skipped > 0 && <span className="summary-skipped">{run.summary.skipped} skipped</span>}
                        </span>
                      )}
                    </div>
                    <button 
                      className="flow-run-delete"
                      onClick={() => {
                        const updatedRuns = flowRuns.filter(r => r.id !== run.id);
                        saveFlowRunsToStorage(updatedRuns);
                      }}
                      title="Delete run"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {flowRuns.length > 0 && (
              <div className="flow-runs-footer">
                <button 
                  className="btn-text-danger"
                  onClick={() => {
                    if (confirm('Clear all flow run history?')) {
                      saveFlowRunsToStorage([]);
                    }
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Clear History
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Save Modal */}
        {showSaveModal && (
          <div className="flow-modal-overlay" onClick={() => setShowSaveModal(false)}>
            <div className="flow-modal" onClick={e => e.stopPropagation()}>
              <div className="flow-modal-header">
                <h3><i className="fas fa-save"></i> Save Flow</h3>
                <button onClick={() => setShowSaveModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flow-modal-body">
                <div className="form-group">
                  <label>Flow Name</label>
                  <input 
                    type="text"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    placeholder="Enter flow name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && flowName.trim()) {
                        saveFlow();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flow-modal-footer">
                <button className="btn-secondary" onClick={() => setShowSaveModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  onClick={saveFlow}
                  disabled={!flowName.trim()}
                >
                  Save Flow
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && flowToDelete && (
          <div className="flow-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="flow-modal" onClick={e => e.stopPropagation()}>
              <div className="flow-modal-header">
                <h3><i className="fas fa-exclamation-triangle"></i> Delete Flow</h3>
                <button onClick={() => setShowDeleteConfirm(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flow-modal-body">
                <p>Are you sure you want to delete "<strong>{flowToDelete.name}</strong>"?</p>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
              <div className="flow-modal-footer">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-danger" 
                  onClick={() => deleteFlow(flowToDelete.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Rename Flow Modal */}
        {showRenameModal && flowToRename && (
          <div className="flow-modal-overlay" onClick={() => setShowRenameModal(false)}>
            <div className="flow-modal" onClick={e => e.stopPropagation()}>
              <div className="flow-modal-header">
                <h3><i className="fas fa-pen"></i> Rename Flow</h3>
                <button onClick={() => setShowRenameModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flow-modal-body">
                <div className="form-group">
                  <label>Flow Name</label>
                  <input
                    type="text"
                    value={newFlowName}
                    onChange={(e) => setNewFlowName(e.target.value)}
                    placeholder="Enter new flow name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newFlowName.trim() && newFlowName.trim() !== flowToRename.name) {
                        const updatedFlows = flows.map(f => 
                          f.id === flowToRename.id 
                            ? { ...f, name: newFlowName.trim(), updatedAt: new Date().toISOString() }
                            : f
                        );
                        saveFlowsToStorage(updatedFlows);
                        setFlows(updatedFlows);
                        if (selectedFlow?.id === flowToRename.id) {
                          setSelectedFlow({ ...selectedFlow, name: newFlowName.trim() });
                        }
                        setShowRenameModal(false);
                        setFlowToRename(null);
                        setNewFlowName('');
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flow-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setShowRenameModal(false);
                  setFlowToRename(null);
                  setNewFlowName('');
                }}>
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  disabled={!newFlowName.trim() || newFlowName.trim() === flowToRename.name}
                  onClick={() => {
                    const updatedFlows = flows.map(f => 
                      f.id === flowToRename.id 
                        ? { ...f, name: newFlowName.trim(), updatedAt: new Date().toISOString() }
                        : f
                    );
                    saveFlowsToStorage(updatedFlows);
                    setFlows(updatedFlows);
                    if (selectedFlow?.id === flowToRename.id) {
                      setSelectedFlow({ ...selectedFlow, name: newFlowName.trim() });
                    }
                    setShowRenameModal(false);
                    setFlowToRename(null);
                    setNewFlowName('');
                  }}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Execution Modal */}
        {showExecutionModal && (
          <div className="flow-modal-overlay execution-modal-overlay" onClick={() => setShowExecutionModal(false)}>
            <div className="flow-modal execution-modal" onClick={e => e.stopPropagation()}>
              <div className="flow-modal-header">
                <h3>
                  {isRunning ? (
                    <><i className="fas fa-spinner fa-spin"></i> Running Flow</>
                  ) : (
                    <><i className="fas fa-flag-checkered"></i> Execution Complete</>
                  )}
                </h3>
                <button onClick={() => setShowExecutionModal(false)} title="Minimize (flow will continue running)">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flow-modal-body execution-body">
                <div className="execution-status-bar">
                  {isRunning ? (
                    <div className="execution-status running">
                      <div className="status-indicator pulse"></div>
                      <span>Executing flow...</span>
                    </div>
                  ) : (
                    <div className={`execution-status ${Object.values(executionResults).every(r => r.success) ? 'success' : 'partial'}`}>
                      <div className="status-indicator"></div>
                      <span>
                        {Object.values(executionResults).every(r => r.success) 
                          ? 'All nodes executed successfully!' 
                          : 'Execution completed with some failures'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="execution-log">
                  <div className="execution-log-header">
                    <i className="fas fa-terminal"></i> Execution Log
                  </div>
                  <div className="execution-log-content">
                    {executionLog.map((log, idx) => (
                      <div key={idx} className={`log-entry ${log.type}`}>
                        <span className="log-time">{log.time}</span>
                        <span className="log-message">{log.message}</span>
                      </div>
                    ))}
                    {isRunning && (
                      <div className="log-entry info">
                        <span className="log-time">{new Date().toLocaleTimeString()}</span>
                        <span className="log-message"><i className="fas fa-circle-notch fa-spin"></i> Processing...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isRunning && (
                  <div className="execution-summary">
                    <div className="summary-item success">
                      <i className="fas fa-check-circle"></i>
                      <span>{Object.values(executionResults).filter(r => r.success && !r.skipped).length} Passed</span>
                    </div>
                    <div className="summary-item failed">
                      <i className="fas fa-times-circle"></i>
                      <span>{Object.values(executionResults).filter(r => !r.success).length} Failed</span>
                    </div>
                    <div className="summary-item skipped">
                      <i className="fas fa-forward"></i>
                      <span>{Object.values(executionResults).filter(r => r.skipped).length} Skipped</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flow-modal-footer">
                {isRunning ? (
                  <>
                    <button className="btn-secondary" onClick={() => setShowExecutionModal(false)}>
                      <i className="fas fa-window-minimize"></i> Run in Background
                    </button>
                    <button className="btn-danger" onClick={cancelFlowRun}>
                      <i className="fas fa-stop"></i> Cancel Execution
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-secondary" onClick={() => setShowExecutionModal(false)}>
                      Close
                    </button>
                    <button className="btn-primary" onClick={runFlow}>
                      <i className="fas fa-redo"></i> Run Again
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Flow Run Detail Modal */}
        {showFlowRunDetail && selectedFlowRun && (() => {
          // Check if this is the currently running flow
          const isThisRunning = isRunning && currentFlowRun?.id === selectedFlowRun.id;
          // Use live data if running, otherwise use stored data
          const displayRun = isThisRunning ? { ...selectedFlowRun, ...currentFlowRun, nodeResults: executionResults } : selectedFlowRun;
          const displayLogs = isThisRunning ? executionLog : (selectedFlowRun.logs || []);
          
          return (
          <div className="flow-modal-overlay" onClick={() => setShowFlowRunDetail(false)}>
            <div className="flow-modal flow-run-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="flow-modal-header">
                <h3>
                  {isThisRunning ? (
                    <><i className="fas fa-spinner fa-spin"></i> Flow Running</>
                  ) : (
                    <>
                      <i className={`fas ${
                        selectedFlowRun.status === 'passed' ? 'fa-check-circle' :
                        selectedFlowRun.status === 'failed' ? 'fa-times-circle' :
                        selectedFlowRun.status === 'cancelled' ? 'fa-ban' :
                        'fa-clock'
                      }`}></i>
                      Flow Run Details
                    </>
                  )}
                </h3>
                <button onClick={() => setShowFlowRunDetail(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flow-modal-body">
                {/* Flow Run Header Info */}
                <div className={`flow-run-detail-header ${isThisRunning ? 'running' : ''}`}>
                  <div className="flow-run-detail-title">
                    <h4>{selectedFlowRun.flowName}</h4>
                    <span className={`status-badge ${isThisRunning ? 'running' : selectedFlowRun.status}`}>
                      {isThisRunning ? 'Running' :
                       selectedFlowRun.status === 'passed' ? 'Passed' : 
                       selectedFlowRun.status === 'failed' ? 'Failed' :
                       selectedFlowRun.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                    </span>
                  </div>
                  <div className="flow-run-detail-meta">
                    <span><i className="fas fa-calendar"></i> {new Date(selectedFlowRun.startTime).toLocaleString()}</span>
                    {!isThisRunning && selectedFlowRun.endTime && (
                      <span><i className="fas fa-clock"></i> Duration: {Utils.formatDuration(selectedFlowRun.duration)}</span>
                    )}
                    {isThisRunning && (
                      <span><i className="fas fa-sync fa-spin"></i> In progress...</span>
                    )}
                    {!isThisRunning && selectedFlowRun.summary && (
                      <span>
                        <i className="fas fa-tasks"></i> 
                        {selectedFlowRun.summary.passed + selectedFlowRun.summary.failed + selectedFlowRun.summary.skipped} scenarios
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Summary Cards - only show when completed */}
                {!isThisRunning && selectedFlowRun.summary && (
                  <div className="flow-run-summary-cards">
                    <div className="summary-card passed">
                      <div className="summary-card-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-value">{selectedFlowRun.summary.passed}</span>
                        <span className="summary-card-label">Passed</span>
                      </div>
                    </div>
                    <div className="summary-card failed">
                      <div className="summary-card-icon">
                        <i className="fas fa-times-circle"></i>
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-value">{selectedFlowRun.summary.failed}</span>
                        <span className="summary-card-label">Failed</span>
                      </div>
                    </div>
                    <div className="summary-card skipped">
                      <div className="summary-card-icon">
                        <i className="fas fa-forward"></i>
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-value">{selectedFlowRun.summary.skipped}</span>
                        <span className="summary-card-label">Skipped</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Flow Diagram Snapshot */}
                {displayRun.flowSnapshot && (
                  <div className="flow-snapshot-section">
                    <div className="flow-snapshot-header">
                      <h5><i className="fas fa-project-diagram"></i> Flow Diagram</h5>
                      <button 
                        className="btn-icon-sm"
                        onClick={() => setShowFullScreenSnapshot(true)}
                        title="View full screen"
                      >
                        <i className="fas fa-expand"></i>
                      </button>
                    </div>
                    <div className="flow-snapshot-preview">
                      <FlowSnapshotViewer 
                        flowSnapshot={displayRun.flowSnapshot}
                        nodeResults={displayRun.nodeResults}
                        compact={true}
                      />
                    </div>
                  </div>
                )}
                
                {/* Node Results */}
                <div className="flow-run-nodes-section">
                  <h5><i className="fas fa-project-diagram"></i> Node Execution Results</h5>
                  <div className="flow-run-nodes-list">
                    {displayRun.nodeResults && Object.keys(displayRun.nodeResults).length > 0 ? (
                      Object.entries(displayRun.nodeResults)
                        .sort((a, b) => (a[1].executionOrder ?? 0) - (b[1].executionOrder ?? 0))
                        .map(([nodeId, node], idx) => {
                        // Get scenario name if it's a scenario node
                        const scenarioName = node.scenarioId 
                          ? (MOCK_DATA.scenarios.find(s => s.id === node.scenarioId)?.objective || `Scenario ${node.scenarioId}`)
                          : null;
                        
                        // Determine status class
                        const statusClass = node.skipped ? 'skipped' : (node.success ? 'success' : 'failed');
                        const isControlNode = ['start', 'end', 'condition'].includes(node.type);
                        
                        return (
                          <div key={nodeId} className={`flow-run-node-item ${statusClass} ${isControlNode ? 'control-node' : ''}`}>
                            <div className="node-item-order">{idx + 1}</div>
                            <div className={`node-item-status ${isControlNode ? 'control' : statusClass}`}>
                              <i className={`fas ${
                                isControlNode ? (
                                  node.type === 'start' ? 'fa-play-circle' :
                                  node.type === 'end' ? 'fa-stop-circle' :
                                  'fa-code-branch'
                                ) : (
                                  node.skipped ? 'fa-forward' :
                                  node.success ? 'fa-check-circle' :
                                  'fa-times-circle'
                                )
                              }`}></i>
                            </div>
                            <div className="node-item-info">
                              <span className="node-item-name">
                                {node.type === 'scenario' ? (
                                  <>
                                    <i className="fas fa-file-alt"></i> {scenarioName}
                                  </>
                                ) : node.type === 'start' ? (
                                  <>
                                    <i className="fas fa-play-circle"></i> Start
                                  </>
                                ) : node.type === 'end' ? (
                                  <>
                                    <i className="fas fa-stop-circle"></i> End
                                  </>
                                ) : node.type === 'condition' ? (
                                  <>
                                    <i className="fas fa-code-branch"></i> Condition
                                    {node.conditionResult !== undefined && (
                                      <span className={`condition-result ${node.conditionResult ? 'pass' : 'fail'}`}>
                                        ({node.conditionResult ? 'Pass path' : 'Fail path'})
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-cube"></i> {node.type || 'Node'}
                                  </>
                                )}
                              </span>
                              {node.duration && (
                                <span className="node-item-duration">
                                  {Utils.formatDuration(node.duration)}
                                </span>
                              )}
                              {node.stepsCompleted && (
                                <span className="node-item-steps">
                                  {node.stepsCompleted} steps completed
                                </span>
                              )}
                              {node.error && (
                                <span className="node-item-error">{node.error}</span>
                              )}
                              {node.skipped && (
                                <span className="node-item-skipped">Skipped (parent failed)</span>
                              )}
                            </div>
                            {node.executionId && node.scenarioId && (
                              <button 
                                className="node-item-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowFlowRunDetail(false);
                                  setShowFlowRunsPanel(false);
                                  onViewExecution(node.scenarioId, node.executionId);
                                }}
                                title="View execution details"
                              >
                                <i className="fas fa-external-link-alt"></i>
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flow-run-no-nodes">
                        <i className="fas fa-info-circle"></i>
                        <span>No node execution data available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Execution Logs */}
                {displayLogs && displayLogs.length > 0 && (
                  <div className="flow-run-logs-section">
                    <h5><i className="fas fa-terminal"></i> Execution Logs</h5>
                    <div className={`flow-run-logs ${isThisRunning ? 'live' : ''}`}>
                      {displayLogs.map((log, idx) => (
                        <div key={idx} className={`log-entry ${log.type || log.level}`}>
                          <span className="log-time">
                            {log.time || new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="log-message">{log.message}</span>
                        </div>
                      ))}
                      {isThisRunning && (
                        <div className="log-entry info">
                          <span className="log-time">{new Date().toLocaleTimeString()}</span>
                          <span className="log-message"><i className="fas fa-circle-notch fa-spin"></i> Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flow-modal-footer">
                <button className="btn-secondary" onClick={() => setShowFlowRunDetail(false)}>
                  Close
                </button>
                {isThisRunning ? (
                  <button className="btn-danger" onClick={() => {
                    cancelFlowRun();
                    setShowFlowRunDetail(false);
                  }}>
                    <i className="fas fa-stop"></i> Cancel Execution
                  </button>
                ) : (
                  <button 
                    className="btn-danger"
                    onClick={() => {
                      const updatedRuns = flowRuns.filter(r => r.id !== selectedFlowRun.id);
                      saveFlowRunsToStorage(updatedRuns);
                      setShowFlowRunDetail(false);
                      setSelectedFlowRun(null);
                    }}
                  >
                    <i className="fas fa-trash"></i> Delete Run
                  </button>
                )}
              </div>
            </div>
          </div>
          );
        })()}
        
        {/* Full Screen Flow Snapshot Modal */}
        {showFullScreenSnapshot && selectedFlowRun && (
          <div className="flow-modal-overlay fullscreen" onClick={() => setShowFullScreenSnapshot(false)}>
            <div className="flow-snapshot-fullscreen-modal" onClick={e => e.stopPropagation()}>
              <div className="flow-modal-header">
                <h3>
                  <i className="fas fa-project-diagram"></i>
                  Flow Diagram - {selectedFlowRun.flowName}
                </h3>
                <button onClick={() => setShowFullScreenSnapshot(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flow-snapshot-fullscreen-body">
                <FlowSnapshotViewer 
                  flowSnapshot={selectedFlowRun.flowSnapshot || (currentFlowRun?.flowSnapshot)}
                  nodeResults={selectedFlowRun.nodeResults || (currentFlowRun?.nodeResults) || {}}
                  compact={false}
                />
              </div>
              <div className="flow-snapshot-fullscreen-footer">
                <div className="snapshot-legend">
                  <span className="legend-item success"><i className="fas fa-check-circle"></i> Passed</span>
                  <span className="legend-item failed"><i className="fas fa-times-circle"></i> Failed</span>
                  <span className="legend-item skipped"><i className="fas fa-forward"></i> Skipped</span>
                  <span className="legend-item control"><i className="fas fa-play-circle"></i> Control Node</span>
                </div>
                <button className="btn-secondary" onClick={() => setShowFullScreenSnapshot(false)}>
                  <i className="fas fa-compress"></i> Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Main App Component =====
const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [previousPage, setPreviousPage] = useState(null); // Track where user came from
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [selectedExecutionId, setSelectedExecutionId] = useState(null);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [editingScenario, setEditingScenario] = useState(null); // For edit mode
  const [cloningScenario, setCloningScenario] = useState(null); // For clone mode
  const [initialFolderId, setInitialFolderId] = useState(null); // For create scenario with folder
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-renders after data changes
  const [globalSearchQuery, setGlobalSearchQuery] = useState(''); // Global search state
  
  // Flows and Flow Runs state for dashboard display
  const [savedFlows, setSavedFlows] = useState([]);
  const [flowRuns, setFlowRuns] = useState([]);
  
  // Load data from localStorage on initial mount
  useEffect(() => {
    // Check if data version changed (folder structure update)
    StorageHelper.checkDataVersion();
    
    const savedScenarios = StorageHelper.loadScenarios();
    const savedExecutions = StorageHelper.loadExecutions();
    const savedStats = StorageHelper.loadStats();
    const savedFolders = StorageHelper.loadFolders();
    const savedVariables = StorageHelper.loadVariables();
    
    let dataModified = false;
    let runningCount = 0;
    
    // Load folders from localStorage or use defaults
    if (savedFolders && savedFolders.length > 0) {
      MOCK_DATA.folders = savedFolders;
    }
    
    // Load variables from localStorage or use defaults
    if (savedVariables && savedVariables.length > 0) {
      MOCK_DATA.variables = savedVariables;
    }
    
    if (savedScenarios && savedScenarios.length > 0) {
      // Don't mark running scenarios as interrupted - they may still be running in background
      // We'll check their actual status via background polling
      savedScenarios.forEach(scenario => {
        // Ensure scenario has a folderId - assign to root folder if missing
        if (!scenario.folderId) {
          const rootFolder = MOCK_DATA.folders.find(f => f.isDefault);
          if (rootFolder) {
            scenario.folderId = rootFolder.id;
            dataModified = true;
          }
        }
      });
      MOCK_DATA.scenarios = savedScenarios;
    } else {
      // No saved scenarios - load demo scenarios if available
      if (typeof loadDemoScenarios === 'function') {
        const demoData = loadDemoScenarios();
        if (demoData.scenarios.length > 0) {
          console.log(`📦 Loaded ${demoData.scenarios.length} demo scenario(s)`);
          MOCK_DATA.scenarios = demoData.scenarios;
          dataModified = true;
        }
      }
      
      // Ensure scenarios have folderIds
      MOCK_DATA.scenarios.forEach(scenario => {
        if (!scenario.folderId) {
          const rootFolder = MOCK_DATA.folders.find(f => f.isDefault);
          if (rootFolder) {
            scenario.folderId = rootFolder.id;
          }
        }
      });
    }
    
    if (savedExecutions && savedExecutions.length > 0) {
      // Don't mark running executions as interrupted - they may still be running in background
      // We'll check their actual status via background polling
      MOCK_DATA.executions = savedExecutions;
    } else {
      // No saved executions - load demo executions if available
      if (typeof loadDemoScenarios === 'function') {
        const demoData = loadDemoScenarios();
        if (demoData.executions.length > 0) {
          MOCK_DATA.executions = demoData.executions;
          dataModified = true;
        }
      }
    }
    
    if (savedStats) {
      // Keep the running count as-is since scenarios may still be running in background
      MOCK_DATA.stats = savedStats;
    }
    
    // Persist the cleaned up data if we made any modifications
    if (dataModified) {
      StorageHelper.saveScenarios(MOCK_DATA.scenarios);
      StorageHelper.saveExecutions(MOCK_DATA.executions);
      StorageHelper.saveStats(MOCK_DATA.stats);
      StorageHelper.saveFolders(MOCK_DATA.folders);
    }
    
    // Load saved flows from localStorage
    try {
      const savedFlowsData = localStorage.getItem('trinamix_flows');
      if (savedFlowsData) {
        setSavedFlows(JSON.parse(savedFlowsData));
      }
    } catch (e) {
      console.error('Error loading flows:', e);
    }
    
    // Load flow runs from localStorage
    const loadedFlowRuns = StorageHelper.loadFlowRuns();
    if (loadedFlowRuns) {
      setFlowRuns(loadedFlowRuns);
    }
    
    // Trigger re-render after loading data
    setRefreshKey(prev => prev + 1);
  }, []);
  
  // Background polling for active tasks
  useEffect(() => {
    const pollActiveTasks = async () => {
      const activeTasks = StorageHelper.loadActiveTasks();
      
      if (activeTasks.length === 0) return;
      
      console.log(`Polling ${activeTasks.length} active task(s)...`);
      
      for (const task of activeTasks) {
        try {
          // Check task status via API
          const taskStatus = await BrowserUseAPI.getTask(task.taskId);
          
          // Only update if task is finished or stopped
          if (taskStatus.status === 'finished' || taskStatus.status === 'stopped') {
            console.log(`Task ${task.taskId} completed with status: ${taskStatus.status}`);
            
            // Find the scenario and execution
            const scenario = MOCK_DATA.scenarios.find(s => s.id === task.scenarioId);
            const execIndex = MOCK_DATA.executions.findIndex(e => e.id === task.executionId);
            
            if (scenario && execIndex >= 0) {
              // Transform the final task result to execution
              const finalExecution = BrowserUseAPI.transformTaskToExecution(taskStatus, scenario, task.executionId);
              
              // Update execution
              MOCK_DATA.executions[execIndex] = finalExecution;
              
              // Update scenario status
              const scenarioIndex = MOCK_DATA.scenarios.findIndex(s => s.id === task.scenarioId);
              if (scenarioIndex >= 0) {
                MOCK_DATA.scenarios[scenarioIndex].status = finalExecution.status;
                MOCK_DATA.scenarios[scenarioIndex].lastRun = {
                  executionId: task.executionId,
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
              
              // Persist updates
              StorageHelper.saveScenarios(MOCK_DATA.scenarios);
              StorageHelper.saveExecutions(MOCK_DATA.executions);
              StorageHelper.saveStats(MOCK_DATA.stats);
              
              // Remove from active tasks
              StorageHelper.removeActiveTask(task.taskId);
              
              // Trigger re-render
              setRefreshKey(prev => prev + 1);
            }
          } else {
            // Still running - update progress
            const execIndex = MOCK_DATA.executions.findIndex(e => e.id === task.executionId);
            if (execIndex >= 0) {
              const scenario = MOCK_DATA.scenarios.find(s => s.id === task.scenarioId);
              if (scenario) {
                const updatedExecution = BrowserUseAPI.transformTaskToExecution(taskStatus, scenario, task.executionId);
                MOCK_DATA.executions[execIndex] = updatedExecution;
                StorageHelper.saveExecutions(MOCK_DATA.executions);
              }
            }
          }
        } catch (error) {
          console.error(`Error polling task ${task.taskId}:`, error);
          // If task fails to poll multiple times, we might want to mark it as failed
          // For now, just log the error and continue
        }
      }
    };
    
    // Poll immediately on mount
    pollActiveTasks();
    
    // Set up polling interval (every 5 seconds)
    const pollInterval = setInterval(pollActiveTasks, 5000);
    
    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, []); // Empty dependency array - only run once on mount
  
  // Save data to localStorage whenever it changes
  const persistData = useCallback(() => {
    StorageHelper.saveScenarios(MOCK_DATA.scenarios);
    StorageHelper.saveExecutions(MOCK_DATA.executions);
    StorageHelper.saveStats(MOCK_DATA.stats);
    StorageHelper.saveFolders(MOCK_DATA.folders);
    StorageHelper.saveVariables(MOCK_DATA.variables);
  }, []);
  
  // Compute search results based on globalSearchQuery
  const searchResults = useMemo(() => {
    if (!globalSearchQuery || globalSearchQuery.trim().length === 0) {
      return { scenarios: [], executions: [] };
    }
    
    const query = globalSearchQuery.toLowerCase().trim();
    
    // Search scenarios by name, description, or steps
    const matchingScenarios = MOCK_DATA.scenarios.filter(scenario => {
      const nameMatch = scenario.name?.toLowerCase().includes(query);
      const descMatch = scenario.description?.toLowerCase().includes(query);
      const objectiveMatch = scenario.objective?.toLowerCase().includes(query);
      const stepsMatch = scenario.steps?.some(step => {
        // Steps can be strings or objects with a description property
        if (typeof step === 'string') {
          return step.toLowerCase().includes(query);
        }
        return step.description?.toLowerCase().includes(query);
      });
      return nameMatch || descMatch || objectiveMatch || stepsMatch;
    });
    
    // Search executions by scenario name or status
    const matchingExecutions = MOCK_DATA.executions.filter(execution => {
      const scenario = MOCK_DATA.scenarios.find(s => s.id === execution.scenarioId);
      const scenarioName = scenario?.name || '';
      const nameMatch = scenarioName.toLowerCase().includes(query);
      const statusMatch = execution.status?.toLowerCase().includes(query);
      return nameMatch || statusMatch;
    }).map(execution => {
      const scenario = MOCK_DATA.scenarios.find(s => s.id === execution.scenarioId);
      return {
        ...execution,
        scenarioName: scenario?.name || 'Unknown Scenario'
      };
    });
    
    return {
      scenarios: matchingScenarios,
      executions: matchingExecutions
    };
  }, [globalSearchQuery, refreshKey]);
  
  // Handle search result selection
  const handleSelectSearchResult = useCallback((type, id, executionId = null) => {
    setGlobalSearchQuery('');
    setPreviousPage(activePage);
    if (type === 'scenario') {
      setSelectedScenarioId(id);
      setSelectedExecutionId(null);
      setActivePage('scenario-detail');
    } else if (type === 'execution') {
      setSelectedScenarioId(id);
      setSelectedExecutionId(executionId);
      setActivePage('scenario-detail');
    }
  }, [activePage]);
  
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
  
  const handleNavigate = (page, options = {}) => {
    setPreviousPage(activePage);
    setActivePage(page);
    setSelectedScenarioId(null);
    setSelectedExecutionId(null);
    setSelectedStepId(null);
    // Set initial folder ID if provided (for create-scenario page)
    if (options.folderId !== undefined) {
      setInitialFolderId(options.folderId);
    } else {
      setInitialFolderId(null);
    }
  };
  
  const handleViewScenario = (scenarioId) => {
    setPreviousPage(activePage);
    setSelectedScenarioId(scenarioId);
    setSelectedExecutionId(null); // Reset execution ID to show latest
    setActivePage('scenario-detail');
  };
  
  const handleViewExecution = (scenarioId, executionId) => {
    // Navigate to scenario detail with specific execution
    setPreviousPage(activePage);
    setSelectedScenarioId(scenarioId);
    setSelectedExecutionId(executionId);
    setActivePage('scenario-detail');
  };
  
  const handleViewStepDetail = (executionId, stepId) => {
    setPreviousPage(activePage);
    setSelectedExecutionId(executionId);
    setSelectedStepId(stepId);
    setActivePage('step-detail');
  };
  
  const handleEditScenario = (scenario) => {
    setPreviousPage(activePage);
    setEditingScenario(scenario);
    setCloningScenario(null);
    setActivePage('create-scenario');
  };
  
  const handleCloneScenario = (scenario) => {
    setPreviousPage(activePage);
    setCloningScenario(scenario);
    setEditingScenario(null);
    setActivePage('create-scenario');
  };
  
  // Navigate to flow builder and open a specific flow run
  const [targetFlowRunId, setTargetFlowRunId] = useState(null);
  
  const handleViewFlowRun = (flowRunId) => {
    setTargetFlowRunId(flowRunId);
    setActivePage('flow-builder');
  };
  
  // Determine where to go back to from scenario-detail
  const handleBackFromScenarioDetail = () => {
    // If user came from history, go back to history; otherwise go to scenarios
    if (previousPage === 'history') {
      handleNavigate('history');
    } else {
      handleNavigate('scenarios');
    }
  };
  
  const getBreadcrumb = () => {
    switch (activePage) {
      case 'dashboard':
        return ['TestAutomate', 'Dashboard'];
      case 'scenarios':
        return ['TestAutomate', 'Scenarios'];
      case 'scenario-detail':
        // Show different breadcrumb based on where user came from
        if (previousPage === 'history') {
          return ['TestAutomate', 'Run History', 'Execution Details'];
        }
        return ['TestAutomate', 'Scenarios', 'Details'];
      case 'step-detail':
        return ['TestAutomate', 'Scenario', 'Step Details'];
      case 'history':
        return ['TestAutomate', 'Run History'];
      case 'create-scenario':
        return editingScenario ? ['TestAutomate', 'Scenarios', 'Edit Scenario'] : cloningScenario ? ['TestAutomate', 'Scenarios', 'Clone Scenario'] : ['TestAutomate', 'New Scenario'];
      case 'flow-builder':
        return ['TestAutomate', 'Flow Builder'];
      case 'variables':
        return ['TestAutomate', 'Settings', 'Variables'];
      default:
        return ['TestAutomate'];
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
            savedFlows={savedFlows}
            flowRuns={flowRuns}
            onViewFlowRun={handleViewFlowRun}
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
            executionId={selectedExecutionId}
            onBack={handleBackFromScenarioDetail}
            onViewStepDetail={handleViewStepDetail}
            onEditScenario={handleEditScenario}
            onCloneScenario={handleCloneScenario}
            onViewFlowRun={handleViewFlowRun}
          />
        );
      case 'step-detail':
        return (
          <StepDetailPage
            executionId={selectedExecutionId}
            stepId={selectedStepId}
            onBack={() => {
              // Go back to the scenario detail page
              setActivePage('scenario-detail');
              setSelectedStepId(null);
            }}
          />
        );
      case 'history':
        return (
          <HistoryPage 
            onViewExecution={handleViewExecution}
            onViewFlowRun={handleViewFlowRun}
          />
        );
      case 'create-scenario':
        return (
          <CreateScenarioPage 
            onBack={() => {
              setEditingScenario(null);
              setCloningScenario(null);
              setInitialFolderId(null);
              handleNavigate('scenarios');
            }}
            onNavigate={(page) => {
              setEditingScenario(null);
              setCloningScenario(null);
              setInitialFolderId(null);
              handleNavigate(page);
            }}
            onScenarioCreated={handleScenarioCreated}
            editingScenario={editingScenario}
            cloningScenario={cloningScenario}
            initialFolderId={initialFolderId}
          />
        );
      case 'flow-builder':
        return (
          <FlowBuilderPage 
            onNavigate={handleNavigate}
            onViewExecution={handleViewExecution}
            targetFlowRunId={targetFlowRunId}
            onClearTargetFlowRun={() => setTargetFlowRunId(null)}
          />
        );
      case 'variables':
        return (
          <VariablesPage 
            onVariablesChange={() => setRefreshKey(prev => prev + 1)}
          />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} savedFlows={savedFlows} flowRuns={flowRuns} onViewFlowRun={handleViewFlowRun} />;
    }
  };
  
  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="main-content">
        <Header 
          breadcrumb={getBreadcrumb()} 
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          searchResults={searchResults}
          onSelectSearchResult={handleSelectSearchResult}
          onClearSearch={() => setGlobalSearchQuery('')}
        />
        {renderPage()}
      </main>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
