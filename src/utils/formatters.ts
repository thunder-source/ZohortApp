/**
 * Utility functions for formatting data
 */

/**
 * Format price to display with currency symbol
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Format rating to display with star emoji
 */
export const formatRating = (rating: number): string => {
  return `⭐ ${rating.toFixed(1)}`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

