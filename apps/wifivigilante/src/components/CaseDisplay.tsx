// src/components/CaseDisplay.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  AlertCircle,
  Loader2,
  ClipboardList,
  Network,
  Target,
  Wrench,
  FileCheck,
  BarChart3,
  ArrowLeft,
  Clock4,
  ShieldHalf,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { shareToPlatform } from '../utils/share.ts';
import {
  H1,
  SubSectionTitle,
  P,
  ContentCard,
  AggregateRating,
} from '@krisarmstrong/web-foundation';
import { Button } from './ui/Button.tsx';
import { TransformedCase } from '@/types';
import { getRatingStats, submitRating, getUserRating } from '../utils/ratings';

interface CaseDisplayProps {
  pageTitle: string;
  pageIcon: React.ReactNode;
  caseData: TransformedCase | null;
  isLoading: boolean;
  error: Error | { message: string } | null;
  relatedCases?: TransformedCase[];
}

type SharePlatform = 'linkedin' | 'twitter' | 'facebook' | 'instagram';

export default function CaseDisplay({
  pageTitle,
  pageIcon,
  caseData,
  isLoading,
  error,
  relatedCases = [],
}: CaseDisplayProps): React.ReactElement {
  const navigate = useNavigate();

  const tags = caseData?.tags || [];

  const handleTagClick = (tag: string) => {
    navigate(`/cases?tags=${encodeURIComponent(tag)}`);
  };

  const handleShareWrapper = (platform: SharePlatform): void => {
    if (!caseData) return;
    shareToPlatform(platform, caseData, window.location.href, (m: string) =>
      console.warn(`Share alert: ${m}`)
    );
  };

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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] w-full p-6 sm:p-10 bg-surface-raised border border-red-700/50 rounded-lg shadow-xl">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <H1 className="!text-xl !mb-2">Error Loading Content</H1>
        <P className="text-center mb-6">{errorMessage}</P>
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

  const takeaways = [caseData.rootCause, caseData.resolution, caseData.verdict].filter(
    Boolean
  ) as string[];

  // Type-safe metadata access

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.2),transparent_40%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-hover hover:bg-surface-border/20 text-text-primary rounded-md transition-all text-sm font-medium group focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        <header className="space-y-3 mb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <button
              onClick={() => navigate('/')}
              className="underline-offset-4 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <button
              onClick={() => navigate('/cases')}
              className="underline-offset-4 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Cases
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-semibold line-clamp-1">{caseData.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-blue-100/80">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30">
              Case Detail
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30">
              {displayDate}
            </span>
            {caseData.durationMinutes && (
              <span className="px-3 py-1 rounded-full bg-surface-hover border border-surface-border/60 text-text-primary">
                {caseData.durationMinutes} min duration
              </span>
            )}
          </div>

          <H1 icon={pageIcon} className="!mb-2">
            {caseData.title}
          </H1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-surface-hover/40 border border-surface-border px-4 py-3">
              <ShieldHalf className="text-red-300" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Severity</p>
                <p className="text-sm font-semibold text-text-primary">{caseData.severity}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-hover/40 border border-surface-border px-4 py-3">
              <Target className="text-emerald-300" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Status</p>
                <p className="text-sm font-semibold text-text-primary">{caseData.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-hover/40 border border-surface-border px-4 py-3">
              <Clock4 className="text-blue-300" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Duration</p>
                <p className="text-sm font-semibold text-text-primary">
                  {caseData.durationMinutes ? `${caseData.durationMinutes} min` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4 text-sm text-text-muted">
            <div className="flex items-center gap-2 rounded-2xl bg-surface-hover border border-surface-border px-3 py-2">
              <Clock4 size={16} className="text-sky-200" />
              <span>Date</span>
              <strong className="text-text-primary ml-auto">{displayDate}</strong>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface-hover border border-surface-border px-3 py-2">
              <MapPin size={16} className="text-blue-200" />
              <span>Location</span>
              <strong className="text-text-primary ml-auto">{caseData.location || 'N/A'}</strong>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface-hover border border-surface-border px-3 py-2">
              <Network size={16} className="text-indigo-200" />
              <span>Sector</span>
              <strong className="text-text-primary ml-auto">{caseData.sector || 'N/A'}</strong>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface-hover border border-surface-border px-3 py-2">
              <Target size={16} className="text-emerald-200" />
              <span>Subsector</span>
              <strong className="text-text-primary ml-auto">{caseData.subsector || 'N/A'}</strong>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface-hover border border-surface-border px-3 py-2">
              <FileCheck size={16} className="text-slate-200" />
              <span>Category</span>
              <strong className="text-text-primary ml-auto">{caseData.category || 'N/A'}</strong>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface-hover border border-surface-border px-3 py-2">
              <Wrench size={16} className="text-sky-200" />
              <span>Tool</span>
              <strong className="text-text-primary ml-auto">{caseData.tool || 'N/A'}</strong>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4" aria-label="Tags">
              {tags.map((tag, index) => (
                <button
                  key={`${tag}-${index}`}
                  onClick={() => handleTagClick(tag)}
                  className="inline-flex items-center gap-1 text-sm rounded-full font-medium px-3 py-1 border border-blue-400/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition-all duration-150 hover:-translate-y-0.5"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </header>

        <article className="bg-gradient-to-b from-blue-950/40 via-surface-raised to-surface-raised border border-surface-border rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <section className="mb-8">
              <SubSectionTitle icon={<ShieldCheck size={20} className="text-blue-400" />}>
                Case Snapshot
              </SubSectionTitle>
              <P className="text-text-primary leading-relaxed">
                {caseData.summary || caseData.incidentOverview || 'Summary unavailable.'}
              </P>
            </section>
            <section className="mb-8">
              <SubSectionTitle icon={<ClipboardList size={20} className="text-blue-400" />}>
                Incident Overview
              </SubSectionTitle>
              <P>
                {caseData.incidentOverview || (
                  <span className="italic text-text-muted">No incident overview provided.</span>
                )}
              </P>
            </section>

            <section className="mb-8">
              <SubSectionTitle icon={<Network size={20} className="text-blue-400" />}>
                Investigation Breakdown
              </SubSectionTitle>
              <P>
                {caseData.investigationBreakdown || (
                  <span className="italic text-text-muted">
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
                  <span className="italic text-text-muted">Root cause not detailed.</span>
                )}
              </P>
            </section>

            <section className="mb-8">
              <SubSectionTitle icon={<Wrench size={20} className="text-blue-400" />}>
                Resolution
              </SubSectionTitle>
              <P>
                {caseData.resolution || (
                  <span className="italic text-text-muted">Resolution not provided.</span>
                )}
              </P>
            </section>

            <section className="mb-8">
              <SubSectionTitle icon={<FileCheck size={20} className="text-blue-400" />}>
                Verdict & Summary
              </SubSectionTitle>
              {caseData.verdict && (
                <P>
                  <strong className="text-text-muted font-medium">Verdict:</strong>{' '}
                  {caseData.verdict}
                </P>
              )}
              {caseData.summary && (
                <P className={caseData.verdict ? 'mt-2' : ''}>
                  <strong className="text-text-muted font-medium">Summary:</strong>{' '}
                  {caseData.summary}
                </P>
              )}
              {!(caseData.verdict || caseData.summary) && (
                <P className="italic text-text-muted">No verdict or summary provided.</P>
              )}
            </section>

            {takeaways.length > 0 && (
              <section className="mb-8">
                <SubSectionTitle icon={<BarChart3 size={20} className="text-blue-400" />}>
                  Key Takeaways
                </SubSectionTitle>
                <ul className="list-disc list-inside space-y-2 text-text-primary">
                  {takeaways.map((t, idx) => (
                    <li key={`${t}-${idx}`} className="text-sm leading-relaxed">
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mb-8">
              <SubSectionTitle icon={<BarChart3 size={20} className="text-blue-400" />}>
                Operational Context & Impact
              </SubSectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <P>
                  <strong className="text-text-muted font-medium">Detected By:</strong>{' '}
                  {caseData.detectedBy || 'N/A'}
                </P>
                <P>
                  <strong className="text-text-muted font-medium">Severity:</strong>{' '}
                  {caseData.severity || 'N/A'}
                </P>
                <P>
                  <strong className="text-text-muted font-medium">Status:</strong>{' '}
                  {caseData.status || 'N/A'}
                </P>
                <P>
                  <strong className="text-text-muted font-medium">Impact Scope:</strong>{' '}
                  {caseData.impactScope || 'N/A'}
                </P>
                <P>
                  <strong className="text-text-muted font-medium">Duration:</strong>{' '}
                  {caseData.durationMinutes ? `${caseData.durationMinutes} minutes` : 'N/A'}
                </P>
                <P>
                  <strong className="text-text-muted font-medium">Validated By:</strong>{' '}
                  {caseData.validatedBy || 'N/A'}
                </P>
              </div>
            </section>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2 bg-surface-raised border border-surface-border rounded-2xl p-4 sm:p-6 shadow-inner shadow-blue-500/5">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                  Share
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['linkedin', 'twitter', 'facebook', 'instagram'] as SharePlatform[]).map(
                    (platform) => (
                      <Button
                        key={platform}
                        onClick={() => handleShareWrapper(platform)}
                        variant="ghost"
                        size="sm"
                        className="px-3 py-2 rounded-lg border border-surface-border hover:bg-blue-500/10 focus:ring-blue-500 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                        aria-label={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                        disabled={!caseData}
                      >
                        {platform === 'linkedin' && <Linkedin size={18} />}
                        {platform === 'twitter' && <Twitter size={18} />}
                        {platform === 'facebook' && <Facebook size={18} />}
                        {platform === 'instagram' && <Instagram size={18} />}
                        <span className="text-sm capitalize">{platform}</span>
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                  Rate this case
                </h3>
                <AggregateRating
                  itemId={caseData.publicId}
                  itemType="case"
                  ratingAPI={{
                    getRatingStats,
                    submitRating,
                    getUserRating,
                  }}
                  starColor="blue-400"
                  size="md"
                  onRate={(rating, stats) =>
                    console.warn(
                      `Rated case ${caseData.publicId}: ${rating} stars. New average: ${stats.average_rating}`
                    )
                  }
                />
              </div>
            </div>
          </div>

          {relatedCases.length > 0 && (
            <div className="px-6 sm:px-8 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">More like this</h2>
                <button
                  className="text-sm text-blue-300 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1"
                  onClick={() => navigate('/cases')}
                >
                  View all
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedCases.slice(0, 3).map((c, idx) => (
                  <ContentCard
                    key={c.publicId}
                    href={`/cases/${c.publicId}`}
                    title={c.title}
                    excerpt={c.summary || c.incidentOverview}
                    date={c.incidentDate}
                    durationMinutes={c.durationMinutes}
                    tags={c.tags || []}
                    accentColor="blue"
                    animationDelay={idx * 60}
                    onTagClick={(tag) => navigate(`/cases?tags=${encodeURIComponent(tag)}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
