
import * as React from "react"

// Updated to a smaller breakpoint for better mobile optimization
const MOBILE_BREAKPOINT = 640

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to update based on screen size
    const updateSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    updateSize()

    // Setup event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", updateSize)
    
    // Clean up event listener
    return () => mql.removeEventListener("change", updateSize)
  }, [])

  // If isMobile is undefined (during SSR), return false as a fallback
  return isMobile === undefined ? false : isMobile
}
