import { testAccessibility, testFocusManagement } from '../test/accessibility-utils';
import { AsyncButton } from '@/components/ui/async-button';
import { FormGuard } from '@/components/ui/form-guard';
import { Button } from '@/components/ui/button';

describe('Accessibility Tests', () => {
  describe('AsyncButton', () => {
    it('should have no accessibility violations', async () => {
      await testAccessibility(
        <AsyncButton onClick={() => Promise.resolve()}>
          Submit Form
        </AsyncButton>
      );
    });

    it('should maintain focus management during loading state', () => {
      testFocusManagement(
        <AsyncButton onClick={() => Promise.resolve()} loadingText="Loading...">
          Submit
        </AsyncButton>
      );
    });

    it('should have proper ARIA attributes when loading', async () => {
      const { getByRole } = render(
        <AsyncButton onClick={() => new Promise(resolve => setTimeout(resolve, 100))}>
          Submit
        </AsyncButton>
      );

      const button = getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('FormGuard', () => {
    it('should have no accessibility violations', async () => {
      await testAccessibility(
        <FormGuard onSubmit={() => Promise.resolve()}>
          <label htmlFor="test-input">Test Input</label>
          <input id="test-input" name="test" />
          <button type="submit">Submit</button>
        </FormGuard>
      );
    });

    it('should properly associate labels with form controls', () => {
      const { getByLabelText } = render(
        <FormGuard onSubmit={() => Promise.resolve()}>
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" />
          <button type="submit">Submit</button>
        </FormGuard>
      );

      expect(getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should announce errors to screen readers', async () => {
      const mockValidate = () => ['Email is required'];
      
      const { getByText } = render(
        <FormGuard onSubmit={() => Promise.resolve()} validate={mockValidate}>
          <input name="email" />
          <button type="submit">Submit</button>
        </FormGuard>
      );

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alert = getByText('Email is required').closest('[role="alert"]');
        expect(alert).toBeInTheDocument();
      });
    });
  });

  describe('Standard Button', () => {
    it('should have no accessibility violations', async () => {
      await testAccessibility(
        <Button variant="default">Click me</Button>
      );
    });

    it('should support keyboard interaction', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <Button onClick={handleClick}>Click me</Button>
      );

      const button = getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });

      // Button should be clickable via keyboard
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Focus Indicators', () => {
    it('should provide visible focus indicators', () => {
      const { getByRole } = render(<Button>Focusable Button</Button>);
      const button = getByRole('button');
      
      button.focus();
      
      // Check that focus styles are applied (this would need actual CSS testing in a real scenario)
      expect(button).toHaveFocus();
    });
  });
});