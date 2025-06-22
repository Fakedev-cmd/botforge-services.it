import { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false
  };

  private listeners: ((state: AuthState) => void)[] = [];

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  login(user: User) {
    this.state = {
      user,
      isAuthenticated: true
    };
    this.notify();
  }

  logout() {
    this.state = {
      user: null,
      isAuthenticated: false
    };
    this.notify();
  }

  isAdmin(): boolean {
    return this.state.user?.role === "owner" || this.state.user?.role === "manager";
  }

  isCustomer(): boolean {
    return this.state.user?.role === "customer";
  }

  isDeveloper(): boolean {
    return this.state.user?.role === "developer";
  }

  isOwner(): boolean {
    return this.state.user?.role === "owner";
  }

  isManager(): boolean {
    return this.state.user?.role === "manager";
  }

  hasPermission(action: string): boolean {
    const role = this.state.user?.role;
    if (!role) return false;

    const permissions = {
      owner: ["all"],
      manager: ["manage_users", "manage_orders", "manage_tickets", "publish_updates", "view_admin"],
      developer: ["manage_tickets", "view_analytics"],
      customer: ["create_reviews", "create_tickets", "view_orders"],
      user: ["create_tickets"]
    };

    return permissions[role as keyof typeof permissions]?.includes(action) || 
           permissions[role as keyof typeof permissions]?.includes("all") || false;
  }

  getCurrentUser(): User | null {
    return this.state.user;
  }
}

export const authManager = new AuthManager();

// Hook for React components
import { useState, useEffect } from "react";

export function useAuth() {
  const [authState, setAuthState] = useState(authManager.getState());

  useEffect(() => {
    return authManager.subscribe(setAuthState);
  }, []);

  return {
    ...authState,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    isAdmin: authManager.isAdmin.bind(authManager),
    isCustomer: authManager.isCustomer.bind(authManager),
    isDeveloper: authManager.isDeveloper.bind(authManager),
    isOwner: authManager.isOwner.bind(authManager),
    isManager: authManager.isManager.bind(authManager),
    hasPermission: authManager.hasPermission.bind(authManager),
    getCurrentUser: authManager.getCurrentUser.bind(authManager)
  };
}
