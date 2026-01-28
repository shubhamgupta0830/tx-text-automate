# Demo Scenario System - Quick Start

## What Was Added

I've set up a complete system for you to export your scenarios and use them as demo data for new users.

### New Files Created

1. **`demoScenarios.js`** - Stores demo scenarios that load automatically for new users
2. **`DEMO_SCENARIOS_GUIDE.md`** - Detailed instructions on how to export and add scenarios

### Modified Files

1. **`index.html`** - Added `demoScenarios.js` script
2. **`app.js`** - Updated initialization to load demo scenarios when localStorage is empty
3. **`mockData.js`** - Added export utilities (`exportDemoScenario()` and `exportAllData()`)

## Quick Start: Export Your Scenario

1. Open your app in browser
2. Open console (F12)
3. Run: `exportDemoScenario()`  ← Lists all scenarios
4. Run: `exportDemoScenario("scenario-id")`  ← Exports specific scenario
5. JSON is printed and copied to clipboard
6. Share the JSON with me or paste it into `demoScenarios.js`

## How It Works

### For New Users
- When someone opens the app for the first time (empty localStorage)
- Demo scenarios automatically load from `demoScenarios.js`
- They see your pre-configured scenarios with full execution history
- They can interact with them, view screenshots, agent steps, etc.

### For Existing Users
- Their existing data remains untouched
- Demo scenarios don't override their work
- They can clear localStorage to see demo scenarios

## Console Commands Available

```javascript
// List all scenarios in localStorage
exportDemoScenario()

// Export specific scenario with execution data
exportDemoScenario("scenario-001")

// Export ALL data (scenarios, executions, variables, folders)
exportAllData()
```

## Next Steps

**To add your demo scenario:**

1. **Run the export command** in your browser console:
   ```javascript
   exportDemoScenario("your-scenario-id")
   ```

2. **Copy the output** (it's auto-copied to clipboard)

3. **Send it to me** or paste it into `demoScenarios.js`:
   - Open `demoScenarios.js`
   - Find the `scenarios: []` array
   - Paste your scenario data inside
   - Save the file

4. **Test it**:
   - Open console: `localStorage.clear()`
   - Refresh page
   - Your demo scenario should appear!

## Example Export Output

```json
{
  "scenario": {
    "id": "scenario-001",
    "name": "Login Test",
    "objective": "Test Oracle login",
    "steps": [...],
    ...
  },
  "execution": {
    "id": "exec-001",
    "scenarioId": "scenario-001",
    "stepResults": [
      {
        "subSteps": [
          {
            "screenshot": "data:image/...",
            "agentAction": {...},
            ...
          }
        ]
      }
    ],
    ...
  }
}
```

Everything is preserved:
- ✅ All scenario details
- ✅ Full execution history
- ✅ Screenshots (base64)
- ✅ Agent actions & evaluations
- ✅ Browser states
- ✅ Timing information

---

**Ready?** Open your app and run `exportDemoScenario()` in the console! 🎯
