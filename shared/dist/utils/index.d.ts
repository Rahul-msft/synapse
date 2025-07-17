import { ApiResponse, ApiError } from '../types';
/**
 * Utility function to create standardized API responses
 */
export declare function createApiResponse<T>(success: boolean, data?: T, error?: string | ApiError): ApiResponse<T>;
/**
 * Utility function to format dates consistently
 */
export declare function formatDate(date: Date): string;
/**
 * Utility function to parse dates from API responses
 */
export declare function parseDate(dateString: string): Date;
/**
 * Utility function to generate unique IDs
 */
export declare function generateId(): string;
/**
 * Utility function to validate email addresses
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Utility function to validate usernames
 */
export declare function isValidUsername(username: string): boolean;
/**
 * Utility function to sanitize text input
 */
export declare function sanitizeText(text: string): string;
/**
 * Utility function to truncate text
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Utility function to format file sizes
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Utility function to debounce function calls
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Utility function to check if a value is empty
 */
export declare function isEmpty(value: any): boolean;
/**
 * Utility function to get relative time
 */
export declare function getRelativeTime(date: Date): string;
/**
 * Utility function to capitalize first letter
 */
export declare function capitalize(text: string): string;
/**
 * Utility function to generate avatar initials
 */
export declare function getAvatarInitials(name: string): string;
//# sourceMappingURL=index.d.ts.map