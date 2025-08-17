import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"
import { Textarea } from "./textarea"

interface AccessibleFormFieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  description?: string
  children: React.ReactNode
  className?: string
}

export function AccessibleFormField({
  id,
  label,
  error,
  required = false,
  description,
  children,
  className
}: AccessibleFormFieldProps) {
  const errorId = error ? `${id}-error` : undefined
  const descriptionId = description ? `${id}-description` : undefined
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': [errorId, descriptionId].filter(Boolean).join(' ') || undefined,
          'aria-required': required,
          className: cn(
            (children as React.ReactElement).props.className,
            error && "border-destructive focus:border-destructive"
          )
        })}
      </div>
      
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
}

export function AccessibleInput({
  label,
  error,
  description,
  required,
  className,
  ...props
}: AccessibleInputProps) {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <AccessibleFormField
      id={id}
      label={label}
      error={error}
      required={required}
      description={description}
      className={className}
    >
      <Input {...props} />
    </AccessibleFormField>
  )
}

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  description?: string
}

export function AccessibleTextarea({
  label,
  error,
  description,
  required,
  className,
  ...props
}: AccessibleTextareaProps) {
  const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <AccessibleFormField
      id={id}
      label={label}
      error={error}
      required={required}
      description={description}
      className={className}
    >
      <Textarea {...props} />
    </AccessibleFormField>
  )
}