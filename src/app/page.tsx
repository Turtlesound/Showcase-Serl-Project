'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // For reading URL query params
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/lib/projectService'; 
import { Project } from '@/lib/projectTypes'; 

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const searchParams = useSearchParams(); // Hook to get the query params
  const searchTerm = searchParams?.get('search') || ''; // Get search term from URL

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(); // Fetch all projects
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
    const intervalId = setInterval(fetchProjects, 60000); // Refetch every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Filter projects based on the search term from URL query params
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Project Showcase
        </h1>

        {/* Display filtered projects */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg bg-white shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:shadow-xl hover:outline hover:outline-grey-500 hover:outline-2"
              >
                <Link href={`/projects/${project.id}`} className="block">
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
                  </div>
                </Link>
                <div className="p-6">
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
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-lg text-gray-600">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
