declare module 'dompurify' {
    export type DOMPurifyOptions = {
        ALLOWED_TAGS?: string[];   // Array of allowed HTML tags
        ALLOWED_ATTR?: string[];   // Array of allowed attributes
    };

    // Sanitizes the input string by removing disallowed tags and attributes
    export function sanitize(_dirty: string, _options?: DOMPurifyOptions): string;

    // Sets global configuration options for DOMPurify
    export function setConfig(_options: DOMPurifyOptions): void; // Renamed to _options

    // Checks if the current browser supports DOMPurify
    export function isSupported(): boolean;
}
