import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, formatCurrency, formatTimeAgo, getStatusBadgeClass, getPriorityBadgeClass, getRoleBadgeClass } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { 
  BarChart3, Users, ShoppingCart, Ticket, Megaphone, QrCode, Key,
  Eye, Ban, CheckCircle, XCircle, Download
} from "lucide-react";
import type { 
  User, Order, Product, Ticket as TicketType, PasswordChangeRequest 
} from "@shared/schema";
import { z } from "zod";

interface OrderWithUserAndProduct extends Order {
  user: User;
  product: Product;
}

interface TicketWithUser extends TicketType {
  user: User;
}

interface PasswordRequestWithUser extends PasswordChangeRequest {
  user: User;
}

const qrGenerateSchema = z.object({
  content: z.string().min(1, "Content is required"),
  size: z.string().default("300"),
  format: z.string().default("png"),
});

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [generatedQR, setGeneratedQR] = useState<{ qrUrl: string; content: string } | null>(null);

  // Queries
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<OrderWithUserAndProduct[]>({
    queryKey: ["/api/orders"],
  });

  const { data: tickets, isLoading: ticketsLoading } = useQuery<TicketWithUser[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: passwordRequests, isLoading: passwordRequestsLoading } = useQuery<PasswordRequestWithUser[]>({
    queryKey: ["/api/password-requests"],
  });

  // QR Form
  const qrForm = useForm({
    resolver: zodResolver(qrGenerateSchema),
    defaultValues: {
      content: "",
      size: "300",
      format: "png",
    },
  });

  // Mutations
  const banUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("PATCH", `/api/users/${userId}/ban`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "User banned",
        description: "User has been banned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to ban user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/tickets/${ticketId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Ticket updated",
        description: "Ticket status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update ticket",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePasswordRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/password-requests/${requestId}`, { 
        status, 
        processedBy: user?.id 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/password-requests"] });
      toast({
        title: "Request processed",
        description: "Password change request has been processed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to process request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateQRMutation = useMutation({
    mutationFn: async (data: z.infer<typeof qrGenerateSchema>) => {
      const response = await apiRequest("POST", "/api/qr-generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedQR({ qrUrl: data.qrUrl, content: data.content });
      toast({
        title: "QR Code generated",
        description: "Your QR code has been generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate QR code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onGenerateQR = (data: z.infer<typeof qrGenerateSchema>) => {
    generateQRMutation.mutate(data);
  };

  // Calculate stats
  const stats = {
    totalUsers: users?.length || 0,
    totalOrders: orders?.length || 0,
    openTickets: tickets?.filter(t => t.status === "open" || t.status === "in_progress").length || 0,
    revenue: orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
          </div>
          <nav className="px-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="admin-tab"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="admin-tab"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
            <Button
              variant={activeTab === "orders" ? "secondary" : "ghost"}
              className="admin-tab"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order Management
            </Button>
            <Button
              variant={activeTab === "tickets" ? "secondary" : "ghost"}
              className="admin-tab"
              onClick={() => setActiveTab("tickets")}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Support Tickets
            </Button>
            <Button
              variant={activeTab === "qr" ? "secondary" : "ghost"}
              className="admin-tab"
              onClick={() => setActiveTab("qr")}
            >
              <QrCode className="mr-2 h-4 w-4" />
              QR Generator
            </Button>
            <Button
              variant={activeTab === "password-requests" ? "secondary" : "ghost"}
              className="admin-tab"
              onClick={() => setActiveTab("password-requests")}
            >
              <Key className="mr-2 h-4 w-4" />
              Password Requests
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                        <p className="text-sm text-slate-600">Total Users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <ShoppingCart className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                        <p className="text-sm text-slate-600">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                        <Ticket className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stats.openTickets}</p>
                        <p className="text-sm text-slate-600">Open Tickets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.revenue)}</p>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders?.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">
                            New order from {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{formatTimeAgo(order.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Management */}
          {activeTab === "users" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">User</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {users?.map((user) => (
                          <tr key={user.id}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback>
                                    {user.firstName[0]}{user.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-900">
                                  {user.firstName} {user.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge className={getRoleBadgeClass(user.role)}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusBadgeClass(user.status, 'user')}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{formatDate(user.createdAt)}</td>
                            <td className="py-3 px-4">
                              {user.status !== "banned" && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => banUserMutation.mutate(user.id)}
                                  disabled={banUserMutation.isPending}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Ban
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Order Management */}
          {activeTab === "orders" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Product</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {orders?.map((order) => (
                          <tr key={order.id}>
                            <td className="py-3 px-4 font-medium text-slate-900">#{order.id}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {order.user.firstName} {order.user.lastName}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{order.product.name}</td>
                            <td className="py-3 px-4 text-slate-900 font-medium">
                              {formatCurrency(order.amount)}
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={order.status}
                                onValueChange={(status) => 
                                  updateOrderStatusMutation.mutate({ orderId: order.id, status })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="development">Development</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{formatDate(order.createdAt)}</td>
                            <td className="py-3 px-4">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Support Tickets */}
          {activeTab === "tickets" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Support Tickets</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Ticket ID</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Subject</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Priority</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Created</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {tickets?.map((ticket) => (
                          <tr key={ticket.id}>
                            <td className="py-3 px-4 font-medium text-slate-900">#{ticket.id}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {ticket.user.firstName} {ticket.user.lastName}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{ticket.subject}</td>
                            <td className="py-3 px-4">
                              <Badge className={getPriorityBadgeClass(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={ticket.status}
                                onValueChange={(status) => 
                                  updateTicketStatusMutation.mutate({ ticketId: ticket.id, status })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {formatTimeAgo(ticket.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* QR Generator */}
          {activeTab === "qr" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">QR Code Generator</h2>
              
              <div className="max-w-2xl">
                <Card>
                  <CardContent className="pt-6">
                    <Form {...qrForm}>
                      <form onSubmit={qrForm.handleSubmit(onGenerateQR)} className="space-y-4">
                        <FormField
                          control={qrForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter the content for your QR code..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={qrForm.control}
                            name="size"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="200">200x200</SelectItem>
                                    <SelectItem value="300">300x300</SelectItem>
                                    <SelectItem value="500">500x500</SelectItem>
                                    <SelectItem value="1000">1000x1000</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={qrForm.control}
                            name="format"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Format</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="png">PNG</SelectItem>
                                    <SelectItem value="jpg">JPG</SelectItem>
                                    <SelectItem value="svg">SVG</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          disabled={generateQRMutation.isPending}
                        >
                          {generateQRMutation.isPending ? "Generating..." : "Generate QR Code"}
                        </Button>
                      </form>
                    </Form>
                    
                    {generatedQR && (
                      <div className="mt-8 text-center">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                          <img 
                            src={generatedQR.qrUrl} 
                            alt="Generated QR Code" 
                            className="mx-auto mb-4"
                          />
                          <p className="text-sm text-slate-600 mb-4">
                            QR Code for: {generatedQR.content}
                          </p>
                          <Button asChild>
                            <a href={generatedQR.qrUrl} download="qr-code.png">
                              <Download className="h-4 w-4 mr-2" />
                              Download QR Code
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Password Requests */}
          {activeTab === "password-requests" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Password Change Requests</h2>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">User</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Request Date</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {passwordRequests?.map((request) => (
                          <tr key={request.id}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback>
                                    {request.user.firstName[0]}{request.user.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-900">
                                  {request.user.firstName} {request.user.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{request.user.email}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {formatDate(request.requestedAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusBadgeClass(request.status, 'user')}>
                                {request.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {request.status === "pending" && (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePasswordRequestMutation.mutate({ 
                                      requestId: request.id, 
                                      status: "approved" 
                                    })}
                                    disabled={handlePasswordRequestMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handlePasswordRequestMutation.mutate({ 
                                      requestId: request.id, 
                                      status: "declined" 
                                    })}
                                    disabled={handlePasswordRequestMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {(!passwordRequests || passwordRequests.length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-slate-600">No pending password change requests.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
