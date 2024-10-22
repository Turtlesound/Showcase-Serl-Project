'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjects, searchProjects } from '@/lib/projectService'; // You'll need to implement these
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';
import Head from 'next/head';

export default function KioskPage({ params }: { params: { search?: string } }) {
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
const searchTerm = params.search || '';
const [, setIsFullscreen] = React.useState(false);




useEffect(() => {
const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
    let data;
    if (searchTerm) {
        data = await searchProjects(searchTerm); // Fetch projects by search term
    } else {
        data = await getProjects(); // Fetch all projects
    }

    if (data && data.length > 0) {
        setProjects(data);
        setCurrentProjectIndex(0); // Reset to the first project on fetch
    } else {
        setProjects([]);
    }
    } catch (err) {
    setError('Error fetching projects');
    } finally {
    setLoading(false);
    }


};


fetchProjects();
}, [searchTerm]);

// Function to cycle to the next project every 30 seconds
useEffect(() => {
    const interval = setInterval(() => {
        setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 3000); // 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
}, [projects]);

// Function to trigger fullscreen, I noticed it is blocked on most browser but if you turn it of on a raspberry it should fullscreen on loading website.
useEffect(() => {
    const requestFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen() // you can add this without request to force fullscreen (not considered "correct")
                .then(() => setIsFullscreen(true))
                .catch((err) => console.error('Fullscreen request failed', err));
        }
    };

    requestFullscreen

    const onFullscreenChange = () => {
        setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
}, []);


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

if (projects.length === 0) {
return (
    <div className="min-h-screen flex items-center justify-center">
    <p className="text-lg text-gray-600">No projects found.</p>
    </div>
);
}

const currentProject = projects[currentProjectIndex];

return (
    <>
    <Head>
        <title>{currentProject.title}</title>
        <meta name="description" content={currentProject.description} />
    </Head>

    {/* General Wrapper div */}
    <div className="container mx-auto max-w-full px-4 py-0">
        <div className="min-h-screen bg-gray-50 py-8">
          {/* Main content section */}
        <div className="flex flex-col justify-between px-4 ">
            {/* Top section with grey backdrop */}
            
            <div className="bg-white p-8 rounded-lg flex flex-col md:flex-row gap-8 mb-4 flex-1 mr-0 shadow-md">


              {/* Project Info section */}
            <div className="md:w-1/4 flex flex-col gap-4 ">
                {/* QR Code and Visit button section */}
                <div className="flex flex-col gap-2">
                <QRCodeSVG value={currentProject.url} size={140} />
                <a
                    href={currentProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
                >
                </a>


                
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">{currentProject.title}</h1>
                {/* Project Description Section */}
                <p className="text-gray-600 mb-4 break-words">{currentProject.description}</p>

                
                {/* Author and date section */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <p>
                    Author: <span className="font-semibold">{currentProject.author}</span>
                </p>
                <p>
                    Created: <span className="font-semibold">{new Date(currentProject.created_at).toLocaleDateString()}</span>
                </p>
                <p>
                    Updated: <span className="font-semibold">{new Date(currentProject.updated_at).toLocaleDateString()}</span>
                </p>

                
                
                </div>

            </div>
                    {/* Screenshot section */}
                    <div className="flex-1 flex flex-wrap gap-4 ">
                    {currentProject.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative w-full flex-1 flex-wrap h-[500px]">  {/*  max-sm:h-[500px] add this in div to make screenshot show in smaller screens */} 
                        <Image
                            src={screenshot}
                            alt={`${currentProject.title} screenshot ${index + 1}`}
                            fill
                            onError={(e) => { e.currentTarget.src = '/noscreenshot.png'; }}
                            className="rounded-lg object-contain cursor-pointer"
                        />
                        </div>
                    ))}
                    </div>

                
            </div>
            {/* Sidebar with Tags and Type on the right */}
            <div className="w-full mt-0 ">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 font-semibold">
                Type:{" "}
                <span
                    className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold"
                >
                    {currentProject.type}
                </span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 font-semibold mt-4">
                Tags: 
                {currentProject.tags.map((tag) => (
                    <span
                    key={tag}
                    className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold"
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

