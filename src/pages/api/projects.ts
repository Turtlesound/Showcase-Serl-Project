// src/pages/api/projects.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Define the handler function for the API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct the path to the JSON file
  const filePath = path.join(process.cwd(), 'public', 'projects.json');
  
  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading projects.json:', err);
      res.status(500).json({ error: 'Failed to read projects data' });
      return;
    }

    // Parse the JSON data
    const projects = JSON.parse(data);
    
    // Return the project data as a JSON response
    res.status(200).json(projects);
  });
}
