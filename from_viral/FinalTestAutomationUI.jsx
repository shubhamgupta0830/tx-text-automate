import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Plus, Search, MoreVertical, Play, Edit, Trash2, Copy, FolderPlus, Upload, Download, Filter, Grid, List, Clock, CheckCircle, XCircle, AlertCircle, Zap, ArrowRight, ArrowDown, X, Sparkles, Wand2, Save, Eye } from 'lucide-react';

// Mock folder structure with more details
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
            { id: 't1', name: 'Login Flow Validation', type: 'test', lastRun: new Date(Date.now() - 3600000), status: 'passed', duration: 45 },
            { id: 't2', name: 'User Profile Update', type: 'test', lastRun: new Date(Date.now() - 7200000), status: 'passed', duration: 62 },
            { id: 't3', name: 'Benefits Enrollment', type: 'test', lastRun: new Date(Date.now() - 10800000), status: 'failed', duration: 38 }
          ]
        },
        {
          id: 'f1-2',
          name: 'Oracle Fusion',
          type: 'folder',
          children: [
            { id: 't4', name: 'Invoice Processing', type: 'test', lastRun: new Date(Date.now() - 14400000), status: 'passed', duration: 89 },
            { id: 't5', name: 'Purchase Order Creation', type: 'test', lastRun: new Date(Date.now() - 18000000), status: 'running', duration: 0 }
          ]
        }
      ]
    },
    {
      id: 'f2',
      name: 'E-commerce Platform',
      type: 'folder',
      children: [
        { id: 't6', name: 'Product Search & Filter', type: 'test', lastRun: new Date(Date.now() - 21600000), status: 'passed', duration: 34 }
      ]
    }
  ]
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
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 1000px 100%;
        }

        .tree-item:hover {
          background: #F1F5F9;
        }

        .tree-item.selected {
          background: #EEF2FF;
          border-left: 3px solid #6366F1;
        }

        .context-menu {
          animation: slideIn 0.15s ease-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #F1F5F9;
        }

        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }

        .flow-connector {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          background: #CBD5E1;
        }

        .flow-step {
          position: relative;
          z-index: 1;
        }

        .flow-step::before {
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 20px;
          background: #CBD5E1;
        }

        .flow-step:first-child::before {
          display: none;
        }
      `}</style>

      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          setShowCreateModal={setShowCreateModal}
          setShowTestBuilder={setShowTestBuilder}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'library' && (
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
            />
          )}
          {activeView === 'executions' && <ExecutionsView />}
          {activeView === 'dashboard' && <DashboardView />}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Create Folder Modal */}
      {showCreateModal && (
        <CreateFolderModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Test Builder Modal */}
      {showTestBuilder && (
        <TestBuilderModal onClose={() => setShowTestBuilder(false)} />
      )}
    </div>
  );
}

// Sidebar Component
function Sidebar({ activeView, setActiveView }) {
  const navItems = [
    { id: 'dashboard', icon: <Grid className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'library', icon: <Folder className="w-5 h-5" />, label: 'Test Library', count: 127 },
    { id: 'executions', icon: <Play className="w-5 h-5" />, label: 'Test Runs', badge: 3 },
    { id: 'analytics', icon: <ChevronRight className="w-5 h-5" />, label: 'Analytics' },
    { id: 'settings', icon: <ChevronRight className="w-5 h-5" />, label: 'Settings' }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
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
              activeView === item.id
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.count && (
              <span className="text-xs text-slate-500">{item.count}</span>
            )}
            {item.badge && (
              <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header({ viewMode, setViewMode, searchQuery, setSearchQuery, setShowCreateModal, setShowTestBuilder }) {
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
              className="w-80 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`p-2 rounded ${viewMode === 'tree' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Filter">
            <Filter className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowTestBuilder(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Create Test
          </button>
        </div>
      </div>
    </header>
  );
}

// Test Library Component
function TestLibrary({ 
  folderStructure, 
  expandedFolders, 
  toggleFolder, 
  selectedItem, 
  setSelectedItem,
  viewMode,
  searchQuery,
  handleContextMenu,
  setShowTestBuilder
}) {
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
      {/* Folder Tree */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Folders</h3>
          <button 
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
            title="New Folder"
          >
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'tree' ? (
          <TestListView
            items={getAllItems(filteredStructure)}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            handleContextMenu={handleContextMenu}
            setShowTestBuilder={setShowTestBuilder}
          />
        ) : (
          <TestGridView
            items={getAllItems(filteredStructure)}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            handleContextMenu={handleContextMenu}
          />
        )}
      </div>
    </div>
  );
}

// Tree Node Component (same as before)
function TreeNode({ node, level, expandedFolders, toggleFolder, selectedItem, setSelectedItem, handleContextMenu }) {
  if (node.type === 'test') return null;

  const isExpanded = expandedFolders.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer tree-item ${
          selectedItem?.id === node.id ? 'selected' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) toggleFolder(node.id);
          setSelectedItem(node);
        }}
        onContextMenu={(e) => handleContextMenu(e, node)}
      >
        {hasChildren && (
          <button className="p-0.5">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        
        {isExpanded ? (
          <FolderOpen className="w-4 h-4 text-indigo-500" />
        ) : (
          <Folder className="w-4 h-4 text-slate-400" />
        )}
        
        <span className="text-sm text-slate-700 flex-1 truncate">{node.name}</span>
        
        {hasChildren && (
          <span className="text-xs text-slate-400">
            {node.children.filter(c => c.type === 'test').length}
          </span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              handleContextMenu={handleContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Test List View
function TestListView({ items, selectedItem, setSelectedItem, handleContextMenu, setShowTestBuilder }) {
  const tests = items.filter(item => item.type === 'test');

  if (tests.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tests found</h3>
          <p className="text-slate-500 mb-6">Create your first test to get started</p>
          <button 
            onClick={() => setShowTestBuilder(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 mx-auto"
          >
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
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Test Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Last Run
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tests.map(test => (
              <tr
                key={test.id}
                className={`hover:bg-slate-50 cursor-pointer ${
                  selectedItem?.id === test.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedItem(test)}
                onContextMenu={(e) => handleContextMenu(e, test)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <File className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{test.name}</span>
                  </div>
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
                  <span className="text-sm text-slate-600">
                    {test.duration > 0 ? `${test.duration}s` : '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Run Test">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit Test">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="More Options">
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

// Test Grid View (simplified version)
function TestGridView({ items, selectedItem, setSelectedItem, handleContextMenu }) {
  const tests = items.filter(item => item.type === 'test');

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tests.map(test => (
          <div
            key={test.id}
            className={`bg-white rounded-lg border-2 p-4 cursor-pointer hover:shadow-lg transition-all ${
              selectedItem?.id === test.id ? 'border-indigo-500 shadow-lg' : 'border-slate-200'
            }`}
            onClick={() => setSelectedItem(test)}
            onContextMenu={(e) => handleContextMenu(e, test)}
          >
            <div className="flex items-start justify-between mb-3">
              <File className="w-8 h-8 text-indigo-500" />
              <StatusBadge status={test.status} />
            </div>
            
            <h4 className="font-semibold text-slate-900 mb-2 truncate">{test.name}</h4>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>{test.lastRun ? formatTime(test.lastRun) : 'Never run'}</span>
              </div>
              {test.duration > 0 && (
                <div>Duration: {test.duration}s</div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <button className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded text-xs font-semibold hover:bg-indigo-100 flex items-center justify-center gap-1">
                <Play className="w-3 h-3" />
                Run
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// TEST BUILDER MODAL - The main feature!
function TestBuilderModal({ onClose }) {
  const [step, setStep] = useState(1); // 1: AI Input, 2: Generated Steps, 3: Visual Builder
  const [testDescription, setTestDescription] = useState('');
  const [testName, setTestName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState([]);

  const handleGenerateSteps = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const steps = [
        { id: 1, type: 'navigate', title: 'Log in to Oracle', description: 'Navigate to Oracle login page and authenticate', icon: '🔐', color: 'cyan' },
        { id: 2, type: 'action', title: 'Create Purchase Requisition', description: 'Click on "New Purchase Requisition" button', icon: '➕', color: 'slate' },
        { id: 3, type: 'validate', title: 'Approve Purchase Requisition', description: 'Enter supervisor details and approve the requisition', icon: '✓', color: 'blue' },
        { id: 4, type: 'action', title: 'Create Purchase Order', description: 'Convert requisition to purchase order', icon: '➕', color: 'slate' },
        { id: 5, type: 'terminate', title: 'Close browser', description: 'End the test and close browser session', icon: '✗', color: 'red' }
      ];
      setGeneratedSteps(steps);
      setIsGenerating(false);
      setStep(2);
    }, 2000);
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
                        Generate Test Steps
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Generated Test: {testName}</h3>
                  <p className="text-slate-600">Review and customize the steps generated by AI</p>
                </div>

                {/* Visual Flowchart */}
                <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                  <div className="flex flex-col items-center space-y-0">
                    {generatedSteps.map((flowStep, index) => (
                      <div key={flowStep.id} className="w-full max-w-2xl">
                        <FlowStep step={flowStep} index={index} />
                        {index < generatedSteps.length - 1 && (
                          <div className="flex justify-center py-3">
                            <ArrowDown className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Details Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Test Steps Details</h4>
                  <div className="space-y-3">
                    {generatedSteps.map((s, i) => (
                      <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-slate-900">{s.title}</h5>
                          <p className="text-sm text-slate-600 mt-1">{s.description}</p>
                        </div>
                        <button className="p-2 hover:bg-slate-200 rounded text-slate-600">
                          <Edit className="w-4 h-4" />
                        </button>
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
                      // Save test
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
    </div>
  );
}

// Flow Step Component for Visual Flowchart
function FlowStep({ step, index }) {
  const colorClasses = {
    cyan: 'bg-cyan-100 border-cyan-300 text-cyan-900',
    slate: 'bg-slate-100 border-slate-300 text-slate-900',
    blue: 'bg-blue-100 border-blue-300 text-blue-900',
    red: 'bg-red-100 border-red-300 text-red-900',
  };

  return (
    <div className={`${colorClasses[step.color]} border-2 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{step.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-1">{step.title}</h4>
          <p className="text-sm opacity-80">{step.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="p-2 bg-white/50 hover:bg-white rounded-lg">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/50 hover:bg-white rounded-lg">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const config = {
    passed: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3 h-3" />, label: 'Passed' },
    failed: { color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" />, label: 'Failed' },
    running: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <div className="w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />, label: 'Running' },
    not_run: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <AlertCircle className="w-3 h-3" />, label: 'Not Run' }
  };

  const { color, icon, label } = config[status] || config.not_run;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {icon}
      {label}
    </span>
  );
}

// Context Menu Component
function ContextMenu({ x, y, item, onClose }) {
  const menuItems = item.type === 'folder' ? [
    { icon: <FolderPlus className="w-4 h-4" />, label: 'New Folder', action: () => console.log('New folder') },
    { icon: <Plus className="w-4 h-4" />, label: 'New Test', action: () => console.log('New test') },
    { divider: true },
    { icon: <Edit className="w-4 h-4" />, label: 'Rename', action: () => console.log('Rename') },
    { icon: <Copy className="w-4 h-4" />, label: 'Duplicate', action: () => console.log('Duplicate') },
    { divider: true },
    { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: () => console.log('Delete'), danger: true }
  ] : [
    { icon: <Play className="w-4 h-4" />, label: 'Run Test', action: () => console.log('Run') },
    { icon: <Edit className="w-4 h-4" />, label: 'Edit Test', action: () => console.log('Edit') },
    { divider: true },
    { icon: <Copy className="w-4 h-4" />, label: 'Duplicate', action: () => console.log('Duplicate') },
    { icon: <Download className="w-4 h-4" />, label: 'Export', action: () => console.log('Export') },
    { divider: true },
    { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: () => console.log('Delete'), danger: true }
  ];

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 context-menu min-w-[180px]"
      style={{ top: y, left: x }}
    >
      {menuItems.map((item, index) => 
        item.divider ? (
          <div key={index} className="h-px bg-slate-200 my-1" />
        ) : (
          <button
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 ${
              item.danger ? 'text-red-600' : 'text-slate-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>
  );
}

// Create Folder Modal
function CreateFolderModal({ onClose }) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 animate-slide-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Folder</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Creating folder:', name);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Tests', value: 127, icon: <File className="w-6 h-6" />, color: 'from-indigo-500 to-purple-600' },
          { label: 'Pass Rate', value: '94.2%', icon: <CheckCircle className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
          { label: 'Active Runs', value: 3, icon: <Play className="w-6 h-6" />, color: 'from-blue-500 to-cyan-600' },
          { label: 'Avg Duration', value: '145s', icon: <Clock className="w-6 h-6" />, color: 'from-orange-500 to-red-600' }
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
  if (node.type === 'test') {
    items.push(node);
  }
  if (node.children) {
    node.children.forEach(child => getAllItems(child, items));
  }
  return items;
}

function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
