import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { Button, LoadingSpinner } from '@krisarmstrong/web-foundation';
import { Mail, ArrowRight } from 'lucide-react';

type DownloadType = 'md' | 'pdf' | 'docx';

export default function Resume() {
  const [md, setMd] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = import.meta.env.BASE_URL || '/';
    const resumeUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}resume.md`;
    fetch(resumeUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load resume');
        return res.text();
      })
      .then((text) => {
        const cleaned = text.replace(/^#\s*Kris Armstrong\s*\n?/, '');
        setMd(cleaned);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // Log to error tracking service in production
          if (import.meta.env.DEV) {
            console.error('Error loading resume:', err);
          }
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const handleDownload = async (type: DownloadType) => {
    if (type === 'md') {
      // Download the original markdown
      const { saveAs } = await import('file-saver');
      const blob = new Blob([md], { type: 'text/markdown' });
      saveAs(blob, 'kris_armstrong_resume.md');
    } else if (type === 'pdf') {
      // Use browser's print dialog for PDF
      // This preserves all styling and formatting
      window.print();
    } else if (type === 'docx') {
      // Generate Word document
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      const { saveAs } = await import('file-saver');

      // Parse markdown into sections
      const lines = md.split('\n');
      const children: React.ReactNode[] = [];
      let inHtmlBlock = false;

      for (const line of lines) {
        // Skip any HTML content
        if (line.trim().startsWith('<div')) {
          inHtmlBlock = true;
          continue;
        }
        if (line.trim().startsWith('</div>')) {
          inHtmlBlock = false;
          continue;
        }
        if (inHtmlBlock || line.trim().startsWith('<')) {
          continue; // Skip HTML content
        }

        if (line.startsWith('# ')) {
          // H1 heading
          children.push(
            new Paragraph({
              text: line.substring(2),
              heading: HeadingLevel.HEADING_1,
            })
          );
        } else if (line.startsWith('## ')) {
          // H2 heading
          children.push(
            new Paragraph({
              text: line.substring(3),
              heading: HeadingLevel.HEADING_2,
            })
          );
        } else if (line.startsWith('### ')) {
          // H3 heading
          children.push(
            new Paragraph({
              text: line.substring(4),
              heading: HeadingLevel.HEADING_3,
            })
          );
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          // Bullet point - remove markdown bold markers
          let text = line.substring(2);
          text = text.replace(/\*\*/g, ''); // Remove ** bold markers
          children.push(
            new Paragraph({
              text: text,
              bullet: {
                level: 0,
              },
            })
          );
        } else if (line.trim() === '---') {
          // Horizontal rule - add spacing
          children.push(new Paragraph({ text: '' }));
        } else if (line.trim()) {
          // Regular text - remove markdown bold and links
          let text = line;
          text = text.replace(/\*\*/g, ''); // Remove ** bold markers
          text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Convert [text](url) to text
          children.push(
            new Paragraph({
              children: [new TextRun(text)],
            })
          );
        }
      }

      const doc = new Document({
        sections: [
          {
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'kris_armstrong_resume.docx');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner variant="violet" loadingContext="resume-page" size={64} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-900/40 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.22),transparent_40%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto py-10 px-4 relative">
        <header className="mb-8 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-violet-200/70 mb-2">Resume</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" aria-hidden="true">
            Kris Armstrong
          </h1>
          <p className="text-lg text-violet-100/90 max-w-3xl mx-auto">
            Principal Wi-Fi strategist, security architect, and pre-sales engineer. Hands-on leader
            who translates complex wireless problems into decisive, profitable outcomes.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-violet-100/80">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              20+ yrs enterprise wireless & security
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              Based in Colorado • Remote-friendly
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              Available for advisory & fractional leadership
            </span>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3 mb-10 print:hidden">
          <div className="lg:col-span-2 bg-surface-raised border border-surface-border/70 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-text-muted">Downloads</p>
              <h2 className="text-2xl font-semibold text-text-primary mt-1">Get a copy</h2>
              <p className="text-text-muted mt-2">
                Choose the format that fits your workflow. Exports preserve the on-page styling and
                structure for fast review.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleDownload('pdf')}
                tone="violet"
                className="inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print / Save as PDF
              </Button>
              <Button
                onClick={() => handleDownload('docx')}
                tone="blue"
                className="inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Word
              </Button>
              <Button
                onClick={() => handleDownload('md')}
                variant="outline"
                className="inline-flex items-center gap-2 border-surface-border text-text-primary hover:bg-surface-raised"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Markdown
              </Button>
            </div>
          </div>

          <div className="bg-surface-raised border border-surface-border/70 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-text-muted">Quick Links</p>
              <h2 className="text-xl font-semibold text-text-primary mt-1">Connect</h2>
            </div>

            <div className="space-y-3">
              <a
                href="https://www.linkedin.com/in/kris-armstrong-cissp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-3 rounded-lg border border-surface-border hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
              >
                <span className="font-medium text-text-primary">LinkedIn</span>
                <ArrowRight className="w-4 h-4 text-text-muted" />
              </a>
              <a
                href="https://github.com/krisarmstrong"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-3 rounded-lg border border-surface-border hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
              >
                <span className="font-medium text-text-primary">GitHub</span>
                <ArrowRight className="w-4 h-4 text-text-muted" />
              </a>
              <a
                href="mailto:hello@krisarmstrong.com"
                className="flex items-center justify-between px-3 py-3 rounded-lg border border-surface-border hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
              >
                <span className="font-medium text-text-primary">Email</span>
                <Mail className="w-4 h-4 text-text-muted" />
              </a>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <article className="bg-surface-raised rounded-2xl shadow-xl border border-surface-border overflow-hidden">
          <div className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none resume-content">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              components={{
                h1: ({ node: _node, children, ...props }) => <h2 {...props}>{children}</h2>,
              }}
            >
              {md}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
