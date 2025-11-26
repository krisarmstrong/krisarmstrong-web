import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Resume from '../src/pages/Resume';

// Mock markdown content with various formatting to test all DOCX conversion branches
const mockResume = `# Kris Armstrong
## Senior Sales Engineer

<div class="contact-info">
  <p>Contact details here</p>
</div>

### Experience
- **Company A** (2020-2024)
  - Led enterprise sales
* **Company B** (2015-2020)
  - Network architecture

---

### Skills
- Network Engineering
- Cybersecurity

Regular paragraph text with **bold** and [link](https://example.com).

# Another H1 Heading
Some more content here.`;

// Mock fetch
global.fetch = vi.fn();

// Mock window.print
global.print = vi.fn();

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

// Mock docx
vi.mock('docx', () => {
  class MockDocument {
    constructor() {}
  }
  class MockParagraph {
    constructor(options: unknown) {
      return options;
    }
  }
  class MockTextRun {
    constructor(text: unknown) {
      return { text };
    }
  }
  return {
    Document: MockDocument,
    Packer: {
      toBlob: vi.fn(() => Promise.resolve(new Blob(['mock docx content']))),
    },
    Paragraph: MockParagraph,
    TextRun: MockTextRun,
    HeadingLevel: {
      HEADING_1: 'HEADING_1',
      HEADING_2: 'HEADING_2',
      HEADING_3: 'HEADING_3',
    },
  };
});

describe('Resume', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    (global.fetch as unknown as { mockResolvedValue: (val: unknown) => void }).mockResolvedValue({
      ok: true,
      text: async () => mockResume,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading spinner while fetching resume', async () => {
    render(<Resume />);

    // Check for loading spinner with animate-spin class
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    await waitFor(() => {
      // Loading spinner should be removed once content loads
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  it('loads and displays resume content', async () => {
    render(<Resume />);

    await waitFor(() => {
      expect(screen.getByText(/Kris Armstrong/i)).toBeInTheDocument();
      expect(screen.getByText(/Senior Sales Engineer/i)).toBeInTheDocument();
    });
  });

  it('displays all three download buttons', async () => {
    render(<Resume />);

    await waitFor(() => {
      expect(screen.getByText(/Print \/ Save as PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/Download Word/i)).toBeInTheDocument();
      expect(screen.getByText(/Download Markdown/i)).toBeInTheDocument();
    });
  });

  it('opens print dialog when PDF button is clicked', async () => {
    render(<Resume />);

    await waitFor(() => {
      expect(screen.getByText(/Print \/ Save as PDF/i)).toBeInTheDocument();
    });

    const pdfButton = screen.getByText(/Print \/ Save as PDF/i);
    fireEvent.click(pdfButton);

    expect(global.print).toHaveBeenCalled();
  });

  it('downloads markdown file when MD button is clicked', async () => {
    const { saveAs } = await import('file-saver');

    render(<Resume />);

    await waitFor(() => {
      expect(screen.getByText(/Download Markdown/i)).toBeInTheDocument();
    });

    const mdButton = screen.getByText(/Download Markdown/i);
    fireEvent.click(mdButton);

    await waitFor(() => {
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'kris_armstrong_resume.md');
    });
  });

  it('downloads DOCX file when Word button is clicked', async () => {
    const { saveAs } = await import('file-saver');
    const { Packer } = await import('docx');

    render(<Resume />);

    await waitFor(() => {
      expect(screen.getByText(/Download Word/i)).toBeInTheDocument();
    });

    const docxButton = screen.getByText(/Download Word/i);
    fireEvent.click(docxButton);

    await waitFor(() => {
      expect(Packer.toBlob).toHaveBeenCalled();
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'kris_armstrong_resume.docx');
    });
  });

  it('displays LinkedIn and GitHub links', async () => {
    render(<Resume />);

    await waitFor(() => {
      const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
      const githubLink = screen.getByRole('link', { name: /github/i });

      expect(linkedInLink).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/kris-armstrong-cissp/'
      );
      expect(githubLink).toHaveAttribute('href', 'https://github.com/krisarmstrong');
    });
  });

  it('handles fetch error gracefully', async () => {
    (
      global.fetch as unknown as { mockRejectedValueOnce: (val: unknown) => void }
    ).mockRejectedValueOnce(new Error('Network error'));

    render(<Resume />);

    // Should stop loading even if fetch fails
    await waitFor(
      () => {
        const spinner = document.querySelector('.animate-spin');
        // After error, spinner should be gone
        expect(spinner).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('renders resume with proper markdown formatting', async () => {
    render(<Resume />);

    await waitFor(() => {
      // Check for headings
      expect(screen.getByText(/Kris Armstrong/i)).toBeInTheDocument();
      expect(screen.getByText(/Senior Sales Engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/Experience/i)).toBeInTheDocument();
      expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    });
  });
});
