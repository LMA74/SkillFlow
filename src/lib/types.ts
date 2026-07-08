export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string;
  location: string;
  education_level: string;
  employment_status: string;
  current_job: string;
  current_skills: string[];
  interests: string[];
  free_time_hours_per_week: number;
  preferred_study_times: string[];
  bio: string;
  avatar_url: string;
  is_eligible: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  market_demand: number;
  icon_name: string;
  created_at: string;
}

export interface Course {
  id: string;
  skill_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  image_url: string;
  is_free: boolean;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  module_order: number;
  resource_id: string | null;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced';
  source: 'assessment' | 'recommended' | 'manual';
  is_learning: boolean;
  created_at: string;
  skill?: Skill;
}

export interface UserAssessment {
  id: string;
  user_id: string;
  responses: Record<string, string | string[]>;
  eligibility_score: number;
  is_eligible: boolean;
  vulnerability_factors: string[];
  recommended_skill_ids: string[];
  completed_at: string;
}

export interface UserSchedule {
  id: string;
  user_id: string;
  course_id: string;
  day_of_week: string;
  start_time: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  course?: Course;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  time_spent_minutes: number;
  completed_at: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string;
  issued_at: string;
  course?: Course;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  location: string;
  opportunity_type: 'job' | 'internship' | 'volunteer' | 'training' | 'scholarship';
  required_skills: string[];
  url: string;
  phone: string;
  email: string;
  requirements: string;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Resource {
  id: string;
  skill_id: string;
  title: string;
  description: string;
  resource_type: 'video' | 'article' | 'quiz' | 'external' | 'mentor';
  url: string;
  duration_minutes: number;
  is_free: boolean;
  created_at: string;
}
