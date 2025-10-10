import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  subText?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  gradient?: string;
}

export function KPICard({
  title,
  value,
  trend,
  subText,
  icon,
  iconBg = "bg-primary/10",
  gradient,
}: KPICardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card className={cn("overflow-hidden", gradient)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">{value}</h3>
              {trend !== undefined && (
                <span
                  className={cn(
                    "flex items-center text-sm font-medium",
                    isPositiveTrend && "text-success",
                    isNegativeTrend && "text-destructive"
                  )}
                >
                  {isPositiveTrend ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subText && <p className="text-sm text-muted-foreground">{subText}</p>}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-lg", iconBg)}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
