import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Search, Download, Trash2, ChevronLeft, ChevronRight, Home } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  page?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (search) params.set("q", search);

      const response = await fetch(`/api/admin/leads?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Lead deleted",
          description: "The lead has been removed",
        });
        fetchLeads();
      } else {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Failed to delete lead",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete lead",
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/export?type=leads", {
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
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
        description: "Failed to export leads",
      });
    }
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
              <h1 className="text-3xl font-bold">Contact Leads</h1>
            </div>
            <p className="text-muted-foreground">
              Manage all contact form submissions
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Button onClick={handleExport} variant="outline" data-testid="button-export-csv">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No leads found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Name</th>
                        <th className="text-left py-3 px-2 font-semibold">Email</th>
                        <th className="text-left py-3 px-2 font-semibold">Phone</th>
                        <th className="text-left py-3 px-2 font-semibold">Message</th>
                        <th className="text-left py-3 px-2 font-semibold">Page</th>
                        <th className="text-left py-3 px-2 font-semibold">Created</th>
                        <th className="text-right py-3 px-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b hover-elevate" data-testid={`row-lead-${lead.id}`}>
                          <td className="py-3 px-2 text-sm font-medium">{lead.name}</td>
                          <td className="py-3 px-2 text-sm">{lead.email}</td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {lead.phone || "-"}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground max-w-xs truncate">
                            {lead.message ? (
                              <span title={lead.message}>
                                {lead.message.substring(0, 50)}
                                {lead.message.length > 50 && "..."}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {lead.page || "-"}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(lead.id)}
                                data-testid={`button-delete-${lead.id}`}
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
