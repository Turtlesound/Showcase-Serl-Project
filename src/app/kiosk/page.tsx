'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjects } from '@/lib/projectService'; // Only import the service
import { Project } from '@/lib/projectTypes'; // Import the Project type
import React from 'react'; 
import { QRCodeSVG } from 'qrcode.react'; 

export default function KioskPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // manage search input
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false); // To toggle fullscreen mode

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

  // Initial fetch of projects
  useEffect(() => {
    fetchProjects(); 

    // event listener for fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Filter projects based on the search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProject = filteredProjects[currentIndex];

  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Reset current index when search term changes
    setCurrentIndex(0);
  };

  // Update current index every 5 seconds if there are filtered projects
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (filteredProjects.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length);
      }
    }, 5000); // Change project every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [filteredProjects.length]);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

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
      <div className="min-h-screen p-8">
        <div className="mb-6 w-full md:w-1/2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <p className="text-lg text-gray-600">No projects found.</p>
      </div>
    );
  }

  // Render the current project details
  return (
    <div className={`min-h-screen p-8 ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Conditionally render Search Input based on fullscreen state */}
      {!isFullscreen && (
        <div className="flex justify-between mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            className="border border-gray-300 rounded-md p-2 w-full md:w-1/2"
          />
          <button
            onClick={toggleFullscreen}
            className="ml-4 p-2 bg-blue-500 text-white rounded-md"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="mb-6">
          {/* Check if currentProject is defined before accessing properties */}
          {currentProject ? (
            <>
              {currentProject.screenshots && currentProject.screenshots.length > 0 ? (
                <Image
                  src={currentProject.screenshots[0]}
                  alt={currentProject.title}
                  width={400}
                  height={250}
                  className="rounded-lg object-cover w-full h-auto"
                />
              ) : (
                <div className="w-full h-auto bg-gray-200 flex items-center justify-center rounded-lg" style={{ width: 400, height: 250 }}>
                  <p className="text-gray-600">No image available</p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-auto bg-gray-200 flex items-center justify-center rounded-lg" style={{ width: 400, height: 250 }}>
              <p className="text-gray-600">No project selected</p>
            </div>
          )}
        </div>

        {/* Render project details if currentProject is defined */}
        {currentProject && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{currentProject.title}</h1>
            <p className="text-lg mb-4">{currentProject.description}</p>
            <p className="italic text-sm text-gray-600 mb-2">Type: {currentProject.type}</p>
            <p className="text-sm text-gray-600 mb-2">Tags: {currentProject.tags.join(', ')}</p>
            <p className="text-sm text-gray-600 mb-2">Author: <span className="font-semibold">{currentProject.author}</span></p>
            <p className="text-sm text-gray-600 mb-2">Created: <span className="font-semibold">{new Date(currentProject.created_at).toLocaleDateString()}</span></p>
            <p className="text-sm text-gray-600 mb-2">Updated: <span className="font-semibold">{new Date(currentProject.updated_at).toLocaleDateString()}</span></p>

            <div className="flex items-center mt-4">
              <a
                href={currentProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-lg font-semibold"
              >
                Visit Project
              </a>
              
                  {/* QR Code for the project URL */}
                    <div className="ml-4">
                  <QRCodeSVG value={currentProject.url} size={100} />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background-color: white;
          overflow: auto;
        }
      `}</style>
    </div>
  );
}
