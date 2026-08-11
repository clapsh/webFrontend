import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import type { FallbackProps } from 'react-error-boundary'

interface DynamicOptions {
  error?: ({ error }: FallbackProps) => React.ReactNode
  loading?: React.ReactNode
}

export function dynamic(
  importFn: () => Promise<{ default: React.ComponentType }>,
  options: DynamicOptions = {}
) {
  const Component = lazy(() => importFn())

  return function DynamicComponent() {
    return (
      <ErrorBoundary
        fallbackRender={
          options.error ||
          (({ error }) => (
            <div>Error: {(error as Error)?.message || 'Unknown error!!'}</div>
          ))
        }>
        <Suspense fallback={options.loading || <div>Loading...</div>}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
