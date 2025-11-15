import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ContentCard } from './ContentCard';
import { BrowserRouter } from 'react-router-dom';
import { Wifi } from 'lucide-react';

const meta: Meta<typeof ContentCard> = {
  title: 'Components/ContentCard',
  component: ContentCard,
  decorators: [
    ((Story: StoryFn<typeof ContentCard>, context) => (
      <BrowserRouter>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {Story(context.args, context)}
        </div>
      </BrowserRouter>
    )),
  ],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    accentColor: {
      control: 'select',
      options: ['violet', 'blue', 'green', 'red', 'yellow'],
    },
    severity: {
      control: 'select',
      options: ['Critical', 'High', 'Medium', 'Low'],
    },
    onTagClick: { action: 'tag-clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Default: Story = {
  args: {
    href: '/example',
    title: 'Example Content Card',
    excerpt: 'This is a basic content card with a title and excerpt. It demonstrates the default styling and layout.',
    accentColor: 'violet',
  },
};

export const BlogPost: Story = {
  args: {
    href: '/blog/getting-started',
    title: 'Getting Started with Web Foundation',
    excerpt: 'Learn how to use the web foundation library to build modern, accessible React applications with pre-built components and design tokens.',
    date: '2024-01-15',
    readTime: 5,
    tags: ['React', 'TypeScript', 'Tutorial'],
    accentColor: 'blue',
  },
};

export const FeaturedBlogPost: Story = {
  args: {
    href: '/blog/featured-article',
    title: 'Advanced Component Patterns in React',
    excerpt: 'Explore advanced patterns for building scalable and maintainable React components using composition, render props, and custom hooks.',
    date: '2024-01-20',
    readTime: 12,
    tags: ['React', 'Advanced', 'Patterns'],
    featured: true,
    accentColor: 'violet',
  },
};

export const SecurityCase: Story = {
  args: {
    href: '/cases/critical-vulnerability',
    title: 'Critical Wi-Fi Security Vulnerability Discovered',
    excerpt: 'A critical vulnerability was discovered in enterprise Wi-Fi infrastructure affecting multiple Fortune 500 companies. Immediate patching recommended.',
    date: '2024-01-18',
    durationMinutes: 45,
    tags: ['WPA3', 'Enterprise', 'Vulnerability'],
    severity: 'Critical',
    status: 'Resolved',
    metadata: 'Enterprise • Financial Services',
    metadataIcon: <Wifi size={14} />,
    accentColor: 'red',
  },
};

export const MediumSeverityCase: Story = {
  args: {
    href: '/cases/medium-issue',
    title: 'Misconfigured Access Points in Retail Environment',
    excerpt: 'Investigation revealed improperly configured wireless access points allowing unauthorized guest network access to internal resources.',
    date: '2024-01-10',
    durationMinutes: 30,
    tags: ['Configuration', 'Retail', 'Access Control'],
    severity: 'Medium',
    status: 'In Progress',
    metadata: 'Retail • Small Business',
    metadataIcon: <Wifi size={14} />,
    accentColor: 'yellow',
  },
};

export const LowSeverityCase: Story = {
  args: {
    href: '/cases/low-priority',
    title: 'Outdated Firmware on Non-Critical Devices',
    excerpt: 'Routine scan identified several access points running outdated firmware. No active exploits known, but upgrade recommended.',
    date: '2024-01-05',
    durationMinutes: 15,
    tags: ['Firmware', 'Maintenance', 'Preventive'],
    severity: 'Low',
    status: 'Scheduled',
    metadata: 'Healthcare • Clinic',
    metadataIcon: <Wifi size={14} />,
    accentColor: 'green',
  },
};

export const WithClickableTags: Story = {
  args: {
    href: '/example/clickable-tags',
    title: 'Content with Interactive Tags',
    excerpt: 'This card demonstrates clickable tags for filtering. Click any tag to see the action logged.',
    tags: ['Interactive', 'Filtering', 'UI/UX'],
    accentColor: 'blue',
    onTagClick: (tag: string) => {
      console.log(`Tag clicked: ${tag}`);
    },
  },
};

export const MinimalCard: Story = {
  args: {
    href: '/minimal',
    title: 'Minimal Content Card',
    excerpt: 'A minimal card with just title and excerpt, no metadata or tags.',
    accentColor: 'violet',
  },
};

export const LongContent: Story = {
  args: {
    href: '/long-content',
    title: 'This is a Very Long Title That Might Wrap to Multiple Lines in the Card Layout',
    excerpt: 'This card demonstrates how the component handles very long content. The excerpt can be quite lengthy and the line-clamp utility will truncate it after three lines with an ellipsis. This ensures cards maintain consistent heights in grid layouts while still providing enough preview text for users to understand the content.',
    date: '2024-01-25',
    readTime: 20,
    tags: ['Long Form', 'Content Strategy', 'Writing', 'Best Practices', 'Documentation'],
    accentColor: 'violet',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      {(['violet', 'blue', 'green', 'red', 'yellow'] as const).map((color) => (
        <ContentCard
          key={color}
          href={`/variant/${color}`}
          title={`${color.charAt(0).toUpperCase() + color.slice(1)} Accent Color`}
          excerpt={`This card demonstrates the ${color} accent color variant with hover effects.`}
          date="2024-01-15"
          readTime={5}
          tags={['Example', 'Variant']}
          accentColor={color}
        />
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    href: '/blog/image-example',
    title: 'Content Card with Image',
    excerpt: 'This card includes an image thumbnail that appears above the content. The image is clickable and links to the same destination as the title.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    imageAlt: 'Developer working on laptop',
    date: '2024-01-20',
    readTime: 8,
    tags: ['Design', 'UX'],
    accentColor: 'blue',
  },
};

export const WithAuthor: Story = {
  args: {
    href: '/blog/author-example',
    title: 'Article with Author Information',
    excerpt: 'This card displays author information including name and avatar, perfect for multi-author blogs or team sites.',
    author: 'Kris Armstrong',
    authorAvatar: 'https://github.com/krisarmstrong.png',
    date: '2024-01-22',
    readTime: 6,
    tags: ['Tutorial', 'React'],
    accentColor: 'violet',
  },
};

export const CompactVariant: Story = {
  args: {
    href: '/compact-example',
    title: 'Compact Card Variant',
    excerpt: 'The compact variant displays content in a horizontal layout, perfect for sidebars or list views.',
    variant: 'compact',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    date: '2024-01-18',
    readTime: 3,
    tags: ['Quick Read'],
    accentColor: 'blue',
  },
};

export const ExpandedVariant: Story = {
  args: {
    href: '/expanded-example',
    title: 'Expanded Card Variant for Feature Articles',
    excerpt: 'The expanded variant provides more space and prominence for featured or important content. Great for hero sections or highlighting key articles.',
    variant: 'expanded',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop',
    author: 'Kris Armstrong',
    authorAvatar: 'https://github.com/krisarmstrong.png',
    date: '2024-01-25',
    readTime: 15,
    tags: ['In-Depth', 'Analysis', 'Featured'],
    featured: true,
    accentColor: 'violet',
  },
};

export const WithBookmarkAndShare: Story = {
  args: {
    href: '/interactive-example',
    title: 'Interactive Card with Bookmark and Share',
    excerpt: 'This card includes bookmark and share functionality. Click the bookmark icon to save for later, or share with others.',
    date: '2024-01-23',
    readTime: 7,
    tags: ['Interactive', 'Features'],
    accentColor: 'blue',
    onBookmark: () => console.log('Bookmark toggled'),
    onShare: () => console.log('Share clicked'),
  },
};

export const WithProgress: Story = {
  args: {
    href: '/progress-example',
    title: 'Article with Reading Progress',
    excerpt: 'The progress bar at the top shows how much of the article has been read. This is useful for tracking reading progress in longer content.',
    progress: 65,
    date: '2024-01-24',
    readTime: 12,
    tags: ['Long Form', 'Tutorial'],
    accentColor: 'violet',
  },
};

export const LoadingState: Story = {
  args: {
    href: '/loading',
    title: 'Loading Skeleton',
    excerpt: 'This will not be shown',
    isLoading: true,
    image: 'placeholder.jpg',
    accentColor: 'violet',
  },
};

export const FullyLoaded: Story = {
  args: {
    href: '/full-example',
    title: 'Fully Featured Content Card',
    excerpt: 'This card demonstrates all available features: image, author, progress, bookmarks, sharing, tags, and metadata. It showcases the complete capabilities of the ContentCard component.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    imageAlt: 'Code on screen',
    author: 'Kris Armstrong',
    authorAvatar: 'https://github.com/krisarmstrong.png',
    date: '2024-01-26',
    readTime: 10,
    tags: ['Comprehensive', 'Guide', 'Best Practices'],
    featured: true,
    metadata: 'Web Development • React',
    metadataIcon: <Wifi size={14} />,
    progress: 35,
    accentColor: 'violet',
    onBookmark: () => console.log('Bookmark toggled'),
    onShare: () => console.log('Share clicked'),
    onTagClick: (tag) => console.log(`Tag clicked: ${tag}`),
  },
};

export const CompactWithImage: Story = {
  args: {
    href: '/compact-image',
    title: 'Compact Layout with Image',
    excerpt: 'Compact variant with image creates an efficient horizontal layout perfect for news feeds or article lists.',
    variant: 'compact',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    author: 'Kris Armstrong',
    date: '2024-01-19',
    readTime: 4,
    tags: ['News', 'Update'],
    accentColor: 'blue',
    onBookmark: () => console.log('Bookmarked'),
  },
};
