import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/lib/auth";

// Import all pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Products from "@/pages/products";
import Reviews from "@/pages/reviews";
import Updates from "@/pages/updates";
import Support from "@/pages/support";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  if (adminOnly && !isAdmin()) {
    return <NotFound />;
  }
  
  return <>{children}</>;
}

function Router() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="main-content">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/products" component={Products} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/updates" component={Updates} />
            <Route path="/support" component={Support} />
            <Route path="/profile">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Route>
            <Route path="/admin">
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
