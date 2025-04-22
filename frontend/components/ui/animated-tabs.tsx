import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AnimatedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue || "")
    
    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value)
      }
    }, [value])
    
    const handleTabChange = (newValue: string) => {
      if (value === undefined) {
        setActiveTab(newValue)
      }
      onValueChange?.(newValue)
    }
    
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              activeTab,
              onTabChange: handleTabChange,
            } as any)
          }
          return child
        })}
      </div>
    )
  }
)
AnimatedTabs.displayName = "AnimatedTabs"

export interface AnimatedTabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string
  onTabChange?: (value: string) => void
  children: React.ReactNode
}

const AnimatedTabsList = React.forwardRef<HTMLDivElement, AnimatedTabsListProps>(
  ({ className, activeTab, onTabChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              activeTab,
              onTabChange,
            } as any)
          }
          return child
        })}
      </div>
    )
  }
)
AnimatedTabsList.displayName = "AnimatedTabsList"

export interface AnimatedTabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  activeTab?: string
  onTabChange?: (value: string) => void
  children: React.ReactNode
}

const AnimatedTabsTrigger = React.forwardRef<HTMLButtonElement, AnimatedTabsTriggerProps>(
  ({ className, value, activeTab, onTabChange, children, ...props }, ref) => {
    const isActive = activeTab === value
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
          className
        )}
        onClick={() => onTabChange?.(value)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-background rounded-sm shadow-sm"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{ zIndex: -1 }}
          />
        )}
      </motion.button>
    )
  }
)
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger"

export interface AnimatedTabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeTab?: string
  children: React.ReactNode
}

const AnimatedTabsContent = React.forwardRef<HTMLDivElement, AnimatedTabsContentProps>(
  ({ className, value, activeTab, children, ...props }, ref) => {
    const isActive = activeTab === value
    
    return (
      <motion.div
        ref={ref}
        className={cn("mt-2", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ display: isActive ? "block" : "none" }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedTabsContent.displayName = "AnimatedTabsContent"

export { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } 