import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Search, Download, Mail, Trash2, ChevronLeft, ChevronRight, Home } from "lucide-react";

interface Valuation {
  id: string;
  email: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  stage: number;
  conservative?: number;
  optimistic?: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Valuations() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchValuations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (search) params.set("q", search);
      if (stageFilter !== "all") params.set("stage", stageFilter);

      const response = await fetch(`/api/admin/valuations?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setValuations(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch valuations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValuations();
  }, [pagination.page, search, stageFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this valuation?")) return;

    try {
      const response = await fetch(`/api/admin/valuations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Valuation deleted",
          description: "The valuation has been removed",
        });
        fetchValuations();
      } else {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Failed to delete valuation",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete valuation",
      });
    }
  };

  const handleResend = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/valuations/${id}/resend`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Email sent",
          description: "Valuation report has been resent",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Resend failed",
          description: "Failed to resend email",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend email",
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/export?type=valuations", {
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `valuations-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Export successful",
          description: "CSV file has been downloaded",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export valuations",
      });
    }
  };

  const getStageBadge = (stage: number) => {
    const variants = {
      1: { label: "Contact", variant: "secondary" as const },
      2: { label: "Details", variant: "default" as const },
      3: { label: "Completed", variant: "default" as const },
    };
    const config = variants[stage as keyof typeof variants] || variants[1];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Valuations</h1>
            </div>
            <p className="text-muted-foreground">
              Manage all property valuation submissions
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-full md:w-[180px]" data-testid="select-stage-filter">
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  <SelectItem value="1">Contact</SelectItem>
                  <SelectItem value="2">Details</SelectItem>
                  <SelectItem value="3">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} variant="outline" data-testid="button-export-csv">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : valuations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No valuations found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Email</th>
                        <th className="text-left py-3 px-2 font-semibold">Address</th>
                        <th className="text-left py-3 px-2 font-semibold">Stage</th>
                        <th className="text-right py-3 px-2 font-semibold">Conservative</th>
                        <th className="text-right py-3 px-2 font-semibold">Optimistic</th>
                        <th className="text-left py-3 px-2 font-semibold">Created</th>
                        <th className="text-right py-3 px-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valuations.map((val) => (
                        <tr key={val.id} className="border-b hover-elevate" data-testid={`row-valuation-${val.id}`}>
                          <td className="py-3 px-2 text-sm">{val.email}</td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {val.street ? `${val.street}, ${val.city || ""} ${val.state || ""}` : "-"}
                          </td>
                          <td className="py-3 px-2">{getStageBadge(val.stage)}</td>
                          <td className="py-3 px-2 text-sm text-right">
                            {val.conservative ? `$${val.conservative.toLocaleString()}` : "-"}
                          </td>
                          <td className="py-3 px-2 text-sm text-right">
                            {val.optimistic ? `$${val.optimistic.toLocaleString()}` : "-"}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {new Date(val.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex justify-end gap-2">
                              {val.stage === 3 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleResend(val.id)}
                                  data-testid={`button-resend-${val.id}`}
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(val.id)}
                                data-testid={`button-delete-${val.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                    {pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page >= pagination.totalPages}
                      data-testid="button-next-page"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
