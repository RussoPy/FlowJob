import uuid
import random
from django.core.management.base import BaseCommand
# Ensure db is your initialized Firestore client (e.g., from firebase_admin)
from base.firebase_config import db
from google.cloud import firestore # Import firestore namespace specifically for SERVER_TIMESTAMP and ArrayUnion if needed later
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Define some sample data for consistency
# (Keep your existing SAMPLE_SKILLS, SAMPLE_TAGS, etc. or refine them)
SAMPLE_SKILLS = ['Communication', 'Customer Service', 'Sales', 'Problem Solving', 'Python', 'JavaScript', 'React', 'Node.js', 'Data Entry', 'Project Management', 'Cooking', 'Cleaning', 'Driving', 'Cash Handling']
SAMPLE_TAGS = ['Retail', 'Hospitality', 'Technology', 'Food Service', 'Customer Support', 'Office Admin', 'Warehouse', 'Construction', 'Education', 'Healthcare']
SAMPLE_INDUSTRIES = ['Technology', 'Retail', 'Hospitality', 'Healthcare', 'Finance', 'Education', 'Construction', 'Food & Beverage']
EXPERIENCE_LEVELS = ['Entry-level', 'Intermediate', 'Senior', 'Expert'] # Match worker model
AVAILABILITY_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Flexible Hours', 'Remote', 'On-Site', 'Hybrid']
BENEFITS_LIST = ['Health Insurance', 'Paid Time Off (PTO)', 'Dental Insurance', 'Vision Insurance', '401(k)', 'Flexible Schedule', 'Remote Work Options', 'Paid Sick Leave', 'Employee Discount']
SALARY_UNITS = ['hour', 'month']

class Command(BaseCommand):
    help = 'Populate Firebase Firestore with fake users (Workers/Businesses), jobs, and swipe data'

    def add_arguments(self, parser):
        parser.add_argument('--num_workers', type=int, default=10, help='Number of worker users to create')
        parser.add_argument('--num_businesses', type=int, default=5, help='Number of business users to create')
        parser.add_argument('--num_jobs', type=int, default=20, help='Number of jobs to create')

    def handle(self, *args, **kwargs):
        num_workers = kwargs['num_workers']
        num_businesses = kwargs['num_businesses']
        num_jobs = kwargs['num_jobs']

        self.stdout.write("Starting population...")

        # Populate Users (Workers and Businesses)
        user_data = self.populate_users(num_workers, num_businesses)
        worker_ids = user_data['worker_ids']
        business_ids = user_data['business_ids']

        # Populate Jobs, linking to business users
        job_ids = []
        if business_ids:
             job_ids = self.populate_jobs(num_jobs, business_ids)
        else:
             self.stdout.write(self.style.WARNING("No business users created, skipping job population."))

        # Populate Swipes for workers on available jobs
        if worker_ids and job_ids:
             self.populate_swipes(worker_ids, job_ids)
        else:
             self.stdout.write(self.style.WARNING("Skipping swipe population due to missing worker IDs or job IDs."))

        self.stdout.write(self.style.SUCCESS("✅ Population complete!"))

    # Updated populate_users function

    def populate_users(self, worker_count, business_count):
        self.stdout.write(f"Creating {worker_count} worker users and {business_count} business users in 'users' collection...")
        worker_ids = []
        business_ids = []
        batch = db.batch()
        total_users = worker_count + business_count
        created_count = 0

        # --- Create Worker Users ---
        for i in range(worker_count):
            user_id = str(uuid.uuid4())
            worker_ids.append(user_id)
            user_ref = db.collection('users').document(user_id)

            first_name = fake.first_name()
            last_name = fake.last_name()
            birth_dt = fake.date_of_birth(minimum_age=18, maximum_age=60)
            # --- Create Python datetime object ---
            birth_datetime = datetime.combine(birth_dt, datetime.min.time())
            min_sal_worker = round(random.randint(50, 150) / 10) * 10
            max_sal_worker = min_sal_worker + round(random.randint(10, 100) / 10) * 10

            doc = {
                'id': user_id,
                'role': 'Worker',
                'email': fake.unique.email(),
                'firstName': first_name,
                'lastName': last_name,
                'username': fake.unique.user_name(),
                'phone': fake.phone_number(),
                # --- Assign Python datetime directly ---
                'birth_date': birth_datetime, # Library will convert this to Timestamp
                'profileImage': fake.image_url(), # Corrected field name
                'headline': fake.catch_phrase(),
                'summary': fake.paragraph(nb_sentences=3),
                'experience_level': random.choice(EXPERIENCE_LEVELS),
                'skills': random.sample(SAMPLE_SKILLS, k=random.randint(3, 8)),
                'preferred_tags': random.sample(SAMPLE_TAGS, k=random.randint(1, 4)), # Corrected field name
                'industry_preference': random.choice(SAMPLE_INDUSTRIES + [None]),
                'resumeUrl': None,
                'portfolioUrl': None,
                'location_lat': round(random.uniform(29.5, 33.3), 6),
                'location_lng': round(random.uniform(34.2, 35.9), 6),
                'job_search_radius': random.choice([10, 25, 50, 100]),
                'salary_min': min_sal_worker,
                'salary_max': max_sal_worker,
                'salary_unit': random.choice(SALARY_UNITS),
                'availability': random.sample(AVAILABILITY_TYPES, k=random.randint(1, 3)),
                'willing_to_relocate': fake.boolean(chance_of_getting_true=15),
                'liked_jobs': [],
                'matched_jobs': [],
                'disliked_jobs': {},
                'profileComplete': fake.boolean(chance_of_getting_true=80),
                 # --- Use SERVER_TIMESTAMP sentinel value ---
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_updated_at': firestore.SERVER_TIMESTAMP,
            }
            batch.set(user_ref, doc)
            created_count += 1
            if created_count % 499 == 0:
                batch.commit()
                batch = db.batch()
                self.stdout.write(f"  -> Committed batch at {created_count}/{total_users} users")

        # --- Create Business Users (No Timestamp changes needed here) ---
        for i in range(business_count):
            user_id = str(uuid.uuid4())
            business_ids.append(user_id)
            user_ref = db.collection('users').document(user_id)

            first_name_user = fake.first_name()
            last_name_user = fake.last_name()
            business_name_fake = fake.company()

            min_sal_job = round(random.randint(6000, 20000) / 100) * 100
            max_sal_job = min_sal_job + round(random.randint(1000, 10000) / 100) * 100

            doc = {
                'id': user_id,
                'role': 'Business',
                'email': fake.unique.email(),
                'firstName': first_name_user,
                'lastName': last_name_user,
                'username': fake.unique.user_name(),
                'phone': fake.phone_number(),
                'profileComplete': fake.boolean(chance_of_getting_true=60),
                # --- Use SERVER_TIMESTAMP sentinel value ---
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_updated_at': firestore.SERVER_TIMESTAMP,

                # --- Fields shown in Business User screenshot ---
                'business_name': business_name_fake,
                'logo_url': fake.image_url(),
                'job_title': fake.job(),
                'job_description': fake.paragraph(nb_sentences=4),
                'job_availability': random.choice(AVAILABILITY_TYPES),
                'job_experience_required': random.choice(EXPERIENCE_LEVELS),
                'job_location_address': fake.address(),
                'job_minimum_age': random.choice([None, 16, 18]),
                'job_salary_min': min_sal_job,
                'job_salary_max': max_sal_job,
                'job_salary_unit': random.choice(SALARY_UNITS),
                'job_benefits': random.sample(BENEFITS_LIST, k=random.randint(0, 5)),
                'job_skills_needed': random.sample(SAMPLE_SKILLS, k=random.randint(2, 6)),
                'job_tags': random.sample(SAMPLE_TAGS, k=random.randint(1, 4)),

                'liked_workers': {},
                'disliked_workers': {},
                'matched_workers': [],
            }
            batch.set(user_ref, doc)
            created_count += 1
            if created_count % 499 == 0:
                batch.commit()
                batch = db.batch()
                self.stdout.write(f"  -> Committed batch at {created_count}/{total_users} users")

        batch.commit() # Commit final batch
        self.stdout.write(self.style.SUCCESS(f"  -> {worker_count} workers and {business_count} businesses added to 'users' collection"))
        return {'worker_ids': worker_ids, 'business_ids': business_ids}


    def populate_jobs(self, count, business_user_ids):
        # This function now creates documents in a separate 'jobs' collection,
        # but links them to a user with role 'Business' via business_id.
        self.stdout.write(f"Creating {count} jobs linked to business users...")
        job_ids = []
        batch = db.batch()
        created_count = 0

        for i in range(count):
            job_id = str(uuid.uuid4())
            job_ids.append(job_id)
            job_ref = db.collection('jobs').document(job_id) # Target 'jobs' collection

            # Assign job to a random business user
            assigned_business_user_id = random.choice(business_user_ids)

            min_sal = round(random.randint(6000, 20000) / 100) * 100
            max_sal = min_sal + round(random.randint(1000, 10000) / 100) * 100
            is_remote_job = fake.boolean(chance_of_getting_true=15)

            doc = {
                'id': job_id,
                'business_id': assigned_business_user_id, # Link to the User ID with role: Business

                # --- Core Job Details (Reflecting Job Interface) ---
                'title': fake.job(),
                'industry': random.choice(SAMPLE_INDUSTRIES),
                'description': fake.paragraph(nb_sentences=5),
                'tags': random.sample(SAMPLE_TAGS, k=random.randint(1, 4)),
                'experience_required': random.choice(EXPERIENCE_LEVELS),
                'skills_needed': random.sample(SAMPLE_SKILLS, k=random.randint(2, 5)),
                'availability': random.choice(AVAILABILITY_TYPES),

                # --- Location ---
                'location_lat': None if is_remote_job else round(random.uniform(29.5, 33.3), 6),
                'location_lng': None if is_remote_job else round(random.uniform(34.2, 35.9), 6),
                'location_address': "Remote" if is_remote_job else fake.address(),
                'is_remote': is_remote_job,

                # --- Compensation & Requirements ---
                'salary_min': min_sal,
                'salary_max': max_sal,
                'minimum_age': random.choice([None, 16, 18, 21]),
                'benefits': random.sample(BENEFITS_LIST, k=random.randint(0, 4)),
                'salary_unit': random.choice(SALARY_UNITS), # Added salary unit for job

                # --- Business Context (Optional Denormalized - can be fetched via business_id) ---
                # 'business_name': assigned_business['name'], # Can fetch from user doc if needed
                # 'logo_url': assigned_business['logo_url'], # Can fetch from user doc if needed
                'imageUrls': [fake.image_url() for _ in range(random.randint(0, 3))],

                # --- Application State & Matching ---
                'is_active': True,
                'applicants': [],
                'matches': [],
                'rejected': {},

                # --- System Information ---
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'posted_by_user_id': assigned_business_user_id, # User who posted
            }

            batch.set(job_ref, doc)
            created_count += 1
            if created_count % 499 == 0:
                batch.commit()
                batch = db.batch()
                self.stdout.write(f"  -> Committed batch at {created_count}/{count} jobs")

        batch.commit() # Commit final batch
        self.stdout.write(self.style.SUCCESS(f"  -> {count} jobs added to 'jobs' collection"))
        return job_ids


    def populate_swipes(self, worker_user_ids, job_ids):
        # This function now targets users/{worker_id}/swipes/data
        self.stdout.write(f"Populating swipes for {len(worker_user_ids)} workers on {len(job_ids)} jobs...")

        if not job_ids:
            self.stdout.write(self.style.WARNING("  -> No jobs available to swipe on. Skipping swipe population."))
            return

        total_swipes_populated = 0
        batch = db.batch()
        processed_count = 0

        for worker_id in worker_user_ids:
            num_jobs_to_swipe = random.randint(int(len(job_ids) * 0.3), int(len(job_ids) * 0.8))
            if num_jobs_to_swipe == 0 and len(job_ids) > 0:
                num_jobs_to_swipe = 1

            swiped_job_ids = random.sample(job_ids, k=min(num_jobs_to_swipe, len(job_ids)))

            num_likes = random.randint(int(len(swiped_job_ids) * 0.2), int(len(swiped_job_ids) * 0.7))
            liked_jobs = swiped_job_ids[:num_likes]
            disliked_jobs = swiped_job_ids[num_likes:]

            if not liked_jobs and not disliked_jobs:
                continue

            # --- Reference the subcollection under the 'users' collection ---
            swipe_ref = db.collection('users').document(worker_id).collection('swipes').document('data')

            # Prepare update data using FieldValue for atomicity if possible, though ArrayUnion is fine here
            update_data = {}
            if liked_jobs:
                 # Directly setting the array is simpler for fake data population
                 update_data['liked_jobs'] = liked_jobs # Use correct field name from worker profile
            if disliked_jobs:
                 # Dislikes stored as a map in the worker profile
                 update_data['disliked_jobs'] = {job_id: True for job_id in disliked_jobs} # Use correct field name

            # Use set with merge=True to create/update the swipe doc safely
            batch.set(swipe_ref, update_data, merge=True)
            total_swipes_populated += len(liked_jobs) + len(disliked_jobs)
            processed_count += 1

            # Commit batches
            if processed_count % 499 == 0:
                try:
                    batch.commit()
                    batch = db.batch()
                    self.stdout.write(f"  -> Committed swipe batch at worker {processed_count}/{len(worker_user_ids)}")
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  -> Error committing swipe batch for worker {worker_id}: {e}"))
                    # Start new batch even if commit failed to avoid losing subsequent ops
                    batch = db.batch()


        # Commit the final batch for swipes
        try:
            batch.commit()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"  -> Error committing final swipe batch: {e}"))

        self.stdout.write(self.style.SUCCESS(f"  -> Swipe data populated. Added approx {total_swipes_populated} swipe entries."))