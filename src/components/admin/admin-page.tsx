import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
};

/** A quiet, content-first header shared by private portfolio surfaces. */
export function AdminPageHeader({ eyebrow = "Portfolio", title, description, actions, backLabel, onBack, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {onBack && <Button type="button" variant="ghost" size="sm" className="-ml-3 mb-3 text-muted-foreground" onClick={onBack}><ArrowLeft className="size-4" />{backLabel ?? "Back"}</Button>}
        {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

type SectionProps = { title: string; description?: string; children: ReactNode; className?: string };

/** Keeps forms legible without turning each field group into a heavy panel. */
export function AdminFormSection({ title, description, children, className }: SectionProps) {
  return <Card className={cn("rounded-xl shadow-none", className)}><CardHeader className="border-b border-border px-5 py-4"><CardTitle className="text-sm font-semibold tracking-normal">{title}</CardTitle>{description && <CardDescription className="mt-1 leading-5">{description}</CardDescription>}</CardHeader><CardContent className="space-y-4 p-5">{children}</CardContent></Card>;
}
