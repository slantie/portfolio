import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimize Cloudinary image URL with transformations
 * Adds f_auto (auto format), q_auto (auto quality), and optional width
 */
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url.includes('cloudinary.com')) return url;
  
  // Build transformation string
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  
  // Insert transformations after /upload/
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
