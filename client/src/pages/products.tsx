import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Bot, BarChart3, Settings, Check } from "lucide-react";
import type { Product } from "@shared/schema";

const productIcons = {
  "AI Assistant": Bot,
  "Analytics": BarChart3,
  "Automation": Settings,
};

export default function Products() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handlePurchase = async (productId: number) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase products",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/orders", {
        userId: user.id,
        productId,
      });
      
      toast({
        title: "Order created",
        description: "Your order has been placed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Products</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover our range of AI-powered solutions designed to transform your business operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => {
            const IconComponent = productIcons[product.category as keyof typeof productIcons] || Bot;
            
            return (
              <Card key={product.id} className="product-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(product.price)}/mo
                    </span>
                    {product.category === "AI Assistant" && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-slate-600">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchase(product.id)}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-600">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
