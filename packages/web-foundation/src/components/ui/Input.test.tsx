import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TextInput, SearchInput } from './Input';
import { useState } from 'react';

// ============================================================================
// TextInput Tests
// ============================================================================

describe('TextInput', () => {
  it('renders the input and allows typing', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <TextInput
          placeholder="Enter text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();

    await user.type(input, 'Hello, world!');
    expect(input).toHaveValue('Hello, world!');
  });

  it('renders with a label', () => {
    const TestComponent = () => {
      return (
        <TextInput
          label="Username"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-sm', 'font-medium', 'text-gray-300');
  });

  it('generates id from label if not provided', () => {
    const TestComponent = () => {
      return (
        <TextInput
          label="User Name"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'user-name');
  });

  it('uses provided id over label-generated id', () => {
    const TestComponent = () => {
      return (
        <TextInput
          id="custom-id"
          label="Username"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('displays error message and applies error styling', () => {
    const TestComponent = () => {
      return (
        <TextInput
          placeholder="Enter text"
          value=""
          onChange={() => {}}
          error="This field is required"
        />
      );
    };

    render(<TestComponent />);
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-400');

    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toHaveClass('border-red-500');
  });

  it('does not display error message when not provided', () => {
    const TestComponent = () => {
      return (
        <TextInput
          placeholder="Enter text"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toHaveClass('border-gray-600');
  });

  it('applies disabled state styling', () => {
    const TestComponent = () => {
      return (
        <TextInput
          placeholder="Enter text"
          value=""
          onChange={() => {}}
          disabled
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('respects placeholder text', () => {
    const TestComponent = () => {
      return (
        <TextInput
          placeholder="Enter your email"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('handles different input types via props spread', () => {
    const TestComponent = () => {
      return (
        <TextInput
          type="email"
          placeholder="email@example.com"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText('email@example.com');
    // The type prop is spread and overrides the hardcoded text type
    expect(input).toHaveAttribute('type', 'email');
  });

  it('calls onChange handler when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <TextInput
          placeholder="Type here"
          value={value}
          onChange={(e) => {
            handleChange(e);
            setValue(e.target.value);
          }}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText(/type here/i);

    await user.type(input, 'A');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('respects controlled value prop', () => {
    const TestComponent = () => {
      return (
        <TextInput
          placeholder="Controlled input"
          value="Initial value"
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Controlled input');
    expect(input).toHaveValue('Initial value');
  });

  it('applies variant color to focus ring', () => {
    const testVariants = ['violet', 'blue', 'green', 'red', 'yellow', 'gray'] as const;

    testVariants.forEach((variant) => {
      const { unmount } = render(
        <TextInput
          placeholder="Test"
          value=""
          onChange={() => {}}
          variant={variant}
        />
      );

      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass(`focus:ring-${variant}-500`);

      unmount();
    });
  });

  it('applies default blue variant when not specified', () => {
    render(
      <TextInput
        placeholder="Test"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('focus:ring-blue-500');
  });

  it('applies custom className', () => {
    render(
      <TextInput
        placeholder="Test"
        value=""
        onChange={() => {}}
        className="custom-class"
      />
    );

    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('custom-class');
  });

  it('spreads additional props to the input element', () => {
    render(
      <TextInput
        placeholder="Test"
        value=""
        onChange={() => {}}
        data-testid="custom-testid"
        maxLength={50}
      />
    );

    const input = screen.getByTestId('custom-testid');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('renders without label when not provided', () => {
    render(
      <TextInput
        placeholder="Test"
        value=""
        onChange={() => {}}
      />
    );

    const labels = screen.queryAllByRole('label');
    expect(labels).toHaveLength(0);
  });

  it('has required base styling classes', () => {
    render(
      <TextInput
        placeholder="Test"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass(
      'w-full',
      'bg-gray-700',
      'border',
      'border-gray-600',
      'text-gray-200',
      'px-4',
      'py-3',
      'rounded-md',
      'shadow-sm',
      'focus:outline-none',
      'focus:ring-2',
      'placeholder-gray-400',
      'text-base'
    );
  });
});

// ============================================================================
// SearchInput Tests
// ============================================================================

describe('SearchInput', () => {
  it('renders the search input and allows typing', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');

    await user.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('renders with default search placeholder', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('overrides default placeholder with custom placeholder', () => {
    render(
      <SearchInput
        placeholder="Find something..."
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Find something...');
    expect(input).toBeInTheDocument();
  });

  it('renders with a label', () => {
    const TestComponent = () => {
      return (
        <SearchInput
          label="Search products"
          value=""
          onChange={() => {}}
        />
      );
    };

    render(<TestComponent />);
    const label = screen.getByText('Search products');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-sm', 'font-medium', 'text-gray-300');
  });

  it('generates id from search-input when no label provided', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('id', 'search-input');
  });

  it('uses provided id over default id', () => {
    render(
      <SearchInput
        id="custom-search"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('id', 'custom-search');
  });

  it('applies disabled state styling', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('respects controlled value prop', () => {
    render(
      <SearchInput
        value="existing search"
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('existing search');
  });

  it('calls onChange handler when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          value={value}
          onChange={(e) => {
            handleChange(e);
            setValue(e.target.value);
          }}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByRole('searchbox');

    await user.type(input, 'search term');
    expect(handleChange).toHaveBeenCalledTimes(11); // One call per character
  });

  it('applies variant color to focus ring', () => {
    const testVariants = ['violet', 'blue', 'green', 'red', 'yellow', 'gray'] as const;

    testVariants.forEach((variant) => {
      const { unmount } = render(
        <SearchInput
          value=""
          onChange={() => {}}
          variant={variant}
        />
      );

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass(`focus:ring-${variant}-500`);

      unmount();
    });
  });

  it('applies default blue variant when not specified', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveClass('focus:ring-blue-500');
  });

  it('applies custom className', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        className="custom-search-class"
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveClass('custom-search-class');
  });

  it('spreads additional props to the input element', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        data-testid="search-box"
        maxLength={100}
      />
    );

    const input = screen.getByTestId('search-box');
    expect(input).toHaveAttribute('maxLength', '100');
  });

  it('renders without label when not provided', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
      />
    );

    const labels = screen.queryAllByRole('label');
    expect(labels).toHaveLength(0);
  });

  it('has required base styling classes', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveClass(
      'w-full',
      'bg-gray-700',
      'border',
      'border-gray-600',
      'text-gray-200',
      'px-4',
      'py-3',
      'rounded-md',
      'shadow-sm',
      'focus:outline-none',
      'focus:ring-2',
      'placeholder-gray-400',
      'text-base'
    );
  });

  it('has correct input type of search', () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('type', 'search');
  });
});
