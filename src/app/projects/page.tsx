'use client'; // Add this at the top
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Main Page Component
export default function Page() {
  const [projects, setProjects] = useState([]);

  // Fetch JSON data on component mount
  useEffect(() => {
    fetch('/projects.json') // Fetch from public folder
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects); // Set the projects state
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-2xl font-bold">Project Showcase</h1>

        {/* Check if projects data is loaded */}
        {projects.length > 0 ? (
          <ul className="list-disc">
            {projects.map((project) => (
              <li key={project.id} className="mb-4">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p>{project.description}</p>
                <p className="italic">Type: {project.type}</p>
                <p>Tags: {project.tags.join(', ')}</p>
                <Image
                  src={project.screenshots[0]} // Show the first screenshot
                  alt={project.title}
                  width={300}
                  height={150}
                  className="mt-2"
                />
                <p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visit Project
                  </a>
                </p>
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
