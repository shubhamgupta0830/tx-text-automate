import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Plus, Search, MoreVertical, Play, Edit, Trash2, Copy, FolderPlus, Upload, Download, Filter, Grid, List, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
        },
        { id: 't6', name: 'Integration Test Suite', type: 'test', lastRun: new Date(Date.now() - 21600000), status: 'passed', duration: 120 }
      ]
    },
    {
      id: 'f2',
      name: 'Salesforce',
      type: 'folder',
      children: [
        { id: 't7', name: 'Lead Conversion Flow', type: 'test', lastRun: new Date(Date.now() - 25200000), status: 'passed', duration: 56 },
        { id: 't8', name: 'Opportunity Management', type: 'test', lastRun: new Date(Date.now() - 28800000), status: 'passed', duration: 73 },
        { id: 't9', name: 'Report Generation', type: 'test', lastRun: null, status: 'not_run', duration: 0 }
      ]
    },
    {
      id: 'f3',
      name: 'E-commerce Platform',
      type: 'folder',
      children: [
        {
          id: 'f3-1',
          name: 'Checkout Process',
          type: 'folder',
          children: [
            { id: 't10', name: 'Guest Checkout', type: 'test', lastRun: new Date(Date.now() - 32400000), status: 'passed', duration: 45 },
            { id: 't11', name: 'Registered User Checkout', type: 'test', lastRun: new Date(Date.now() - 36000000), status: 'passed', duration: 52 },
            { id: 't12', name: 'Payment Gateway Integration', type: 'test', lastRun: new Date(Date.now() - 39600000), status: 'failed', duration: 28 }
          ]
        },
        { id: 't13', name: 'Product Search & Filter', type: 'test', lastRun: new Date(Date.now() - 43200000), status: 'passed', duration: 34 }
      ]
    },
    {
      id: 'f4',
      name: 'API Testing',
      type: 'folder',
      children: [
        { id: 't14', name: 'Authentication API', type: 'test', lastRun: new Date(Date.now() - 46800000), status: 'passed', duration: 12 },
        { id: 't15', name: 'Data Sync API', type: 'test', lastRun: new Date(Date.now() - 50400000), status: 'running', duration: 0 }
      ]
    }
  ]
});

export default function TestAutomationUI() {
  const [folderStructure, setFolderStructure] = useState(generateFolderStructure());
  const [activeView, setActiveView] = useState('library');
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root', 'f1', 'f1-1']));
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
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
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
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
      `}</style>

      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header viewMode={viewMode} setViewMode={setViewMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
              setShowCreateModal={setShowCreateModal}
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

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal onClose={() => setShowCreateModal(false)} />
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
function Header({ viewMode, setViewMode, searchQuery, setSearchQuery }) {
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
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Test
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
  setShowCreateModal
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
            onClick={() => setShowCreateModal(true)}
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

// Tree Node Component
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
function TestListView({ items, selectedItem, setSelectedItem, handleContextMenu }) {
  const tests = items.filter(item => item.type === 'test');

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
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
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

// Test Grid View
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
                <div className="flex items-center gap-2">
                  <span>Duration: {test.duration}s</span>
                </div>
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

// Create Modal Component
function CreateModal({ onClose }) {
  const [type, setType] = useState('test'); // 'test' or 'folder'
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 animate-slide-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Create New {type === 'test' ? 'Test' : 'Folder'}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setType('test')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium ${
                  type === 'test' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <File className="w-4 h-4 inline mr-2" />
                Test
              </button>
              <button
                onClick={() => setType('folder')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium ${
                  type === 'folder' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <Folder className="w-4 h-4 inline mr-2" />
                Folder
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${type} name...`}
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
              console.log('Creating', type, name);
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
