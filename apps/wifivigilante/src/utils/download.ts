// src/utils/download.ts
import jsPDF from 'jspdf';

interface RawCaseForDownload {
  title?: string;
  sectors?: { name?: string };
  subsectors?: { name?: string };
  tool?: string | null;
  location?: string | null;
  category?: string | null;
  incident_date?: string;
  tags?: string[] | string;
  incident_overview?: string;
  investigation_breakdown?: string | null;
  root_cause?: string | null;
  resolution?: string | null;
  verdict?: string | null;
  summary?: string | null;
  detected_by?: string | null;
  severity?: string;
  status?: string;
  impact_scope?: string | null;
  duration_minutes?: number | null;
  validated_by?: string | null;
  public_id?: string;
  id?: string | number;
  case_id?: string;
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    // eslint-disable-next-line security/detect-object-injection
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

let loadedFontData: string | null = null;
let fontLoadingPromise: Promise<{ base64Font: string; fontNameVFS: string }> | null = null;

// Function to load the font
async function getFontData(
  fontPath: string = '/assets/fonts/NotoSans-Regular.ttf',
  fontNameVFS: string = 'NotoSans-Regular.ttf'
): Promise<{ base64Font: string; fontNameVFS: string }> {
  if (loadedFontData) {
    return { base64Font: loadedFontData, fontNameVFS };
  }
  if (fontLoadingPromise) {
    return fontLoadingPromise;
  }
  fontLoadingPromise = (async () => {
    try {
      const response = await fetch(fontPath);
      if (!response.ok) throw new Error(`Failed to fetch font: ${response.status} ${response.statusText}`);
      const fontBuffer = await response.arrayBuffer();
      loadedFontData = arrayBufferToBase64(fontBuffer);
      return { base64Font: loadedFontData, fontNameVFS };
    } catch (error) {
      console.error("Error loading font:", error);
      loadedFontData = null;
      fontLoadingPromise = null;
      throw error;
    }
  })();
  return fontLoadingPromise;
}

/**
 * Generates Markdown content for a given case, aligned with the new schema.
 * @param caseData - The case data object. Expects fields like title,
 * sectors: {name}, subsectors: {name}, tool, location, category, incident_date, tags (array),
 * incident_overview, investigation_breakdown, root_cause, resolution, verdict, summary, etc.
 * @returns The Markdown formatted string.
 */
export function generateMarkdownContent(caseData: RawCaseForDownload): string {
  if (!caseData) return "";

  const getField = (value: string | null | undefined, fallback: string = "N/A"): string => value || fallback;

  const tagsString = (Array.isArray(caseData.tags) && caseData.tags.length > 0)
                   ? caseData.tags.map(t => `#${t.replace(/^#/, '')}`).join("  ") // Ensure # prefix
                   : "N/A";

  let md = `# ${getField(caseData.title, "Untitled Case")}\n\n`;
  md += `**Sector**: ${getField(caseData.sectors?.name)}\n`; // From related table
  if (caseData.subsectors?.name) { // Only show subsector if it exists
    md += `**Subsector**: ${getField(caseData.subsectors.name)}\n`;
  }
  md += `**Tool**: ${getField(caseData.tool)}\n`;
  md += `**Location**: ${getField(caseData.location)}\n`;
  md += `**Category**: ${getField(caseData.category)}\n`;
  md += `**Incident Date**: ${caseData.incident_date ? new Date(caseData.incident_date).toLocaleDateString() : "N/A"}\n`;
  md += `**Tags**: ${tagsString}\n\n---\n\n`;

  md += `## 📝 Incident Overview\n${getField(caseData.incident_overview)}\n\n`;
  md += `## 🔍 Investigation Breakdown\n${getField(caseData.investigation_breakdown)}\n\n`;
  md += `## 🎯 Identified Root Cause\n${getField(caseData.root_cause)}\n\n`;
  md += `## 🛠️ Resolution Applied\n${getField(caseData.resolution)}\n\n`;

  md += `## 📄 Case Verdict & Summary\n`;
  if (caseData.verdict) md += `**Verdict:** ${caseData.verdict}\n\n`;
  if (caseData.summary) md += `**Overall Summary:** ${caseData.summary}\n\n`; // Changed label slightly
  if (!caseData.verdict && !caseData.summary) md += `_No verdict or summary provided._\n\n`;

  md += `## 📊 Operational Context & Impact\n`;
  md += `**Detected By:** ${getField(caseData.detected_by)}\n`;
  md += `**Severity:** ${getField(caseData.severity)}\n`;
  md += `**Status:** ${getField(caseData.status)}\n`;
  md += `**Impact Scope:** ${getField(caseData.impact_scope)}\n`;
  md += `**Duration:** ${caseData.duration_minutes ? `${caseData.duration_minutes} minutes` : "N/A"}\n`;
  md += `**Validated By:** ${getField(caseData.validated_by)}\n`;

  return md.replace(/\n\n\n/g, '\n\n'); // Clean up excessive newlines
}

/**
 * Triggers a file download in the browser.
 */
export function downloadFile(content: string, filename: string, type: string): void {
  try {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading file:", error);
    alert("Sorry, the file could not be downloaded at this time.");
  }
}

/**
 * Generates and downloads a PDF for the given case data, aligned with the new schema.
 * @param caseData - The case data object.
 */
export async function generateAndDownloadPdf(caseData: RawCaseForDownload): Promise<void> {
  if (!caseData) {
    console.warn("generateAndDownloadPdf: No caseData provided.");
    return;
  }

  const FONT_NAME_IN_PDF = "NotoSansCustom";
  const FONT_FILENAME_VFS = "NotoSans-Regular.ttf";
  const FONT_PATH_PUBLIC = '/assets/fonts/NotoSans-Regular.ttf';

  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  let fontName = "helvetica"; // Default fallback font

  try {
    const { base64Font, fontNameVFS: actualFontNameVFS } = await getFontData(FONT_PATH_PUBLIC, FONT_FILENAME_VFS);
    doc.addFileToVFS(actualFontNameVFS, base64Font);
    doc.addFont(actualFontNameVFS, FONT_NAME_IN_PDF, 'normal');
    // If you add bold/italic TTF files for Noto Sans, register them here:
    // doc.addFileToVFS('NotoSans-Bold.ttf', base64FontBold);
    // doc.addFont('NotoSans-Bold.ttf', FONT_NAME_IN_PDF, 'bold');
    fontName = FONT_NAME_IN_PDF;
  } catch (fontError) {
    console.warn("Failed to load custom font, using default helvetica:", fontError);
    // Continue with default font
  }

  try {
    doc.setFont(fontName);

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    const getLineHeight = (fontSize: number, factor: number = 1.3): number => fontSize * factor;

    const COLOR_TITLE = "var(--theme-text-primary)";
    const COLOR_SECTION_TITLE = "var(--theme-surface-raised)";
    const COLOR_CONTENT_TEXT = "var(--theme-surface-border)";
    const COLOR_LABEL = "var(--theme-text-muted)";    const COLOR_METADATA_VALUE = COLOR_CONTENT_TEXT; // Fixed typo: Text → TEXT

    const checkAndAddPage = (neededHeight: number = 20): void => {
      if (yPos + neededHeight > pageHeight - margin - 20) {
        doc.addPage();
        yPos = margin;
        doc.setFont(fontName); // Re-set font on new page
      }
    };

    // === Case Title ===
    yPos += 10;
    let fontSize = 20;
    doc.setFontSize(fontSize);
    // doc.setFont(FONT_NAME_IN_PDF, "bold"); // Uncomment if bold NotoSans is embedded and preferred
    doc.setTextColor(COLOR_TITLE);
    let titleLines = doc.splitTextToSize(caseData.title || "Title Not Available", contentWidth);
    checkAndAddPage(titleLines.length * getLineHeight(fontSize));
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * getLineHeight(fontSize) + 15;

    // === Metadata ===
    fontSize = 9;
    doc.setFontSize(fontSize);
    const metaLineHeight = getLineHeight(fontSize);

    const addMetaLinePdf = (label: string, value: string | number | null | undefined): void => {
      if (value || typeof value === 'number') {
        const labelText = `${label}: `;
        const valueText = String(value);
        const fullText = labelText + valueText; // For height estimation
        const linesForHeight = doc.splitTextToSize(fullText, contentWidth);
        checkAndAddPage(linesForHeight.length * metaLineHeight + 6); // +6 for spacing after

        doc.setTextColor(COLOR_LABEL);
        doc.text(labelText, margin, yPos);

        const labelWidth = doc.getTextWidth(labelText);
        doc.setTextColor(COLOR_METADATA_VALUE);
        const valueLines = doc.splitTextToSize(valueText, contentWidth - labelWidth - 5); // -5 for a small gap
        doc.text(valueLines, margin + labelWidth, yPos);

        yPos += Math.max(linesForHeight.length, valueLines.length) * metaLineHeight + 6;
      }
    };

    addMetaLinePdf("Sector", caseData.sectors?.name);
    if (caseData.subsectors?.name) { // Only show subsector if it exists
        addMetaLinePdf("Subsector", caseData.subsectors.name);
    }
    addMetaLinePdf("Tool", caseData.tool);
    addMetaLinePdf("Location", caseData.location);
    addMetaLinePdf("Category", caseData.category);
    addMetaLinePdf("Incident Date", caseData.incident_date ? new Date(caseData.incident_date).toLocaleDateString() : null);
    if (Array.isArray(caseData.tags) && caseData.tags.length > 0) {
      addMetaLinePdf("Tags", caseData.tags.map(t => `#${t.replace(/^#/, '')}`).join("  "));
    }
    yPos += 20;

    // === Content Sections ===
    const addContentSectionPdf = (title: string, content: string | null | undefined): void => {
      const sectionTitleFontSize = 14;
      const sectionTitleLineHeight = getLineHeight(sectionTitleFontSize);
      const contentFontSize = 10;
      const contentLineHeight = getLineHeight(contentFontSize);

      checkAndAddPage(sectionTitleLineHeight + 10 + contentLineHeight);
      // doc.setFont(FONT_NAME_IN_PDF, "bold"); // Uncomment if bold NotoSans is embedded
      doc.setFontSize(sectionTitleFontSize);
      doc.setTextColor(COLOR_SECTION_TITLE);
      doc.text(title, margin, yPos); // Plain text title
      yPos += sectionTitleLineHeight + 8;

      doc.setFont(fontName, "normal");
      doc.setFontSize(contentFontSize);
      doc.setTextColor(COLOR_CONTENT_TEXT);

      const textToDraw = String(content || "N/A").trim() || "N/A";
      const contentLines = doc.splitTextToSize(textToDraw, contentWidth);
      checkAndAddPage(contentLines.length * contentLineHeight + 20);
      doc.text(contentLines, margin, yPos);
      yPos += contentLines.length * contentLineHeight + 20;
    };

    // Using new schema field names and section titles matching CaseDisplay
    addContentSectionPdf("Incident Overview", caseData.incident_overview);
    addContentSectionPdf("Investigation Breakdown", caseData.investigation_breakdown);
    addContentSectionPdf("Identified Root Cause", caseData.root_cause);
    addContentSectionPdf("Resolution Applied", caseData.resolution);

    // For Verdict & Summary
    let verdictSummaryContent: string[] = [];
    if (caseData.verdict) verdictSummaryContent.push(`Verdict: ${caseData.verdict}`);
    if (caseData.summary) verdictSummaryContent.push(`Overall Summary: ${caseData.summary}`);
    addContentSectionPdf("Case Verdict & Summary", verdictSummaryContent.length > 0 ? verdictSummaryContent.join("\n\n") : "N/A");

    // Operational Context & Impact
    checkAndAddPage(getLineHeight(14) + 8 + (6 * getLineHeight(9))); // Title + approx 6 lines
    // doc.setFont(fontName, "bold"); // Uncomment if bold NotoSans is embedded
    doc.setFontSize(14); // Section title size
    doc.setTextColor(COLOR_SECTION_TITLE);
    doc.text("Operational Context & Impact", margin, yPos);
    yPos += getLineHeight(14) + 8;
    doc.setFontSize(9); // Detail font size

    const addOpDetailPdf = (label: string, value: string | number | null | undefined): void => {
        if(value || typeof value === 'number') {
            const text = `${label}: `;
            const valStr = String(value);
            checkAndAddPage(getLineHeight(9) + 4);
            doc.setTextColor(COLOR_LABEL);
            doc.text(text, margin, yPos);
            const labelW = doc.getTextWidth(text);
            doc.setTextColor(COLOR_CONTENT_TEXT);
            doc.text(valStr, margin + labelW, yPos);
            yPos += getLineHeight(9) + 4;
        }
    };
    addOpDetailPdf("Detected By", caseData.detected_by);
    addOpDetailPdf("Severity", caseData.severity);
    addOpDetailPdf("Status", caseData.status);
    addOpDetailPdf("Impact Scope", caseData.impact_scope);
    addOpDetailPdf("Duration", caseData.duration_minutes ? `${caseData.duration_minutes} minutes` : null);
    addOpDetailPdf("Validated By", caseData.validated_by);

    const fileId = caseData.public_id || caseData.id || caseData.case_id || 'case'; // Prefer public_id
    doc.save(`${fileId}_${new Date().toISOString().slice(0,10)}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Sorry, the PDF could not be generated. Please ensure the font file is correctly placed in public/assets/fonts/ and accessible. Check console for details.");
  }
}
