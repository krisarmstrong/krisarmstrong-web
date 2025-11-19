import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './Input';
import { useState } from 'react';

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
});
