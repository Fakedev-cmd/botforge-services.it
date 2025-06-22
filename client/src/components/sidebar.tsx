import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { 
  Home, 
  ShoppingCart, 
  MessageSquare, 
  Megaphone, 
  HeadphonesIcon, 
  User, 
  Settings, 
  Crown,
  Shield,
  Code,
  Users,
  LogOut
} from "lucide-react";

const roleIcons = {
  owner: Crown,
  manager: Shield, 
  developer: Code,
  customer: ShoppingCart,
  user: User
};

const roleColors = {
  owner: "text-red-500",
  manager: "text-purple-500",
  developer: "text-green-500",
  customer: "text-blue-500",
  user: "text-gray-500"
};

const mainNavItems = [
  { path: "/", label: "Home", icon: Home, permissions: [] },
  { path: "/products", label: "Products", icon: ShoppingCart, permissions: [] },
  { path: "/reviews", label: "Reviews", icon: MessageSquare, permissions: [] },
  { path: "/updates", label: "Updates", icon: Megaphone, permissions: [] },
  { path: "/support", label: "Support", icon: HeadphonesIcon, permissions: [] },
];

const userNavItems = [
  { path: "/profile", label: "Profile", icon: User, permissions: [] },
  { path: "/admin", label: "Admin Panel", icon: Settings, permissions: ["view_admin"] },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user, logout, hasPermission } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getRoleIcon = (role: string) => {
    const IconComponent = roleIcons[role as keyof typeof roleIcons] || User;
    return IconComponent;
  };

  const getRoleColor = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || "text-gray-500";
  };

  return (
    <div className="sidebar w-64 h-screen fixed left-0 top-0 z-50 flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-white/20">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BotForge</span>
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      {isAuthenticated && user && (
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarFallback className="bg-white/20 text-white">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center gap-2">
                {(() => {
                  const IconComponent = getRoleIcon(user.role);
                  return <IconComponent className={`h-3 w-3 ${getRoleColor(user.role)}`} />;
                })()}
                <span className="text-white/70 text-xs capitalize">{user.role}</span>
              </div>
            </div>
          </div>
          <Badge 
            className={`w-full justify-center bg-white/10 text-white border-white/20 hover:bg-white/20`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3">
          Navigation
        </div>
        {mainNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "sidebar-nav-item",
                isActive && "active"
              )}>
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* User Section */}
        {isAuthenticated && (
          <>
            <div className="text-white/50 text-xs uppercase tracking-wider font-semibold mt-6 mb-3">
              Account
            </div>
            {userNavItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.path;
              
              // Check permissions
              if (item.permissions.length > 0 && !item.permissions.some(permission => hasPermission(permission))) {
                return null;
              }
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={cn(
                    "sidebar-nav-item",
                    isActive && "active"
                  )}>
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/20">
        {isAuthenticated ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        ) : (
          <div className="space-y-2">
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}