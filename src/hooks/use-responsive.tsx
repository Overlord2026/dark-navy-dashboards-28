import * as React from "react"

const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280,
} as const

type Breakpoint = keyof typeof BREAKPOINTS
type BreakpointState = Record<Breakpoint, boolean>

export function useResponsive() {
  const [breakpoints, setBreakpoints] = React.useState<BreakpointState>({
    mobile: false,
    tablet: false,
    desktop: false,
    large: false,
  })

  React.useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        mobile: width < BREAKPOINTS.mobile,
        tablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
        desktop: width >= BREAKPOINTS.desktop && width < BREAKPOINTS.large,
        large: width >= BREAKPOINTS.large,
      })
    }

    // Set initial state
    updateBreakpoints()

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoints)
    return () => window.removeEventListener('resize', updateBreakpoints)
  }, [])

  return {
    ...breakpoints,
    isMobile: breakpoints.mobile,
    isTablet: breakpoints.tablet,
    isDesktop: breakpoints.desktop,
    isLarge: breakpoints.large,
    isSmallScreen: breakpoints.mobile || breakpoints.tablet,
    isLargeScreen: breakpoints.desktop || breakpoints.large,
  }
}