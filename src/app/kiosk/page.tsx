'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjects } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';

export default function KioskPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetching projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase();
    return (
      project.title?.toLowerCase().includes(search) ||
      project.tags?.some(tag => tag.toLowerCase().includes(search)) ||
      project.type?.toLowerCase().includes(search) ||
      project.author?.toLowerCase().includes(search) ||
      project.description?.toLowerCase().includes(search)
    );
  });

  const currentProject = filteredProjects[currentIndex];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentIndex(0);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (filteredProjects.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [filteredProjects.length]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold animate-pulse">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center flex-col">
        <div className="mb-6 w-full md:w-1/2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            className="border border-gray-300 rounded-md p-2 w-full transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-lg text-gray-600">No projects found.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center justify-center ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Search Input and Fullscreen Toggle */}
      {!isFullscreen && (
        <div className="flex justify-between mb-6 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            className="border border-gray-300 rounded-md p-2 w-full md:w-1/2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={toggleFullscreen}
            className="ml-4 p-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 text-lg transition duration-200"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </button>
        </div>
      )}

      {/* Project Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Screenshots Section */}
        <div className="flex flex-col items-center">
          {currentProject?.screenshots && currentProject.screenshots.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              {currentProject.screenshots.slice(0, 4).map((screenshot, index) => (
                <div key={index} className="relative w-full h-full">
                  <Image
                    src={screenshot || '/placeholder.png'}
                    alt={`${currentProject.title} screenshot ${index + 1}`}
                    layout="responsive"
                    width={800} // Use a base width
                    height={450} // Use a base height
                    className="object-cover w-full max-h-[calc(100vh-4rem)]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg shadow">
              <p className="text-gray-600 text-2xl">No images available</p>
            </div>
          )}
        </div>

        {/* Project Info Section */}
        {currentProject && (
          <div className="lg:max-w-3xl text-center lg:text-left">
            <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{currentProject.title || 'Untitled'}</h1>
            <p className="text-sm text-gray-800 mb-4">{currentProject.description || 'No description available'}</p>
            <p className="text-sm text-gray-700 mb-2">Type: <span className="font-semibold">{currentProject.type || 'Unknown'}</span></p>
            <p className="text-sm text-gray-700 mb-2">Tags: <span className="font-semibold">{currentProject.tags?.join(', ') || 'No tags available'}</span></p>
            <p className="text-sm text-gray-700 mb-2">Author: <span className="font-semibold">{currentProject.author || 'Unknown'}</span></p>
            <p className="text-sm text-gray-700 mb-2">Created: <span className="font-semibold">{currentProject.created_at ? new Date(currentProject.created_at).toLocaleDateString() : 'N/A'}</span></p>
            <p className="text-sm text-gray-700 mb-2">Updated: <span className="font-semibold">{currentProject.updated_at ? new Date(currentProject.updated_at).toLocaleDateString() : 'N/A'}</span></p>

            {/* Visit Button and QR Code */}
            <div className="flex items-center mt-4 justify-center lg:justify-start">
              {currentProject.url && (
                <>
                  <a
                    href={currentProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-lg font-semibold"
                  >
                  </a>
                  <div className="">
                    <QRCodeSVG value={currentProject.url} size={180} />
                  </div>
                </>
              )}
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
          justify-content: center;
          align-items: center;
          background-color: #ffffff; /* Changed to white for better contrast */
          overflow: auto;
          padding: 20px; /* Added padding for better spacing */
        }

        .fullscreen .grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 20px; /* Adjusted gap for better spacing */
        }

        .fullscreen img {
          width: 100% !important;
          height: 100% !important;
        }

        .fullscreen h1 {
          font-size: 3rem !important; /* Adjusted font size for full screen */
          color: #1a202c; /* Darker text for better visibility */
        }

        .fullscreen .text-sm {
          font-size: 1.4rem !important; /* Adjusted for full screen */
          color: #4a5568; /* Darker text */
        }

        .fullscreen .text-lg {
          font-size: 1.6rem !important; /* Adjusted for full screen */
          color: #4a5568; /* Darker text */
        }
      `}</style>
    </div>
  );
}
