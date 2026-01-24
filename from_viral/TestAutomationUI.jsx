import React, { useState, useEffect } from 'react';

// Mock Data Generator
const generateMockData = () => ({
  stats: {
    totalTests: 127,
    passRate: 94.2,
    avgDuration: 145000,
    activeRuns: 3
  },
  executions: [
    {
      id: 'exec-001',
      testName: 'Login Flow Validation',
      status: 'running',
      startTime: new Date(Date.now() - 120000),
      progress: {
        currentStep: 5,
        totalSteps: 12,
        percentage: 42,
        currentAction: 'Verifying dashboard load'
      },
      steps: [
        { id: 1, name: 'Navigate to login page', status: 'success', duration: 2300 },
        { id: 2, name: 'Enter username', status: 'success', duration: 1200 },
        { id: 3, name: 'Enter password', status: 'success', duration: 1100 },
        { id: 4, name: 'Click login button', status: 'success', duration: 800 },
        { id: 5, name: 'Verify dashboard load', status: 'running', duration: 0 },
        { id: 6, name: 'Extract user data', status: 'pending', duration: 0 },
      ]
    },
    {
      id: 'exec-002',
      testName: 'Product Search & Filter',
      status: 'passed',
      startTime: new Date(Date.now() - 300000),
      endTime: new Date(Date.now() - 150000),
      duration: 150000,
      progress: {
        currentStep: 8,
        totalSteps: 8,
        percentage: 100
      },
      steps: [
        { id: 1, name: 'Open product page', status: 'success', duration: 2100 },
        { id: 2, name: 'Enter search term', status: 'success', duration: 1500 },
        { id: 3, name: 'Apply filters', status: 'success', duration: 2800 },
        { id: 4, name: 'Verify results', status: 'success', duration: 1900 },
      ]
    },
    {
      id: 'exec-003',
      testName: 'Checkout Process',
      status: 'failed',
      startTime: new Date(Date.now() - 600000),
      endTime: new Date(Date.now() - 480000),
      duration: 120000,
      progress: {
        currentStep: 6,
        totalSteps: 10,
        percentage: 60
      },
      error: 'Payment gateway timeout after 30s'
    },
    {
      id: 'exec-004',
      testName: 'User Registration',
      status: 'passed',
      startTime: new Date(Date.now() - 900000),
      endTime: new Date(Date.now() - 800000),
      duration: 100000,
      progress: {
        currentStep: 7,
        totalSteps: 7,
        percentage: 100
      }
    },
    {
      id: 'exec-005',
      testName: 'API Integration Test',
      status: 'running',
      startTime: new Date(Date.now() - 60000),
      progress: {
        currentStep: 3,
        totalSteps: 15,
        percentage: 20,
        currentAction: 'Testing API endpoint /auth'
      }
    }
  ]
});

export default function TestAutomationUI() {
  const [data, setData] = useState(generateMockData());
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedExecution, setSelectedExecution] = useState(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = { ...prevData };
        newData.executions = newData.executions.map(exec => {
          if (exec.status === 'running') {
            const newProgress = Math.min(exec.progress.percentage + Math.random() * 10, 100);
            const newStep = Math.min(
              exec.progress.currentStep + (newProgress > exec.progress.percentage + 5 ? 1 : 0),
              exec.progress.totalSteps
            );
            
            return {
              ...exec,
              progress: {
                ...exec.progress,
                percentage: newProgress,
                currentStep: newStep
              }
            };
          }
          return exec;
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Manrope', -apple-system, sans-serif;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 2s linear infinite;
        }
      `}</style>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Trinamix
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Test Automation</p>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {[
                { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                { id: 'executions', icon: '▶️', label: 'Test Runs', badge: 3 },
                { id: 'tests', icon: '📝', label: 'Test Library', badge: 127 },
                { id: 'analytics', icon: '📈', label: 'Analytics' },
                { id: 'settings', icon: '⚙️', label: 'Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeView === item.id
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-72 flex-1">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40 px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">Test Automation</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tests..."
                    className="w-80 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                  <span>▶️</span>
                  Run Test
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-8">
            {activeView === 'dashboard' && (
              <Dashboard data={data} onExecutionClick={setSelectedExecution} />
            )}
            {activeView === 'executions' && (
              <ExecutionsList executions={data.executions} onExecutionClick={setSelectedExecution} />
            )}
            {activeView === 'tests' && <TestsView />}
            {activeView === 'analytics' && <AnalyticsView />}
            {activeView === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>

      {/* Execution Detail Modal */}
      {selectedExecution && (
        <ExecutionDetailModal 
          execution={selectedExecution}
          onClose={() => setSelectedExecution(null)}
        />
      )}
    </div>
  );
}

// Dashboard Component
function Dashboard({ data, onExecutionClick }) {
  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Tests', 
            value: data.stats.totalTests, 
            icon: '📝', 
            trend: '↑ 12%',
            trendUp: true,
            color: 'from-indigo-500 to-purple-500'
          },
          { 
            label: 'Pass Rate', 
            value: `${data.stats.passRate}%`, 
            icon: '✓', 
            trend: '↑ 3.2%',
            trendUp: true,
            color: 'from-green-500 to-emerald-500'
          },
          { 
            label: 'Avg Duration', 
            value: `${Math.round(data.stats.avgDuration / 1000)}s`, 
            icon: '⏱️', 
            trend: '↓ 8%',
            trendUp: false,
            color: 'from-blue-500 to-cyan-500'
          },
          { 
            label: 'Active Runs', 
            value: data.stats.activeRuns, 
            icon: '▶️', 
            trend: 'Live',
            isLive: true,
            color: 'from-orange-500 to-red-500'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                stat.isLive 
                  ? 'bg-red-50 text-red-600 animate-pulse' 
                  : stat.trendUp 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-blue-50 text-blue-600'
              }`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Executions */}
      <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Executions</h3>
      <div className="space-y-4">
        {data.executions.map((execution, index) => (
          <ExecutionCard 
            key={execution.id}
            execution={execution}
            onClick={() => onExecutionClick(execution)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

// Execution Card Component
function ExecutionCard({ execution, onClick, delay = 0 }) {
  const formatDuration = (ms) => {
    if (!ms) return 'In progress...';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const statusColors = {
    running: 'bg-blue-50 text-blue-700 border-blue-200',
    passed: 'bg-green-50 text-green-700 border-green-200',
    failed: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer animate-slide-up"
      onClick={onClick}
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-900 mb-2">{execution.testName}</h4>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Started: {formatTime(execution.startTime)}</span>
            <span>•</span>
            <span>{formatDuration(execution.duration || Date.now() - execution.startTime.getTime())}</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border font-semibold flex items-center gap-2 ${statusColors[execution.status]}`}>
          {execution.status === 'running' && <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
          {execution.status === 'passed' && '✓'}
          {execution.status === 'failed' && '✗'}
          <span className="capitalize">{execution.status}</span>
        </div>
      </div>

      {execution.status === 'running' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">
              Step {execution.progress.currentStep} of {execution.progress.totalSteps}
            </span>
            <span className="font-semibold text-indigo-600">
              {Math.round(execution.progress.percentage)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${execution.progress.percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" 
                   style={{ animation: 'shimmer 2s infinite' }} />
            </div>
          </div>
          {execution.progress.currentAction && (
            <p className="text-sm text-slate-500 mt-2">Current: {execution.progress.currentAction}</p>
          )}
        </div>
      )}

      {execution.steps && (
        <div className="mt-4 space-y-2">
          {execution.steps.slice(0, 3).map(step => {
            const iconColors = {
              success: 'bg-green-500 text-white',
              running: 'bg-blue-500 text-white animate-spin',
              pending: 'bg-slate-200 text-slate-400'
            };
            
            return (
              <div key={step.id} className="flex items-center gap-3 text-sm">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[step.status]}`}>
                  {step.status === 'success' && '✓'}
                  {step.status === 'running' && '↻'}
                  {step.status === 'pending' && '○'}
                </div>
                <span className="text-slate-700 flex-1">{step.name}</span>
                {step.duration > 0 && (
                  <span className="text-slate-400 text-xs">{(step.duration / 1000).toFixed(1)}s</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {execution.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>⚠️ Error:</strong> {execution.error}
        </div>
      )}
    </div>
  );
}

// Execution Detail Modal
function ExecutionDetailModal({ execution, onClose }) {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{execution.testName}</h2>
            <p className="text-sm text-slate-500 mt-1">Execution ID: {execution.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 border-b border-slate-200">
          {[
            { id: 'timeline', icon: '📋', label: 'Timeline' },
            { id: 'screenshots', icon: '📸', label: 'Screenshots' },
            { id: 'data', icon: '📊', label: 'Data' },
            { id: 'logs', icon: '📝', label: 'Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {activeTab === 'timeline' && <TimelineView execution={execution} />}
          {activeTab === 'screenshots' && <ScreenshotsView />}
          {activeTab === 'data' && <DataView />}
          {activeTab === 'logs' && <LogsView />}
        </div>
      </div>
    </div>
  );
}

// Timeline View
function TimelineView({ execution }) {
  if (!execution.steps) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No steps available</h3>
        <p className="text-slate-500">Step details will appear here once the execution progresses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {execution.steps.map((step, index) => (
        <div key={step.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step.status === 'success' ? 'bg-green-500 text-white' :
                step.status === 'running' ? 'bg-blue-500 text-white' :
                'bg-slate-300 text-slate-600'
              }`}>
                {step.status === 'success' && '✓'}
                {step.status === 'running' && '↻'}
                {step.status === 'pending' && '○'}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Step {step.id}: {step.name}</h4>
                {step.duration > 0 && (
                  <p className="text-sm text-slate-500">Duration: {(step.duration / 1000).toFixed(2)}s</p>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              step.status === 'success' ? 'bg-green-100 text-green-700' :
              step.status === 'running' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-200 text-slate-600'
            }`}>
              {step.status}
            </span>
          </div>
          
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">// Agent Reasoning</div>
            <div className="mt-1">"Located element and verified visibility. Proceeding with interaction."</div>
            <div className="mt-3 text-blue-400">// Action Details</div>
            <div className="mt-1">
              Action: <span className="text-yellow-300">click_element</span><br />
              Target: <span className="text-purple-300">button[data-testid="submit-form"]</span><br />
              Duration: <span className="text-cyan-300">{step.duration ? `${(step.duration / 1000).toFixed(2)}s` : 'N/A'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Screenshots View
function ScreenshotsView() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(8).fill(null).map((_, i) => (
        <div key={i} className="aspect-video rounded-xl overflow-hidden border-2 border-slate-200 hover:border-indigo-400 hover:scale-105 transition-all cursor-pointer">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            #{i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}

// Data View
function DataView() {
  const mockData = {
    userProfile: {
      username: "john_doe",
      email: "john@example.com",
      accountType: "Premium",
      memberSince: "2022-01-15"
    },
    extractedProducts: [
      { id: "PRD-001", name: "Widget Pro", price: 49.99, inStock: true },
      { id: "PRD-002", name: "Gadget Plus", price: 79.99, inStock: false }
    ]
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
      <pre className="text-slate-100">{JSON.stringify(mockData, null, 2)}</pre>
    </div>
  );
}

// Logs View
function LogsView() {
  const mockLogs = [
    { time: '14:32:01.123', level: 'INFO', message: 'Agent initialized successfully', color: 'text-green-400' },
    { time: '14:32:01.456', level: 'DEBUG', message: 'Browser session created', color: 'text-slate-400' },
    { time: '14:32:02.789', level: 'INFO', message: 'Navigating to target URL', color: 'text-green-400' },
    { time: '14:32:05.234', level: 'DEBUG', message: 'DOM loaded: 142 elements detected', color: 'text-slate-400' },
    { time: '14:32:05.567', level: 'INFO', message: 'Screenshot captured', color: 'text-green-400' },
    { time: '14:32:06.890', level: 'WARN', message: 'Element load slower than expected (500ms)', color: 'text-yellow-400' },
    { time: '14:32:07.123', level: 'ERROR', message: 'Connection timeout on API endpoint', color: 'text-red-400' },
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm space-y-1 overflow-x-auto">
      {mockLogs.map((log, i) => (
        <div key={i} className="flex gap-4">
          <span className="text-slate-500">{log.time}</span>
          <span className={`font-semibold ${log.color}`}>[{log.level}]</span>
          <span className="text-slate-300">{log.message}</span>
        </div>
      ))}
    </div>
  );
}

// Tests View
function TestsView() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Test Library</h3>
      <p className="text-slate-500 mb-6">Your test library will appear here. Create your first test to get started.</p>
      <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        ➕ Create Test
      </button>
    </div>
  );
}

// Analytics View
function AnalyticsView() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📈</div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h3>
      <p className="text-slate-500">Detailed analytics and reporting coming soon</p>
    </div>
  );
}

// Settings View
function SettingsView() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">⚙️</div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Settings</h3>
      <p className="text-slate-500">Configuration options coming soon</p>
    </div>
  );
}

// Executions List View
function ExecutionsList({ executions, onExecutionClick }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">All Test Executions</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            🔍 Filter
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            📊 Export
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {executions.map((execution, index) => (
          <ExecutionCard 
            key={execution.id}
            execution={execution}
            onClick={() => onExecutionClick(execution)}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
