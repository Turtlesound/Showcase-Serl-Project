// src/app/kiosk/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'; // For reading URL query params
import { getProjects } from '@/lib/projectService'; // Only import the service
import { Project } from '@/lib/projectTypes'; // Import the Project type

export default function KioskPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetching projects from the API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects(); // Fetch all projects
      setProjects(data);
    } catch (err: any) {
      setError('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // Initial fetch
    const intervalId = setInterval(() => {
      if (projects.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }
    }, 5000); // Change project every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [projects.length]);

  // Filter projects based on the search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProject = filteredProjects[currentIndex];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading project...</p>
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">Error: {error}</p>
      </div>
    );
  }

  // No projects found
  if (filteredProjects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">No projects found.</p>
      </div>
    );
  }

  // Render the current project details
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="mb-6">
          <Image
            src={currentProject.screenshots[0]}
            alt={currentProject.title}
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-auto"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{currentProject.title}</h1>
          <p className="text-lg mb-4">{currentProject.description}</p>
          <p className="italic text-sm text-gray-600 mb-2">Type: {currentProject.type}</p>
          <p className="text-sm text-gray-600 mb-2">Tags: {currentProject.tags.join(', ')}</p>
          <p className="text-sm text-gray-600 mb-2">Author: <span className="font-semibold">{currentProject.author}</span></p>
          <p className="text-sm text-gray-600 mb-2">Created: <span className="font-semibold">{new Date(currentProject.created_at).toLocaleDateString()}</span></p>
          <p className="text-sm text-gray-600 mb-2">Updated: <span className="font-semibold">{new Date(currentProject.updated_at).toLocaleDateString()}</span></p>
          <a
            href={currentProject.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
          >
            Visit Project
          </a>
        </div>
      </div>
    </div>
  );
}
