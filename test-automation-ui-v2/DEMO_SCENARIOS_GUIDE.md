# Demo Scenario Setup Guide

This guide explains how to add your executed scenario as a demo scenario that loads for all new users.

## Step 1: Export Your Scenario

1. **Open your application** in a browser
2. **Run the scenario** you want to use as demo (or use an existing completed scenario)
3. **Open Browser Console** (Press F12, then click "Console" tab)
4. **List available scenarios**:
   ```javascript
   exportDemoScenario()
   ```
   This will show all your scenarios with their IDs

5. **Export the specific scenario**:
   ```javascript
   exportDemoScenario("your-scenario-id")
   ```
   Replace `your-scenario-id` with the actual scenario ID from step 4

6. The complete JSON will be:
   - Printed to the console
   - Automatically copied to your clipboard (if browser supports it)

## Step 2: Add to Demo Scenarios

1. **Open the file**: `demoScenarios.js`

2. **Paste your exported data** into the `scenarios` array:

```javascript
const DEMO_SCENARIOS = {
  enabled: true,
  
  scenarios: [
    // Paste your scenario here
    {
      id: 'demo-scenario-001',
      name: 'Your Scenario Name',
      objective: 'Your scenario objective',
      // ... rest of the exported data
    }
  ],
  
  executions: [
    // If you have execution data, paste it here
    {
      id: 'demo-exec-001',
      scenarioId: 'demo-scenario-001',
      // ... rest of the execution data
    }
  ]
};
```

3. **Save the file**

## Step 3: Verify

1. **Clear your localStorage** to test:
   ```javascript
   localStorage.clear()
   ```
   
2. **Refresh the page**

3. Your demo scenario should now appear automatically!

## Export All Data

If you want to export ALL your scenarios and executions at once:

```javascript
exportAllData()
```

This is useful if you want to:
- Backup all your work
- Share multiple scenarios
- Migrate data between environments

## Disable Demo Scenarios

To temporarily disable demo scenarios, edit `demoScenarios.js`:

```javascript
const DEMO_SCENARIOS = {
  enabled: false,  // Change this to false
  // ...
}
```

## Tips

- **Screenshots**: All screenshots are included in the export as base64 data URLs
- **Agent Steps**: Complete agent action details, browser states, and results are preserved
- **Variables**: Make sure to review exported data for any sensitive information (passwords, tokens)
- **File Size**: Large scenarios with many screenshots may produce large JSON files

## Troubleshooting

**Console shows "exportDemoScenario is not defined"**
- Make sure the page has fully loaded
- Check that `mockData.js` is loaded in the page

**No scenarios listed**
- Your localStorage might be empty
- Run some scenarios first, then try exporting

**Export too large**
- Consider exporting individual scenarios instead of all data
- Screenshots can be large - you may want to manually remove some if not critical

---

**Ready to add your demo scenario?** Follow Step 1 above! 🚀
