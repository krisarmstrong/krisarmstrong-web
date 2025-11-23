// src/components/CaseDisplay.tsx
import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  FileDown,
  AlertCircle,
  Loader2,
  Share2,
  ClipboardList,
  Network,
  Target,
  Wrench,
  FileCheck,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import { generateMarkdownContent, downloadFile } from '../utils/download.js';
import { shareToPlatform } from '../utils/share.ts';
import { H1, ArticleTitle, SubSectionTitle, P, MutedText, Tag } from './ui/Typography.tsx';
import { Button } from './ui/Button.tsx';
import { StarRating } from '@krisarmstrong/web-foundation';
import { TransformedCase } from '@/types';

interface CaseDisplayProps {
  pageTitle: string;
  pageIcon: React.ReactNode;
  caseData: TransformedCase | null;
  isLoading: boolean;
  error: Error | { message: string } | null;
}

type DownloadFormat = 'pdf' | 'md';
type SharePlatform = 'linkedin' | 'twitter' | 'facebook' | 'instagram';

// Memoized CaseDisplay to prevent re-renders when props haven't changed
const CaseDisplay = memo(
  function CaseDisplay({
    pageTitle,
    pageIcon,
    caseData,
    isLoading,
    error,
  }: CaseDisplayProps): React.ReactElement {
    const navigate = useNavigate();

    // State for tracking PDF download progress
    const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

    const handleDownloadWrapper = async (format: DownloadFormat): Promise<void> => {
      if (!caseData) return;

      const filenameBase = String(
        caseData.title
          ? caseData.title
              .replace(/[^a-z0-9_]/gi, '_')
              .toLowerCase()
              .substring(0, 50)
          : caseData.publicId || caseData.id || 'case_file'
      ).replace(/_{2,}/g, '_');

      if (format === 'pdf') {
        try {
          setIsDownloadingPdf(true);

          const { generateAndDownloadPdf } = await import('../utils/download.js');
          await generateAndDownloadPdf(caseData);

          setIsDownloadingPdf(false);
        } catch (error) {
          console.error('PDF generation failed:', error);
          setIsDownloadingPdf(false);
          alert('Failed to generate PDF. Please try again.');
        }
      } else if (format === 'md') {
        const markdownContent = generateMarkdownContent(caseData);
        downloadFile(markdownContent, `${filenameBase}.md`, 'text/markdown');
      }
    };

    const handleShareWrapper = (platform: SharePlatform): void => {
      if (!caseData) return;
      shareToPlatform(platform, caseData, window.location.href, (m: string) =>
        console.info(`Share alert: ${m}`)
      );
    };

    const tagsArray: string[] = caseData?.tags || [];

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] w-full">
          <Loader2 size={48} className="animate-spin text-blue-400" />
          <P className="ml-4 text-lg mt-4">
            Loading {pageTitle ? pageTitle.toLowerCase() : 'content'}...
          </P>
        </div>
      );
    }

    if (error || !caseData) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message ||
            `Could not load ${pageTitle ? pageTitle.toLowerCase() : 'the requested content'}. Please try again later.`;
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] w-full p-6 sm:p-10 bg-gray-800 border border-red-700/50 rounded-lg shadow-xl">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <H1 className="!text-xl !mb-2 text-gray-100">Error Loading Content</H1>
          <P className="text-center text-gray-300 mb-6">{errorMessage}</P>
        </div>
      );
    }

    // Fallback for date formatting if incident_date is invalid
    let displayDate = 'N/A';
    if (caseData.incidentDate) {
      try {
        displayDate = new Date(caseData.incidentDate).toLocaleDateString();
      } catch (e) {
        console.error('Error formatting incident_date:', caseData.incidentDate, e);
      }
    }

    // Type-safe metadata access

    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded-md transition-all text-sm font-medium group"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          <header className="mb-6 sm:mb-8">
            <H1 icon={pageIcon} className="!mb-3">
              {pageTitle}
            </H1>
          </header>

          <article className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <header className="mb-6 sm:mb-8">
                <ArticleTitle>{caseData.title || 'Title Not Available'}</ArticleTitle>

                <MutedText className="space-x-2 mb-4 text-gray-300 text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>
                    <strong className="text-gray-400 font-medium">Sector:</strong>{' '}
                    <span className="font-normal text-gray-100">{caseData.sector || 'N/A'}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    <strong className="text-gray-400 font-medium">Subsector:</strong>{' '}
                    <span className="font-normal text-gray-100">{caseData.subsector || 'N/A'}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    <strong className="text-gray-400 font-medium">Tool:</strong>{' '}
                    <span className="font-normal text-gray-100">{caseData.tool || 'N/A'}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    <strong className="text-gray-400 font-medium">Location:</strong>{' '}
                    <span className="font-normal text-gray-100">{caseData.location || 'N/A'}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    <strong className="text-gray-400 font-medium">Category:</strong>{' '}
                    <span className="font-normal text-gray-100">{caseData.category || 'N/A'}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    <strong className="text-gray-400 font-medium">Date:</strong>{' '}
                    <span className="font-normal text-gray-100">{displayDate}</span>
                  </span>
                </MutedText>

                {tagsArray.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tagsArray.map((tag, index) => (
                      <Tag key={`${tag}-${index}`} colorScheme="blue">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}
              </header>

              <section className="mb-8">
                <SubSectionTitle icon={<ClipboardList size={20} className="text-blue-400" />}>
                  Incident Overview
                </SubSectionTitle>
                <P>
                  {caseData.incidentOverview || (
                    <span className="italic text-gray-500">No incident overview provided.</span>
                  )}
                </P>
              </section>

              <section className="mb-8">
                <SubSectionTitle icon={<Network size={20} className="text-blue-400" />}>
                  Investigation Breakdown
                </SubSectionTitle>
                <P>
                  {caseData.investigationBreakdown || (
                    <span className="italic text-gray-500">
                      No investigation breakdown provided.
                    </span>
                  )}
                </P>
              </section>

              <section className="mb-8">
                <SubSectionTitle icon={<Target size={20} className="text-blue-400" />}>
                  Root Cause
                </SubSectionTitle>
                <P>
                  {caseData.rootCause || (
                    <span className="italic text-gray-500">Root cause not detailed.</span>
                  )}
                </P>
              </section>

              <section className="mb-8">
                <SubSectionTitle icon={<Wrench size={20} className="text-blue-400" />}>
                  Resolution
                </SubSectionTitle>
                <P>
                  {caseData.resolution || (
                    <span className="italic text-gray-500">Resolution not provided.</span>
                  )}
                </P>
              </section>

              <section className="mb-8">
                <SubSectionTitle icon={<FileCheck size={20} className="text-blue-400" />}>
                  Verdict & Summary
                </SubSectionTitle>
                {caseData.verdict && (
                  <P>
                    <strong className="text-gray-400 font-medium">Verdict:</strong>{' '}
                    {caseData.verdict}
                  </P>
                )}
                {caseData.summary && (
                  <P className={caseData.verdict ? 'mt-2' : ''}>
                    <strong className="text-gray-400 font-medium">Summary:</strong>{' '}
                    {caseData.summary}
                  </P>
                )}
                {!(caseData.verdict || caseData.summary) && (
                  <P className="italic text-gray-500">No verdict or summary provided.</P>
                )}
              </section>

              <section className="mb-8">
                <SubSectionTitle icon={<BarChart3 size={20} className="text-blue-400" />}>
                  Operational Context & Impact
                </SubSectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <P>
                    <strong className="text-gray-400 font-medium">Detected By:</strong>{' '}
                    {caseData.detectedBy || 'N/A'}
                  </P>
                  <P>
                    <strong className="text-gray-400 font-medium">Severity:</strong>{' '}
                    {caseData.severity || 'N/A'}
                  </P>
                  <P>
                    <strong className="text-gray-400 font-medium">Status:</strong>{' '}
                    {caseData.status || 'N/A'}
                  </P>
                  <P>
                    <strong className="text-gray-400 font-medium">Impact Scope:</strong>{' '}
                    {caseData.impactScope || 'N/A'}
                  </P>
                  <P>
                    <strong className="text-gray-400 font-medium">Duration:</strong>{' '}
                    {caseData.durationMinutes ? `${caseData.durationMinutes} minutes` : 'N/A'}
                  </P>
                  <P>
                    <strong className="text-gray-400 font-medium">Validated By:</strong>{' '}
                    {caseData.validatedBy || 'N/A'}
                  </P>
                </div>
              </section>
            </div>

            {/* Rating Section */}
            <div className="px-6 sm:px-8 pt-6 pb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Rate this Case</h3>
              <StarRating
                itemId={caseData.publicId}
                storagePrefix="case"
                onRate={(rating) =>
                  console.log(`Rated case ${caseData.publicId} with ${rating} stars`)
                }
              />
            </div>

            <footer className="p-6 sm:p-8 flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleDownloadWrapper('md')}
                  leftIcon={<FileText size={16} />}
                  variant="secondary"
                  disabled={!caseData}
                >
                  Markdown
                </Button>
                <Button
                  onClick={() => handleDownloadWrapper('pdf')}
                  leftIcon={
                    isDownloadingPdf ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <FileDown size={16} />
                    )
                  }
                  variant="secondary"
                  disabled={!caseData || isDownloadingPdf}
                >
                  {isDownloadingPdf ? 'Generating...' : 'PDF'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-gray-400 hidden sm:inline" />
                <MutedText className="hidden sm:inline !mb-0 text-gray-300">Share:</MutedText>
                {(['linkedin', 'twitter', 'facebook', 'instagram'] as SharePlatform[]).map(
                  (platform) => (
                    <Button
                      key={platform}
                      onClick={() => handleShareWrapper(platform)}
                      variant="ghost"
                      size="sm"
                      className="p-2 focus:ring-blue-500"
                      aria-label={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                      disabled={!caseData}
                    >
                      {platform === 'linkedin' && <Linkedin size={20} />}
                      {platform === 'twitter' && <Twitter size={20} />}
                      {platform === 'facebook' && <Facebook size={20} />}
                      {platform === 'instagram' && <Instagram size={20} />}
                    </Button>
                  )
                )}
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
  },
  (prevProps: CaseDisplayProps, nextProps: CaseDisplayProps): boolean => {
    return (
      prevProps.caseData === nextProps.caseData &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.error === nextProps.error
    );
  }
);

export default CaseDisplay;
