// Mock Data for Test Automation UI
// Based on the data models from test-automation-ui-design.md

const MOCK_DATA = {
  // Test Definitions
  tests: [
    {
      id: 'test-001',
      name: 'Login Flow Automation',
      description: 'Automated test for user authentication flow including login, session validation, and logout',
      tags: ['authentication', 'critical', 'smoke-test'],
      createdAt: '2024-01-05T10:30:00Z',
      updatedAt: '2024-01-09T14:20:00Z',
      createdBy: 'john.doe@trinamix.com',
      configuration: {
        maxSteps: 25,
        timeout: 120,
        retryOnFailure: true,
        maxRetries: 3,
        captureScreenshots: true,
        captureOnlyFailures: false,
        headless: false,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      instructions: {
        task: 'Navigate to the login page, enter valid credentials, verify successful login, and then logout',
        steps: [
          { id: 'step-1', order: 1, description: 'Navigate to login page', action: 'navigate' },
          { id: 'step-2', order: 2, description: 'Enter username', action: 'input' },
          { id: 'step-3', order: 3, description: 'Enter password', action: 'input' },
          { id: 'step-4', order: 4, description: 'Click login button', action: 'click' },
          { id: 'step-5', order: 5, description: 'Verify dashboard loads', action: 'verify' }
        ]
      },
      lastRun: {
        status: 'passed',
        date: '2024-01-09T14:30:00Z',
        duration: 45000
      }
    },
    {
      id: 'test-002',
      name: 'Product Search and Filter',
      description: 'Test product search functionality with various filters and sorting options',
      tags: ['e-commerce', 'search', 'regression'],
      createdAt: '2024-01-03T09:00:00Z',
      updatedAt: '2024-01-08T11:00:00Z',
      createdBy: 'jane.smith@trinamix.com',
      configuration: {
        maxSteps: 30,
        timeout: 180,
        retryOnFailure: true,
        maxRetries: 2,
        captureScreenshots: true,
        captureOnlyFailures: false,
        headless: true,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      instructions: {
        task: 'Search for products, apply filters, verify results, and sort by different criteria',
        steps: [
          { id: 'step-1', order: 1, description: 'Navigate to products page', action: 'navigate', expectedOutcome: 'Products page loads' },
          { id: 'step-2', order: 2, description: 'Enter search term in search box', action: 'input', expectedOutcome: 'Search term entered' },
          { id: 'step-3', order: 3, description: 'Click search button', action: 'click', expectedOutcome: 'Search results displayed' },
          { id: 'step-4', order: 4, description: 'Apply category filter', action: 'click', expectedOutcome: 'Results filtered by category' },
          { id: 'step-5', order: 5, description: 'Apply price range filter', action: 'input', expectedOutcome: 'Results filtered by price' },
          { id: 'step-6', order: 6, description: 'Sort by price low to high', action: 'click', expectedOutcome: 'Results sorted ascending' },
          { id: 'step-7', order: 7, description: 'Verify first product price', action: 'verify', expectedOutcome: 'Lowest price first' },
          { id: 'step-8', order: 8, description: 'Sort by price high to low', action: 'click', expectedOutcome: 'Results sorted descending' }
        ]
      },
      lastRun: {
        status: 'failed',
        date: '2024-01-08T16:45:00Z',
        duration: 78000
      }
    },
    {
      id: 'test-003',
      name: 'Checkout Process',
      description: 'End-to-end checkout flow from cart to order confirmation',
      tags: ['e-commerce', 'checkout', 'critical', 'payment'],
      createdAt: '2024-01-01T14:00:00Z',
      updatedAt: '2024-01-07T09:30:00Z',
      createdBy: 'mike.wilson@trinamix.com',
      configuration: {
        maxSteps: 40,
        timeout: 240,
        retryOnFailure: true,
        maxRetries: 3,
        captureScreenshots: true,
        captureOnlyFailures: false,
        headless: false,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      instructions: {
        task: 'Add items to cart, proceed to checkout, fill shipping info, complete payment',
        steps: [
          { id: 'step-1', order: 1, description: 'Navigate to product page', action: 'navigate', expectedOutcome: 'Product page loads' },
          { id: 'step-2', order: 2, description: 'Click Add to Cart button', action: 'click', expectedOutcome: 'Item added to cart' },
          { id: 'step-3', order: 3, description: 'Open cart sidebar', action: 'click', expectedOutcome: 'Cart displays item' },
          { id: 'step-4', order: 4, description: 'Click Proceed to Checkout', action: 'click', expectedOutcome: 'Checkout page loads' },
          { id: 'step-5', order: 5, description: 'Enter shipping address', action: 'input', expectedOutcome: 'Address filled' },
          { id: 'step-6', order: 6, description: 'Select shipping method', action: 'click', expectedOutcome: 'Shipping selected' },
          { id: 'step-7', order: 7, description: 'Enter payment details', action: 'input', expectedOutcome: 'Payment info entered' },
          { id: 'step-8', order: 8, description: 'Click Place Order', action: 'click', expectedOutcome: 'Order submitted' },
          { id: 'step-9', order: 9, description: 'Verify order confirmation', action: 'verify', expectedOutcome: 'Confirmation displayed' }
        ]
      },
      lastRun: {
        status: 'passed',
        date: '2024-01-09T10:00:00Z',
        duration: 120000
      }
    },
    {
      id: 'test-004',
      name: 'User Profile Update',
      description: 'Test user profile editing and settings management',
      tags: ['user-management', 'profile', 'settings'],
      createdAt: '2024-01-02T11:30:00Z',
      updatedAt: '2024-01-06T15:00:00Z',
      createdBy: 'sarah.johnson@trinamix.com',
      configuration: {
        maxSteps: 20,
        timeout: 90,
        retryOnFailure: true,
        maxRetries: 2,
        captureScreenshots: true,
        captureOnlyFailures: true,
        headless: true,
        browser: 'firefox',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      instructions: {
        task: 'Navigate to profile, update personal info, change password, verify changes',
        steps: [
          { id: 'step-1', order: 1, description: 'Navigate to user profile page', action: 'navigate', expectedOutcome: 'Profile page loads' },
          { id: 'step-2', order: 2, description: 'Click Edit Profile button', action: 'click', expectedOutcome: 'Edit mode enabled' },
          { id: 'step-3', order: 3, description: 'Update display name', action: 'input', expectedOutcome: 'Name updated' },
          { id: 'step-4', order: 4, description: 'Update email address', action: 'input', expectedOutcome: 'Email updated' },
          { id: 'step-5', order: 5, description: 'Click Save Changes', action: 'click', expectedOutcome: 'Changes saved' },
          { id: 'step-6', order: 6, description: 'Navigate to security settings', action: 'click', expectedOutcome: 'Security page loads' },
          { id: 'step-7', order: 7, description: 'Enter current password', action: 'input', expectedOutcome: 'Current password entered' },
          { id: 'step-8', order: 8, description: 'Enter new password', action: 'input', expectedOutcome: 'New password entered' },
          { id: 'step-9', order: 9, description: 'Confirm new password', action: 'input', expectedOutcome: 'Password confirmed' },
          { id: 'step-10', order: 10, description: 'Click Update Password', action: 'click', expectedOutcome: 'Password updated' }
        ]
      },
      lastRun: {
        status: 'running',
        date: '2024-01-09T15:00:00Z',
        duration: null
      }
    },
    {
      id: 'test-005',
      name: 'Form Validation Testing',
      description: 'Comprehensive form validation with various input scenarios',
      tags: ['validation', 'forms', 'input'],
      createdAt: '2024-01-04T08:00:00Z',
      updatedAt: '2024-01-09T09:00:00Z',
      createdBy: 'alex.chen@trinamix.com',
      configuration: {
        maxSteps: 35,
        timeout: 150,
        retryOnFailure: false,
        maxRetries: 0,
        captureScreenshots: true,
        captureOnlyFailures: false,
        headless: true,
        browser: 'chrome',
        viewportWidth: 1920,
        viewportHeight: 1080
      },
      instructions: {
        task: 'Test form with valid inputs, invalid inputs, edge cases, and error handling',
        steps: [
          { id: 'step-1', order: 1, description: 'Navigate to registration form', action: 'navigate', expectedOutcome: 'Form page loads' },
          { id: 'step-2', order: 2, description: 'Test empty form submission', action: 'click', expectedOutcome: 'Validation errors shown' },
          { id: 'step-3', order: 3, description: 'Enter invalid email format', action: 'input', expectedOutcome: 'Email error displayed' },
          { id: 'step-4', order: 4, description: 'Enter short password', action: 'input', expectedOutcome: 'Password error displayed' },
          { id: 'step-5', order: 5, description: 'Enter valid email', action: 'input', expectedOutcome: 'Email accepted' },
          { id: 'step-6', order: 6, description: 'Enter valid password', action: 'input', expectedOutcome: 'Password accepted' },
          { id: 'step-7', order: 7, description: 'Test phone number validation', action: 'input', expectedOutcome: 'Phone validated' },
          { id: 'step-8', order: 8, description: 'Submit valid form', action: 'click', expectedOutcome: 'Form submitted' },
          { id: 'step-9', order: 9, description: 'Verify success message', action: 'verify', expectedOutcome: 'Success shown' }
        ]
      },
      lastRun: null
    }
  ],

  // Sample Test Execution (detailed)
  executions: [
    {
      id: 'exec-001',
      testId: 'test-001',
      testName: 'Login Flow Automation',
      status: 'passed',
      startTime: '2024-01-09T14:45:32Z',
      endTime: '2024-01-09T14:48:06Z',
      duration: 154000,
      progress: {
        currentStep: 20,
        totalSteps: 20,
        currentAction: 'Test completed',
        percentage: 100
      },
      results: {
        finalResult: 'Successfully logged in, verified dashboard content, and logged out',
        isSuccessful: true,
        hasErrors: false,
        judgeVerdict: {
          isSuccessful: true,
          failureReason: null,
          confidence: 0.95
        },
        steps: [
          {
            stepNumber: 1,
            stepDescription: 'Navigate to login page',
            startTime: '2024-01-09T14:45:32Z',
            endTime: '2024-01-09T14:45:35Z',
            duration: 3000,
            status: 'success',
            agentAction: {
              type: 'go_to_url',
              parameters: { url: 'https://example.com/login' },
              evaluation: 'Successfully navigated to login page',
              nextGoal: 'Locate and fill username field',
              memory: 'Arrived at login page. Need to enter credentials.'
            },
            result: {
              success: true,
              extractedContent: 'Login page loaded successfully',
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/login',
              title: 'Login - Example App',
              timestamp: '2024-01-09T14:45:35Z'
            }
          },
          {
            stepNumber: 2,
            stepDescription: 'Enter username',
            startTime: '2024-01-09T14:45:35Z',
            endTime: '2024-01-09T14:45:37Z',
            duration: 2000,
            status: 'success',
            agentAction: {
              type: 'input_text',
              parameters: { selector: 'input#username', value: '[MASKED]' },
              evaluation: 'Located username input field with ID user-input. Field is visible and ready for interaction.',
              nextGoal: 'Enter password in password field',
              memory: 'Username field filled. Next: enter password.'
            },
            result: {
              success: true,
              extractedContent: 'Text entered successfully',
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/login',
              title: 'Login - Example App',
              timestamp: '2024-01-09T14:45:37Z'
            }
          },
          {
            stepNumber: 3,
            stepDescription: 'Enter password',
            startTime: '2024-01-09T14:45:37Z',
            endTime: '2024-01-09T14:45:39Z',
            duration: 2000,
            status: 'success',
            agentAction: {
              type: 'input_text',
              parameters: { selector: 'input#password', value: '[MASKED]' },
              evaluation: 'Password field located and filled securely',
              nextGoal: 'Click login button to submit form',
              memory: 'Both credentials entered. Ready to submit.'
            },
            result: {
              success: true,
              extractedContent: 'Password entered successfully',
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/login',
              title: 'Login - Example App',
              timestamp: '2024-01-09T14:45:39Z'
            }
          },
          {
            stepNumber: 4,
            stepDescription: 'Click login button',
            startTime: '2024-01-09T14:45:39Z',
            endTime: '2024-01-09T14:45:42Z',
            duration: 3000,
            status: 'success',
            agentAction: {
              type: 'click',
              parameters: { selector: 'button[type="submit"]' },
              evaluation: 'Login button clicked, waiting for navigation',
              nextGoal: 'Verify dashboard loads successfully',
              memory: 'Form submitted. Waiting for redirect to dashboard.'
            },
            result: {
              success: true,
              extractedContent: 'Login form submitted',
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/dashboard',
              title: 'Dashboard - Example App',
              timestamp: '2024-01-09T14:45:42Z'
            }
          },
          {
            stepNumber: 5,
            stepDescription: 'Verify dashboard loads',
            startTime: '2024-01-09T14:45:42Z',
            endTime: '2024-01-09T14:45:45Z',
            duration: 3000,
            status: 'success',
            agentAction: {
              type: 'extract_content',
              parameters: { selector: '.dashboard-welcome' },
              evaluation: 'Dashboard loaded with welcome message',
              nextGoal: 'Verify user profile information',
              memory: 'Login successful. Dashboard is displaying correctly.'
            },
            result: {
              success: true,
              extractedContent: 'Welcome back, John Doe!',
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/dashboard',
              title: 'Dashboard - Example App',
              timestamp: '2024-01-09T14:45:45Z'
            }
          },
          {
            stepNumber: 6,
            stepDescription: 'Click on user profile',
            startTime: '2024-01-09T14:45:45Z',
            endTime: '2024-01-09T14:45:47Z',
            duration: 2000,
            status: 'success',
            agentAction: {
              type: 'click',
              parameters: { selector: '.user-avatar' },
              evaluation: 'User avatar clicked to open profile menu',
              nextGoal: 'Verify profile dropdown opens',
              memory: 'Navigating to profile section.'
            },
            result: {
              success: true,
              extractedContent: 'Profile menu opened',
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/dashboard',
              title: 'Dashboard - Example App',
              timestamp: '2024-01-09T14:45:47Z'
            }
          },
          {
            stepNumber: 7,
            stepDescription: 'Extract user info',
            startTime: '2024-01-09T14:45:47Z',
            endTime: '2024-01-09T14:45:49Z',
            duration: 2000,
            status: 'success',
            agentAction: {
              type: 'extract_content',
              parameters: { selector: '.user-profile-card' },
              evaluation: 'User profile information extracted successfully',
              nextGoal: 'Navigate to settings page',
              memory: 'User profile verified: john.doe@trinamix.com'
            },
            result: {
              success: true,
              extractedContent: JSON.stringify({
                name: 'John Doe',
                email: 'john.doe@trinamix.com',
                role: 'Administrator',
                lastLogin: '2024-01-09'
              }),
              error: null,
              isDone: false
            },
            browserState: {
              url: 'https://example.com/dashboard',
              title: 'Dashboard - Example App',
              timestamp: '2024-01-09T14:45:49Z'
            }
          },
          {
            stepNumber: 8,
            stepDescription: 'Click logout button',
            startTime: '2024-01-09T14:45:49Z',
            endTime: '2024-01-09T14:45:52Z',
            duration: 3000,
            status: 'success',
            agentAction: {
              type: 'click',
              parameters: { selector: 'button.logout' },
              evaluation: 'Logout button clicked',
              nextGoal: 'Verify redirect to login page',
              memory: 'Logging out user session.'
            },
            result: {
              success: true,
              extractedContent: 'Logged out successfully',
              error: null,
              isDone: true
            },
            browserState: {
              url: 'https://example.com/login',
              title: 'Login - Example App',
              timestamp: '2024-01-09T14:45:52Z'
            }
          }
        ],
        visitedUrls: [
          'https://example.com/login',
          'https://example.com/dashboard'
        ],
        screenshots: [
          {
            id: 'ss-001',
            stepNumber: 1,
            timestamp: '2024-01-09T14:45:35Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23f0f0f0" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23999">Login Page</text></svg>',
            url: 'https://example.com/login',
            fileSize: 45000,
            description: 'Login page loaded'
          },
          {
            id: 'ss-002',
            stepNumber: 2,
            timestamp: '2024-01-09T14:45:37Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e8f4f8" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666">Username Entered</text></svg>',
            url: 'https://example.com/login',
            fileSize: 52000,
            description: 'Username field filled'
          },
          {
            id: 'ss-003',
            stepNumber: 3,
            timestamp: '2024-01-09T14:45:39Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e8f8e8" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666">Password Entered</text></svg>',
            url: 'https://example.com/login',
            fileSize: 48000,
            description: 'Password field filled'
          },
          {
            id: 'ss-004',
            stepNumber: 4,
            timestamp: '2024-01-09T14:45:42Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23fff8e8" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666">Form Submitted</text></svg>',
            url: 'https://example.com/login',
            fileSize: 51000,
            description: 'Login button clicked'
          },
          {
            id: 'ss-005',
            stepNumber: 5,
            timestamp: '2024-01-09T14:45:45Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23d4edda" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23155724">Dashboard View</text></svg>',
            url: 'https://example.com/dashboard',
            fileSize: 89000,
            description: 'Dashboard loaded successfully'
          },
          {
            id: 'ss-006',
            stepNumber: 6,
            timestamp: '2024-01-09T14:45:47Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23cce5ff" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23004085">Profile Menu</text></svg>',
            url: 'https://example.com/dashboard',
            fileSize: 67000,
            description: 'Profile menu opened'
          },
          {
            id: 'ss-007',
            stepNumber: 7,
            timestamp: '2024-01-09T14:45:49Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e2e3e5" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23383d41">User Profile</text></svg>',
            url: 'https://example.com/dashboard',
            fileSize: 72000,
            description: 'User profile info extracted'
          },
          {
            id: 'ss-008',
            stepNumber: 8,
            timestamp: '2024-01-09T14:45:52Z',
            thumbnailBase64: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23f0f0f0" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23999">Logged Out</text></svg>',
            url: 'https://example.com/login',
            fileSize: 43000,
            description: 'Successfully logged out'
          }
        ],
        extractedData: [
          {
            stepNumber: 5,
            dataType: 'welcome_message',
            data: { message: 'Welcome back, John Doe!' },
            timestamp: '2024-01-09T14:45:45Z'
          },
          {
            stepNumber: 7,
            dataType: 'user_profile',
            data: {
              name: 'John Doe',
              email: 'john.doe@trinamix.com',
              role: 'Administrator',
              lastLogin: '2024-01-09'
            },
            timestamp: '2024-01-09T14:45:49Z'
          }
        ],
        errors: [],
        metrics: {
          totalActions: 8,
          successfulActions: 8,
          failedActions: 0,
          averageStepTime: 2500,
          domLoadTime: 1200
        }
      },
      metadata: {
        executedBy: 'john.doe@trinamix.com',
        environment: 'staging',
        triggeredBy: 'manual',
        tags: ['smoke-test', 'critical']
      },
      logs: [
        { timestamp: '2024-01-09T14:45:32.123Z', level: 'info', message: 'Agent initialized' },
        { timestamp: '2024-01-09T14:45:32.145Z', level: 'debug', message: 'Browser session created' },
        { timestamp: '2024-01-09T14:45:32.234Z', level: 'info', message: 'Task: "Login and verify dashboard"' },
        { timestamp: '2024-01-09T14:45:32.456Z', level: 'info', message: 'Step 1: Navigating to URL...' },
        { timestamp: '2024-01-09T14:45:35.789Z', level: 'debug', message: 'DOM loaded: 142 elements' },
        { timestamp: '2024-01-09T14:45:35.890Z', level: 'info', message: 'Screenshot captured: step_1.png' },
        { timestamp: '2024-01-09T14:45:36.012Z', level: 'info', message: 'Step 2: Locating username field' },
        { timestamp: '2024-01-09T14:45:36.345Z', level: 'debug', message: 'Element found: input#username' },
        { timestamp: '2024-01-09T14:45:36.567Z', level: 'info', message: 'Entering text into field...' },
        { timestamp: '2024-01-09T14:45:37.123Z', level: 'debug', message: 'Input value set successfully' },
        { timestamp: '2024-01-09T14:45:37.234Z', level: 'info', message: 'Step 3: Locating password field' },
        { timestamp: '2024-01-09T14:45:39.456Z', level: 'info', message: 'Step 4: Clicking login button' },
        { timestamp: '2024-01-09T14:45:42.567Z', level: 'info', message: 'Navigation to dashboard detected' },
        { timestamp: '2024-01-09T14:45:45.123Z', level: 'info', message: 'Dashboard content verified' },
        { timestamp: '2024-01-09T14:45:49.234Z', level: 'info', message: 'User profile extracted' },
        { timestamp: '2024-01-09T14:45:52.345Z', level: 'info', message: 'Logout successful' },
        { timestamp: '2024-01-09T14:45:52.456Z', level: 'info', message: 'Test completed successfully' }
      ]
    },
    {
      id: 'exec-002',
      testId: 'test-002',
      testName: 'Product Search and Filter',
      status: 'failed',
      startTime: '2024-01-08T16:30:00Z',
      endTime: '2024-01-08T16:31:18Z',
      duration: 78000,
      progress: {
        currentStep: 12,
        totalSteps: 20,
        currentAction: 'Failed',
        percentage: 60
      },
      results: {
        finalResult: 'Test failed at step 12: Element not found',
        isSuccessful: false,
        hasErrors: true,
        judgeVerdict: {
          isSuccessful: false,
          failureReason: 'Filter dropdown element was not found after page update',
          confidence: 0.88
        },
        steps: [],
        visitedUrls: ['https://example.com/products', 'https://example.com/products?search=laptop'],
        screenshots: [],
        extractedData: [],
        errors: [
          {
            stepNumber: 12,
            errorType: 'element_not_found',
            message: 'Could not locate element with selector ".filter-dropdown". Element may have been removed or is not yet visible on the page.',
            stackTrace: 'TimeoutError: Element not found\n  at waitForSelector...',
            timestamp: '2024-01-08T16:31:15Z',
            recoveryAttempts: 3
          }
        ],
        metrics: {
          totalActions: 12,
          successfulActions: 11,
          failedActions: 1,
          averageStepTime: 6500,
          domLoadTime: 1800
        }
      },
      metadata: {
        executedBy: 'jane.smith@trinamix.com',
        environment: 'staging',
        triggeredBy: 'scheduled',
        tags: ['regression']
      },
      logs: []
    },
    {
      id: 'exec-003',
      testId: 'test-004',
      testName: 'User Profile Update',
      status: 'running',
      startTime: '2024-01-09T15:00:00Z',
      endTime: null,
      duration: null,
      progress: {
        currentStep: 9,
        totalSteps: 20,
        currentAction: 'Updating profile picture',
        percentage: 45
      },
      results: {
        finalResult: null,
        isSuccessful: null,
        hasErrors: false,
        judgeVerdict: null,
        steps: [],
        visitedUrls: ['https://example.com/profile'],
        screenshots: [],
        extractedData: [],
        errors: [],
        metrics: {
          totalActions: 9,
          successfulActions: 9,
          failedActions: 0,
          averageStepTime: 3200,
          domLoadTime: 1100
        }
      },
      metadata: {
        executedBy: 'sarah.johnson@trinamix.com',
        environment: 'dev',
        triggeredBy: 'manual',
        tags: ['user-management']
      },
      logs: []
    }
  ],

  // Recent executions for dashboard
  recentExecutions: [
    { id: 'exec-001', testName: 'Login Flow Automation', status: 'passed', startTime: '2024-01-09T14:45:32Z', duration: 154000 },
    { id: 'exec-003', testName: 'User Profile Update', status: 'running', startTime: '2024-01-09T15:00:00Z', duration: null },
    { id: 'exec-002', testName: 'Product Search and Filter', status: 'failed', startTime: '2024-01-08T16:30:00Z', duration: 78000 },
    { id: 'exec-004', testName: 'Checkout Process', status: 'passed', startTime: '2024-01-09T10:00:00Z', duration: 120000 },
    { id: 'exec-005', testName: 'Login Flow Automation', status: 'passed', startTime: '2024-01-08T09:15:00Z', duration: 148000 },
    { id: 'exec-006', testName: 'Form Validation Testing', status: 'error', startTime: '2024-01-07T14:00:00Z', duration: 35000 },
    { id: 'exec-007', testName: 'Product Search and Filter', status: 'passed', startTime: '2024-01-07T11:30:00Z', duration: 82000 },
    { id: 'exec-008', testName: 'Checkout Process', status: 'passed', startTime: '2024-01-06T16:45:00Z', duration: 115000 }
  ],

  // Dashboard stats
  stats: {
    totalTests: 5,
    passRate: 78,
    avgDuration: 97000,
    activeRuns: 1,
    trendsData: [
      { date: '2024-01-03', passed: 8, failed: 2 },
      { date: '2024-01-04', passed: 12, failed: 1 },
      { date: '2024-01-05', passed: 10, failed: 3 },
      { date: '2024-01-06', passed: 15, failed: 2 },
      { date: '2024-01-07', passed: 11, failed: 4 },
      { date: '2024-01-08', passed: 9, failed: 3 },
      { date: '2024-01-09', passed: 6, failed: 1 }
    ]
  }
};

// Make it globally available
window.MOCK_DATA = MOCK_DATA;
