'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // useRouter to navigate
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/lib/projectService'; // Only import the service
import { Project } from '@/lib/projectTypes'; // Import the Project type

const ProjectsPageContent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const searchParams = useSearchParams(); // Hook to get the query params
  const searchTerm = searchParams?.get('search') || ''; // Get search term from URL
  const router = useRouter(); // For programmatic navigation

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
    const intervalId = setInterval(fetchProjects, 30000); // Refetch every 30 seconds
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

  // Navigate to the projects page with a specific tag as a search parameter
  const handleTagClick = (event: React.MouseEvent, tag: string) => {
    event.preventDefault(); // Prevent the default link behavior
    event.stopPropagation(); // Stop the click event from propagating to the parent link
    router.push(`/projects?search=${tag}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Project Showcase
        </h1>

        {/* Display the number of filtered projects */}
        <div className="text-center mb-4">
          {filteredProjects.length > 0 ? (
            <p className="text-lg text-gray-600">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found.
            </p>
          ) : (
            <p className="text-lg text-gray-600">No projects found.</p>
          )}
        </div>

        {/* Display filtered projects */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg bg-white shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:shadow-xl"
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

                    {/* Clickable Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={(event) => handleTagClick(event, tag)}
                          className="text-blue-500 hover:underline cursor-pointer text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
};

const ProjectsPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading projects...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
};

export default ProjectsPage;
