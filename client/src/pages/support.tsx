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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatTimeAgo, getStatusBadgeClass } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { insertTicketSchema, type InsertTicket, type Ticket } from "@shared/schema";
import { Book, Video, HelpCircle, MessageSquare, Phone, Mail, Clock } from "lucide-react";

export default function Support() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const { data: userTickets } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets", user?.id],
    enabled: !!user,
  });

  const form = useForm<Omit<InsertTicket, "userId">>({
    resolver: zodResolver(insertTicketSchema.omit({ userId: true })),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
      category: "",
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: InsertTicket) => {
      const response = await apiRequest("POST", "/api/tickets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      form.reset();
      toast({
        title: "Ticket created",
        description: "Your support ticket has been submitted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create ticket",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertTicket, "userId">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a support ticket",
        variant: "destructive",
      });
      return;
    }
    
    createTicketMutation.mutate({
      ...data,
      userId: user.id,
    });
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Support Center</h2>
          <p className="text-xl text-slate-600">Get help when you need it</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Ticket Form */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brief description of your issue" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Technical Support">Technical Support</SelectItem>
                              <SelectItem value="Billing Question">Billing Question</SelectItem>
                              <SelectItem value="Feature Request">Feature Request</SelectItem>
                              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide detailed information about your issue..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={createTicketMutation.isPending || !isAuthenticated}
                    >
                      {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-sm text-slate-600">
                        Please log in to create a support ticket.
                      </p>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* My Tickets */}
            {isAuthenticated && userTickets && userTickets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>My Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userTickets.map((ticket) => (
                      <div key={ticket.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-slate-900">
                              #{ticket.id}
                            </span>
                            <span className={getStatusBadgeClass(ticket.status, 'ticket')}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-sm text-slate-600">
                            {formatTimeAgo(ticket.updatedAt)}
                          </span>
                        </div>
                        <h4 className="font-medium text-slate-900 mb-1">{ticket.subject}</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {ticket.description.substring(0, 100)}...
                        </p>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Support Resources */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors">
                    <Book className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium text-slate-900">Documentation</span>
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors">
                    <Video className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium text-slate-900">Video Tutorials</span>
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors">
                    <HelpCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium text-slate-900">FAQ</span>
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors">
                    <MessageSquare className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium text-slate-900">Community Forum</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-slate-900">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Contact our support team directly for urgent issues.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-primary mr-2" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-primary mr-2" />
                    <span>support@botforge.com</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
