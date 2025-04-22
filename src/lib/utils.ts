import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Updated to properly merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Format time in seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get color based on difficulty - return Tailwind classes
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-500 text-white';
    case 'medium':
      return 'bg-amber-500 text-white';
    case 'hard':
      return 'bg-orange-500 text-white';
    case 'expert':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
}

// Get color based on rarity - return Tailwind classes
export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'bg-gray-200 text-gray-700';
    case 'uncommon':
      return 'bg-green-500 text-white';
    case 'rare':
      return 'bg-blue-500 text-white';
    case 'epic':
      return 'bg-purple-500 text-white';
    case 'legendary':
      return 'bg-amber-500 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

// Get category icon name - unchanged
export function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case 'problem-solving':
      return 'brain';
    case 'leadership':
      return 'users';
    case 'communication':
      return 'message-square';
    case 'technical':
      return 'code';
    case 'creativity':
      return 'lightbulb';
    default:
      return 'star';
  }
}