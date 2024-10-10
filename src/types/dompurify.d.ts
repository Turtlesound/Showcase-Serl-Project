declare module 'dompurify' {
    export type DOMPurifyOptions = {
        ALLOWED_TAGS?: string[];
        ALLOWED_ATTR?: string[];
    };

    export function sanitize(_dirty: string, _options?: DOMPurifyOptions): string; // Rename parameters

    export function setConfig(options: DOMPurifyOptions): void;

    export function isSupported(): boolean;
}
