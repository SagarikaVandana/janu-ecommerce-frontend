/**
 * Utility functions for safe array operations
 */

/**
 * Safely checks if a value is an array and has items
 */
export const isArrayWithItems = (value: any): boolean => {
  return Array.isArray(value) && value.length > 0;
};

/**
 * Safely maps over an array, returns empty array if not an array
 */
export const safeMap = <T, R>(
  array: T[] | null | undefined,
  mapper: (item: T, index: number) => R
): R[] => {
  if (!Array.isArray(array)) {
    console.warn('safeMap: Attempted to map over non-array:', array);
    return [];
  }
  return array.map(mapper);
};

/**
 * Safely filters an array, returns empty array if not an array
 */
export const safeFilter = <T>(
  array: T[] | null | undefined,
  predicate: (item: T, index: number) => boolean
): T[] => {
  if (!Array.isArray(array)) {
    console.warn('safeFilter: Attempted to filter non-array:', array);
    return [];
  }
  return array.filter(predicate);
};

/**
 * Safely gets array length, returns 0 if not an array
 */
export const safeLength = (array: any): number => {
  return Array.isArray(array) ? array.length : 0;
};

/**
 * Ensures a value is always an array
 */
export const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [value];
}; 