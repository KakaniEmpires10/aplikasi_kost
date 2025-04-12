"use client"

import { Button } from '@/components/ui/button'
import { cn, scrollToTop } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const ScrollButton = () => {
    const [scroll, setScroll] = useState(false)

    useEffect(() => {
        const handleButtonVisible = () => {
            if (window.scrollY > 80) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }

        window.addEventListener('scroll', handleButtonVisible)
    
      return () => {
            window.removeEventListener('scroll', handleButtonVisible)
        }
    }, [])
    
    return (
        <Button
            onClick={() => scrollToTop()}
            size="icon"
            className={cn(
            'fixed bottom-2.5 left-2.5 rounded-full transition-all duration-300 transform',
            {
                'invisible scale-0 -rotate-180': !scroll,
                'visible scale-100 rotate-0': scroll,
            }
            )}
        >
            <ArrowUp />
        </Button>
    )
}

export default ScrollButton