// page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/projects.json');
      const data = await res.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects(); // Initial fetch
    const intervalId = setInterval(fetchProjects, 60000); // Fetch every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Project Showcase
        </h1>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg bg-white shadow-md overflow-hidden">
                <Image
                  src={project.screenshots[0]}
                  alt={project.title}
                  width={500}
                  height={250}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-600">{project.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Type: {project.type}</p>
                  <div className="mt-4">
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-lg text-gray-600">Loading projects...</p>
          </div>
        )}
      </div>
    </div>
  );
}
