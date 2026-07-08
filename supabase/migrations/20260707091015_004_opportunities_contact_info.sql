/*
  # Add Contact Information to Opportunities

  1. Changes
    - Add phone, email, and website columns to opportunities table
    - Update existing opportunities with realistic contact information
    - Add descriptive details about how to apply
*/

-- Add contact columns to opportunities if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'phone') THEN
    ALTER TABLE opportunities ADD COLUMN phone text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'email') THEN
    ALTER TABLE opportunities ADD COLUMN email text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'requirements') THEN
    ALTER TABLE opportunities ADD COLUMN requirements text DEFAULT '';
  END IF;
END $$;

-- Update opportunities with contact details
UPDATE opportunities SET 
  phone = '+256 414 341 777',
  email = 'info@mglsd.go.ug',
  requirements = 'Must be 18-35 years old. Bring national ID, 2 passport photos. Registration takes 1 week before training starts.',
  description = 'Free 6-month vocational training in tailoring, hairdressing, or mechanics. Training materials and lunch provided. Certificate upon completion. Classes run Monday-Friday, 8am-4pm.'
WHERE title = 'Youth Vocational Training Program';

UPDATE opportunities SET 
  phone = '+256 700 123 456',
  email = 'admissions@ktti.ac.ug',
  url = 'https://ktti.ac.ug/',
  requirements = 'Basic reading and writing skills. Registration fee 50,000 UGX (refundable upon completion). Bring ID and 4 passport photos.',
  description = '3-month intensive training in motorbike repair and maintenance. Hands-on practice with real motorcycles. Starter toolkit provided upon graduation. 90% job placement rate.'
WHERE title = 'Boda Boda Mechanic Skills Course';

UPDATE opportunities SET 
  phone = '+256 414 222 333',
  email = 'training@uweal.co.ug',
  url = 'https://uweal.co.ug/',
  requirements = 'Women aged 18-45. Passion for fashion. Commitment to attend all sessions. Small registration fee of 30,000 UGX.',
  description = '4-month comprehensive course covering sewing, pattern making, and business skills. Sewing machine provided for practice. Graduates receive starter kit with fabric and tools.'
WHERE title = 'Tailoring & Fashion Design Bootcamp';

UPDATE opportunities SET 
  phone = '+256 752 987 654',
  email = 'enroll@beautyforchange.org',
  requirements = 'No prior experience needed. Must commit to 6-month program. Interview required before acceptance.',
  description = 'Professional 6-month hairdressing certification. Learn plaiting, chemical treatments, salon management, and customer service. Job placement support and salon attachment included.'
WHERE title = 'Hairdressing & Beauty Academy';

UPDATE opportunities SET 
  phone = '+256 700 456 789',
  email = 'farming@urbanagriculture.ug',
  requirements = 'Access to small space (balcony, backyard, or rooftop). Commitment to attend all 10 sessions. Willingness to share knowledge with community.',
  description = '2-week intensive training on urban farming, vertical gardens, and hydroponics. Learn to grow vegetables in small spaces. Seeds, containers, and startup kit provided.'
WHERE title = 'Modern Urban Farming Workshop';

UPDATE opportunities SET 
  phone = '+256 414 555 666',
  email = 'info@builduganda.org',
  requirements = 'Physically fit. Willing to work outdoors. No prior construction experience needed. Must have national ID.',
  description = 'Learn bricklaying, plastering, and masonry while working on real construction sites. Paid stipend of 150,000 UGX per month during 4-month training. Job placement guaranteed.'
WHERE title = 'Construction Apprenticeship Program';

UPDATE opportunities SET 
  phone = '+256 414 111 222',
  email = 'training@markettraders.ug',
  requirements = 'Must have some startup capital (minimum 100,000 UGX). Bring ID and 2 passport photos. Registration is free.',
  description = '1-month program teaching wholesale buying, pricing strategy, customer service, and market management. Includes market stall placement assistance and mentorship from experienced vendors.'
WHERE title = 'Market Vendor Skills Training';

UPDATE opportunities SET 
  phone = '+256 414 567 890',
  email = 'bootcamp@refactory.ug',
  url = 'https://refactory.ug/',
  requirements = 'Basic English reading/writing. Passion for technology. Commitment to attend all sessions. Free to apply!',
  description = 'Free 12-week intensive digital skills program. Learn computer basics, internet research, and online work. Laptops provided during training. 80% of graduates find work within 3 months.'
WHERE title = 'Digital Skills Bootcamp';

-- Update online learning opportunities with proper links
UPDATE opportunities SET 
  url = 'https://www.freecodecamp.org/',
  description = 'Self-paced online learning for web development, JavaScript, Python, and more. Completely free with verified certificates. Learn at your own pace with thousands of hours of content.'
WHERE title = 'FreeCodeCamp Learning Path';

UPDATE opportunities SET 
  url = 'https://learndigital.withgoogle.com/digitalskillsforafrica/',
  description = 'Free 40-hour course covering digital marketing, SEO, social media, and online business. Google certification included. Learn to grow your business online or start a digital marketing career.'
WHERE title = 'Google Digital Marketing Course';

UPDATE opportunities SET 
  url = 'https://alison.com/',
  description = 'Access to 400+ free courses on business, technology, languages, and professional skills. Certificates available for completed courses. Learn anytime, anywhere with internet.'
WHERE title = 'Alison Certificate Programs';

UPDATE opportunities SET 
  url = 'https://www.coursera.org/',
  description = 'Free access to university-level courses on entrepreneurship, finance, communication, and career skills. Certificates from top universities worldwide. Financial aid available for paid courses.'
WHERE title = 'Coursera for Uganda';

UPDATE opportunities SET 
  phone = '+256 414 333 444',
  email = 'competitions@ylp.go.ug',
  url = 'https://mglsd.go.ug/programs/youth-livelihood/',
  requirements = 'Youth aged 18-35. Uganda citizen. Must have a business idea or existing small business. Application form required.',
  description = 'Pitch your business idea for a chance to win 500,000 UGX seed capital. Winners receive 3-month mentorship from successful entrepreneurs and business registration support.'
WHERE title = 'Youth Business Idea Competition';

UPDATE opportunities SET 
  phone = '+256 414 234 567',
  email = 'workshops@enterprise.ug',
  requirements = 'Any aspiring or current business owner. Free to attend. Bring notebook and pen. Certificate of participation provided.',
  description = 'Free 2-day workshop covering business planning, registration, accessing startup loans, and tax basics. Connect with other entrepreneurs and learn from successful business mentors.'
WHERE title = 'Small Business Starter Workshop';

UPDATE opportunities SET 
  phone = '+256 700 100 100',
  email = 'business@mtn.co.ug',
  url = 'https://www.mtn.co.ug/business/mobile-money',
  requirements = 'Valid national ID. Registered MTN SIM card (6+ months). Small capital for starting float (recommended 200,000+ UGX). Trading license from local authority.',
  description = 'Learn to become a certified MTN Mobile Money agent. Training covers float management, security, customer service, and record keeping. Start earning commissions immediately.'
WHERE title = 'Mobile Money Agent Training';

UPDATE opportunities SET 
  phone = '+256 414 678 900',
  email = 'scholarships@ueducationtrust.org',
  requirements = 'Youth aged 18-35. Financial need demonstrated. Academic potential. Application form, recommendation letter, and interview required.',
  description = 'Full scholarship covering tuition and materials for 1-year vocational course (tailoring, mechanics, catering, or ICT). Partner institutions across Uganda. Monthly transport allowance included.'
WHERE title = 'Vocational Training Scholarship';

UPDATE opportunities SET 
  phone = '+256 414 338 338',
  email = 'ictskills@ucc.co.ug',
  url = 'https://www.ucc.co.ug/',
  requirements = 'Ugandan youth aged 18-35. Interest in ICT. Application through district education office.',
  description = 'Free ICT training at certified training centers across Uganda. Includes transportation allowance, data bundle, and certification exam. Basic, intermediate, and advanced tracks available.'
WHERE title = 'ICT Skills Development Grant';

UPDATE opportunities SET 
  phone = '+256 414 222 111',
  email = 'wib@uweal.co.ug',
  url = 'https://uweal.co.ug/',
  requirements = 'Women aged 18-40. Running or planning to start a business. Commitment to attend 8 weekly sessions.',
  description = 'Free 8-week business management training for women. Covers marketing, financial management, record keeping, and growth strategies. Networking events with successful women entrepreneurs.'
WHERE title = 'Women in Business Training';

UPDATE opportunities SET 
  phone = '+256 700 234 567',
  email = 'ictcenters@ucsa.ug',
  requirements = 'No requirements. Open to all community members. Small one-time registration fee (5,000-10,000 UGX) depending on center.',
  description = 'Weekly computer classes at your local community ICT center. Small groups with hands-on learning. Morning, afternoon, and evening sessions available. Basic to advanced levels.'
WHERE title = 'Community ICT Center Classes';

UPDATE opportunities SET 
  phone = '+256 752 567 890',
  email = 'programs@uydn.org',
  requirements = 'Youth 18-30. Willing to participate in group activities. Free to join.',
  description = '4-week program covering communication, confidence building, CV writing, and job interview skills. Includes mock interviews and networking with employers.'
WHERE title = 'Youth Life Skills Program';

UPDATE opportunities SET 
  phone = '+256 414 269 456',
  email = 'hello@hivecolab.org',
  url = 'https://hivecolab.org/',
  requirements = 'Interest in online work. Free to attend. Every Saturday 2-4pm.',
  description = 'Free weekly introduction to finding online work. Learn about Upwork, Fiverr, payment methods (Payoneer, Wise), and how to build your profile. Q&A with successful freelancers.'
WHERE title = 'Online Freelancing Orientation';

UPDATE opportunities SET 
  phone = '+256 700 890 123',
  email = 'info@digitalworkersug.com',
  requirements = 'Computer basics. Good English. Reliable internet. Commitment to 8-week program.',
  description = '8-week program to become a virtual assistant. Covers admin skills, email management, scheduling tools (Calendly, Google Calendar), and client communication. Includes portfolio building.'
WHERE title = 'Virtual Assistant Training';

UPDATE opportunities SET 
  phone = '+256 755 123 456',
  email = 'mentors@mentoruganda.org',
  requirements = 'Commitment to monthly meetings for 6 months. Business plan or clear goals. Willing to learn and take action.',
  description = 'Get matched with an experienced business owner for 6 months of one-on-one guidance. Monthly meetups, progress reviews, and networking. Mentors from various industries available.'
WHERE title = 'Business Mentorship Match';

UPDATE opportunities SET 
  phone = '+256 700 234 567',
  email = 'community@skillflow.ug',
  requirements = 'Free to join. Must be learning a skill on SkillFlow. Willing to share and help others.',
  description = 'Join a learning group with other youth learning the same skill. Weekly meetups at local venues for practice sessions. Share resources, motivate each other, and learn together.'
WHERE title = 'Skills Peer Learning Groups';