import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import { ContentCard } from './ContentCard';
import { Building2 } from 'lucide-react';

const meta: Meta<typeof ContentCard> = {
  title: 'Display/ContentCard',
  component: ContentCard,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-8 bg-surface-base min-h-screen max-w-md">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    accentColor: {
      control: 'select',
      options: ['violet', 'blue', 'green', 'red', 'yellow', 'teal'],
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'expanded'],
    },
    severity: {
      control: 'select',
      options: ['Critical', 'High', 'Medium', 'Low', undefined],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

// Default Card
export const Default: Story = {
  args: {
    href: '/blog/example-post',
    title: 'Getting Started with React 19',
    excerpt:
      'Learn about the new features in React 19 including concurrent rendering, automatic batching, and the new use() hook.',
    date: '2024-01-15',
    readTime: 8,
    tags: ['React', 'JavaScript', 'Frontend'],
  },
};

// Featured Card
export const Featured: Story = {
  args: {
    href: '/blog/featured-post',
    title: 'Building Scalable Applications',
    excerpt:
      'A comprehensive guide to building scalable web applications with modern architecture patterns.',
    date: '2024-01-10',
    readTime: 12,
    tags: ['Architecture', 'Scaling', 'Best Practices'],
    featured: true,
    accentColor: 'violet',
  },
};

// Card with Severity
export const WithSeverity: Story = {
  args: {
    href: '/cases/case-001',
    title: 'Network Connectivity Issue',
    excerpt: 'Critical network outage affecting production systems across multiple data centers.',
    date: '2024-01-20',
    durationMinutes: 45,
    severity: 'Critical',
    status: 'Resolved',
    metadata: 'Healthcare • Hospital Network',
    metadataIcon: <Building2 size={14} />,
    tags: ['Network', 'Infrastructure'],
    accentColor: 'red',
  },
};

// Card with Different Severities
export const SeverityVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <ContentCard
        href="/case/1"
        title="Critical Severity"
        excerpt="Critical issue requiring immediate attention."
        severity="Critical"
        tags={['Urgent']}
        accentColor="red"
      />
      <ContentCard
        href="/case/2"
        title="High Severity"
        excerpt="High priority issue that should be addressed soon."
        severity="High"
        tags={['Priority']}
        accentColor="yellow"
      />
      <ContentCard
        href="/case/3"
        title="Medium Severity"
        excerpt="Medium priority issue with moderate impact."
        severity="Medium"
        tags={['Normal']}
        accentColor="blue"
      />
      <ContentCard
        href="/case/4"
        title="Low Severity"
        excerpt="Low priority issue with minimal impact."
        severity="Low"
        tags={['Minor']}
        accentColor="green"
      />
    </div>
  ),
};

// Compact Variant
export const Compact: Story = {
  args: {
    href: '/blog/compact-post',
    title: 'Quick Tips for Developers',
    excerpt: 'Short and useful tips to improve your development workflow.',
    date: '2024-01-18',
    readTime: 3,
    variant: 'compact',
    tags: ['Tips'],
  },
};

// Expanded Variant
export const Expanded: Story = {
  args: {
    href: '/blog/expanded-post',
    title: 'Deep Dive into TypeScript',
    excerpt:
      'An in-depth exploration of TypeScript features including generics, utility types, and advanced patterns for building type-safe applications.',
    date: '2024-01-12',
    readTime: 20,
    variant: 'expanded',
    tags: ['TypeScript', 'JavaScript', 'Types', 'Advanced'],
    featured: true,
  },
};

// Loading State
export const Loading: Story = {
  args: {
    href: '/blog/loading',
    title: '',
    excerpt: '',
    isLoading: true,
  },
};

// With Progress
export const WithProgress: Story = {
  args: {
    href: '/blog/reading-progress',
    title: 'Article with Reading Progress',
    excerpt: 'This card shows reading progress as a bar at the top.',
    date: '2024-01-14',
    readTime: 10,
    progress: 65,
    tags: ['Reading', 'Progress'],
    accentColor: 'blue',
  },
};

// Color Variants
export const ColorVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      {(['violet', 'blue', 'green', 'red', 'yellow', 'teal'] as const).map((color) => (
        <ContentCard
          key={color}
          href={`/demo/${color}`}
          title={`${color.charAt(0).toUpperCase() + color.slice(1)} Accent`}
          excerpt={`Card with ${color} accent color on hover.`}
          accentColor={color}
          tags={[color]}
        />
      ))}
    </div>
  ),
};
