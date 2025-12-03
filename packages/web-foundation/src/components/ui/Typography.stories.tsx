import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import {
  H1,
  H2,
  ArticleTitle,
  SubSectionTitle,
  CardTitle,
  P,
  SmallText,
  MutedText,
  Tag,
  Badge,
  AccentLink,
} from './Typography';
import { Star, Zap, Shield } from 'lucide-react';

const meta: Meta = {
  title: 'UI/Typography',
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-8 bg-surface-base min-h-screen">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;

// H1 Stories
export const Heading1: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <H1>Default Heading 1</H1>
      <H1 icon={<Star className="w-8 h-8" />}>H1 with Icon</H1>
      <H1 accentColorClass="text-violet-400">Accent Color H1</H1>
    </div>
  ),
};

// H2 Stories
export const Heading2: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <H2>Default Heading 2</H2>
      <H2 icon={<Zap className="w-6 h-6" />}>H2 with Icon</H2>
      <H2 accentColorClass="text-blue-400">Accent Color H2</H2>
    </div>
  ),
};

// Article and Section Titles
export const Titles: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <ArticleTitle>Article Title</ArticleTitle>
      <SubSectionTitle>Sub Section Title</SubSectionTitle>
      <SubSectionTitle icon={<Shield className="w-5 h-5" />}>Sub Section with Icon</SubSectionTitle>
      <CardTitle>Card Title</CardTitle>
    </div>
  ),
};

// Paragraph Stories
export const Paragraphs: StoryObj = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <P>
        Default paragraph with muted color and relaxed leading. This demonstrates the standard text
        styling used throughout the application.
      </P>
      <P color="primary">Primary color paragraph for emphasis.</P>
      <P color="accent">Accent color paragraph for special callouts.</P>
      <P size="sm" leading="normal">
        Small paragraph with normal leading. Useful for captions and secondary content.
      </P>
    </div>
  ),
};

// Small and Muted Text
export const SmallAndMuted: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <SmallText>Default small text (muted)</SmallText>
      <SmallText color="primary">Primary small text</SmallText>
      <SmallText color="accent">Accent small text</SmallText>
      <MutedText>Muted text component</MutedText>
    </div>
  ),
};

// Tags
export const Tags: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>Primary Tag</Tag>
      <Tag colorScheme="success">Success Tag</Tag>
      <Tag colorScheme="warning">Warning Tag</Tag>
      <Tag colorScheme="error">Error Tag</Tag>
      <Tag colorScheme="info">Info Tag</Tag>
    </div>
  ),
};

// Badges
export const Badges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// Accent Link
export const AccentLinks: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <AccentLink to="/about">Simple Accent Link</AccentLink>
      <br />
      <AccentLink to="/services" iconRight={<Zap className="w-4 h-4" />}>
        Link with Right Icon
      </AccentLink>
      <br />
      <AccentLink to="/contact" iconLeft={<Star className="w-4 h-4" />}>
        Link with Left Icon
      </AccentLink>
    </div>
  ),
};
