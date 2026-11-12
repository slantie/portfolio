import { useState } from "react";
import { Check, Database, Loader2, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  runTeachingAssistantExperienceUpdate,
  type ProfessionalRefreshResult,
} from "@/lib/professional-refresh";

export default function DataMigration() {
  const [migrating, setMigrating] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [results, setResults] = useState<ProfessionalRefreshResult[]>([]);

  async function runRefresh() {
    if (!isSupabaseConfigured) return;
    setMigrating(true);
    setResults([]);
    try {
      setResults(await runTeachingAssistantExperienceUpdate(setCurrentItem));
    } finally {
      setCurrentItem("");
      setMigrating(false);
    }
  }

  const successCount = results.filter((result) => result.success).length;
  const failureCount = results.length - successCount;

  return (
    <div className="sortd-page space-y-7">
      <div>
        <p className="sortd-page-kicker">Portfolio</p>
        <h1 className="sortd-page-heading mt-1 text-3xl font-semibold">
          Add teaching-assistant experience
        </h1>
        <p className="mt-2 text-muted-foreground">
          Publish the current IC104 Basic Electronic Circuits teaching-assistant role.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="size-5" />
            Reviewed database update
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">
            This reviewed update adds the IC104 Teaching Assistant role under Dr. Ankit Vijayvargiya to the
            professional experience timeline.
          </p>
          <Button
            className="w-full"
            disabled={migrating || !isSupabaseConfigured}
            onClick={() => void runRefresh()}
          >
            {migrating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating {currentItem}
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                Add TA experience
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>Refresh results</span>
              <span className="flex gap-2">
                <Badge>{successCount} updated</Badge>
                {failureCount > 0 && <Badge variant="destructive">{failureCount} failed</Badge>}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[30rem] space-y-2 overflow-y-auto">
            {results.map((result, index) => (
              <div
                className={`flex items-start justify-between gap-3 rounded-lg border p-3 text-sm ${
                  result.success ? "sortd-status-success" : "bg-destructive/10 text-destructive"
                }`}
                key={`${result.type}-${result.title}-${index}`}
              >
                <div className="flex min-w-0 gap-2">
                  {result.success ? (
                    <Check className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>
                    {result.title}
                    {result.error && <span className="block text-xs opacity-80">{result.error}</span>}
                  </span>
                </div>
                <Badge className="shrink-0" variant="outline">{result.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
