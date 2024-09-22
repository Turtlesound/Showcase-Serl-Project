// /src/app/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/projects.json')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects);
      })
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-2xl font-bold">Project Showcase</h1>

        {projects.length > 0 ? (
          <ul className="list-disc">
            {projects.map((project) => (
              <li key={project.id} className="mb-4">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p>{project.description}</p>
                <p>Type: {project.type}</p>
                <Image
                  src={project.screenshots[0]}
                  alt={project.title}
                  width={300}
                  height={150}
                />
                <div className="mt-2">
                  <Link href={`/projects/${project.id}`} className="text-blue-500 hover:underline mr-4">
                    View Summary
                  </Link>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visit Project
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading projects...</p>
        )}
      </main>
    </div>
  );
}
