import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AsyncButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void> | void
  loadingText?: string
  successText?: string
  errorText?: string
  showFeedback?: boolean
  resetAfterMs?: number
}

type AsyncState = 'idle' | 'loading' | 'success' | 'error'

export const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ 
    onClick, 
    children, 
    loadingText = "Loading...",
    successText = "Success!",
    errorText = "Error",
    showFeedback = false,
    resetAfterMs = 2000,
    disabled,
    className,
    ...props 
  }, ref) => {
    const [state, setState] = React.useState<AsyncState>('idle')
    const [error, setError] = React.useState<string | null>(null)

    const handleClick = React.useCallback(async () => {
      if (state === 'loading') return
      
      try {
        setState('loading')
        setError(null)
        await onClick()
        
        if (showFeedback) {
          setState('success')
          setTimeout(() => setState('idle'), resetAfterMs)
        } else {
          setState('idle')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : errorText
        setError(errorMessage)
        setState('error')
        
        if (showFeedback) {
          setTimeout(() => {
            setState('idle')
            setError(null)
          }, resetAfterMs)
        }
      }
    }, [onClick, showFeedback, resetAfterMs, errorText, state])

    const getDisplayText = () => {
      switch (state) {
        case 'loading': return loadingText
        case 'success': return successText
        case 'error': return error || errorText
        default: return children
      }
    }

    const getVariant = () => {
      if (state === 'error') return 'destructive'
      if (state === 'success') return 'success'
      return props.variant
    }

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || state === 'loading'}
        variant={getVariant()}
        className={cn(
          state === 'loading' && "cursor-wait",
          className
        )}
        {...props}
      >
        {state === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
        {getDisplayText()}
      </Button>
    )
  }
)

AsyncButton.displayName = "AsyncButton"