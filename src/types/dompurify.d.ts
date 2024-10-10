declare module 'dompurify' {
    const DOMPurify: {
    sanitize: (dirty: string, options?: any) => string;
    };
    export default DOMPurify;
}
