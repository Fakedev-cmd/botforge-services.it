import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatTimeAgo } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { insertReviewSchema, type InsertReview, type Review, type User } from "@shared/schema";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";

interface ReviewWithUser extends Review {
  user: User;
}

export default function Reviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, isCustomer } = useAuth();
  const [rating, setRating] = useState(0);

  const { data: reviews, isLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews"],
  });

  const form = useForm<Omit<InsertReview, "userId">>({
    resolver: zodResolver(insertReviewSchema.omit({ userId: true })),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      const response = await apiRequest("POST", "/api/reviews", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      form.reset();
      setRating(0);
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertReview, "userId">) => {
    if (!user) return;
    
    createReviewMutation.mutate({
      ...data,
      rating,
      userId: user.id,
    });
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating 
            ? "text-yellow-400 fill-current" 
            : "text-slate-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive && onStarClick ? () => onStarClick(i + 1) : undefined}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading reviews...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Customer Reviews</h2>
          <p className="text-xl text-slate-600">See what our customers are saying about BotForge</p>
        </div>

        {/* Write Review Form - Only for authenticated customers */}
        {isAuthenticated && isCustomer() && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {renderStars(rating, true, setRating)}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your experience with BotForge..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={createReviewMutation.isPending || rating === 0}
                  >
                    {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Reviews Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>
                      {review.user.firstName[0]}{review.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 mb-3">{review.content}</p>
                <div className="text-sm text-slate-500">
                  {formatTimeAgo(review.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!reviews || reviews.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-600">No reviews yet. Be the first to leave a review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
