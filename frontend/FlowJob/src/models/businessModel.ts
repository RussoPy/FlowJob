// src/models/businessModel.ts

import { Timestamp } from 'firebase/firestore';

export interface Business {
    // --- Core Business Identification ---
    businessId: string;            // Unique identifier for the business (will be user.uid)
    name: string;                  // Official name of the business
    industry: string;              // Primary industry (e.g., "Technology", "Retail", "Hospitality")

    // --- Business Description ---
    header: string;                // Short tagline or headline describing the business
    summary: string;               // Detailed description of the business, its mission, culture, etc.
    websiteUrl?: string;           // Optional URL for the business's website
    logoUrl?: string;              // URL for the business's logo
    businessImageUrls?: string[];  // Optional URLs for images showcasing the business (office, team, products)

    // --- Location ---
    location_address: string;      // Primary physical address or main operational area
    location_lat?: number;         // Latitude of the primary location
    location_lng?: number;         // Longitude of the primary location

    // --- Contact & Admin ---
    contactEmail?: string;         // General contact email for the business
    contactPhone?: string;         // General contact phone number
    associatedUserIds: string[];   // IDs of users authorized to manage this business profile

    // --- Additional Business Details (Optional but useful) ---
    size?: string;                 // Estimated company size (e.g., "1-10 employees", "50-200 employees")
    foundedYear?: number;          // Year the business was founded

    // --- Embedded Job Postings ---
    jobs: Job[]; // This will initially be an empty array and filled later.

    // --- System Information ---
    createdAt: Timestamp;          // Firestore Timestamp for when the business profile was created
    updatedAt?: Timestamp;         // Firestore Timestamp for the last update to the business profile
}

export interface Job {
    // --- Core Job Identification ---
    jobId: string;                 // Unique identifier for this specific job posting
    businessId: string;            // Foreign key linking back to the Business (important for queries)

    // --- Job Details ---
    title: string;                 // Job title (e.g., "Software Engineer", "Barista", "Marketing Manager")
    description: string;           // Detailed description of the role, responsibilities, and expectations
    tags?: string[];               // Keywords relevant to the job (e.g., "customer service", "java", "sales")
    experience_required?: string;  // Required level of experience (e.g., "Entry-level", "2+ years", "Senior")
    skills_needed?: string[];      // Specific skills required (e.g., "JavaScript", "POS Systems", "SEO")
    availability: string;          // Employment type (e.g., "Full-time", "Part-time", "Contract", "Internship")

    // --- Job Location ---
    location_address?: string;     // Displayable location for *this job*
    location_lat?: number;         // Latitude for the job location (if applicable)
    location_lng?: number;         // Longitude for the job location (if applicable)
    is_remote: boolean;            // Flag indicating if the job is fully remote

    // --- Compensation & Benefits ---
    salary_min?: number;           // Optional minimum salary (numeric value)
    salary_max?: number;           // Optional maximum salary (numeric value)
    salary_unit?: string;          // e.g.,per hour/month
    benefits?: string[];           // List of key benefits offered for this role

    // --- Requirements ---
    minimum_age?: number;          // Optional minimum age requirement for this specific job (above 13 minimum)

    // --- Job Specific Media ---
    jobImageUrls?: string[];       // Optional images specific to this job posting

    // --- Application Tracking & Status ---
    is_active: boolean;            // Is the job posting currently active and accepting applications?
    applicants: string[];          // Array of Worker IDs who have applied/swiped right
    matches: string[];             // Array of Worker IDs where both business and worker showed interest
    rejected: { [workerId: string]: Timestamp }; // Map of Worker IDs rejected by the business, potentially storing *when* they were rejected

    // --- System Information ---
    createdAt: Timestamp;          // Firestore Timestamp for when the job was posted
    updatedAt?: Timestamp;         // Firestore Timestamp for the last update to the job posting
    postedByUserId: string;        // ID of the user within the business who posted/manages this job
    expiryDate?: Timestamp;        // Optional: Date when the job posting automatically becomes inactive
}