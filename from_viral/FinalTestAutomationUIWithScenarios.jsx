import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Plus, Search, MoreVertical, Play, Edit, Trash2, Copy, FolderPlus, Upload, Download, Filter, Grid, List, Clock, CheckCircle, XCircle, AlertCircle, Zap, ArrowRight, ArrowDown, X, Sparkles, Wand2, Save, Eye, ChevronUp, PlusCircle, Trash, Move, GripVertical, GitBranch, Workflow, PlayCircle, CheckSquare, Square } from 'lucide-react';

// Mock folder structure
const generateFolderStructure = () => ({
  id: 'root',
  name: 'Test Library',
  type: 'folder',
  children: [
    {
      id: 'f1',
      name: 'Project Workspace',
      type: 'folder',
      children: [
        {
          id: 'f1-1',
          name: 'Oracle Cloud HCM',
          type: 'folder',
          children: [
            { id: 't1', name: 'Payables Q125', type: 'test', lastRun: new Date(Date.now() - 3600000), status: 'passed', duration: 45, scenarioCount: 5 },
            { id: 't2', name: 'User Profile Update', type: 'test', lastRun: new Date(Date.now() - 7200000), status: 'passed', duration: 62, scenarioCount: 3 },
            { id: 't3', name: 'Benefits Enrollment', type: 'test', lastRun: new Date(Date.now() - 10800000), status: 'failed', duration: 38, scenarioCount: 4 }
          ]
        }
      ]
    }
  ]
});

const STEP_TYPES = [
  { id: 'navigate', label: 'Navigate', icon: '🔐', color: 'cyan', description: 'Navigate to URL or login' },
  { id: 'action', label: 'Action', icon: '➕', color: 'purple', description: 'Click, type, or interact' },
  { id: 'validate', label: 'Validate', icon: '✓', color: 'blue', description: 'Check conditions or approve' },
  { id: 'extract', label: 'Extract', icon: '📊', color: 'green', description: 'Extract data from page' },
  { id: 'wait', label: 'Wait', icon: '⏱️', color: 'yellow', description: 'Wait for element or time' },
  { id: 'terminate', label: 'Terminate', icon: '✗', color: 'red', description: 'End test or close browser' }
];

// Sample scenario data for a test
const generateScenarios = () => [
  { id: 's1', name: 'Scenario 120', mined: true, automated: true, steps: 6, linked: 6, status: 'active' },
  { id: 's2', name: 'Scenario 119', mined: true, automated: true, steps: 6, linked: 2, status: 'active' },
  { id: 's3', name: 'Scenario 118', mined: true, automated: true, steps: 6, linked: 2, status: 'active' },
  { id: 's4', name: 'Scenario 117', mined: true, automated: true, steps: 6, linked: 0, status: 'active' },
  { id: 's5', name: 'Scenario 116', mined: true, automated: false, steps: 6, linked: 0, status: 'suggested' }
];

// Sample flowchart data
const generateFlowchart = () => ({
  start: { id: 'start', type: 'start', label: 'START', x: 400, y: 50 },
  nodes: [
    { id: 'n1', type: 'action', label: 'CREATE CREDIT MEMO', number: '115', color: 'purple', x: 400, y: 150, connections: ['n2', 'n3', 'n4'] },
    { id: 'n2', type: 'action', label: 'CANCEL INVOICE', number: '115', color: 'purple', x: 200, y: 280, connections: ['n5', 'n6'] },
    { id: 'n3', type: 'action', label: 'ON HOLD INVOICE', number: '115', color: 'purple', x: 400, y: 380, connections: ['n7', 'n8'] },
    { id: 'n4', type: 'action', label: 'CREATE ACCOUNTING FOR INVOICE', number: '115', color: 'orange', x: 650, y: 280, connections: ['n7', 'n8'] },
    { id: 'n5', type: 'connector', x: 200, y: 380 },
    { id: 'n6', type: 'connector', x: 300, y: 350 },
    { id: 'n7', type: 'action', label: 'FORCE APPROVE INVOICE', number: '115', color: 'orange', x: 500, y: 500, connections: ['n9'] },
    { id: 'n8', type: 'connector', x: 700, y: 450 },
    { id: 'n9', type: 'connector', x: 500, y: 600 }
  ],
  end: { id: 'end', type: 'end', label: 'END', x: 400, y: 700 }
});

export default function TestAutomationUI() {
  const [folderStructure, setFolderStructure] = useState(generateFolderStructure());
  const [activeView, setActiveView] = useState('library');
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root', 'f1', 'f1-1']));
  const [viewMode, setViewMode] = useState('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestBuilder, setShowTestBuilder] = useState(false);
  const [showScenarioView, setShowScenarioView] = useState(null); // Test object when viewing scenarios
  const [contextMenu, setContextMenu] = useState(null);

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, sans-serif;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        
        .tree-item:hover { background: #F1F5F9; }
        .tree-item.selected { background: #EEF2FF; border-left: 3px solid #6366F1; }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

        .flow-node {
          cursor: pointer;
          transition: all 0.2s;
        }

        .flow-node:hover {
          filter: brightness(1.1);
          transform: scale(1.05);
        }

        .flow-connection {
          fill: none;
          stroke: #64748b;
          stroke-width: 2;
          pointer-events: none;
        }

        .scenario-item:hover {
          background: #F8FAFC;
        }
      `}</style>

      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col">
        <Header 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          setShowTestBuilder={setShowTestBuilder}
        />

        <div className="flex-1 overflow-hidden">
          {activeView === 'library' && !showScenarioView && (
            <TestLibrary
              folderStructure={folderStructure}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              viewMode={viewMode}
              searchQuery={searchQuery}
              handleContextMenu={handleContextMenu}
              setShowTestBuilder={setShowTestBuilder}
              onViewScenarios={setShowScenarioView}
            />
          )}
          
          {showScenarioView && (
            <ScenarioView 
              test={showScenarioView}
              onClose={() => setShowScenarioView(null)}
            />
          )}
          
          {activeView === 'executions' && <ExecutionsView />}
          {activeView === 'dashboard' && <DashboardView />}
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
        />
      )}

      {showTestBuilder && (
        <TestBuilderModal onClose={() => setShowTestBuilder(false)} />
      )}
    </div>
  );
}

// Sidebar Component (same as before, simplified)
function Sidebar({ activeView, setActiveView }) {
  const navItems = [
    { id: 'dashboard', icon: <Grid className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'library', icon: <Folder className="w-5 h-5" />, label: 'Test Library', count: 127 },
    { id: 'executions', icon: <Play className="w-5 h-5" />, label: 'Test Runs', badge: 3 }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">T</div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Trinamix</h1>
            <p className="text-xs text-slate-500">Test Automation</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
              activeView === item.id ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.count && <span className="text-xs text-slate-500">{item.count}</span>}
            {item.badge && <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full font-semibold">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Header Component
function Header({ viewMode, setViewMode, searchQuery, setSearchQuery, setShowTestBuilder }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Test Library</h2>
          <p className="text-sm text-slate-500 mt-0.5">Organize and manage your test automation scripts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
              className="w-80 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setViewMode('tree')} className={`p-2 rounded ${viewMode === 'tree' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button onClick={() => setShowTestBuilder(true)} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Create Test
          </button>
        </div>
      </div>
    </header>
  );
}

// Test Library Component
function TestLibrary({ folderStructure, expandedFolders, toggleFolder, selectedItem, setSelectedItem, viewMode, searchQuery, handleContextMenu, setShowTestBuilder, onViewScenarios }) {
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.reduce((acc, item) => {
      if (item.type === 'test' && item.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(item);
      } else if (item.type === 'folder' && item.children) {
        const filteredChildren = filterItems(item.children, query);
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren });
        }
      }
      return acc;
    }, []);
  };

  const filteredStructure = searchQuery 
    ? { ...folderStructure, children: filterItems(folderStructure.children, searchQuery) }
    : folderStructure;

  return (
    <div className="h-full flex">
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Folders</h3>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600">
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-2">
          <TreeNode
            node={filteredStructure}
            level={0}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            handleContextMenu={handleContextMenu}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TestListView
          items={getAllItems(filteredStructure)}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          handleContextMenu={handleContextMenu}
          setShowTestBuilder={setShowTestBuilder}
          onViewScenarios={onViewScenarios}
        />
      </div>
    </div>
  );
}

// Tree Node Component
function TreeNode({ node, level, expandedFolders, toggleFolder, selectedItem, setSelectedItem, handleContextMenu }) {
  if (node.type === 'test') return null;
  const isExpanded = expandedFolders.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer tree-item ${selectedItem?.id === node.id ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) toggleFolder(node.id);
          setSelectedItem(node);
        }}
        onContextMenu={(e) => handleContextMenu(e, node)}
      >
        {hasChildren && (
          <button className="p-0.5">
            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        {isExpanded ? <FolderOpen className="w-4 h-4 text-indigo-500" /> : <Folder className="w-4 h-4 text-slate-400" />}
        <span className="text-sm text-slate-700 flex-1 truncate">{node.name}</span>
        {hasChildren && <span className="text-xs text-slate-400">{node.children.filter(c => c.type === 'test').length}</span>}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} expandedFolders={expandedFolders} toggleFolder={toggleFolder} selectedItem={selectedItem} setSelectedItem={setSelectedItem} handleContextMenu={handleContextMenu} />
          ))}
        </div>
      )}
    </div>
  );
}

// Test List View with Scenarios Button
function TestListView({ items, selectedItem, setSelectedItem, handleContextMenu, setShowTestBuilder, onViewScenarios }) {
  const tests = items.filter(item => item.type === 'test');

  if (tests.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tests found</h3>
          <p className="text-slate-500 mb-6">Create your first test to get started</p>
          <button onClick={() => setShowTestBuilder(true)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 mx-auto">
            <Sparkles className="w-4 h-4" />
            Create Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Test Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Scenarios</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Last Run</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tests.map(test => (
              <tr
                key={test.id}
                className={`hover:bg-slate-50 cursor-pointer ${selectedItem?.id === test.id ? 'bg-indigo-50' : ''}`}
                onClick={() => setSelectedItem(test)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <File className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{test.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewScenarios(test);
                    }}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Workflow className="w-4 h-4" />
                    {test.scenarioCount || 0} scenarios
                  </button>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={test.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {test.lastRun ? formatTime(test.lastRun) : 'Never'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Run Test">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit Test">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="More">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// SCENARIO VIEW - Main new feature!
function ScenarioView({ test, onClose }) {
  const [scenarios, setScenarios] = useState(generateScenarios());
  const [selectedScenarios, setSelectedScenarios] = useState(new Set(['s1', 's2', 's3']));
  const [activeTab, setActiveTab] = useState('discovery'); // 'discovery' or 'linking'
  const [filterMode, setFilterMode] = useState('mined'); // 'all', 'automated', 'mined', 'suggested'
  const flowchart = generateFlowchart();

  const toggleScenario = (scenarioId) => {
    setSelectedScenarios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scenarioId)) {
        newSet.delete(scenarioId);
      } else {
        newSet.add(scenarioId);
      }
      return newSet;
    });
  };

  const filteredScenarios = scenarios.filter(s => {
    if (filterMode === 'all') return true;
    if (filterMode === 'mined') return s.mined;
    if (filterMode === 'automated') return s.automated;
    if (filterMode === 'suggested') return s.status === 'suggested';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="font-medium">Back to Tests</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white rounded-lg">
              <Download className="w-5 h-5 text-slate-600" />
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              START
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{test.name}</h2>
        <p className="text-sm text-slate-600 mt-1">Scenario execution flow and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-6">
        <button
          onClick={() => setActiveTab('discovery')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'discovery' ? 'text-teal-600 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Discovery Snapshot
          </div>
        </button>
        <button
          onClick={() => setActiveTab('linking')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'linking' ? 'text-teal-600 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Linking
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Scenario List */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
          {/* Filter Options */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search scenarios..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={() => setFilterMode('all')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  filterMode === 'all' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  All
                </span>
                <span className="text-xs">{scenarios.length}</span>
              </button>

              <button
                onClick={() => setFilterMode('automated')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  filterMode === 'automated' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Automated
                </span>
                <span className="text-xs">{scenarios.filter(s => s.automated).length}</span>
              </button>

              <button
                onClick={() => setFilterMode('mined')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  filterMode === 'mined' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mined
                </span>
                <span className="text-xs">{scenarios.filter(s => s.mined).length}</span>
              </button>

              <button
                onClick={() => setFilterMode('suggested')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  filterMode === 'suggested' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Suggested
                </span>
                <span className="text-xs">{scenarios.filter(s => s.status === 'suggested').length}</span>
              </button>
            </div>
          </div>

          {/* Scenario List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredScenarios.map(scenario => (
              <div
                key={scenario.id}
                className="scenario-item mb-2 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer"
                onClick={() => toggleScenario(scenario.id)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedScenarios.has(scenario.id)}
                    onChange={() => toggleScenario(scenario.id)}
                    className="mt-1 w-4 h-4 text-teal-600 rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900">{scenario.name}</span>
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <PlayCircle className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      {scenario.mined && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Mined
                        </span>
                      )}
                      {scenario.automated && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Auto
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {scenario.steps} steps
                      </span>
                      <span className="flex items-center gap-1">
                        {scenario.linked > 0 ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-600" />
                        )}
                        {scenario.linked}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Flowchart */}
        <div className="flex-1 overflow-auto relative bg-gradient-to-br from-slate-50 to-slate-100">
          <FlowchartCanvas flowchart={flowchart} />
        </div>

        {/* Right Panel - Summary */}
        <div className="w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
            
            <div className="flex gap-2 mb-4">
              <button className="flex-1 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200">
                All (5)
              </button>
              <button className="flex-1 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200">
                Activities
              </button>
              <button className="flex-1 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200">
                Configs
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Key Configurations</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">Payables</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-between py-2 mt-2">
                <span className="text-sm font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-slate-900">{filteredScenarios.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Flowchart Canvas Component
function FlowchartCanvas({ flowchart }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 800 750">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
        </marker>
      </defs>

      {/* Draw connections */}
      {flowchart.nodes.map(node => {
        if (!node.connections) return null;
        return node.connections.map((targetId, i) => {
          const target = flowchart.nodes.find(n => n.id === targetId) || flowchart.end;
          if (!target) return null;
          
          return (
            <path
              key={`${node.id}-${targetId}-${i}`}
              d={`M ${node.x} ${node.y + 30} Q ${(node.x + target.x) / 2} ${(node.y + target.y) / 2} ${target.x} ${target.y - 30}`}
              className="flow-connection"
              markerEnd="url(#arrowhead)"
            />
          );
        });
      })}

      {/* Start node */}
      <g className="flow-node" transform={`translate(${flowchart.start.x}, ${flowchart.start.y})`}>
        <ellipse cx="0" cy="0" rx="50" ry="25" fill="#10b981" />
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {flowchart.start.label}
        </text>
      </g>

      {/* Action nodes */}
      {flowchart.nodes.map(node => {
        if (node.type === 'connector') {
          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle cx="0" cy="0" r="12" fill="#475569" />
              <text x="0" y="5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                {node.number || '•'}
              </text>
            </g>
          );
        }

        const color = node.color === 'purple' ? '#9333ea' : '#f59e0b';
        
        return (
          <g key={node.id} className="flow-node" transform={`translate(${node.x}, ${node.y})`}>
            <rect x="-80" y="-25" width="160" height="50" rx="25" fill={color} />
            <text x="-60" y="-5" textAnchor="start" fill="white" fontSize="12" fontWeight="bold">
              {node.number}
            </text>
            <text x="0" y="5" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
              {node.label}
            </text>
          </g>
        );
      })}

      {/* End node */}
      <g className="flow-node" transform={`translate(${flowchart.end.x}, ${flowchart.end.y})`}>
        <ellipse cx="0" cy="0" rx="50" ry="25" fill="#ef4444" />
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {flowchart.end.label}
        </text>
      </g>
    </svg>
  );
}

// TEST BUILDER MODAL WITH FULL EDITING CAPABILITIES
function TestBuilderModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [testDescription, setTestDescription] = useState('');
  const [testName, setTestName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState([]);
  const [editingStep, setEditingStep] = useState(null);
  const [showAddStepModal, setShowAddStepModal] = useState(null);

  const handleGenerateSteps = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const steps = [
        { id: 1, type: 'navigate', title: 'Log in to Oracle', description: 'Navigate to Oracle login page and authenticate', icon: '🔐', color: 'cyan' },
        { id: 2, type: 'action', title: 'Create Purchase Requisition', description: 'Click on "New Purchase Requisition" button', icon: '➕', color: 'purple' },
        { id: 3, type: 'validate', title: 'Approve Purchase Requisition', description: 'Enter supervisor details and approve the requisition', icon: '✓', color: 'blue' },
        { id: 4, type: 'action', title: 'Create Purchase Order', description: 'Convert requisition to purchase order', icon: '➕', color: 'purple' },
        { id: 5, type: 'terminate', title: 'Close browser', description: 'End the test and close browser session', icon: '✗', color: 'red' }
      ];
      setGeneratedSteps(steps);
      setIsGenerating(false);
      setStep(2);
    }, 2000);
  };

  const handleDeleteStep = (stepId) => {
    setGeneratedSteps(prev => prev.filter(s => s.id !== stepId));
  };

  const handleMoveStepUp = (stepId) => {
    setGeneratedSteps(prev => {
      const index = prev.findIndex(s => s.id === stepId);
      if (index <= 0) return prev;
      const newSteps = [...prev];
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
      return newSteps;
    });
  };

  const handleMoveStepDown = (stepId) => {
    setGeneratedSteps(prev => {
      const index = prev.findIndex(s => s.id === stepId);
      if (index >= prev.length - 1) return prev;
      const newSteps = [...prev];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      return newSteps;
    });
  };

  const handleAddStep = (position, referenceStepId, newStep) => {
    setGeneratedSteps(prev => {
      const index = prev.findIndex(s => s.id === referenceStepId);
      const newSteps = [...prev];
      const insertIndex = position === 'before' ? index : index + 1;
      const newId = Math.max(...prev.map(s => s.id)) + 1;
      newSteps.splice(insertIndex, 0, { ...newStep, id: newId });
      return newSteps;
    });
    setShowAddStepModal(null);
  };

  const handleUpdateStep = (stepId, updates) => {
    setGeneratedSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...updates } : s));
    setEditingStep(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-indigo-600" />
              AI Test Builder
            </h2>
            <p className="text-sm text-slate-600 mt-1">Describe your test and let AI generate the automation steps</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
                  <Wand2 className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Let AI Create Your Test</h3>
                  <p className="text-indigo-100">Simply describe what you want to test, and our AI will generate a complete workflow with all necessary steps.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="e.g., Approve Purchase Requisition"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Describe your test scenario *
                    </label>
                    <textarea
                      value={testDescription}
                      onChange={(e) => setTestDescription(e.target.value)}
                      placeholder="Example: I want to test the complete purchase requisition approval flow in Oracle. First, log into the system, then create a new purchase requisition, fill in supervisor details with name 'Dimpy Sharma', role 'Approver II', limit '$150,000', organization 'Acme Operations', and purpose 'Conference'. Then approve it and create a purchase order. Finally, close the browser."
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base h-48 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">Be specific about actions, data to enter, and validations needed. The more detailed, the better!</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Tips for better results:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                      <li>Include specific URLs, page names, or navigation paths</li>
                      <li>Mention exact field names and values to enter</li>
                      <li>Specify expected outcomes or validations</li>
                      <li>Describe the complete flow from start to finish</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleGenerateSteps}
                    disabled={!testName || !testDescription || isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating your test...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Continue
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Generated Test: {testName}</h3>
                  <p className="text-slate-600">Review, edit, reorder, or add/remove steps as needed</p>
                </div>

                {/* Visual Flowchart with Edit Controls */}
                <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                  <div className="flex flex-col items-center space-y-0">
                    {generatedSteps.map((flowStep, index) => (
                      <div key={flowStep.id} className="w-full max-w-3xl">
                        <EditableFlowStep 
                          step={flowStep}
                          index={index}
                          totalSteps={generatedSteps.length}
                          onEdit={() => setEditingStep(flowStep)}
                          onDelete={() => handleDeleteStep(flowStep.id)}
                          onMoveUp={() => handleMoveStepUp(flowStep.id)}
                          onMoveDown={() => handleMoveStepDown(flowStep.id)}
                          onAddBefore={() => setShowAddStepModal({ position: 'before', stepId: flowStep.id })}
                          onAddAfter={() => setShowAddStepModal({ position: 'after', stepId: flowStep.id })}
                        />
                        {index < generatedSteps.length - 1 && (
                          <div className="flex justify-center py-2 relative">
                            <ArrowDown className="w-5 h-5 text-slate-400" />
                            <button
                              onClick={() => setShowAddStepModal({ position: 'after', stepId: flowStep.id })}
                              className="absolute left-1/2 -translate-x-1/2 p-1.5 bg-white border-2 border-dashed border-slate-300 rounded-full hover:border-indigo-500 hover:bg-indigo-50 transition-all opacity-0 hover:opacity-100"
                              title="Insert step here"
                            >
                              <PlusCircle className="w-4 h-4 text-indigo-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    onClick={() => {
                      console.log('Saving test:', { testName, steps: generatedSteps });
                      onClose();
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Test
                  </button>
                  <button
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Run Test Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Step Modal */}
      {editingStep && (
        <EditStepModal
          step={editingStep}
          onClose={() => setEditingStep(null)}
          onSave={(updates) => handleUpdateStep(editingStep.id, updates)}
        />
      )}

      {/* Add Step Modal */}
      {showAddStepModal && (
        <AddStepModal
          position={showAddStepModal.position}
          onClose={() => setShowAddStepModal(null)}
          onAdd={(newStep) => handleAddStep(showAddStepModal.position, showAddStepModal.stepId, newStep)}
        />
      )}
    </div>
  );
}

// Editable Flow Step Component with all controls
function EditableFlowStep({ step, index, totalSteps, onEdit, onDelete, onMoveUp, onMoveDown, onAddBefore, onAddAfter }) {
  const colorClasses = {
    cyan: 'bg-cyan-100 border-cyan-300 text-cyan-900',
    purple: 'bg-purple-100 border-purple-300 text-purple-900',
    blue: 'bg-blue-100 border-blue-300 text-blue-900',
    red: 'bg-red-100 border-red-300 text-red-900',
    green: 'bg-green-100 border-green-300 text-green-900',
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  };

  return (
    <div className="flow-step relative group">
      {/* Add Before Button */}
      <div className="flex justify-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onAddBefore}
          className="px-3 py-1 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
        >
          <PlusCircle className="w-3 h-3" />
          Add step above
        </button>
      </div>

      <div className={`${colorClasses[step.color]} border-2 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all relative`}>
        {/* Step Number Badge */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center font-bold text-sm text-slate-700 shadow-sm">
          {index + 1}
        </div>

        {/* Main Content */}
        <div className="flex items-center gap-4">
          <div className="text-4xl">{step.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg mb-1">{step.title}</h4>
            <p className="text-sm opacity-80">{step.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1 step-hover-actions opacity-0 group-hover:opacity-100">
            <div className="flex gap-1">
              <button 
                onClick={onEdit}
                className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-sm"
                title="Edit step"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={onDelete}
                className="p-2 bg-white/80 hover:bg-red-50 rounded-lg shadow-sm text-red-600"
                title="Delete step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={onMoveUp}
                disabled={index === 0}
                className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                onClick={onMoveDown}
                disabled={index === totalSteps - 1}
                className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add After Button */}
      <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onAddAfter}
          className="px-3 py-1 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
        >
          <PlusCircle className="w-3 h-3" />
          Add step below
        </button>
      </div>
    </div>
  );
}

// Edit Step Modal
function EditStepModal({ step, onClose, onSave }) {
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description);
  const [type, setType] = useState(step.type);

  const selectedType = STEP_TYPES.find(t => t.id === type);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 animate-slide-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Edit Step</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Step Type</label>
            <div className="grid grid-cols-3 gap-2">
              {STEP_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    type === t.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="font-semibold text-sm">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Step Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const updatedType = STEP_TYPES.find(t => t.id === type);
              onSave({
                title,
                description,
                type,
                icon: updatedType.icon,
                color: updatedType.color
              });
            }}
            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Step Modal
function AddStepModal({ position, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('action');

  const selectedType = STEP_TYPES.find(t => t.id === type);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 animate-slide-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Add New Step</h3>
        <p className="text-sm text-slate-600 mb-6">This step will be inserted {position} the selected step</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Step Type</label>
            <div className="grid grid-cols-3 gap-2">
              {STEP_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    type === t.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Step Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Click submit button"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what this step does..."
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title) return;
              const newStep = {
                title,
                description,
                type,
                icon: selectedType.icon,
                color: selectedType.color
              };
              onAdd(newStep);
            }}
            disabled={!title}
            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Step
          </button>
        </div>
      </div>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const config = {
    passed: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3 h-3" />, label: 'Passed' },
    failed: { color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" />, label: 'Failed' },
    running: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <div className="w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />, label: 'Running' }
  };
  const { color, icon, label } = config[status] || config.passed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {icon}
      {label}
    </span>
  );
}

// Context Menu
function ContextMenu({ x, y, item, onClose }) {
  return (
    <div className="fixed bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[180px]" style={{ top: y, left: x }}>
      <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">
        <Play className="w-4 h-4" />
        <span>Run Test</span>
      </button>
      <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">
        <Edit className="w-4 h-4" />
        <span>Edit</span>
      </button>
      <div className="h-px bg-slate-200 my-1" />
      <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 text-red-600">
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Tests', value: 127, icon: <File className="w-6 h-6" />, color: 'from-indigo-500 to-purple-600' },
          { label: 'Pass Rate', value: '94.2%', icon: <CheckCircle className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
          { label: 'Active Runs', value: 3, icon: <Play className="w-6 h-6" />, color: 'from-blue-500 to-cyan-600' },
          { label: 'Scenarios', value: 248, icon: <Workflow className="w-6 h-6" />, color: 'from-teal-500 to-cyan-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Executions View
function ExecutionsView() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Test Runs</h3>
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <p className="text-slate-600">No recent executions</p>
      </div>
    </div>
  );
}

// Helper Functions
function getAllItems(node, items = []) {
  if (node.type === 'test') items.push(node);
  if (node.children) node.children.forEach(child => getAllItems(child, items));
  return items;
}

function formatTime(date) {
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
