import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LoadingSpinner,
  LoadingCard,
  LoadingPage,
  Skeleton,
  SkeletonText,
  SkeletonCard,
} from './Loading';

const meta: Meta = {
  title: 'Feedback/Loading',
  decorators: [
    (Story) => (
      <div className="p-8 bg-surface-base min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Loading Spinner
export const Spinner: StoryObj<typeof LoadingSpinner> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="flex items-center gap-8">
          <LoadingSpinner size={24} />
          <LoadingSpinner size={32} />
          <LoadingSpinner size={48} />
          <LoadingSpinner size={64} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Color Variants</h3>
        <div className="flex items-center gap-8">
          <LoadingSpinner variant="violet" />
          <LoadingSpinner variant="blue" />
          <LoadingSpinner variant="green" />
          <LoadingSpinner variant="red" />
          <LoadingSpinner variant="yellow" />
          <LoadingSpinner variant="gray" />
        </div>
      </div>
    </div>
  ),
};

// Loading Card
export const Card: StoryObj<typeof LoadingCard> = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <LoadingCard message="Loading content..." />
      <LoadingCard message="Fetching data..." variant="violet" />
      <LoadingCard message="Please wait..." variant="green" />
    </div>
  ),
};

// Loading Page
export const Page: StoryObj<typeof LoadingPage> = {
  render: () => (
    <div className="h-96">
      <LoadingPage message="Loading page content..." variant="blue" />
    </div>
  ),
};

// Skeleton Components
export const Skeletons: StoryObj = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Skeleton</h3>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Skeleton Text (3 lines)</h3>
        <SkeletonText lines={3} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Skeleton Text (5 lines)</h3>
        <SkeletonText lines={5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Skeleton Card</h3>
        <SkeletonCard />
      </div>
    </div>
  ),
};

// Custom Skeleton Layout
export const CustomSkeletonLayout: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <div className="rounded-lg border border-surface-border bg-surface-raised p-4">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-lg mb-4" />
        <SkeletonText lines={2} />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  ),
};
