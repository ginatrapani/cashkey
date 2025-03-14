
import * as React from "react"
import { debounce } from "lodash"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }, 100)

    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Add listeners for changes
    mql.addEventListener("change", handleResize)
    window.addEventListener("resize", handleResize)
    
    return () => {
      mql.removeEventListener("change", handleResize)
      window.removeEventListener("resize", handleResize)
      handleResize.cancel()
    }
  }, [])

  return !!isMobile
}
