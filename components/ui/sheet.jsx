"use client"

import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const Sheet = ({ children }) => <div>{children}</div>
const SheetTrigger = ({ children }) => <div>{children}</div>
const SheetClose = ({ children }) => <div>{children}</div>
const SheetPortal = ({ children }) => <div>{children}</div>
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      className
    )}
    {...props}
    ref={ref} />
))
SheetOverlay.displayName = "SheetOverlay"

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom:
          "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <div>
    <SheetOverlay />
    <div
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}>
      {children}
      <button>
        <span>Close</span>
      </button>
    </div>
  </div>
))
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props} />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

