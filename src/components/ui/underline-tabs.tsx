import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TabItem {
  value: string;
  label: string;
}

interface UnderlineTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  tabClassName?: string;
}

export function UnderlineTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabClassName,
}: UnderlineTabsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 sm:gap-2 border-b border-border",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "relative px-3 py-2 text-sm font-medium transition-colors",
            activeTab === tab.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80",
            tabClassName,
          )}
        >
          {tab.label}
          {activeTab === tab.value && (
            <motion.span
              layoutId="underline-tabs-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// Mobile dropdown version for smaller screens
interface UnderlineTabsDropdownProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function UnderlineTabsDropdown({
  tabs,
  activeTab,
  onTabChange,
  placeholder = "Select category",
  className,
}: UnderlineTabsDropdownProps) {
  return <Select value={activeTab} onValueChange={onTabChange}><SelectTrigger aria-label={placeholder} className={cn("w-full bg-card", className)}><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{tabs.map((tab) => <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>)}</SelectContent></Select>;
}

// Combined responsive tabs component
interface ResponsiveTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  mobileBreakpoint?: "sm" | "md" | "lg";
}

export function ResponsiveTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  mobileBreakpoint = "sm",
}: ResponsiveTabsProps) {
  const breakpointClasses = {
    sm: { mobile: "sm:hidden", desktop: "hidden sm:flex" },
    md: { mobile: "md:hidden", desktop: "hidden md:flex" },
    lg: { mobile: "lg:hidden", desktop: "hidden lg:flex" },
  };

  const { mobile, desktop } = breakpointClasses[mobileBreakpoint];

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile Dropdown */}
      <div className={mobile}>
        <UnderlineTabsDropdown
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
      {/* Desktop Tabs */}
      <div className={desktop}>
        <UnderlineTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          className="w-full justify-center"
        />
      </div>
    </div>
  );
}
