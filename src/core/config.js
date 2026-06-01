/**
 * Configuration variables for the application.
 * You can also use environment variables in the future by adding a .env file
 * and referencing it here like: import.meta.env.VITE_API_BASE_URL
 */

// In development, this is an empty string so it hits Vite's /api proxy.
// In production, it points directly to the deployed Digital Ocean backend.
export const API_BASE_URL = import.meta.env.PROD 
  ? 'http://167.172.74.173' 
  : '';
