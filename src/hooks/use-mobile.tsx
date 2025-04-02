
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

// Helper hook to apply specific styles for mobile view
export function useMobileStyles() {
  const isMobile = useIsMobile()
  
  return {
    chatContainer: isMobile ? 'flex-1 overflow-y-auto pb-16' : 'flex-1 overflow-y-auto',
    inputContainer: isMobile ? 'p-2 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md' : 'p-4 border-t border-gray-200',
    actionButtons: isMobile ? 'mt-auto pt-2 flex justify-center gap-2' : 'mt-4 flex justify-start gap-2',
  }
}
