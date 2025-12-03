// src/components/CaseContentRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface CaseContentRendererProps {
  content: string | null | undefined;
  fallback?: string;
  className?: string;
}

/**
 * Renders case content with markdown support.
 * Converts plain text with common patterns (bullets, dashes, numbered lists)
 * into proper markdown and renders with consistent styling.
 */
export function CaseContentRenderer({
  content,
  fallback = 'No content provided.',
  className = '',
}: CaseContentRendererProps): React.ReactElement {
  if (!content) {
    return <p className="italic text-text-muted">{fallback}</p>;
  }

  // Normalize content: convert plain text patterns to markdown
  const normalizedContent = normalizeToMarkdown(content);

  return (
    <div className={`case-content prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Paragraph styling
          p: ({ children }) => (
            <p className="text-text-primary leading-relaxed mb-4 last:mb-0">{children}</p>
          ),
          // Strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-text-primary">{children}</strong>
          ),
          // Emphasis/italic
          em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
          // Unordered lists with proper alignment
          ul: ({ children }) => <ul className="list-none space-y-2 mb-4 last:mb-0">{children}</ul>,
          // Ordered lists
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-2 mb-4 last:mb-0 marker:text-blue-400">
              {children}
            </ol>
          ),
          // List items with custom bullet styling
          li: ({ children, ...props }) => {
            const isOrdered =
              (props as { node?: { parent?: { tagName?: string } } }).node?.parent?.tagName ===
              'ol';
            return (
              <li
                className={`text-text-primary leading-relaxed ${!isOrdered ? 'flex items-start gap-2' : ''}`}
              >
                {!isOrdered && <span className="text-blue-400 mt-1.5 flex-shrink-0">•</span>}
                <span className="flex-1">{children}</span>
              </li>
            );
          },
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-text-primary mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-text-primary mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-text-primary mb-2">{children}</h3>
          ),
          // Code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-surface-hover px-1.5 py-0.5 rounded text-sm font-mono text-blue-300">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-surface-hover p-3 rounded-lg text-sm font-mono text-text-secondary overflow-x-auto">
                {children}
              </code>
            );
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/50 pl-4 my-4 text-text-secondary italic">
              {children}
            </blockquote>
          ),
          // Horizontal rules
          hr: () => <hr className="border-surface-border my-6" />,
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Converts plain text with common patterns to markdown format.
 * Handles:
 * - Lines starting with "- " or "* " (bullet points)
 * - Lines starting with "1. ", "2. ", etc. (numbered lists)
 * - Lines with **bold** text
 * - Lines with "Key:" or "Result:" style labels
 */
function normalizeToMarkdown(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    // eslint-disable-next-line security/detect-object-injection -- i is loop-controlled and bounds-checked
    let line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but preserve paragraph breaks
    if (!trimmedLine) {
      if (inList) {
        inList = false;
      }
      result.push('');
      continue;
    }

    // Detect and normalize bullet points
    // Patterns: "- text", "• text", "* text" (not at start of word), "– text" (en-dash)
    const bulletMatch = trimmedLine.match(/^[-•–]\s+(.+)$/);
    if (bulletMatch) {
      line = `- ${bulletMatch[1]}`;
      inList = true;
    }

    // Detect and normalize numbered lists
    // Patterns: "1. text", "1) text", "1: text"
    const numberedMatch = trimmedLine.match(/^(\d+)[.):\s]+\s*(.+)$/);
    if (numberedMatch) {
      line = `${numberedMatch[1]}. ${numberedMatch[2]}`;
      inList = true;
    }

    // Convert label patterns to bold
    // Patterns: "Key Finding:", "Result:", "Note:" at start of line
    const labelMatch = trimmedLine.match(/^([A-Z][a-zA-Z\s]{0,30}:)\s*(.+)$/);
    if (labelMatch && !trimmedLine.startsWith('-') && !numberedMatch) {
      line = `**${labelMatch[1]}** ${labelMatch[2]}`;
    }

    result.push(line);
  }

  return result.join('\n');
}

export default CaseContentRenderer;
