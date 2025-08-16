import * as React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export interface FormGuardProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => Promise<void> | void
  loading?: boolean
  error?: string | null
  success?: string | null
  className?: string
  showProgress?: boolean
  validate?: () => boolean | string[]
  resetAfterMs?: number
}

type FormState = 'idle' | 'validating' | 'submitting' | 'success' | 'error'

export const FormGuard: React.FC<FormGuardProps> = ({
  children,
  onSubmit,
  loading = false,
  error = null,
  success = null,
  className,
  showProgress = false,
  validate,
  resetAfterMs = 3000
}) => {
  const [state, setState] = React.useState<FormState>('idle')
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null)

  // Reset success/error states after timeout
  React.useEffect(() => {
    if (state === 'success' || state === 'error') {
      const timer = setTimeout(() => {
        setState('idle')
        setSubmitError(null)
        setSubmitSuccess(null)
      }, resetAfterMs)
      return () => clearTimeout(timer)
    }
  }, [state, resetAfterMs])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous states
    setValidationErrors([])
    setSubmitError(null)
    setSubmitSuccess(null)

    // Run validation if provided
    if (validate) {
      setState('validating')
      const validationResult = validate()
      
      if (validationResult === false) {
        setState('error')
        return
      }
      
      if (Array.isArray(validationResult) && validationResult.length > 0) {
        setValidationErrors(validationResult)
        setState('error')
        return
      }
    }

    // Submit form
    try {
      setState('submitting')
      await onSubmit(e)
      setSubmitSuccess(success || "Form submitted successfully")
      setState('success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setSubmitError(error || errorMessage)
      setState('error')
    }
  }, [onSubmit, validate, error, success])

  const isDisabled = loading || state === 'validating' || state === 'submitting'
  const currentError = submitError || error
  const currentSuccess = submitSuccess || success

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      noValidate
    >
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {currentError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{currentError}</AlertDescription>
        </Alert>
      )}

      {/* Success State */}
      {currentSuccess && state === 'success' && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            {currentSuccess}
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Indicator */}
      {showProgress && (state === 'validating' || state === 'submitting') && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {state === 'validating' ? 'Validating...' : 'Submitting...'}
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" 
              style={{ width: state === 'validating' ? '30%' : '70%' }}
            />
          </div>
        </div>
      )}

      {/* Form Content with disabled context */}
      <fieldset disabled={isDisabled} className="space-y-4">
        {children}
      </fieldset>
    </form>
  )
}

FormGuard.displayName = "FormGuard"