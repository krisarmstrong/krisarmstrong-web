/**
 * Web Vitals monitoring for performance tracking
 * Tracks Core Web Vitals: LCP, INP, CLS, FCP, TTFB
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

interface NetworkInformation {
  effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

function getConnectionSpeed(): string {
  const nav = navigator as NavigatorWithConnection;
  return 'connection' in nav &&
    nav.connection &&
    'effectiveType' in nav.connection
    ? nav.connection.effectiveType || ''
    : '';
}

/**
 * Send analytics data to endpoint
 * @param metric - Web Vitals metric object
 */
function sendToAnalytics(metric: Metric): void {
  const analyticsId = import.meta.env.VITE_ANALYTICS_ID;

  // Only send in production if analytics ID is configured
  if (!analyticsId || import.meta.env.DEV) {
    console.log('[Web Vitals]', metric.name, metric.value, metric.rating);
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
  }
}

/**
 * Report Web Vitals metrics
 * @param onPerfEntry - Optional callback for each metric
 */
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void): void {
  const reportMetric = onPerfEntry || sendToAnalytics;

  // Core Web Vitals
  onCLS(reportMetric);  // Cumulative Layout Shift
  onINP(reportMetric);  // Interaction to Next Paint (replaces FID)
  onLCP(reportMetric);  // Largest Contentful Paint

  // Other important metrics
  onFCP(reportMetric);  // First Contentful Paint
  onTTFB(reportMetric); // Time to First Byte
}

/**
 * Get Web Vitals thresholds for scoring
 */
export const webVitalsThresholds = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint (ms)
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint (ms)
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift (score)
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte (ms)
} as const;

type MetricName = keyof typeof webVitalsThresholds;
type Rating = 'good' | 'needs-improvement' | 'poor' | 'unknown';

/**
 * Rate a Web Vital metric
 * @param name - Metric name
 * @param value - Metric value
 * @returns Rating: 'good', 'needs-improvement', or 'poor'
 */
export function rateMetric(name: string, value: number): Rating {
  const threshold = webVitalsThresholds[name as MetricName];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}
