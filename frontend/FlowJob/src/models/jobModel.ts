// models/jobModel.ts

import { Timestamp } from 'firebase/firestore'; // Import Firestore Timestamp type

export interface Job {
    id: string;                     // Unique ID for the job posting
    business_id: string;            // ID of the Business posting the job (links to Business model)

    // --- Core Job Details ---
    title: string;                  // Job title (e.g., "Frontend Developer")
    industry: string;               // Industry (e.g., "Technology", "Healthcare")
    description: string;            // Detailed job description
    tags: string[];                 // Keywords for the role/responsibilities (e.g., "React", "Node.js", "UI/UX")
    experience_required: string;    // e.g., "Entry-level", "3-5 years", "Senior"
    skills_needed: string[];        // Specific skills required (e.g., "TypeScript", "AWS", "Figma")
    availability: string;           // e.g., "Full-time", "Part-time", "Contract"

    // --- Location ---
    location_lat?: number;          // Latitude (optional if fully remote)
    location_lng?: number;          // Longitude (optional if fully remote)
    location_address?: string;       // Displayable location (e.g., "123 Main St, Anytown" or "Remote (Israel)")
    is_remote?: boolean;            // Flag indicating if the job is fully remote

    // --- Compensation & Requirements ---
    salary_min?: number;             // Optional minimum salary (consider ranges for privacy/flexibility)
    salary_max?: number;             // Optional maximum salary
    minimum_age?: number;           // Optional minimum age requirement
    benefits?: string[];            // List of key benefits offered (e.g., "Health Insurance", "Paid Time Off", "Stock Options")

    // --- Business Context (can be denormalized for easy display) ---
    business_name?: string;         // Name of the business (pulled from Business profile)
    logo_url?: string;              // Logo URL (pulled from Business profile)
    imageUrls?: string[];           // Optional additional images related to the job/team/office

    // --- Application State & Matching ---
    is_active: boolean;             // Is the job posting currently active and visible?
    applicants: string[];           // Array of Worker IDs who have liked/applied (swiped right)
    matches: string[];              // Array of Worker IDs where both parties liked each other
    rejected: { [workerId: string]: boolean }; // Map of Worker IDs rejected by the business (swiped left)
    employee_distance?: number;     // *Consider removing*: Calculate this dynamically during matching based on worker location preference

    // --- System Information ---
    created_at: Timestamp;          // Firestore Timestamp for creation date
    updated_at?: Timestamp;         // Firestore Timestamp for last update
    posted_by_user_id?: string;     // ID of the user within the business who posted the job
}