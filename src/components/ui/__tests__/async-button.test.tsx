import { render, screen, fireEvent } from '@testing-library/react'
import { AsyncButton } from '../async-button'
import { vi } from 'vitest'

describe('AsyncButton', () => {
  it('renders children when not loading', () => {
    render(<AsyncButton onClick={() => {}}>Click me</AsyncButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('shows loading state with spinner', () => {
    render(<AsyncButton loading loadingText="Saving..." onClick={() => {}}>Save</AsyncButton>)
    
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument()
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })

  it('is disabled when loading', () => {
    render(<AsyncButton loading onClick={() => {}}>Submit</AsyncButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('is disabled when explicitly disabled', () => {
    render(<AsyncButton disabled onClick={() => {}}>Submit</AsyncButton>)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders with icon when provided', () => {
    const icon = <span data-testid="test-icon">🔍</span>
    render(<AsyncButton icon={icon} onClick={() => {}}>Search</AsyncButton>)
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('handles click events when not loading', () => {
    const handleClick = vi.fn()
    render(<AsyncButton onClick={handleClick}>Click me</AsyncButton>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click events when loading', () => {
    const handleClick = vi.fn()
    render(<AsyncButton loading onClick={handleClick}>Click me</AsyncButton>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<AsyncButton loading data-testid="submit-btn" onClick={() => {}}>Submit</AsyncButton>)
    
    const button = screen.getByTestId('submit-btn')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-describedby', 'submit-btn-loading')
  })

  it('applies custom className', () => {
    render(<AsyncButton className="custom-class" onClick={() => {}}>Button</AsyncButton>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<AsyncButton ref={ref} onClick={() => {}}>Button</AsyncButton>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })
})