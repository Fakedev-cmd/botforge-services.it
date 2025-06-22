import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: string | number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TK-${year}-${randomNum}`;
}

export function getStatusBadgeClass(status: string, type: 'ticket' | 'order' | 'user' = 'ticket'): string {
  const baseClass = `${type}-status-badge`;
  return `${baseClass} ${type}-status-${status.toLowerCase().replace('_', '-')}`;
}

export function getPriorityBadgeClass(priority: string): string {
  return `priority-badge priority-${priority.toLowerCase()}`;
}

export function getRoleBadgeClass(role: string): string {
  return `role-badge role-${role.toLowerCase()}`;
}

export function getRoleIcon(role: string): string {
  const icons = {
    owner: "👑",
    manager: "🛡️", 
    developer: "💻",
    customer: "🛒",
    user: "👤"
  };
  return icons[role as keyof typeof icons] || "👤";
}
