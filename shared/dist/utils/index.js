/**
 * Utility function to create standardized API responses
 */
export function createApiResponse(success, data, error) {
    const response = {
        success,
        timestamp: new Date()
    };
    if (success && data !== undefined) {
        response.data = data;
    }
    if (!success && error) {
        response.error = typeof error === 'string'
            ? { code: 'UNKNOWN_ERROR', message: error }
            : error;
    }
    return response;
}
/**
 * Utility function to format dates consistently
 */
export function formatDate(date) {
    return date.toISOString();
}
/**
 * Utility function to parse dates from API responses
 */
export function parseDate(dateString) {
    return new Date(dateString);
}
/**
 * Utility function to generate unique IDs
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Utility function to validate email addresses
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Utility function to validate usernames
 */
export function isValidUsername(username) {
    // Username should be 3-20 characters, alphanumeric plus underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}
/**
 * Utility function to sanitize text input
 */
export function sanitizeText(text) {
    return text.trim().replace(/\s+/g, ' ');
}
/**
 * Utility function to truncate text
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}
/**
 * Utility function to format file sizes
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Utility function to debounce function calls
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * Utility function to check if a value is empty
 */
export function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return false;
}
/**
 * Utility function to get relative time
 */
export function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return 'just now';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    return date.toLocaleDateString();
}
/**
 * Utility function to capitalize first letter
 */
export function capitalize(text) {
    if (!text)
        return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
/**
 * Utility function to generate avatar initials
 */
export function getAvatarInitials(name) {
    if (!name)
        return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
//# sourceMappingURL=index.js.map