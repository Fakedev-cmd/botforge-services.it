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
    return this.state.user?.role === "admin";
  }

  isCustomer(): boolean {
    return this.state.user?.role === "customer";
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
    getCurrentUser: authManager.getCurrentUser.bind(authManager)
  };
}
