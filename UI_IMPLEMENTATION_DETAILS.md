# WorkflowAI Pro: UI & Styling Implementation

## 1. Print-Friendly Executive Styling (CSS)
This CSS ensures that reports are optimized for physical printing and boardroom review.

```css
@media print {
  body {
    font-family: 'Merriweather', serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #000;
    margin: 2.5cm;
  }

  h1, h2, h3 {
    font-family: 'Inter', sans-serif;
    page-break-after: avoid;
  }

  .no-print {
    display: none;
  }

  pre, blockquote {
    page-break-inside: avoid;
    border: 1px solid #ccc;
    padding: 10px;
  }
}
```

## 2. 'Copy Report to Clipboard' Control (React + Tailwind)
A high-assurance component for executive report extraction.

```tsx
import React, { useState } from 'react';

interface CopyControlProps {
  content: string;
}

export const CopyReportToClipboard: React.FC<CopyControlProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy executive report:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-200 no-print
        ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium`}
    >
      {copied ? (
        <>
          <span className="text-sm">Report Copied!</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </>
      ) : (
        <>
          <span className="text-sm">Copy Report to Clipboard</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </>
      )}
    </button>
  );
};
```
