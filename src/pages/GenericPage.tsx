import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Icons replaced with Font Awesome

interface GenericPageProps {
  title: string;
  description: string;
}

export default function GenericPage({ title, description }: GenericPageProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button className="gap-2">
          <i className="fa fa-plus h-4 w-4" aria-hidden="true" />
          Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title} Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Coming Soon</p>
              <p className="text-sm">This page is under construction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
