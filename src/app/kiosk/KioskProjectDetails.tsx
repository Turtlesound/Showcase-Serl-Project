// src/app/kiosk/KioskProjectDetails.tsx

import Image from 'next/image';
import { Project } from '@/lib/projectService'; // Import Project type

interface KioskProjectDetailsProps {
  project: Project; // Receive the project object as props
}

export default function KioskProjectDetails({ project }: KioskProjectDetailsProps) {
  return (
    <div className="rounded-lg bg-white shadow-md overflow-hidden">
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
  );
}
