
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DESKTOP_THRESHOLD = 1024
const FORCE_DESKTOP_KEY = "force_desktop_view"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [forceDesktop, setForceDesktop] = React.useState<boolean>(
    localStorage.getItem(FORCE_DESKTOP_KEY) === "true"
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const desktopMql = window.matchMedia(`(min-width: ${DESKTOP_THRESHOLD}px)`)
    
    const onChange = () => {
      // If forceDesktop is true and we're on a laptop/desktop (above threshold),
      // always return false for isMobile
      if (forceDesktop && desktopMql.matches) {
        setIsMobile(false)
      } else {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }
    
    mql.addEventListener("change", onChange)
    desktopMql.addEventListener("change", onChange)
    
    // Initial check
    onChange()
    
    return () => {
      mql.removeEventListener("change", onChange)
      desktopMql.removeEventListener("change", onChange)
    }
  }, [forceDesktop])

  const toggleForceDesktop = React.useCallback(() => {
    const newValue = !forceDesktop
    setForceDesktop(newValue)
    localStorage.setItem(FORCE_DESKTOP_KEY, String(newValue))
  }, [forceDesktop])

  return {
    isMobile: !!isMobile,
    forceDesktop,
    toggleForceDesktop
  }
}
