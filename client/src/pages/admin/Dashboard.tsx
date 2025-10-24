import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { BarChart3, FileText, Users, TrendingUp, ArrowRight } from "lucide-react";

interface Stats {
  totalValuations: number;
  completedReports: number;
  leadsTotal: number;
  conversionRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage valuations and leads
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="hover-elevate">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Valuations
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" data-testid="stat-total-valuations">
                      {stats?.totalValuations || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All submissions
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed Reports
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" data-testid="stat-completed-reports">
                      {stats?.completedReports || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      With email sent
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Contact Leads
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" data-testid="stat-leads-total">
                      {stats?.leadsTotal || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact form submissions
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Conversion Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" data-testid="stat-conversion-rate">
                      {stats?.conversionRate || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed / Total
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Valuations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      View, manage, and export all property valuation submissions. Resend emails or delete records as needed.
                    </p>
                    <Link href="/admin/valuations">
                      <Button className="w-full" data-testid="link-view-valuations">
                        View All Valuations
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Leads</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Browse contact form submissions, export lead data, and manage your pipeline.
                    </p>
                    <Link href="/admin/leads">
                      <Button className="w-full" data-testid="link-view-leads">
                        View All Leads
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
