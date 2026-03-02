import { Card, CardContent } from "~/components/ui/card";
import { z } from "zod";

/**
 * Single metric schema
 */
export const MetricSchema = z.object({
  label: z.string(),
  value: z.string().or(z.number()),
});

/**
 * API response is an object with dynamic keys
 */
export const MetricsResponseSchema = z.record(MetricSchema);

export type MetricsResponse = z.infer<typeof MetricsResponseSchema>;

export interface MetricCardProps {
  data?: MetricsResponse; // <-- accept raw API object
}

export function MetricCard({ data }: MetricCardProps) {
  if (!data) return null;

  // Convert object → array safely
  const metrics = Object.values(data);

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">
                {metric.value}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {metric.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
