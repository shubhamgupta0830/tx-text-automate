'use strict';

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Set BROWSER_USE_API_KEY in Render's environment variables dashboard
const BU_API_KEY = process.env.BROWSER_USE_API_KEY || '';
const BU_BASE_URL = 'https://api.browser-use.com/api/v2';

const MAX_STEPS_PER_SCENARIO_STEP = 20;
const MAX_STEPS_MINIMUM = 50;
const SCHEDULER_INTERVAL_MS = 30 * 1000; // 30 seconds

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

// ── In-memory job store ───────────────────────────────────────────────────────
// { [jobId]: { ...job fields, _scenario: Object, runs: Array } }
const jobStore = {};

// ── Schedule helpers (mirrors frontend calculateNextRun) ──────────────────────
function calculateNextRun(job) {
  if (job.status !== 'active') return null;
  const now = new Date();
  switch (job.schedule.type) {
    case 'interval': {
      const lastRunDate = job.lastRun?.date
        ? new Date(job.lastRun.date)
        : new Date(job.createdAt);
      const intervalMs = parseFloat(job.schedule.intervalMinutes) * 60 * 1000;
      return new Date(lastRunDate.getTime() + intervalMs);
    }
    case 'daily': {
      const [h, m] = job.schedule.dailyTime.split(':').map(Number);
      const next = new Date(now);
      next.setHours(h, m, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return next;
    }
    case 'weekly': {
      const [h, m] = job.schedule.weeklyTime.split(':').map(Number);
      const day = parseInt(job.schedule.weeklyDay);
      const next = new Date(now);
      next.setHours(h, m, 0, 0);
      const daysUntil = (day - next.getDay() + 7) % 7;
      if (daysUntil === 0 && next <= now) next.setDate(next.getDate() + 7);
      else next.setDate(next.getDate() + daysUntil);
      return next;
    }
    case 'once':
      return job.schedule.onceDateTime ? new Date(job.schedule.onceDateTime) : null;
    default:
      return null;
  }
}

// ── Browser Use API helpers ───────────────────────────────────────────────────
async function buFetch(path, options = {}) {
  const res = await fetch(`${BU_BASE_URL}${path}`, {
    ...options,
    headers: {
      'X-Browser-Use-API-Key': BU_API_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    const msg = typeof detail === 'string' ? detail
      : Array.isArray(detail) ? detail.map(e => e.msg || JSON.stringify(e)).join('; ')
      : `Browser Use API error ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

async function pollUntilDone(taskId, intervalMs = 5000, timeoutMs = 600000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const task = await buFetch(`/tasks/${taskId}`);
    if (['finished', 'stopped', 'failed'].includes(task.status)) return task;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Task polling timeout exceeded');
}

// ── Job runner ────────────────────────────────────────────────────────────────
async function runJob(jobId) {
  const job = jobStore[jobId];
  if (!job) return;

  const scenario = job._scenario;
  if (!scenario) {
    console.error(`[Scheduler] No scenario attached for job ${jobId} ("${job.name}")`);
    return;
  }

  const runId = `sched-run-${jobId}-${Date.now()}`;
  const executionId = `exec-sched-${runId}`;
  const startTime = new Date().toISOString();

  console.log(`[Scheduler] Starting job "${job.name}" — run ${runId}`);

  // Create the run entry immediately (status: running)
  const newRun = {
    id: runId,
    scheduledJobId: jobId,
    executionId,
    status: 'running',
    startTime,
    endTime: null,
    duration: null,
    browserUseTaskId: null,
    browserUseSessionId: null,
    taskResult: null,
  };
  jobStore[jobId].runs = [newRun, ...(jobStore[jobId].runs || [])];
  jobStore[jobId].lastRun = { runId, status: 'running', date: startTime };

  const updateRun = (patch) => {
    if (!jobStore[jobId]) return;
    const ri = jobStore[jobId].runs.findIndex(r => r.id === runId);
    if (ri >= 0) Object.assign(jobStore[jobId].runs[ri], patch);
  };

  try {
    const stepsText = scenario.steps
      .map((s, i) => `${i + 1}. ${s.description}`)
      .join('\n');
    const taskPrompt = `Objective: ${scenario.objective}\n\nSteps to execute:\n${stepsText}`;
    const maxSteps = Math.max(
      MAX_STEPS_MINIMUM,
      scenario.steps.length * MAX_STEPS_PER_SCENARIO_STEP
    );

    const created = await buFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        task: taskPrompt,
        llm: job.model || 'gemini-flash-latest',
        maxSteps,
        highlightElements: true,
        vision: true,
        metadata: { scenarioId: scenario.id, executionId, scheduledJobId: jobId },
      }),
    });

    // Store taskId + sessionId right away so the UI can show the live tab
    updateRun({ browserUseTaskId: created.id, browserUseSessionId: created.sessionId });
    console.log(`[Scheduler] Task created: ${created.id} (session: ${created.sessionId})`);

    const taskResult = await pollUntilDone(created.id);
    console.log(`[Scheduler] Task ${created.id} finished: ${taskResult.status}`);

    const endTime = taskResult.finishedAt || new Date().toISOString();
    const duration = new Date(endTime) - new Date(startTime);
    const finalStatus = taskResult.status === 'finished'
      ? (taskResult.isSuccess || taskResult.judgeVerdict ? 'passed' : 'failed')
      : 'failed';

    updateRun({ status: finalStatus, endTime, duration, taskResult });

    if (jobStore[jobId]) {
      jobStore[jobId].lastRun = { runId, status: finalStatus, date: endTime };
      if (jobStore[jobId].schedule.type === 'once') {
        jobStore[jobId].status = 'paused';
      }
    }
  } catch (err) {
    console.error(`[Scheduler] Job "${job.name}" run failed:`, err.message);
    const endTime = new Date().toISOString();
    updateRun({ status: 'failed', endTime });
    if (jobStore[jobId]) {
      jobStore[jobId].lastRun = { runId, status: 'failed', date: endTime };
    }
  }
}

// ── Scheduler loop ────────────────────────────────────────────────────────────
function checkScheduledJobs() {
  const now = new Date();
  for (const [jobId, job] of Object.entries(jobStore)) {
    if (job.status !== 'active') continue;
    const nextRun = calculateNextRun(job);
    if (nextRun && nextRun <= now) {
      console.log(`[Scheduler] Triggering job: "${job.name}"`);
      runJob(jobId).catch(err => console.error('[Scheduler] Unexpected error:', err));
    }
  }
}

setInterval(checkScheduledJobs, SCHEDULER_INTERVAL_MS);
console.log(`[Scheduler] Running — checking every ${SCHEDULER_INTERVAL_MS / 1000}s`);

// ── Routes ────────────────────────────────────────────────────────────────────

// Health / keep-alive — ping this endpoint every few minutes to prevent Render sleep
app.get('/ping', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), jobs: Object.keys(jobStore).length });
});

// Bulk sync: UI sends all jobs on page load
// Backend merges: keeps its own run history, updates schedule/status/scenario from UI
app.post('/api/jobs/sync', (req, res) => {
  const { jobs } = req.body;
  if (!Array.isArray(jobs)) return res.status(400).json({ error: 'jobs must be an array' });

  // Remove jobs that no longer exist in the UI
  const uiIds = new Set(jobs.map(j => j.id));
  for (const id of Object.keys(jobStore)) {
    if (!uiIds.has(id)) delete jobStore[id];
  }

  // Upsert from UI
  for (const job of jobs) {
    const existing = jobStore[job.id];
    const { scenario, ...jobFields } = job;
    jobStore[job.id] = {
      ...jobFields,
      _scenario: scenario || existing?._scenario || null,
      // Prefer backend's run history (contains taskResult); fall back to UI's
      runs: existing?.runs?.length ? existing.runs : (job.runs || []),
      lastRun: existing?.lastRun || job.lastRun || null,
    };
  }

  console.log(`[API] Synced ${jobs.length} job(s) from UI`);
  res.json({ success: true, count: jobs.length });
});

// Get all jobs — UI polls this to pick up run results
app.get('/api/jobs', (req, res) => {
  const result = Object.values(jobStore).map(({ _scenario, ...rest }) => rest);
  res.json(result);
});

// Create or update a single job
app.put('/api/jobs/:id', (req, res) => {
  const job = req.body;
  if (job.id !== req.params.id) return res.status(400).json({ error: 'ID mismatch' });
  const { scenario, ...jobFields } = job;
  const existing = jobStore[job.id];
  jobStore[job.id] = {
    ...jobFields,
    _scenario: scenario || existing?._scenario || null,
    runs: existing?.runs || job.runs || [],
    lastRun: existing?.lastRun || job.lastRun || null,
  };
  res.json({ success: true });
});

// Delete a job
app.delete('/api/jobs/:id', (req, res) => {
  delete jobStore[req.params.id];
  console.log(`[API] Deleted job ${req.params.id}`);
  res.json({ success: true });
});

// Manually trigger a job immediately
app.post('/api/jobs/:id/run', (req, res) => {
  const job = jobStore[req.params.id];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  runJob(req.params.id).catch(err => console.error('[API] Manual trigger error:', err));
  res.json({ success: true, message: 'Job triggered' });
});

app.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`));
