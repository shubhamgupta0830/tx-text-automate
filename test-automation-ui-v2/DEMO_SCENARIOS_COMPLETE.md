# ✅ Demo Scenario System - Setup Complete!

## What I've Implemented

I've set up a complete system to export your executed scenarios and use them as demo data that loads automatically for new users. Here's everything that was added:

---

## 🎯 Features Added

### 1. **Export Utilities** (in `mockData.js`)
- Console commands to export scenarios with full execution data
- Auto-copies exported JSON to clipboard
- Preserves screenshots, agent steps, browser states, and all execution details

### 2. **Demo Data Storage** (`demoScenarios.js`)
- Centralized file for storing demo scenarios
- Easy to add/remove/update demo data
- Can be enabled/disabled with a flag

### 3. **Auto-Loading System** (in `app.js`)
- Automatically loads demo scenarios for new users (empty localStorage)
- Doesn't interfere with existing user data
- Smart detection and initialization

### 4. **UI Export Button**
- Added "Export Demo" button in scenario detail page
- One-click export of any scenario
- Shows confirmation with instructions

---

## 🚀 How to Use

### Method 1: Using the UI Button (Easiest!)

1. Open your app and navigate to any scenario
2. Click the **"Export Demo"** button (next to Clone)
3. Check the browser console - JSON is printed and copied to clipboard
4. Paste the JSON into `demoScenarios.js`

### Method 2: Using Console Commands

Open browser console (F12) and run:

```javascript
// List all available scenarios
exportDemoScenario()

// Export a specific scenario
exportDemoScenario("scenario-001")

// Export ALL data at once
exportAllData()
```

---

## 📁 Files Created

1. **`demoScenarios.js`** - Store your demo scenarios here
2. **`DEMO_SCENARIOS_GUIDE.md`** - Detailed user guide
3. **`DEMO_SCENARIOS_README.md`** - Quick start guide
4. **`DEMO_SCENARIOS_COMPLETE.md`** - This file (summary)

## 📝 Files Modified

1. **`index.html`** - Added demoScenarios.js script
2. **`app.js`** - Added demo loading logic + Export button
3. **`mockData.js`** - Added export utility functions + fixed malformed data

---

## 📋 Next Steps - Add Your Demo Scenario

### Step 1: Export Your Scenario

Option A: **Use the UI button**
- Go to any scenario page
- Click "Export Demo"
- Check console

Option B: **Use console command**
```javascript
exportDemoScenario("your-scenario-id")
```

### Step 2: Add to Demo File

1. Copy the exported JSON from console
2. Open [`demoScenarios.js`](demoScenarios.js)
3. Find this section:
   ```javascript
   scenarios: [
     // Add your exported scenarios here
   ```
4. Paste your scenario object inside the array
5. If you have execution data, add it to the `executions` array too

### Step 3: Test It

```javascript
// In browser console
localStorage.clear()
// Then refresh the page
```

Your demo scenario should now appear automatically! 🎉

---

## 📖 Example: Adding a Demo Scenario

After running `exportDemoScenario("scenario-001")`, you'll get JSON like this:

```json
{
  "scenario": {
    "id": "scenario-001",
    "name": "Oracle Login Test",
    "objective": "Verify Oracle Fusion login process",
    "steps": [...],
    "folderId": "folder-test-scenarios",
    "status": "passed",
    ...
  },
  "execution": {
    "id": "exec-001",
    "scenarioId": "scenario-001",
    "status": "passed",
    "stepResults": [
      {
        "subSteps": [
          {
            "screenshot": "data:image/png;base64,...",
            "agentAction": {...},
            ...
          }
        ]
      }
    ]
  }
}
```

Add to `demoScenarios.js`:

```javascript
const DEMO_SCENARIOS = {
  enabled: true,
  
  scenarios: [
    {
      id: "scenario-001",
      name: "Oracle Login Test",
      objective: "Verify Oracle Fusion login process",
      // ... paste the rest of scenario data
    }
  ],
  
  executions: [
    {
      id: "exec-001",
      scenarioId: "scenario-001",
      status: "passed",
      // ... paste the rest of execution data
    }
  ]
};
```

---

## 🎨 What Gets Exported

✅ **Scenario Details**
- ID, name, objective, description
- Steps and expected outcomes
- Tags, folder assignment
- Creation/update timestamps

✅ **Execution Data**
- Full step-by-step execution history
- All sub-steps (browser actions)
- Agent actions, evaluations, and decisions
- Browser states (URL, title, timestamps)

✅ **Visual Data**
- Screenshots (as base64 data URLs)
- Can be viewed in the UI

✅ **Metadata**
- Execution duration
- Success/failure status
- Browser configuration
- User who ran it

---

## 💡 Tips

**Multiple Demo Scenarios**
You can add multiple scenarios to the array:
```javascript
scenarios: [
  { /* scenario 1 */ },
  { /* scenario 2 */ },
  { /* scenario 3 */ }
]
```

**Disable Demo Loading**
Set `enabled: false` in `demoScenarios.js`

**Remove Sensitive Data**
Before sharing, review exported JSON for passwords or tokens

**Large Files**
Screenshots can make exports large. If needed, you can manually remove screenshots from the JSON before adding to demo file.

---

## 🔧 Troubleshooting

**"exportDemoScenario is not defined"**
- Refresh the page to load the utility functions
- Check that mockData.js is loaded

**Demo not showing**
- Make sure `enabled: true` in demoScenarios.js
- Clear localStorage: `localStorage.clear()`
- Refresh the page

**Button not visible**
- Make sure you're on a scenario detail page
- Button appears between "Clone" and "Run Now"

---

## 🎯 You're All Set!

The system is ready to use. When you're ready to add your demo scenario:

1. **Export**: Click "Export Demo" button or use console
2. **Copy**: Get the JSON from console
3. **Paste**: Add to `demoScenarios.js`
4. **Test**: Clear localStorage and refresh

Need help? Check:
- [`DEMO_SCENARIOS_GUIDE.md`](DEMO_SCENARIOS_GUIDE.md) - Detailed guide
- [`DEMO_SCENARIOS_README.md`](DEMO_SCENARIOS_README.md) - Quick reference
- Browser console - All export commands are logged on page load

---

**Ready to create your demo? Open the app and click "Export Demo"!** 🚀
