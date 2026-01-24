// ExecutionDetail.tsx - Complete React implementation for test execution detail page

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Clock, AlertTriangle, 
  PlayCircle, StopCircle, Download, ChevronDown, ChevronUp,
  Image as ImageIcon, Code, AlertCircle, BarChart3, 
  FileText, ExternalLink, Copy, ZoomIn
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TestExecution {
  id: string;
  testId: string;
  testName: string;
  status: 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  progress: {
    currentStep: number;
    totalSteps: number;
    currentAction: string;
    percentage: number;
  };
  results: {
    finalResult: string;
    isSuccessful: boolean;
    hasErrors: boolean;
    judgeVerdict?: {
      isSuccessful: boolean;
      failureReason?: string;
      confidence: number;
    };
    steps: StepResult[];
    visitedUrls: string[];
    screenshots: Screenshot[];
    extractedData: ExtractedData[];
    errors: ErrorDetail[];
    metrics: {
      totalActions: number;
      successfulActions: number;
      failedActions: number;
      averageStepTime: number;
    };
  };
  logs: LogEntry[];
}

interface StepResult {
  stepNumber: number;
  stepDescription: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'success' | 'failed' | 'skipped' | 'error';
  agentAction: {
    type: string;
    parameters: Record<string, any>;
    evaluation: string;
    nextGoal: string;
    memory: string;
  };
  result: {
    success: boolean;
    extractedContent?: string;
    error?: string;
    isDone: boolean;
  };
  screenshot?: Screenshot;
  browserState: {
    url: string;
    title: string;
    timestamp: Date;
  };
}

interface Screenshot {
  id: string;
  stepNumber: number;
  timestamp: Date;
  base64Data: string;
  thumbnailBase64?: string;
  url: string;
}

interface ExtractedData {
  stepNumber: number;
  dataType: string;
  data: any;
  timestamp: Date;
}

interface ErrorDetail {
  stepNumber: number;
  errorType: string;
  message: string;
  timestamp: Date;
  screenshot?: Screenshot;
}

interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExecutionDetail() {
  const { executionId } = useParams<{ executionId: string }>();
  const [execution, setExecution] = useState<TestExecution | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'screenshots' | 'data' | 'errors' | 'logs' | 'metrics'>('timeline');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [wsConnected, setWsConnected] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // ============================================================================
  // DATA FETCHING & WEBSOCKET
  // ============================================================================

  useEffect(() => {
    if (!executionId) return;

    // Fetch initial execution data
    fetchExecution(executionId);

    // Connect to WebSocket for real-time updates
    const ws = new WebSocket(`wss://api.yourapp.com/ws/executions/${executionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [executionId]);

  const fetchExecution = async (id: string) => {
    try {
      const response = await fetch(`/api/executions/${id}`);
      const data = await response.json();
      setExecution(data);
    } catch (error) {
      console.error('Error fetching execution:', error);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'STEP_STARTED':
        setExecution(prev => prev ? {
          ...prev,
          progress: {
            ...prev.progress,
            currentStep: message.data.stepNumber,
            currentAction: message.data.description,
            percentage: (message.data.stepNumber / prev.progress.totalSteps) * 100
          }
        } : null);
        break;

      case 'SCREENSHOT_CAPTURED':
        setExecution(prev => prev ? {
          ...prev,
          results: {
            ...prev.results,
            screenshots: [
              ...prev.results.screenshots,
              {
                id: message.data.screenshotId,
                stepNumber: message.data.stepNumber,
                thumbnailBase64: message.data.thumbnailBase64,
                timestamp: new Date(message.timestamp),
                url: message.data.url,
                base64Data: ''
              }
            ]
          }
        } : null);
        break;

      case 'STEP_COMPLETED':
        setExecution(prev => {
          if (!prev) return null;
          const updatedSteps = [...prev.results.steps];
          const stepIndex = updatedSteps.findIndex(s => s.stepNumber === message.data.stepNumber);
          if (stepIndex !== -1) {
            updatedSteps[stepIndex] = {
              ...updatedSteps[stepIndex],
              status: message.data.status,
              duration: message.data.duration,
              result: message.data.result
            };
          }
          return {
            ...prev,
            results: {
              ...prev.results,
              steps: updatedSteps
            }
          };
        });
        break;

      case 'ERROR_OCCURRED':
        setExecution(prev => prev ? {
          ...prev,
          results: {
            ...prev.results,
            errors: [
              ...prev.results.errors,
              {
                stepNumber: message.data.stepNumber,
                errorType: message.data.errorType,
                message: message.data.errorMessage,
                timestamp: new Date(message.timestamp)
              }
            ]
          }
        } : null);
        break;

      case 'EXECUTION_COMPLETED':
        setExecution(prev => prev ? {
          ...prev,
          status: message.data.status,
          endTime: new Date(message.timestamp),
          duration: message.data.totalDuration,
          results: {
            ...prev.results,
            judgeVerdict: message.data.judgeVerdict
          }
        } : null);
        break;
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleStepExpansion = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  const handleRetry = async () => {
    if (!execution) return;
    try {
      const response = await fetch(`/api/tests/${execution.testId}/execute`, {
        method: 'POST'
      });
      const data = await response.json();
      window.location.href = `/executions/${data.executionId}`;
    } catch (error) {
      console.error('Error retrying test:', error);
    }
  };

  const handleCancel = async () => {
    if (!execution) return;
    try {
      await fetch(`/api/executions/${execution.id}/cancel`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error cancelling execution:', error);
    }
  };

  const handleExport = async () => {
    if (!execution) return;
    try {
      const response = await fetch(`/api/executions/${execution.id}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `execution-${execution.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting execution:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  if (!execution) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ExecutionHeader 
        execution={execution}
        onRetry={handleRetry}
        onCancel={handleCancel}
        onExport={handleExport}
        wsConnected={wsConnected}
      />

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <TabButton
              icon={<FileText className="w-4 h-4" />}
              label="Timeline"
              active={activeTab === 'timeline'}
              onClick={() => setActiveTab('timeline')}
            />
            <TabButton
              icon={<ImageIcon className="w-4 h-4" />}
              label="Screenshots"
              count={execution.results.screenshots.length}
              active={activeTab === 'screenshots'}
              onClick={() => setActiveTab('screenshots')}
            />
            <TabButton
              icon={<Code className="w-4 h-4" />}
              label="Extracted Data"
              count={execution.results.extractedData.length}
              active={activeTab === 'data'}
              onClick={() => setActiveTab('data')}
            />
            <TabButton
              icon={<AlertCircle className="w-4 h-4" />}
              label="Errors"
              count={execution.results.errors.length}
              active={activeTab === 'errors'}
              onClick={() => setActiveTab('errors')}
              variant={execution.results.errors.length > 0 ? 'error' : undefined}
            />
            <TabButton
              icon={<FileText className="w-4 h-4" />}
              label="Logs"
              count={execution.logs.length}
              active={activeTab === 'logs'}
              onClick={() => setActiveTab('logs')}
            />
            <TabButton
              icon={<BarChart3 className="w-4 h-4" />}
              label="Metrics"
              active={activeTab === 'metrics'}
              onClick={() => setActiveTab('metrics')}
            />
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'timeline' && (
          <TimelineTab 
            steps={execution.results.steps}
            expandedSteps={expandedSteps}
            onToggleExpansion={toggleStepExpansion}
            currentStep={execution.progress.currentStep}
          />
        )}

        {activeTab === 'screenshots' && (
          <ScreenshotsTab 
            screenshots={execution.results.screenshots}
            onScreenshotClick={setSelectedScreenshot}
          />
        )}

        {activeTab === 'data' && (
          <ExtractedDataTab 
            extractedData={execution.results.extractedData}
            onCopy={copyToClipboard}
          />
        )}

        {activeTab === 'errors' && (
          <ErrorsTab 
            errors={execution.results.errors}
          />
        )}

        {activeTab === 'logs' && (
          <LogsTab 
            logs={execution.logs}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsTab 
            metrics={execution.results.metrics}
            steps={execution.results.steps}
            duration={execution.duration}
          />
        )}
      </div>

      {/* Screenshot Lightbox */}
      {selectedScreenshot && (
        <ScreenshotLightbox
          screenshot={selectedScreenshot}
          onClose={() => setSelectedScreenshot(null)}
        />
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ExecutionHeader({ 
  execution, 
  onRetry, 
  onCancel, 
  onExport,
  wsConnected 
}: {
  execution: TestExecution;
  onRetry: () => void;
  onCancel: () => void;
  onExport: () => void;
  wsConnected: boolean;
}) {
  const isRunning = execution.status === 'running';
  const duration = execution.duration 
    ? formatDuration(execution.duration)
    : formatDuration(Date.now() - execution.startTime.getTime());

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Test: {execution.testName}
              </h1>
              {wsConnected && isRunning && (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Started: {formatTimestamp(execution.startTime)}</span>
              <span>•</span>
              <span>Duration: {duration}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isRunning && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                Retry
              </button>
            )}
            {isRunning && (
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                Cancel
              </button>
            )}
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Status and Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <StatusBadge status={execution.status} />
            {execution.results.judgeVerdict && (
              <JudgeVerdict verdict={execution.results.judgeVerdict} />
            )}
          </div>

          {isRunning && (
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress: Step {execution.progress.currentStep} of {execution.progress.totalSteps}</span>
                <span>{Math.round(execution.progress.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${execution.progress.percentage}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Current: {execution.progress.currentAction}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TestExecution['status'] }) {
  const config = {
    queued: { icon: Clock, color: 'bg-gray-100 text-gray-800', label: 'Queued' },
    running: { icon: PlayCircle, color: 'bg-blue-100 text-blue-800', label: 'Running' },
    passed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Passed' },
    failed: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Failed' },
    error: { icon: AlertTriangle, color: 'bg-orange-100 text-orange-800', label: 'Error' },
    cancelled: { icon: StopCircle, color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}

function JudgeVerdict({ verdict }: { verdict: { isSuccessful: boolean; failureReason?: string; confidence: number } }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
      verdict.isSuccessful ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      <span className="font-medium">Judge:</span>
      <span>{verdict.isSuccessful ? '✓ Pass' : '✗ Fail'}</span>
      <span className="text-xs opacity-75">({Math.round(verdict.confidence * 100)}% confident)</span>
    </div>
  );
}

function TabButton({ 
  icon, 
  label, 
  count, 
  active, 
  onClick,
  variant 
}: { 
  icon: React.ReactNode; 
  label: string; 
  count?: number; 
  active: boolean; 
  onClick: () => void;
  variant?: 'error';
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-1 py-4 border-b-2 transition-colors
        ${active 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {count !== undefined && (
        <span className={`
          px-2 py-0.5 text-xs rounded-full
          ${variant === 'error' 
            ? 'bg-red-100 text-red-700' 
            : active 
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }
        `}>
          {count}
        </span>
      )}
    </button>
  );
}

function TimelineTab({ 
  steps, 
  expandedSteps, 
  onToggleExpansion,
  currentStep 
}: { 
  steps: StepResult[]; 
  expandedSteps: Set<number>; 
  onToggleExpansion: (stepNumber: number) => void;
  currentStep: number;
}) {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <TimelineStep
          key={step.stepNumber}
          step={step}
          expanded={expandedSteps.has(step.stepNumber)}
          onToggle={() => onToggleExpansion(step.stepNumber)}
          isCurrent={step.stepNumber === currentStep}
        />
      ))}
    </div>
  );
}

function TimelineStep({ 
  step, 
  expanded, 
  onToggle,
  isCurrent 
}: { 
  step: StepResult; 
  expanded: boolean; 
  onToggle: () => void;
  isCurrent: boolean;
}) {
  const statusConfig = {
    success: { icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-700' },
    failed: { icon: XCircle, color: 'bg-red-500', textColor: 'text-red-700' },
    error: { icon: AlertTriangle, color: 'bg-orange-500', textColor: 'text-orange-700' },
    skipped: { icon: Clock, color: 'bg-gray-400', textColor: 'text-gray-700' }
  };

  const { icon: Icon, color, textColor } = statusConfig[step.status];

  return (
    <div className={`
      bg-white rounded-lg border transition-all
      ${isCurrent ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
      ${isCurrent ? 'animate-pulse' : ''}
    `}>
      {/* Step Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Step Info */}
          <div className="text-left">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">
                Step {step.stepNumber}: {step.stepDescription}
              </span>
              {isCurrent && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className={textColor}>{step.status}</span>
              <span>•</span>
              <span>{formatDuration(step.duration)}</span>
              <span>•</span>
              <span>{formatTimestamp(step.startTime)}</span>
            </div>
          </div>
        </div>

        {/* Expand Icon */}
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-6 border-t">
          {/* Agent Reasoning */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Agent Reasoning</h4>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              {step.agentAction.evaluation}
            </div>
          </div>

          {/* Action Taken */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Action Taken</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <code className="px-2 py-1 bg-gray-200 rounded text-sm">{step.agentAction.type}</code>
              </div>
              <div className="text-sm text-gray-600">
                <pre className="overflow-x-auto">
                  {JSON.stringify(step.agentAction.parameters, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Result */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Result</h4>
            <div className={`rounded-lg p-4 ${
              step.result.success ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {step.result.extractedContent && (
                <div className="text-sm text-gray-700 mb-2">
                  {step.result.extractedContent}
                </div>
              )}
              {step.result.error && (
                <div className="text-sm text-red-700 font-mono">
                  {step.result.error}
                </div>
              )}
            </div>
          </div>

          {/* Screenshot */}
          {step.screenshot && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Screenshot</h4>
              <img 
                src={step.screenshot.thumbnailBase64} 
                alt={`Step ${step.stepNumber} screenshot`}
                className="rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              />
            </div>
          )}

          {/* Browser State */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Browser State</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">URL:</span>
                <a 
                  href={step.browserState.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {step.browserState.url}
                  <ExternalLink className="inline w-3 h-3 ml-1" />
                </a>
              </div>
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <span className="ml-2 text-gray-600">{step.browserState.title}</span>
              </div>
            </div>
          </div>

          {/* Memory & Next Goal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Memory</h4>
              <div className="bg-purple-50 rounded-lg p-3 text-sm text-gray-700">
                {step.agentAction.memory}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Next Goal</h4>
              <div className="bg-yellow-50 rounded-lg p-3 text-sm text-gray-700">
                {step.agentAction.nextGoal}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScreenshotsTab({ 
  screenshots, 
  onScreenshotClick 
}: { 
  screenshots: Screenshot[];
  onScreenshotClick: (screenshot: Screenshot) => void;
}) {
  return (
    <div>
      {/* Timeline Scrubber */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Timeline</h3>
        <div className="relative h-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300"></div>
          </div>
          <div className="relative flex justify-between">
            {screenshots.map((screenshot) => (
              <button
                key={screenshot.id}
                onClick={() => onScreenshotClick(screenshot)}
                className="w-3 h-3 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-150 transition-all"
                title={`Step ${screenshot.stepNumber}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Screenshot Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screenshots.map((screenshot) => (
          <button
            key={screenshot.id}
            onClick={() => onScreenshotClick(screenshot)}
            className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-video bg-gray-100">
              <img 
                src={screenshot.thumbnailBase64} 
                alt={`Screenshot ${screenshot.stepNumber}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3">
              <div className="text-sm font-medium text-gray-900">
                Step {screenshot.stepNumber}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTimestamp(screenshot.timestamp)}
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExtractedDataTab({ 
  extractedData, 
  onCopy 
}: { 
  extractedData: ExtractedData[];
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-4">
      {extractedData.map((data, index) => (
        <div key={index} className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Step {data.stepNumber}: {data.dataType}
              </h3>
              <p className="text-sm text-gray-500">
                {formatTimestamp(data.timestamp)}
              </p>
            </div>
            <button
              onClick={() => onCopy(JSON.stringify(data.data, null, 2))}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy JSON
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
            {JSON.stringify(data.data, null, 2)}
          </pre>
        </div>
      ))}

      {extractedData.length === 0 && (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No data extracted yet</p>
        </div>
      )}
    </div>
  );
}

function ErrorsTab({ errors }: { errors: ErrorDetail[] }) {
  return (
    <div className="space-y-4">
      {errors.map((error, index) => (
        <div key={index} className="bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Step {error.stepNumber}: {error.errorType}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(error.timestamp)}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{error.message}</p>
              {error.screenshot && (
                <img 
                  src={error.screenshot.thumbnailBase64}
                  alt="Error screenshot"
                  className="rounded-lg border"
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {errors.length === 0 && (
        <div className="bg-white rounded-lg border p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No errors occurred</p>
        </div>
      )}
    </div>
  );
}

function LogsTab({ logs }: { logs: LogEntry[] }) {
  const [filter, setFilter] = useState<LogEntry['level'] | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs
    .filter(log => filter === 'all' || log.level === filter)
    .filter(log => log.message.toLowerCase().includes(search.toLowerCase()));

  const levelColors = {
    debug: 'text-gray-600',
    info: 'text-blue-600',
    warn: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Controls */}
      <div className="p-4 border-b flex items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-1.5 border rounded-lg text-sm"
        >
          <option value="all">All Levels</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
        />
      </div>

      {/* Logs */}
      <div className="p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
        {filteredLogs.map((log, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-gray-500 flex-shrink-0">
              {formatTimestamp(log.timestamp, true)}
            </span>
            <span className={`font-medium flex-shrink-0 ${levelColors[log.level]}`}>
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-gray-700">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsTab({ 
  metrics, 
  steps,
  duration 
}: { 
  metrics: TestExecution['results']['metrics'];
  steps: StepResult[];
  duration?: number;
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">Total Time</div>
          <div className="text-2xl font-bold text-gray-900">
            {duration ? formatDuration(duration) : 'N/A'}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Step Time</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDuration(metrics.averageStepTime)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round((metrics.successfulActions / metrics.totalActions) * 100)}%
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">Total Actions</div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.totalActions}
          </div>
        </div>
      </div>

      {/* Step Duration Chart */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Step Duration Timeline
        </h3>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.stepNumber} className="flex items-center gap-4">
              <div className="w-20 text-sm text-gray-600">
                Step {step.stepNumber}
              </div>
              <div className="flex-1">
                <div 
                  className="h-8 bg-blue-500 rounded"
                  style={{ width: `${(step.duration / Math.max(...steps.map(s => s.duration))) * 100}%` }}
                />
              </div>
              <div className="w-20 text-sm text-gray-600 text-right">
                {formatDuration(step.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenshotLightbox({ 
  screenshot, 
  onClose 
}: { 
  screenshot: Screenshot;
  onClose: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Step {screenshot.stepNumber}
              </h3>
              <p className="text-sm text-gray-600">
                {formatTimestamp(screenshot.timestamp)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <img 
              src={screenshot.base64Data} 
              alt={`Step ${screenshot.stepNumber}`}
              className="w-full rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDuration(ms: number): string {
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
}

function formatTimestamp(date: Date, includeMs: boolean = false): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  if (includeMs) {
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }
  
  return `${hours}:${minutes}:${seconds}`;
}
