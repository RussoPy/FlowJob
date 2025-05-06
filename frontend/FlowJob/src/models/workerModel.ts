// models/workerModel.ts

export interface Worker {
    // --- Core Identification & Personal Info ---
    id: string;                      // Corresponds to Firebase Auth UID
    email: string;                   // User's email (likely from Auth)
    firstName: string;
    lastName: string;
    username?: string;                // Optional username
    phone?: string;                  // Optional phone number
    birth_date: any;                 // Firestore Timestamp or string (to calculate age if needed)
    profilePictureUrl?: string;      // URL for profile picture
  
    // --- Professional Profile ---
    headline?: string;               // Short professional headline (e.g., "Software Engineer | React Developer")
    summary?: string;                // Longer professional summary/bio
    experience_level: string;        // e.g., "Entry-level", "Intermediate", "Senior" (Matches Job's experience_required)
    skills: string[];                // List of skills (Matches Job's skills_needed)
    preferred_tags: string[];        // Job roles or types the worker is interested in (Matches Job's tags)
    industry_preference?: string;    // Preferred industry (Matches Job's industry)
    resumeUrl?: string;              // Optional link to a resume PDF/doc
    portfolioUrl?: string;           // Optional link to a portfolio website
  
    // --- Job Preferences ---
    location_lat?: number;           // Worker's current or preferred base latitude
    location_lng?: number;           // Worker's current or preferred base longitude
    job_search_radius: number;       // Maximum distance (in km or miles) they are willing to commute/relocate
    salary_min: number;              // Minimum desired salary (Matches Job's salary range)
    salary_max: number;              // Maximum desired salary (Matches Job's salary range)
    availability: string;            // e.g., "Full-time", "Part-time", "Contract", "Internship" (Matches Job's availability)
    willing_to_relocate?: boolean;   // Whether the worker is open to relocating
  
    // --- Application State & Matching ---
    liked_jobs: string[];            // Array of Job IDs the worker has swiped right on / liked
    matched_jobs: string[];          // Array of Job IDs where both worker and business liked each other
    disliked_jobs: { [jobId: string]: boolean }; // Map of Job IDs the worker has swiped left on / rejected (key: jobId, value: true)
  
    // --- System Information ---
    profileComplete: boolean;        // Flag indicating if the profile setup is finished
    created_at: any;                 // Firestore Timestamp or string
    last_updated_at?: any;           // Firestore Timestamp or string
  }