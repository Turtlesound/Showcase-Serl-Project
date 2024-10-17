'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjectById } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Modal from 'react-modal'; // Import react-modal
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import Head from 'next/head';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      const id = params.id;

      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getProjectById(id);
        if (data) {
          setProject(data);
        } else {
          setProject(null);
        }
      } catch (err: any) {
        setError('Error fetching project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  // Open the modal when an image is clicked
  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc); // Set the image to display
    setIsModalOpen(true); // Show the modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Hide the modal
    setSelectedImage(null); // Reset the selected image
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Project not found.</p>
      </div>
    );
  }

  // Sanitize the HTML content before rendering
  const sanitizedDescription = DOMPurify.sanitize(project.description_long);

  // Handle tag and type navigation
  const handleTagClick = (tag: string) => {
    router.push(`/projects?search=${tag}`);
  };

  const handleTypeClick = (type: string) => {
    router.push(`/projects?search=${type}`);
  };

  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name="description" content={project.description} />
      </Head>

      {/* General Wrapper div */}
      <div className="container mx-auto max-w-full px-4 py-8">
        <div className="min-h-screen bg-gray-50 py-8">
          {/* Main content section */}
          <div className="flex flex-col md:flex-row justify-between px-4 ">
            {/* Top section with grey backdrop */}
            
            <div className="bg-white p-8 rounded-lg flex flex-col md:flex-row gap-8 mb-8 flex-1 mr-0 md:mr-8 shadow-md">
              {/* Screenshot section */}
              <div className="w-full relative h-[500px]">
  <Image
    src={project.screenshots[currentImageIndex]}
    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
    fill
    sizes="100vw"
    className="rounded-lg object-contain cursor-pointe"
    priority={currentImageIndex === 0}
  />
</div>

              {/* Project Info section */}
              <div className="w-full flex flex-col gap-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                {/* Project Description Section */}
                <p className="text-gray-600 mb-4   ">{project.description}</p>

                {/* QR Code and Visit button section */}
                <div className="flex flex-col gap-2">
                  <QRCodeSVG value={project.url} size={140} />
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
                  >
                  </a>
                </div>

                {/* Author and date section */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <p>
                    Author: <span className="font-semibold">{project.author}</span>
                  </p>
                  <p>
                    Created: <span className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</span>
                  </p>
                  <p>
                    Updated: <span className="font-semibold">{new Date(project.updated_at).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              {/* Sidebar with Tags and Type on the right */}
            
            </div>
            <div className="w-full md:w-36 mt-8 md:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 font-semibold">
                  Type:{" "}
                  <span
                    onClick={() => handleTypeClick(project.type)}
                    className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
                  >
                    {project.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 font-semibold mt-4">Tags:</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

          
        </div>
      </div>
    </>
  );
}
