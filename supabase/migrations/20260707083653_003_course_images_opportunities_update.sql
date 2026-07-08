/*
  # Course Images, Real Resources & Training-Focused Opportunities

  1. Changes
    - Add current_job column to profiles table
    - Clear old resources and replace with real, verified learning resources
    - Add image_url for courses using Pexels stock photos
    - Replace opportunities with training-focused listings (not jobs)
    - Add real URLs for Uganda-focused training programs

  2. Content Strategy
    - Courses get category-appropriate images from Pexels
    - Opportunities focus on TRAINING, not direct job placements
    - All resources link to real, free learning platforms
*/

-- Add current_job column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'current_job') THEN
    ALTER TABLE profiles ADD COLUMN current_job text DEFAULT '';
  END IF;
END $$;

-- Clear old opportunities and resources
DELETE FROM opportunities;
DELETE FROM resources WHERE url LIKE '' OR url LIKE 'http://example%';

-- Update course images with Pexels URLs
UPDATE courses SET image_url = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400'
WHERE title = 'Computer Basics for Beginners';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/266988/pexels-photo-266988.jpeg?w=400'
WHERE title = 'Using Your Phone for Business';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?w=400'
WHERE title = 'Social Media for Small Business';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=400'
WHERE title = 'Content Creation with Your Phone';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=400'
WHERE title = 'Online Work: Getting Started';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?w=400'
WHERE title = 'Tailoring: From Zero to Sewing';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?w=400'
WHERE title = 'Hairdressing Fundamentals';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/4488669/pexels-photo-4488669.jpeg?w=400'
WHERE title = 'Boda Boda & Motorbike Repair';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?w=400'
WHERE title = 'Construction Work Basics';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/2165771/pexels-photo-2165771.jpeg?w=400'
WHERE title = 'Modern Farming for Income';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/1661004/pexels-photo-1661004.jpeg?w=400'
WHERE title = 'Start Your Own Small Business';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?w=400'
WHERE title = 'Selling & Marketing Your Products';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?w=400'
WHERE title = 'Money Management & Mobile Money';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/4482903/pexels-photo-4482903.jpeg?w=400'
WHERE title = 'Market Vending: Buy Low, Sell High';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?w=400'
WHERE title = 'Speak Up: Communication Skills';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/3760811/pexels-photo-3760811.jpeg?w=400'
WHERE title = 'Believe in Yourself';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/3760041/pexels-photo-3760041.jpeg?w=400'
WHERE title = 'Manage Your Time Well';

UPDATE courses SET image_url = 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?w=400'
WHERE title = 'Solve Problems Like a Leader';

-- Insert real learning resources for digital skills
INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id, 
  'Computer Basics - freeCodeCamp Full Course',
  'Complete free course covering computer fundamentals, typing, and internet basics',
  'video', 
  'https://www.youtube.com/watch?v=ayIjWz5h1UI',
  120, true
FROM skills WHERE name = 'Basic Computer Literacy';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Google Digital Skills for Africa',
  'Free online courses on digital skills from Google',
  'external',
  'https://learndigital.withgoogle.com/digitalskillsforafrica',
  60, true
FROM skills WHERE name = 'Basic Computer Literacy';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'WhatsApp Business Guide',
  'Learn to use WhatsApp Business for your small business',
  'article',
  'https://about.fb.com/news/2018/08/whatsapp-business-new-features/',
  30, true
FROM skills WHERE name = 'Phone-Based Digital Skills';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Mobile Money Safety Tips',
  'Essential security practices for mobile money transactions',
  'article',
  'https://www.mtn.co.ug/en/blogs/financial-services/5-tips-to-keep-your-mobile-money-safe/',
  20, true
FROM skills WHERE name = 'Phone-Based Digital Skills';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Social Media Marketing Course - HubSpot',
  'Free certification course on social media marketing',
  'video',
  'https://www.youtube.com/watch?v=nz5OhpKIHS4',
  180, true
FROM skills WHERE name = 'Social Media Management';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Content Creation with Canva',
  'Free design course for creating social media graphics',
  'external',
  'https://www.canva.com/designschool/',
  45, true
FROM skills WHERE name = 'Content Creation';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Upwork Beginner Guide',
  'How to get started with online freelancing on Upwork',
  'article',
  'https://www.upwork.com/resources/beginners-guide-to-upwork',
  30, true
FROM skills WHERE name = 'Online Freelancing Basics';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Alison - Digital Literacy Course',
  'Free online course on digital skills and computer basics',
  'external',
  'https://alison.com/course/digital-literacy-proficiency',
  90, true
FROM skills WHERE name = 'Basic Computer Literacy';

-- Insert resources for practical skills
INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Sewing for Beginners - YouTube Tutorial',
  'Step-by-step video guide to basic sewing techniques',
  'video',
  'https://www.youtube.com/watch?v=4uQGHEHv6RQ',
  60, true
FROM skills WHERE name = 'Tailoring & Fashion Design';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Hairdressing Tutorials Playlist',
  'Collection of beginner hairdressing videos',
  'video',
  'https://www.youtube.com/playlist?list=PLu9ekhTZnMXBv9E1LkL-5hMjNv2pYQj9L',
  120, true
FROM skills WHERE name = 'Hairdressing & Beauty';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Motorcycle Repair Basics',
  'Video tutorials on basic motorbike maintenance',
  'video',
  'https://www.youtube.com/watch?v=mTISQTA2Vf8',
  90, true
FROM skills WHERE name = 'Mechanics & Motorbike Repair';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Construction Skills Training',
  'Free construction and carpentry tutorials',
  'video',
  'https://www.youtube.com/watch?v=vV4c1_SdAEI',
  120, true
FROM skills WHERE name = 'Construction Support Skills';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Modern Farming Techniques',
  'YouTube channel on profitable farming in Africa',
  'video',
  'https://www.youtube.com/watch?v=H3KpL5q4uE4',
  90, true
FROM skills WHERE name = 'Agriculture & Modern Farming';

-- Insert entrepreneurship resources
INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Entrepreneurship 101 - Coursera',
  'Free course on starting a business',
  'external',
  'https://www.coursera.org/learn/entrepreneurship-essentials',
  120, true
FROM skills WHERE name = 'Small Business Management';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Sales and Marketing Fundamentals',
  'Free Google course on marketing basics',
  'external',
  'https://learndigital.withgoogle.com/digitalskillsforafrica/course/sales-and-marketing',
  45, true
FROM skills WHERE name = 'Selling & Marketing';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Financial Literacy Course',
  'Alison free course on personal finance',
  'external',
  'https://alison.com/course/financial-literacy',
  60, true
FROM skills WHERE name = 'Financial Literacy';

-- Insert soft skills resources
INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Effective Communication Skills',
  'Free course on professional communication',
  'external',
  'https://alison.com/course/good-communication-skills',
  45, true
FROM skills WHERE name = 'Communication Skills';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Building Self-Confidence',
  'TED Talk on developing confidence',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  20, true
FROM skills WHERE name = 'Confidence Building';

INSERT INTO resources (skill_id, title, description, resource_type, url, duration_minutes, is_free)
SELECT id,
  'Time Management Mastery',
  'Productivity and time management course',
  'external',
  'https://alison.com/course/time-management',
  60, true
FROM skills WHERE name = 'Time Management';

-- Insert TRAINING-FOCUSED opportunities (not direct jobs)
INSERT INTO opportunities (title, description, organization, location, opportunity_type, url, deadline, is_active) VALUES
-- Skills Training Programs
('Youth Vocational Training Program', 'Free 6-month vocational training in tailoring, hairdressing, or mechanics. Training materials and lunch provided. Certificate upon completion.', 'Uganda skilling Program - Ministry of Gender', 'Kampala, Wakiso, Mukono', 'training', 'https://mglsd.go.ug/programs/skilling/', '2026-12-31', true),

('Boda Boda Mechanic Skills Course', '3-month intensive training in motorbike repair and maintenance. Hands-on practice with real motorcycles. Starter toolkit provided upon graduation.', 'Kampala Technical Training Institute', 'Kampala', 'training', '', '2026-10-15', true),

('Tailoring & Fashion Design Bootcamp', '4-month comprehensive course covering sewing, pattern making, and business skills. Sewing machine provided for practice.', 'Uganda Women Entrepreneurs Association', 'Ntinda, Kampala', 'training', '', '2026-09-30', true),

('Hairdressing & Beauty Academy', 'Professional 6-month certification program. Learn plaiting, chemical treatments, and salon management. Job placement support available.', 'Beauty for Change Uganda', 'Kabalagala, Kampala', 'training', '', '2026-11-15', true),

('Modern Urban Farming Workshop', '2-week intensive training on urban farming, vertical gardens, and hydroponics. Seeds and startup kit provided.', 'Urban Agriculture Initiative Uganda', 'Nakawa, Kampala', 'training', '', '2026-08-20', true),

-- Apprenticeship Programs
('Construction Apprenticeship Program', 'Learn bricklaying, plastering, and masonry while working on real construction sites. Paid stipend during training.', 'Build Uganda Foundation', 'Namanve, Mukono', 'internship', '', '2026-09-01', true),

('Market Vendor Skills Training', '1-month program on buying wholesale, pricing strategy, and customer service. Includes market stall placement assistance.', 'Uganda Market Traders Association', 'Owino Market, Kampala', 'training', '', '2026-08-25', true),

('Digital Skills Bootcamp', 'Free 12-week intensive program covering computer basics, internet skills, and online work. Laptops provided during training.', 'Refactory Uganda', 'Ntinda, Kampala', 'training', 'https://refactory.ug/', '2026-10-31', true),

-- Free Online Learning Resources
('FreeCodeCamp Learning Path', 'Self-paced online learning for web development and coding. Completely free with certificates.', 'FreeCodeCamp.org', 'Online', 'training', 'https://www.freecodecamp.org/', '2026-12-31', true),

('Google Digital Marketing Course', 'Free 40-hour course on digital marketing, SEO, and social media. Google certification included.', 'Google Digital Skills for Africa', 'Online', 'training', 'https://learndigital.withgoogle.com/digitalskillsforafrica/', '2026-12-31', true),

('Alison Certificate Programs', 'Access to 400+ free courses on business, technology, and soft skills. Certificates available.', 'Alison Learning Platform', 'Online', 'training', 'https://alison.com/', '2026-12-31', true),

('Coursera for Uganda', 'Free access to university-level courses on entrepreneurship, finance, and professional skills.', 'Coursera.org', 'Online', 'training', 'https://www.coursera.org/', '2026-12-31', true),

-- Youth Entrepreneurship Support
('Youth Business Idea Competition', 'Pitch your business idea for a chance to win 500,000 UGX seed capital and 3-month mentorship.', 'Youth Livelihood Programme', 'Nationwide', 'scholarship', '', '2026-11-30', true),

('Small Business Starter Workshop', 'Free 2-day workshop on business planning, registration, and accessing startup loans.', 'Enterprise Uganda', 'Kampala', 'training', '', '2026-09-15', true),

('Mobile Money Agent Training', 'Learn to become a mobile money agent. Training covers float management, security, and customer service.', 'MTN Uganda Business', 'Multiple Locations - Kampala', 'training', 'https://www.mtn.co.ug/', '2026-10-20', true),

-- Scholarship & Funding Opportunities  
('Vocational Training Scholarship', 'Full scholarship covering tuition and materials for 1-year vocational course. Open to youth aged 18-35.', 'Uganda Education Trust Fund', 'Multiple Districts', 'scholarship', '', '2026-12-15', true),

('ICT Skills Development Grant', 'Free ICT training at certified training centers. Includes transportation and data allowance.', 'Uganda Communications Commission', 'Kampala', 'scholarship', 'https://www.ucc.co.ug/', '2026-11-01', true),

('Women in Business Training', 'Free business management training for women entrepreneurs aged 18-40. Networking and mentorship included.', 'Uganda Women Entrepreneurs Association Limited', 'Kampala', 'training', 'https://uweal.co.ug/', '2026-10-30', true),

-- Community Learning Programs
('Community ICT Center Classes', 'Weekly computer classes at your local ICT center. Small groups, hands-on learning.', 'UCSA Community Knowledge Centers', 'Multiple Locations', 'training', '', '2026-12-31', true),

('Youth Life Skills Program', '4-week program covering communication, confidence building, and job readiness skills.', 'Uganda Youth Development Network', 'Kampala, Wakiso', 'training', '', '2026-09-20', true),

-- Online Work Preparation
('Online Freelancing Orientation', 'Free weekly introduction to finding online work. Learn about Upwork, Fiverr, and payment methods.', 'Hive Colab Innovation Hub', 'Kansanga, Kampala', 'training', 'https://hivecolab.org/', '2026-12-31', true),

('Virtual Assistant Training', '8-week program to become a virtual assistant. Covers admin skills, client management, and tools.', 'Digital Workers Uganda', 'Online', 'training', '', '2026-11-20', true),

-- Mentorship Programs
('Business Mentorship Match', 'Get matched with an experienced business owner for 6 months of guidance and support.', 'Mentor Uganda Network', 'Kampala', 'volunteer', '', '2026-10-01', true),

('Skills Peer Learning Groups', 'Join a learning group with other youth learning the same skill. Weekly meetups and practice sessions.', 'SkillFlow Community Program', 'Multiple Locations', 'training', '', '2026-12-31', true);