import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Number formatting utilities
export function formatNumber(num: number | undefined | null): string {
  // Handle undefined, null, or non-numeric values
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  if (numValue >= 1e9) {
    return (numValue / 1e9).toFixed(1) + 'B';
  }
  if (numValue >= 1e6) {
    return (numValue / 1e6).toFixed(1) + 'M';
  }
  if (numValue >= 1e3) {
    return (numValue / 1e3).toFixed(1) + 'K';
  }
  return numValue.toString();
}

export function formatPercent(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0.0%';
  }
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) {
    return '0.0%';
  }
  return (numValue * 100).toFixed(1) + '%';
}

export function formatNumberWithCommas(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) {
    return '0';
  }
  return numValue.toLocaleString();
}

// Date formatting utilities
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
