// /src/app/projects/[id]/ProjectDetails.tsx
'use client';  

import Image from 'next/image';

export default function ProjectDetails({ projectData }) {
  const { title, description, type, tags, author, created_at, updated_at, url, screenshots } = projectData;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <Image
        src={screenshots[0]}
        alt={title}
        width={600}
        height={300}
        className="mb-4"
      />
      <p>{description}</p>
      <p className="italic mt-2">Type: {type}</p>
      <p>Tags: {tags.join(', ')}</p>
      <p>Author: {author}</p>
      <p>Created: {created_at}</p>  {/* Use the ISO format directly */}
      <p>Updated: {updated_at}</p>  {/* Use the ISO format directly */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        Visit Project
      </a>
    </div>
  );
}
