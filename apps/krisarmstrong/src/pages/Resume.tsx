import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { SkeletonText, Skeleton } from "../components/ui/Skeleton";
import { Button } from "@krisarmstrong/web-foundation";

type DownloadType = 'md' | 'pdf' | 'docx';

export default function Resume() {
  const [md, setMd] = useState("");
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
        setMd(text);
        setLoading(false);
      })
      .catch(err => {
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
    if (type === "md") {
      // Download the original markdown
      const { saveAs } = await import("file-saver");
      const blob = new Blob([md], { type: "text/markdown" });
      saveAs(blob, "kris_armstrong_resume.md");
    } else if (type === "pdf") {
      // Use browser's print dialog for PDF
      // This preserves all styling and formatting
      window.print();
    } else if (type === "docx") {
      // Generate Word document
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const { saveAs } = await import("file-saver");

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
          children.push(new Paragraph({ text: "" }));
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
        sections: [{
          children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "kris_armstrong_resume.docx");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="bg-surface-raised p-6 rounded-2xl shadow-lg border border-surface-border">
          <SkeletonText lines={10} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Download Buttons - Hidden when printing */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center print:hidden">
        <Button
          onClick={() => handleDownload("pdf")}
          tone="violet"
          className="inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </Button>
        <Button
          onClick={() => handleDownload("docx")}
          tone="blue"
          className="inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Word
        </Button>
        <Button
          onClick={() => handleDownload("md")}
          variant="outline"
          className="inline-flex items-center gap-2 border-surface-border text-text-primary hover:bg-surface-raised"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Markdown
        </Button>
      </div>

      {/* Resume Content */}
      <article className="bg-surface-raised rounded-2xl shadow-xl border border-surface-border overflow-hidden">
        {/* Social Links - Only shown on web, hidden in print */}
        <div className="flex gap-3 p-8 pb-0 print:hidden">
          <a
            href="https://www.linkedin.com/in/kris-armstrong-cissp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 no-underline"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/krisarmstrong"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 no-underline"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        <div className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none resume-content">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{md}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
