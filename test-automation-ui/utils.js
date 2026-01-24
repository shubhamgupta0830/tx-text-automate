// Utility Functions for Test Automation UI

const Utils = {
  // Format duration in milliseconds to human readable
  formatDuration: (ms) => {
    if (!ms && ms !== 0) return '--';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },

  // Format duration short (e.g., "2:34")
  formatDurationShort: (ms) => {
    if (!ms && ms !== 0) return '--:--';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  // Format date to relative time (e.g., "2 hours ago")
  formatRelativeTime: (dateString) => {
    if (!dateString) return '--';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  },

  // Format date to time only (e.g., "2:45:32 PM")
  formatTime: (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  },

  // Format date to short format (e.g., "Jan 9, 2024")
  formatDate: (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Format date and time (e.g., "Jan 9, 2024 2:45 PM")
  formatDateTime: (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  },

  // Format timestamp for logs (e.g., "14:45:32.123")
  formatLogTimestamp: (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  },

  // Calculate percentage
  calculatePercentage: (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  },

  // Get status color class
  getStatusClass: (status) => {
    const statusMap = {
      'passed': 'success',
      'success': 'success',
      'failed': 'failed',
      'error': 'error',
      'running': 'running',
      'in-progress': 'running',
      'queued': 'pending',
      'pending': 'pending',
      'warning': 'warning',
      'cancelled': 'pending'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  },

  // Get status icon
  getStatusIcon: (status) => {
    const iconMap = {
      'passed': 'fa-check',
      'success': 'fa-check',
      'failed': 'fa-times',
      'error': 'fa-exclamation-triangle',
      'running': 'fa-spinner fa-spin',
      'in-progress': 'fa-spinner fa-spin',
      'queued': 'fa-clock',
      'pending': 'fa-circle',
      'warning': 'fa-exclamation',
      'cancelled': 'fa-ban'
    };
    return iconMap[status?.toLowerCase()] || 'fa-circle';
  },

  // Get action icon for test steps
  getActionIcon: (action) => {
    const iconMap = {
      'navigate': 'fa-globe',
      'click': 'fa-mouse-pointer',
      'type': 'fa-keyboard',
      'input': 'fa-keyboard',
      'select': 'fa-hand-pointer',
      'hover': 'fa-hand-paper',
      'scroll': 'fa-arrows-alt-v',
      'wait': 'fa-clock',
      'assert': 'fa-check-double',
      'verify': 'fa-check-double',
      'extract': 'fa-database',
      'screenshot': 'fa-camera',
      'submit': 'fa-paper-plane',
      'upload': 'fa-upload',
      'download': 'fa-download',
      'drag': 'fa-arrows-alt',
      'drop': 'fa-compress-arrows-alt',
      'clear': 'fa-eraser',
      'refresh': 'fa-sync-alt',
      'switch': 'fa-exchange-alt',
      'close': 'fa-times-circle',
      'focus': 'fa-crosshairs',
      'blur': 'fa-eye-slash'
    };
    return iconMap[action?.toLowerCase()] || 'fa-cog';
  },

  // Truncate text
  truncate: (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  },

  // Format JSON for display
  formatJSON: (data, indent = 2) => {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      return JSON.stringify(data, null, indent);
    } catch (e) {
      return String(data);
    }
  },

  // Syntax highlight JSON
  highlightJSON: (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  },

  // Generate unique ID
  generateId: () => {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  // Copy to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  },

  // Get action type icon
  getActionIcon: (actionType) => {
    const iconMap = {
      'go_to_url': 'fa-globe',
      'navigate': 'fa-globe',
      'click': 'fa-mouse-pointer',
      'input_text': 'fa-keyboard',
      'input': 'fa-keyboard',
      'extract_content': 'fa-file-export',
      'extract': 'fa-file-export',
      'wait': 'fa-clock',
      'scroll': 'fa-arrows-alt-v',
      'screenshot': 'fa-camera',
      'take_screenshot': 'fa-camera',
      'verify': 'fa-check-circle',
      'done': 'fa-flag-checkered',
      'select_dropdown': 'fa-caret-square-down',
      'upload_file': 'fa-upload',
      'go_back': 'fa-arrow-left',
      'switch_tab': 'fa-exchange-alt',
      'open_new_tab': 'fa-plus-square',
      'close_tab': 'fa-window-close'
    };
    return iconMap[actionType?.toLowerCase()] || 'fa-cog';
  },

  // Get log level class
  getLogLevelClass: (level) => {
    return level?.toLowerCase() || 'info';
  },

  // Filter array by search term
  filterBySearch: (items, searchTerm, keys) => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      return keys.some(key => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(term);
      });
    });
  },

  // Sort array by key
  sortBy: (items, key, ascending = true) => {
    return [...items].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  },

  // Group array by key
  groupBy: (items, key) => {
    return items.reduce((groups, item) => {
      const value = item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  },

  // Calculate success rate from executions
  calculateSuccessRate: (executions) => {
    if (!executions || executions.length === 0) return 0;
    
    const completed = executions.filter(e => e.status === 'passed' || e.status === 'failed');
    if (completed.length === 0) return 0;
    
    const passed = completed.filter(e => e.status === 'passed').length;
    return Math.round((passed / completed.length) * 100);
  },

  // Get trend indicator
  getTrendIndicator: (current, previous) => {
    if (current > previous) {
      return { direction: 'up', percentage: Math.round(((current - previous) / previous) * 100) };
    } else if (current < previous) {
      return { direction: 'down', percentage: Math.round(((previous - current) / previous) * 100) };
    }
    return { direction: 'neutral', percentage: 0 };
  }
};

// Make it globally available
window.Utils = Utils;
