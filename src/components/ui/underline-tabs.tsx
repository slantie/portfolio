import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("relative w-full", className)}>
      <label htmlFor="tabs-select" className="sr-only">
        {placeholder}
      </label>
      <select
        id="tabs-select"
        value={activeTab}
        onChange={(e) => onTabChange(e.target.value)}
        className="w-full appearance-none bg-card border border-border rounded-sm px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:border-foreground/50"
      >
        {tabs.map((tab) => (
          <option key={tab.value} value={tab.value}>
            {tab.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
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
