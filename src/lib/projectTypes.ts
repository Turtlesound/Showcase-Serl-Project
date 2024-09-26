// src/lib/projectTypes.ts
export interface Project {
    id: string;
    title: string;
    description: string;
    type: string;
    tags: string[];
    screenshots: string[];
    url: string;
    created_at: string;
    updated_at: string;
    author: string;
}