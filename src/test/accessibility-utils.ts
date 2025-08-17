import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test utility to wrap components with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };

// Accessibility test helper
export const runAxeTest = async (container: Element) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Common accessibility tests
export const testAccessibility = async (component: React.ReactElement) => {
  const { container } = customRender(component);
  await runAxeTest(container);
};

// Focus management tests
export const testFocusManagement = (component: React.ReactElement) => {
  const { container } = customRender(component);
  
  // Test that interactive elements are focusable
  const interactiveElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  interactiveElements.forEach(element => {
    expect(element).not.toHaveAttribute('tabindex', '-1');
  });
};

// Color contrast helper (requires manual verification)
export const checkColorContrast = (element: Element) => {
  const styles = window.getComputedStyle(element);
  const bgColor = styles.backgroundColor;
  const textColor = styles.color;
  
  // Log for manual verification - automated contrast checking needs additional tools
  console.log('Element contrast check:', {
    element: element.tagName,
    backgroundColor: bgColor,
    textColor: textColor,
    text: element.textContent?.slice(0, 50)
  });
};