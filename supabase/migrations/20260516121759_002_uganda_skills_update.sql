/*
  # Uganda-Focused Skills and Content Update

  1. Changes
    - Clear old skills and replace with Uganda-relevant skills
    - Categories: Digital & Online Skills, Practical Income Skills, Entrepreneurship, Soft Skills
    - All skills are practical, low-cost, and realistic for vulnerable youth in Uganda
    - Update courses to match new skills
    - Update opportunities to be Uganda-focused

  2. Security
    - No security changes (RLS already enabled)
*/

-- Delete old data (cascades to courses, modules, resources, user_skills, etc.)
DELETE FROM opportunities;
DELETE FROM course_modules;
DELETE FROM courses;
DELETE FROM resources;
DELETE FROM user_skills;
DELETE FROM skills;

-- Insert Uganda-focused skills using gen_random_uuid()
INSERT INTO skills (name, category, description, market_demand, icon_name) VALUES
-- Digital & Online Skills
('Basic Computer Literacy', 'Digital & Online Skills', 'Learn to use a computer, type, browse the internet, and use common programs', 9, 'monitor'),
('Phone-Based Digital Skills', 'Digital & Online Skills', 'Use your smartphone effectively for communication, money transfers, and learning', 9, 'smartphone'),
('Social Media Management', 'Digital & Online Skills', 'Manage social media accounts for businesses and organizations', 8, 'share-2'),
('Content Creation', 'Digital & Online Skills', 'Create photos, videos, and written content for social media and websites', 7, 'pen-tool'),
('Online Freelancing Basics', 'Digital & Online Skills', 'Find and do online work like data entry, virtual assistance, and writing', 8, 'globe'),

-- Practical Income Skills
('Tailoring & Fashion Design', 'Practical Income Skills', 'Sew clothes, make repairs, and design fashion items for sale', 9, 'scissors'),
('Hairdressing & Beauty', 'Practical Income Skills', 'Style hair, provide beauty services, and run a salon business', 9, 'sparkles'),
('Mechanics & Motorbike Repair', 'Practical Income Skills', 'Repair boda bodas, cars, and other vehicles', 8, 'wrench'),
('Construction Support Skills', 'Practical Income Skills', 'Work in building and construction - bricklaying, plastering, plumbing', 8, 'hammer'),
('Agriculture & Modern Farming', 'Practical Income Skills', 'Grow crops, raise animals, and use modern farming methods for profit', 9, 'sprout'),

-- Entrepreneurship Skills
('Small Business Management', 'Entrepreneurship', 'Start, run, and grow a small business in your community', 9, 'store'),
('Selling & Marketing', 'Entrepreneurship', 'Sell products at market, online, or door-to-door and attract customers', 8, 'shopping-bag'),
('Financial Literacy', 'Entrepreneurship', 'Manage money, save, budget, and understand loans and mobile money', 9, 'wallet'),
('Market Vending Skills', 'Entrepreneurship', 'Buy and sell goods at local markets for profit', 8, 'trending-up'),

-- Soft Skills
('Communication Skills', 'Soft Skills', 'Speak clearly, listen well, and express yourself confidently', 8, 'message-circle'),
('Confidence Building', 'Soft Skills', 'Build self-confidence and believe in your ability to succeed', 8, 'heart'),
('Time Management', 'Soft Skills', 'Organize your day, meet deadlines, and use your time wisely', 7, 'clock'),
('Problem Solving', 'Soft Skills', 'Think critically and find solutions to everyday challenges', 8, 'lightbulb');

-- Insert courses for each skill (using subqueries to get skill IDs)
INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Computer Basics for Beginners', 'Learn to turn on a computer, use a keyboard and mouse, and browse the internet. No experience needed.', 'beginner', 10, '', true
FROM skills WHERE name = 'Basic Computer Literacy';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Using Your Phone for Business', 'Learn how to use WhatsApp Business, mobile money, and phone apps to earn money and stay connected.', 'beginner', 8, '', true
FROM skills WHERE name = 'Phone-Based Digital Skills';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Social Media for Small Business', 'Learn to create posts, grow followers, and use social media to promote a business or service.', 'beginner', 12, '', true
FROM skills WHERE name = 'Social Media Management';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Content Creation with Your Phone', 'Use your phone to take good photos, make simple videos, and write posts that people want to see.', 'beginner', 10, '', true
FROM skills WHERE name = 'Content Creation';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Online Work: Getting Started', 'Find online jobs like data entry, writing, and virtual assistance. Learn where to look and how to apply.', 'beginner', 12, '', true
FROM skills WHERE name = 'Online Freelancing Basics';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Tailoring: From Zero to Sewing', 'Learn basic sewing, how to use a sewing machine, and make simple clothes and repairs.', 'beginner', 20, '', true
FROM skills WHERE name = 'Tailoring & Fashion Design';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Hairdressing Fundamentals', 'Learn to plait hair, do simple styles, and provide basic salon services.', 'beginner', 15, '', true
FROM skills WHERE name = 'Hairdressing & Beauty';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Boda Boda & Motorbike Repair', 'Learn basic motorbike maintenance, common repairs, and how to keep a boda boda running.', 'beginner', 15, '', true
FROM skills WHERE name = 'Mechanics & Motorbike Repair';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Construction Work Basics', 'Learn bricklaying, plastering, and basic construction skills for building sites.', 'beginner', 20, '', true
FROM skills WHERE name = 'Construction Support Skills';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Modern Farming for Income', 'Grow high-value crops, raise poultry, and use modern methods to earn from farming.', 'beginner', 15, '', true
FROM skills WHERE name = 'Agriculture & Modern Farming';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Start Your Own Small Business', 'Learn step-by-step how to start a business with little capital - from idea to first sale.', 'beginner', 12, '', true
FROM skills WHERE name = 'Small Business Management';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Selling & Marketing Your Products', 'Learn how to price, display, and sell products at markets, shops, or online.', 'beginner', 10, '', true
FROM skills WHERE name = 'Selling & Marketing';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Money Management & Mobile Money', 'Learn to budget, save, use mobile money safely, and avoid common money mistakes.', 'beginner', 8, '', true
FROM skills WHERE name = 'Financial Literacy';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Market Vending: Buy Low, Sell High', 'Learn how to find goods at wholesale prices and sell for profit at local markets.', 'beginner', 8, '', true
FROM skills WHERE name = 'Market Vending Skills';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Speak Up: Communication Skills', 'Learn to communicate clearly, listen actively, and express yourself with confidence.', 'beginner', 6, '', true
FROM skills WHERE name = 'Communication Skills';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Believe in Yourself', 'Build your confidence, overcome fear, and take steps toward your goals.', 'beginner', 6, '', true
FROM skills WHERE name = 'Confidence Building';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Manage Your Time Well', 'Learn to plan your day, set priorities, and make the most of your time.', 'beginner', 5, '', true
FROM skills WHERE name = 'Time Management';

INSERT INTO courses (skill_id, title, description, difficulty, estimated_hours, image_url, is_free)
SELECT id, 'Solve Problems Like a Leader', 'Learn to think through problems, make good decisions, and find creative solutions.', 'beginner', 6, '', true
FROM skills WHERE name = 'Problem Solving';

-- Insert modules for each course
DO $$
DECLARE
  course_rec RECORD;
  module_counter INTEGER;
BEGIN
  FOR course_rec IN SELECT id, title FROM courses LOOP
    module_counter := 1;
    WHILE module_counter <= 5 LOOP
      INSERT INTO course_modules (course_id, title, description, module_order)
      VALUES (
        course_rec.id,
        'Module ' || module_counter || ': ' || 
        CASE module_counter
          WHEN 1 THEN 'Getting Started'
          WHEN 2 THEN 'Core Concepts'
          WHEN 3 THEN 'Hands-on Practice'
          WHEN 4 THEN 'Real-World Application'
          WHEN 5 THEN 'Final Assessment'
        END,
        CASE module_counter
          WHEN 1 THEN 'Introduction and what you will learn in ' || course_rec.title
          WHEN 2 THEN 'Learn the key ideas and fundamentals step by step'
          WHEN 3 THEN 'Practice what you have learned with real exercises'
          WHEN 4 THEN 'Apply your skills to real situations in your community'
          WHEN 5 THEN 'Test your knowledge and complete the course'
        END,
        module_counter
      );
      module_counter := module_counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- Insert Uganda-focused opportunities
INSERT INTO opportunities (title, description, organization, location, opportunity_type, url, deadline, is_active) VALUES
('Boda Boda Mechanic Trainee', '3-month hands-on training in motorbike repair and maintenance. Stipend provided.', 'Kampala Mechanics Association', 'Kampala', 'training', '', '2026-08-01', true),
('Tailoring Apprenticeship', '6-month apprenticeship in a working tailor shop. Learn while you earn.', 'Stitch & Style Workshop', 'Wakiso', 'internship', '', '2026-07-15', true),
('Youth Farming Program', 'Free training in modern farming techniques with seeds and tools provided.', 'Uganda Youth Farm Initiative', 'Multiple Districts', 'training', '', '2026-09-01', true),
('Mobile Money Agent Opportunity', 'Become a mobile money agent with training and startup support.', 'MTN Uganda', 'Nationwide', 'job', '', '2026-08-15', true),
('Digital Skills Scholarship', 'Free 3-month online course in computer basics and internet skills.', 'Refactory Uganda', 'Kampala', 'scholarship', '', '2026-10-01', true),
('Hairdressing Training', '4-month professional hairdressing course. Tools provided upon completion.', 'Beauty for Youth Uganda', 'Entebbe', 'training', '', '2026-07-30', true),
('Market Vendor Startup Kit', 'Get a starter kit and training to begin selling at your local market.', 'Uganda Market Women''s Network', 'Multiple Locations', 'scholarship', '', '2026-09-15', true),
('Construction Skills Program', '8-week training in bricklaying and plastering. Job placement support after.', 'Build Uganda Foundation', 'Jinja', 'training', '', '2026-08-30', true),
('Social Media Manager Role', 'Part-time role managing social media for local businesses. Work from your phone.', 'Digital Uganda Hub', 'Remote', 'job', '', '2026-07-20', true),
('Youth Entrepreneurship Grant', 'Seed funding up to 500,000 UGX for youth with a business idea.', 'Youth Livelihood Programme', 'Nationwide', 'scholarship', '', '2026-11-01', true),
('Community Health Volunteer', 'Gain experience in community health work while helping your community.', 'Uganda Red Cross Society', 'Multiple Districts', 'volunteer', '', '2026-12-01', true),
('Online Freelancing Workshop', 'Free 2-day workshop on finding online work and earning from the internet.', 'Hive Colab', 'Kampala', 'training', '', '2026-08-10', true);
