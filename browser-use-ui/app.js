// Browser Use UI - Main Application JavaScript

// ===== Configuration =====
const CONFIG = {
    API_KEY: 'bu_sq01V2GsXGttkJDhHj2xFpMtfsDkfGWWYh37fR6rSmY',
    API_BASE_URL: 'https://api.browser-use.com/api/v2',
    POLLING_INTERVAL: 2000
};

// ===== State =====
const state = {
    currentTask: null,
    isRunning: false,
    startUrl: null,
    logs: [],
    steps: [],
    screenshots: [], // Array of {stepNumber, url, timestamp}
    selectedScreenshotIndex: -1
};

// ===== DOM Elements =====
const elements = {
    taskInput: document.getElementById('task-input'),
    runBtn: document.getElementById('run-task'),
    llmModel: document.getElementById('llm-model'),
    proxyLocation: document.getElementById('proxy-location'),
    browserView: document.getElementById('browser-view'),
    currentUrl: document.getElementById('current-url'),
    agentLogs: document.getElementById('agent-logs'),
    taskStatus: document.getElementById('task-status'),
    progressBar: document.getElementById('progress-bar'),
    stepsContainer: document.getElementById('steps-container'),
    outputContent: document.getElementById('output-content'),
    clearLogs: document.getElementById('clear-logs'),
    downloadLogs: document.getElementById('download-logs'),
    copyOutput: document.getElementById('copy-output'),
    attachFile: document.getElementById('attach-file'),
    addUrl: document.getElementById('add-url'),
    urlModal: document.getElementById('url-modal'),
    closeUrlModal: document.getElementById('close-url-modal'),
    cancelUrl: document.getElementById('cancel-url'),
    confirmUrl: document.getElementById('confirm-url'),
    startUrlInput: document.getElementById('start-url-input')
};

// ===== Utility Functions =====
function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

function addLog(message, type = 'system') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    
    const typeLabels = {
        system: 'SYS',
        action: 'ACT',
        success: 'OK',
        error: 'ERR',
        thinking: 'AI'
    };
    
    logEntry.innerHTML = `
        <span class="log-time">${getTimestamp()}</span>
        <span class="log-type">${typeLabels[type] || 'LOG'}</span>
        <span class="log-message">${message}</span>
    `;
    
    elements.agentLogs.appendChild(logEntry);
    elements.agentLogs.scrollTop = elements.agentLogs.scrollHeight;
    
    state.logs.push({ time: getTimestamp(), type, message });
}

function updateStatus(status) {
    elements.taskStatus.textContent = status;
    elements.taskStatus.className = 'task-status';
    
    if (status.toLowerCase() === 'running') {
        elements.taskStatus.classList.add('running');
    } else if (status.toLowerCase() === 'completed') {
        elements.taskStatus.classList.add('completed');
    } else if (status.toLowerCase() === 'error' || status.toLowerCase() === 'failed') {
        elements.taskStatus.classList.add('error');
    }
}

function updateProgress(percent) {
    elements.progressBar.style.width = `${percent}%`;
}

function clearSteps() {
    elements.stepsContainer.innerHTML = '';
    state.steps = [];
}

function addStep(title, description, status = 'pending') {
    const step = { title, description, status };
    state.steps.push(step);
    renderSteps();
}

function updateStepStatus(index, status) {
    if (state.steps[index]) {
        state.steps[index].status = status;
        renderSteps();
    }
}

function renderSteps() {
    elements.stepsContainer.innerHTML = state.steps.map((step, index) => {
        const icons = {
            pending: '<circle cx="12" cy="12" r="10"/>',
            active: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
            completed: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
            error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        };
        
        return `
            <div class="step-item ${step.status}">
                <div class="step-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${icons[step.status] || icons.pending}
                    </svg>
                </div>
                <div class="step-info">
                    <span class="step-title">${step.title}</span>
                    <span class="step-desc">${step.description}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateBrowserView(content, type = 'placeholder') {
    if (type === 'placeholder') {
        elements.browserView.innerHTML = `
            <div class="browser-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="4"/>
                    <line x1="21.17" y1="8" x2="12" y2="8"/>
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
                </svg>
                <p>${content}</p>
            </div>
        `;
    } else if (type === 'screenshot') {
        // Show loading spinner first, then load image
        elements.browserView.innerHTML = `
            <div class="screenshot-container">
                <div class="screenshot-loading">
                    <div class="spinner" style="width: 32px; height: 32px; border-width: 2px;"></div>
                    <span>Loading screenshot...</span>
                </div>
                <img src="${content}" alt="Browser Screenshot" class="browser-screenshot" style="display: none;"/>
            </div>
        `;
        
        // Handle image load
        const img = elements.browserView.querySelector('.browser-screenshot');
        const loading = elements.browserView.querySelector('.screenshot-loading');
        
        img.onload = () => {
            if (loading) loading.style.display = 'none';
            img.style.display = 'block';
        };
        
        img.onerror = () => {
            if (loading) {
                loading.innerHTML = `
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span>Screenshot unavailable</span>
                `;
            }
        };
    } else if (type === 'loading') {
        elements.browserView.innerHTML = `
            <div class="browser-placeholder">
                <div class="spinner" style="width: 48px; height: 48px; border-width: 3px;"></div>
                <p>${content}</p>
            </div>
        `;
    }
}

function updateUrl(url) {
    elements.currentUrl.textContent = url || 'Waiting for task...';
}

// ===== Screenshot Gallery Functions =====
function addScreenshot(stepNumber, url, stepInfo = {}) {
    if (!url) return;
    
    // Check if this step already has a screenshot
    const existingIndex = state.screenshots.findIndex(s => s.stepNumber === stepNumber);
    if (existingIndex >= 0) {
        // Update existing screenshot
        state.screenshots[existingIndex].url = url;
        state.screenshots[existingIndex].stepInfo = stepInfo;
    } else {
        // Add new screenshot
        state.screenshots.push({
            stepNumber,
            url,
            stepInfo,
            timestamp: new Date().toISOString()
        });
    }
    
    renderScreenshotGallery();
    
    // Auto-select the latest screenshot
    selectScreenshot(state.screenshots.length - 1);
}

function selectScreenshot(index) {
    if (index < 0 || index >= state.screenshots.length) return;
    
    state.selectedScreenshotIndex = index;
    const screenshot = state.screenshots[index];
    
    // Update main browser view
    updateBrowserView(screenshot.url, 'screenshot');
    
    // Update URL if available
    if (screenshot.stepInfo && screenshot.stepInfo.url) {
        updateUrl(screenshot.stepInfo.url);
    }
    
    // Update active state in gallery
    renderScreenshotGallery();
}

function renderScreenshotGallery() {
    const gallery = document.getElementById('screenshot-gallery');
    if (!gallery) return;
    
    if (state.screenshots.length === 0) {
        gallery.innerHTML = '<div class="gallery-placeholder">Screenshots will appear here as steps complete</div>';
        return;
    }
    
    gallery.innerHTML = state.screenshots.map((screenshot, index) => {
        const isActive = index === state.selectedScreenshotIndex;
        const stepLabel = screenshot.stepInfo?.nextGoal 
            ? screenshot.stepInfo.nextGoal.substring(0, 20) + (screenshot.stepInfo.nextGoal.length > 20 ? '...' : '')
            : `Step ${screenshot.stepNumber}`;
        
        return `
            <div class="screenshot-thumb ${isActive ? 'active' : ''}" onclick="selectScreenshot(${index})" title="${screenshot.stepInfo?.nextGoal || 'Step ' + screenshot.stepNumber}">
                <span class="step-number">${screenshot.stepNumber}</span>
                <img src="${screenshot.url}" alt="Step ${screenshot.stepNumber}" />
                <span class="step-label">${stepLabel}</span>
            </div>
        `;
    }).join('');
    
    // Scroll to active thumbnail
    const activeThumbnail = gallery.querySelector('.screenshot-thumb.active');
    if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function clearScreenshots() {
    state.screenshots = [];
    state.selectedScreenshotIndex = -1;
    renderScreenshotGallery();
}

// Make selectScreenshot available globally for onclick
window.selectScreenshot = selectScreenshot;

// ===== API Functions =====
async function createTask(taskDescription) {
    const payload = {
        task: taskDescription
    };

    // Add optional parameters
    const llmModel = elements.llmModel.value;
    if (llmModel && llmModel !== 'browser-use-llm') {
        // Map friendly names to API values
        const llmMapping = {
            'gpt-4o': 'gpt-4o',
            'claude-sonnet': 'claude-3-5-sonnet-20241022',
            'gemini-flash': 'gemini-2.0-flash'
        };
        payload.llm = llmMapping[llmModel] || llmModel;
    }

    if (state.startUrl) {
        payload.startUrl = state.startUrl;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Browser-Use-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || 'Failed to create task');
        }

        return await response.json();
    } catch (error) {
        console.error('Create task error:', error);
        throw error;
    }
}

async function getTaskStatus(taskId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/tasks/${taskId}`, {
            headers: {
                'X-Browser-Use-API-Key': CONFIG.API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get task status');
        }

        return await response.json();
    } catch (error) {
        console.error('Get task status error:', error);
        throw error;
    }
}

async function stopTask(taskId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Browser-Use-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({ status: 'stopped' })
        });

        return response.ok;
    } catch (error) {
        console.error('Stop task error:', error);
        return false;
    }
}

async function getAccountBilling() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/billing/account`, {
            headers: {
                'X-Browser-Use-API-Key': CONFIG.API_KEY
            }
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Get billing error:', error);
        return null;
    }
}

// ===== Task Runner =====
async function runTask() {
    const taskDescription = elements.taskInput.value.trim();
    
    if (!taskDescription) {
        addLog('Please enter a task description', 'error');
        return;
    }

    if (state.isRunning) {
        // Stop the current task
        if (state.currentTask) {
            addLog('Stopping current task...', 'system');
            await stopTask(state.currentTask);
            resetState();
        }
        return;
    }

    // Reset and start
    state.isRunning = true;
    elements.runBtn.classList.add('running');
    elements.runBtn.innerHTML = `
        <div class="spinner"></div>
        <span>Stop Task</span>
    `;

    clearSteps();
    clearScreenshots();
    updateStatus('Running');
    updateProgress(0);
    updateBrowserView('Initializing browser agent...', 'loading');

    addLog(`Starting task: "${taskDescription}"`, 'system');
    addStep('Initialize Agent', 'Setting up browser automation', 'active');

    try {
        // Create the task
        const taskResponse = await createTask(taskDescription);
        state.currentTask = taskResponse.id;
        
        addLog(`Task created with ID: ${taskResponse.id}`, 'success');
        updateStepStatus(0, 'completed');
        addStep('Connect Browser', 'Establishing browser connection', 'active');
        updateProgress(15);

        // Poll for status updates
        await pollTaskStatus(taskResponse.id);

    } catch (error) {
        addLog(`Error: ${error.message}`, 'error');
        updateStatus('Error');
        updateBrowserView('Task failed. Please try again.', 'placeholder');
        resetState();
    }
}

async function pollTaskStatus(taskId) {
    let pollCount = 0;
    const maxPolls = 300; // 10 minutes max
    let lastStepCount = 0;
    let lastScreenshotUrl = null;

    const poll = async () => {
        if (!state.isRunning || pollCount >= maxPolls) {
            if (pollCount >= maxPolls) {
                addLog('Task timeout - exceeded maximum duration', 'error');
                updateStatus('Timeout');
            }
            resetState();
            return;
        }

        try {
            const taskData = await getTaskStatus(taskId);
            pollCount++;
            
            console.log('Task data:', taskData); // Debug logging

            // Update progress based on status
            processTaskData(taskData, lastStepCount, lastScreenshotUrl);
            lastStepCount = taskData.steps ? taskData.steps.length : 0;
            
            // Track last screenshot URL
            if (taskData.steps && taskData.steps.length > 0) {
                const latestStep = taskData.steps[taskData.steps.length - 1];
                if (latestStep.screenshotUrl) {
                    lastScreenshotUrl = latestStep.screenshotUrl;
                }
            }

            // Check if task is complete
            if (taskData.status === 'finished') {
                handleTaskComplete(taskData);
                return;
            } else if (taskData.status === 'stopped') {
                addLog('Task was stopped', 'system');
                updateStatus('Stopped');
                resetState();
                return;
            }

            // Continue polling
            setTimeout(poll, CONFIG.POLLING_INTERVAL);

        } catch (error) {
            addLog(`Polling error: ${error.message}`, 'error');
            setTimeout(poll, CONFIG.POLLING_INTERVAL * 2);
        }
    };

    poll();
}

function processTaskData(taskData, lastStepCount, lastScreenshotUrl) {
    // Update status
    const statusMap = {
        'created': 'Created',
        'started': 'Running',
        'finished': 'Completed',
        'stopped': 'Stopped'
    };
    updateStatus(statusMap[taskData.status] || taskData.status);

    // Process steps
    if (taskData.steps && taskData.steps.length > 0) {
        const steps = taskData.steps;
        const progress = Math.min((steps.length / 30) * 100, 95); // Assuming max 30 steps
        updateProgress(progress);

        // Add new steps to the log and gallery
        for (let i = lastStepCount; i < steps.length; i++) {
            const step = steps[i];
            
            // Update steps UI
            if (i === 0 && lastStepCount === 0) {
                clearSteps();
            }
            
            // Add step to progress panel
            const stepTitle = step.nextGoal || `Step ${step.number}`;
            const stepDesc = step.actions ? step.actions.join(', ') : 'Processing...';
            addStep(stepTitle, stepDesc, i === steps.length - 1 ? 'active' : 'completed');
            
            // Add screenshot to gallery if available
            if (step.screenshotUrl) {
                addScreenshot(step.number, step.screenshotUrl, {
                    nextGoal: step.nextGoal,
                    url: step.url,
                    actions: step.actions,
                    memory: step.memory
                });
            }
            
            // Log the step
            if (step.evaluationPreviousGoal) {
                addLog(`Evaluation: ${step.evaluationPreviousGoal}`, 'system');
            }
            if (step.nextGoal) {
                addLog(`Goal: ${step.nextGoal}`, 'thinking');
            }
            if (step.actions && step.actions.length > 0) {
                step.actions.forEach(action => {
                    addLog(`Action: ${action}`, 'action');
                });
            }
            
            // Update URL
            if (step.url) {
                updateUrl(step.url);
            }
            
            // Log memory if available
            if (step.memory) {
                addLog(`Memory: ${step.memory}`, 'system');
            }
        }
    }
}

function handleTaskComplete(taskData) {
    addLog('Task completed!', 'success');
    updateStatus('Completed');
    updateProgress(100);

    // Mark all steps as completed
    state.steps.forEach((_, index) => {
        updateStepStatus(index, 'completed');
    });

    // Show output
    if (taskData.output) {
        document.querySelector('.output-text').textContent = taskData.output;
        addLog(`Output: ${taskData.output.substring(0, 200)}${taskData.output.length > 200 ? '...' : ''}`, 'success');
    }

    // Show success/failure
    if (taskData.isSuccess !== null) {
        if (taskData.isSuccess) {
            addLog('Task completed successfully ✓', 'success');
        } else {
            addLog('Task completed but may not have achieved the goal', 'system');
        }
    }

    // Show final screenshot if available
    if (taskData.steps && taskData.steps.length > 0) {
        const lastStep = taskData.steps[taskData.steps.length - 1];
        if (lastStep.screenshotUrl) {
            updateBrowserView(lastStep.screenshotUrl, 'screenshot');
        }
        if (lastStep.url) {
            updateUrl(lastStep.url);
        }
    }

    resetState();
}

function handleTaskError(message) {
    addLog(`Task failed: ${message}`, 'error');
    updateStatus('Failed');
    updateBrowserView('Task failed. See logs for details.', 'placeholder');

    // Mark current step as error
    const activeStepIndex = state.steps.findIndex(s => s.status === 'active');
    if (activeStepIndex >= 0) {
        updateStepStatus(activeStepIndex, 'error');
    }

    resetState();
}

function resetState() {
    state.isRunning = false;
    state.currentTask = null;

    elements.runBtn.classList.remove('running');
    elements.runBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <span>Run Task</span>
    `;
}

// ===== Event Listeners =====
elements.runBtn.addEventListener('click', runTask);

elements.taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        runTask();
    }
});

elements.clearLogs.addEventListener('click', () => {
    elements.agentLogs.innerHTML = '';
    state.logs = [];
    addLog('Logs cleared', 'system');
});

elements.downloadLogs.addEventListener('click', () => {
    const logText = state.logs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-use-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('Logs downloaded', 'system');
});

elements.copyOutput.addEventListener('click', async () => {
    const output = document.querySelector('.output-text').textContent;
    try {
        await navigator.clipboard.writeText(output);
        addLog('Output copied to clipboard', 'success');
    } catch (err) {
        addLog('Failed to copy output', 'error');
    }
});

// URL Modal
elements.addUrl.addEventListener('click', () => {
    elements.urlModal.classList.add('active');
    elements.startUrlInput.focus();
});

elements.closeUrlModal.addEventListener('click', () => {
    elements.urlModal.classList.remove('active');
});

elements.cancelUrl.addEventListener('click', () => {
    elements.urlModal.classList.remove('active');
});

elements.confirmUrl.addEventListener('click', () => {
    const url = elements.startUrlInput.value.trim();
    if (url) {
        state.startUrl = url;
        addLog(`Starting URL set: ${url}`, 'system');
        elements.addUrl.style.color = 'var(--accent-primary)';
    }
    elements.urlModal.classList.remove('active');
});

elements.urlModal.addEventListener('click', (e) => {
    if (e.target === elements.urlModal) {
        elements.urlModal.classList.remove('active');
    }
});

// File attachment (placeholder - would need file upload API)
elements.attachFile.addEventListener('click', () => {
    addLog('File attachment coming soon...', 'system');
});

// ===== Demo Mode (for testing without API) =====
function runDemoMode() {
    const demoSteps = [
        { delay: 1000, action: () => {
            addLog('Demo mode activated (API not connected)', 'system');
            updateStepStatus(0, 'completed');
            addStep('Navigate', 'Opening target website', 'active');
            updateProgress(25);
            updateUrl('https://example.com');
        }},
        { delay: 2000, action: () => {
            addLog('Navigating to example.com', 'action');
            updateStepStatus(1, 'completed');
            addStep('Analyze Page', 'Extracting page content', 'active');
            updateProgress(50);
        }},
        { delay: 2000, action: () => {
            addLog('Found 5 elements matching criteria', 'thinking');
            updateStepStatus(2, 'completed');
            addStep('Execute Action', 'Performing requested action', 'active');
            updateProgress(75);
        }},
        { delay: 2000, action: () => {
            addLog('Action completed successfully', 'success');
            updateStepStatus(3, 'completed');
            addStep('Generate Output', 'Preparing results', 'active');
            updateProgress(90);
        }},
        { delay: 1000, action: () => {
            updateStepStatus(4, 'completed');
            updateProgress(100);
            updateStatus('Completed');
            addLog('Task completed! Results ready.', 'success');
            document.querySelector('.output-text').textContent = JSON.stringify({
                status: 'success',
                result: 'Demo task completed successfully',
                steps_completed: 5,
                time_elapsed: '8.2s'
            }, null, 2);
            resetState();
        }}
    ];

    let totalDelay = 0;
    demoSteps.forEach(step => {
        totalDelay += step.delay;
        setTimeout(step.action, totalDelay);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
    addLog('Browser Use UI initialized', 'system');
    addLog('Connecting to API...', 'system');
    
    // Check API connection and get billing info
    try {
        const billing = await getAccountBilling();
        if (billing) {
            document.querySelector('.status-dot').classList.add('connected');
            // Update credits display
            const creditsValue = document.querySelector('.credits-value');
            if (creditsValue && billing.totalCreditsBalanceUsd !== undefined) {
                creditsValue.textContent = `$${billing.totalCreditsBalanceUsd.toFixed(2)}`;
            }
            addLog('API connected ✓', 'success');
            addLog(`Credits available: $${billing.totalCreditsBalanceUsd.toFixed(2)}`, 'system');
        } else {
            addLog('Could not verify API connection', 'error');
        }
    } catch (error) {
        addLog(`API connection failed: ${error.message}`, 'error');
    }
    
    addLog('Ready to run tasks. Enter a description and click "Run Task"', 'system');
});
