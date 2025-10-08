import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
}

export function StatsCard({ title, value, change, icon, iconBg }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
