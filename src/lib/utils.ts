import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// We'll keep this for backward compatibility and to ensure existing components work
export function cn(...inputs: ClassValue[]) {
  return inputs.join(' ');
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

// Get color based on difficulty - return Bulma classes
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'has-background-success';
    case 'medium':
      return 'has-background-warning';
    case 'hard':
      return 'has-background-danger has-background-light';
    case 'expert':
      return 'has-background-danger';
    default:
      return 'has-background-grey-light';
  }
}

// Get color based on rarity - return Bulma classes
export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'has-background-grey-light';
    case 'uncommon':
      return 'has-background-success';
    case 'rare':
      return 'has-background-info';
    case 'epic':
      return 'has-background-purple';
    case 'legendary':
      return 'has-background-warning';
    default:
      return 'has-background-grey-light';
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