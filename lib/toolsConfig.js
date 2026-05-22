export const toolsCategories = [
  {
    title: 'Developer Tools',
    slug: 'dev',
    tools: [
      { name: 'JSON Formatter', path: '/dev/json-formatter', desc: 'Format and validate JSON.' },
      { name: 'Color Studio', path: '/dev/color-picker', desc: 'Generate palettes & check contrast.' },
      { name: 'Base64 Encoder', path: '/dev/base64', desc: 'Encode text and images.' },
      { name: 'CIDR Calculator', path: '/dev/cidr-calculator', desc: 'Calculate IP ranges & subnets.' },
      { name: 'JWT Decoder', path: '/dev/jwt-decoder', desc: 'Decode JSON Web Tokens securely.' },
      { name: 'Cron Builder', path: '/dev/cron-builder', desc: 'Generate server cron schedules.' }
    ]
  },
  {
    title: 'Text & Content',
    slug: 'text',
    tools: [
      { name: 'Password Generator', path: '/text/password-generator', desc: 'Create secure passwords.' },
      { name: 'Word & SEO Counter', path: '/text/word-counter', desc: 'Count words and analyze density.' },
      { name: 'Case Converter', path: '/text/case-converter', desc: 'Transform text casing instantly.' },
      { name: 'QR Code Generator', path: '/text/qr-generator', desc: 'Create scannable QR codes.' }
    ]
  },
  {
    title: 'Math & Finance',
    slug: 'math',
    tools: [
      { name: 'Itemized Split Bill', path: '/math/split-bill', desc: 'Calculate exact proportions.' },
      { name: 'Currency Converter', path: '/math/currency', desc: 'Convert live exchange rates.' },
      { name: 'Percentage Calculator', path: '/math/percentage', desc: 'Calculate percentages easily.' },
      { name: 'Unit Converter', path: '/math/unit-converter', desc: 'Convert measurements and weights.' }
    ]
  },
  {
    title: 'Time & Productivity',
    slug: 'time',
    tools: [
      { name: 'Date Calculator', path: '/time/date-calculator', desc: 'Add/subtract business days.' },
      { name: 'World Clock', path: '/time/world-clock', desc: 'Track multiple timezones.' },
      { name: 'Pomodoro Timer', path: '/time/pomodoro', desc: 'Focus with the Pomodoro technique.' },
      { name: 'Task Manager', path: '/time/tasks', desc: 'Organize your daily tasks.' }
    ]
  }
];

// Helper array to feature specific tools on the homepage
export const spotlightTools = [
  { name: 'JSON Formatter', path: '/dev/json-formatter', category: 'Developer' },
  { name: 'Itemized Split Bill', path: '/math/split-bill', category: 'Math' },
  { name: 'Word & SEO Counter', path: '/text/word-counter', category: 'Text' },
  { name: 'Cron Builder', path: '/dev/cron-builder', category: 'Developer' },
  { name: 'Date Calculator', path: '/time/date-calculator', category: 'Time' },
  { name: 'Color Studio', path: '/dev/color-picker', category: 'Developer' }
];