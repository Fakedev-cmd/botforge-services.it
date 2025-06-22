import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { insertUpdateSchema, type InsertUpdate, type Update, type User } from "@shared/schema";
import { Bell, Newspaper, AlertCircle } from "lucide-react";

interface UpdateWithAuthor extends Update {
  author: User;
}

export default function Updates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, isAdmin } = useAuth();

  const { data: updates, isLoading } = useQuery<UpdateWithAuthor[]>({
    queryKey: ["/api/updates"],
  });

  const form = useForm<Omit<InsertUpdate, "authorId">>({
    resolver: zodResolver(insertUpdateSchema.omit({ authorId: true })),
    defaultValues: {
      title: "",
      content: "",
      isFeatureUpdate: false,
      isImportant: false,
    },
  });

  const createUpdateMutation = useMutation({
    mutationFn: async (data: InsertUpdate) => {
      const response = await apiRequest("POST", "/api/updates", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/updates"] });
      form.reset();
      toast({
        title: "Update published",
        description: "Your update has been published successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to publish update",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertUpdate, "authorId">) => {
    if (!user) return;
    
    createUpdateMutation.mutate({
      ...data,
      authorId: user.id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading updates...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Updates</h2>
          <p className="text-xl text-slate-600">Stay informed with the latest news and product updates</p>
        </div>

        {/* Admin-only publish section */}
        {isAuthenticated && isAdmin() && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Publish Update</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Update title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Update content..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="isFeatureUpdate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <label className="text-sm text-slate-700">
                              Feature Update
                            </label>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isImportant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <label className="text-sm text-slate-700">
                              Important Notice
                            </label>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={createUpdateMutation.isPending}
                  >
                    {createUpdateMutation.isPending ? "Publishing..." : "Publish Update"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Updates List */}
        <div className="space-y-6">
          {updates?.map((update) => (
            <article key={update.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{update.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>{formatDate(update.createdAt)}</span>
                    <span>By {update.author.firstName} {update.author.lastName}</span>
                    {update.isFeatureUpdate && (
                      <Badge variant="secondary">Feature Update</Badge>
                    )}
                    {update.isImportant && (
                      <Badge variant="destructive">Important Notice</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="prose max-w-none text-slate-600">
                <div className="whitespace-pre-wrap">{update.content}</div>
              </div>
            </article>
          ))}
        </div>

        {(!updates || updates.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-600">No updates available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
