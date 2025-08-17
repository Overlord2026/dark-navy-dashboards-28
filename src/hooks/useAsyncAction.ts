import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

interface UseAsyncActionOptions {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useAsyncAction<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  options: UseAsyncActionOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const execute = useCallback(async (...args: T) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await action(...args)
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        })
      }
      
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred')
      setError(error)
      
      const errorMessage = options.errorMessage || error.message
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      
      options.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [action, options, toast])

  return {
    execute,
    loading,
    error,
    reset: () => {
      setError(null)
      setLoading(false)
    }
  }
}