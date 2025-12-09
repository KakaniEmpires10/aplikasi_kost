import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        primary: "bg-primary text-primary-foreground",
        "primary-soft": "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/80 [&>svg]:text-primary/60 dark:[&>svg]:text-primary/40",
        info: "bg-cyan-50 text-cyan-900 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-100 dark:border-cyan-800 [&>svg]:text-cyan-600 dark:[&>svg]:text-cyan-400",
        "info-soft": "bg-cyan-25 text-cyan-800 border-cyan-100 dark:bg-cyan-975 dark:text-cyan-200 dark:border-cyan-900 [&>svg]:text-cyan-500 dark:[&>svg]:text-cyan-300",
        success: "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        "success-soft": "bg-emerald-25 text-emerald-800 border-emerald-100 dark:bg-emerald-975 dark:text-emerald-200 dark:border-emerald-900 [&>svg]:text-emerald-500 dark:[&>svg]:text-emerald-300",
        warning: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        "warning-soft": "bg-amber-25 text-amber-800 border-amber-100 dark:bg-amber-975 dark:text-amber-200 dark:border-amber-900 [&>svg]:text-amber-500 dark:[&>svg]:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
