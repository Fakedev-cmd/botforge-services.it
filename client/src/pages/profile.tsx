import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, formatCurrency, formatTimeAgo, getStatusBadgeClass } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { User, ShoppingCart, Ticket, Settings, Camera, Crown, Shield, Code, UserCheck } from "lucide-react";
import type { Order, Product, Ticket as TicketType } from "@shared/schema";
import { z } from "zod";

interface OrderWithProduct extends Order {
  product: Product;
}

const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: orders } = useQuery<OrderWithProduct[]>({
    queryKey: ["/api/orders", user?.id],
    enabled: !!user,
  });

  const { data: tickets } = useQuery<TicketType[]>({
    queryKey: ["/api/tickets", user?.id],
    enabled: !!user,
  });

  const profileForm = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const requestPasswordChangeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/password-requests", { userId: user?.id });
      return response.json();
    },
    onSuccess: () => {
      passwordForm.reset();
      toast({
        title: "Password change requested",
        description: "Your request has been submitted for admin approval.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onPasswordChangeRequest = () => {
    requestPasswordChangeMutation.mutate();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalOrders = orders?.length || 0;
  const openTickets = tickets?.filter(t => t.status === "open" || t.status === "in_progress").length || 0;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
          <p className="text-slate-600">Manage your account settings and view your activity</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Overview Card */}
          <div className="lg:col-span-4">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-slate-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {user.role === "owner" && <Crown className="h-4 w-4 text-red-500" />}
                      {user.role === "manager" && <Shield className="h-4 w-4 text-purple-500" />}
                      {user.role === "developer" && <Code className="h-4 w-4 text-green-500" />}
                      {user.role === "customer" && <ShoppingCart className="h-4 w-4 text-blue-500" />}
                      {user.role === "user" && <UserCheck className="h-4 w-4 text-gray-500" />}
                      <Badge variant="secondary">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-4">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
                      <p className="text-sm text-slate-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Ticket className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{openTickets}</p>
                      <p className="text-sm text-slate-600">Open Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {new Date(user.createdAt).getFullYear()}
                      </p>
                      <p className="text-sm text-slate-600">Member Since</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="lg:col-span-4">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders && orders.length > 0 ? (
                      <div className="divide-y divide-slate-200">
                        {orders.map((order) => (
                          <div key={order.id} className="py-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium text-slate-900">
                                  Order #{order.id}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Placed on {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">
                                  {formatCurrency(order.amount)}
                                </p>
                                <span className={getStatusBadgeClass(order.status, 'order')}>
                                  {order.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{order.product.name}</p>
                                <p className="text-sm text-slate-600">{order.product.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-center py-8">No orders found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tickets" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tickets && tickets.length > 0 ? (
                      <div className="divide-y divide-slate-200">
                        {tickets.map((ticket) => (
                          <div key={ticket.id} className="py-6">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-slate-900">{ticket.subject}</h4>
                                <p className="text-sm text-slate-600">Ticket #{ticket.id}</p>
                              </div>
                              <span className={getStatusBadgeClass(ticket.status, 'ticket')}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              {ticket.description.substring(0, 150)}...
                            </p>
                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <span>Created {formatTimeAgo(ticket.createdAt)}</span>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-center py-8">No support tickets found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Save Changes</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>

                  {/* Password Change */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">
                        Password changes require admin approval for security purposes.
                      </p>
                      <Form {...passwordForm}>
                        <form className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="button" 
                            variant="secondary"
                            onClick={onPasswordChangeRequest}
                            disabled={requestPasswordChangeMutation.isPending}
                          >
                            {requestPasswordChangeMutation.isPending 
                              ? "Requesting..." 
                              : "Request Password Change"
                            }
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
