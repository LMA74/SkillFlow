// AI-based recommendation engine using multi-factor scoring
// Analyzes user data to generate ranked skill recommendations

export interface UserProfile {
  current_job: string;
  employment_status: string;
  education_level: string;
  current_skills: string[];
  interests: string[];
  free_time_hours_per_week: number;
  vulnerability_score: number;
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  market_demand: number;
  required_skills?: string[];
}

export interface RecommendationScore {
  skill_id: string;
  skill_name: string;
  category: string;
  score: number;
  skill_match: number;
  interest_match: number;
  market_demand_score: number;
  accessibility_score: number;
  explanation: string;
  required_skills: string[];
}

// Job-to-skill mapping for Uganda context
const jobSkillMap: Record<string, string[]> = {
  'Unemployed': ['Financial Literacy', 'Phone-Based Digital Skills', 'Small Business Management', 'Communication Skills', 'Confidence Building'],
  'Student': ['Basic Computer Literacy', 'Phone-Based Digital Skills', 'Online Freelancing Basics', 'Communication Skills', 'Time Management'],
  'Casual worker (general)': ['Financial Literacy', 'Selling & Marketing', 'Phone-Based Digital Skills', 'Small Business Management', 'Time Management'],
  'Street vendor / Hawker': ['Market Vending Skills', 'Financial Literacy', 'Selling & Marketing', 'Phone-Based Digital Skills', 'Small Business Management'],
  'Salon worker (hairdresser / barber)': ['Hairdressing & Beauty', 'Small Business Management', 'Selling & Marketing', 'Financial Literacy', 'Phone-Based Digital Skills'],
  'Tailor / tailoring assistant': ['Tailoring & Fashion Design', 'Small Business Management', 'Selling & Marketing', 'Financial Literacy', 'Content Creation'],
  'Motorcycle rider (Boda boda)': ['Financial Literacy', 'Small Business Management', 'Communication Skills', 'Phone-Based Digital Skills'],
  'Mechanic / garage assistant': ['Mechanics & Motorbike Repair', 'Small Business Management', 'Financial Literacy', 'Problem Solving', 'Communication Skills'],
  'Construction worker / helper': ['Construction Support Skills', 'Financial Literacy', 'Communication Skills', 'Problem Solving', 'Small Business Management'],
  'Domestic worker / house help': ['Financial Literacy', 'Phone-Based Digital Skills', 'Communication Skills', 'Confidence Building', 'Small Business Management'],
  'Small business owner (kiosk / shop / market stall)': ['Small Business Management', 'Financial Literacy', 'Selling & Marketing', 'Phone-Based Digital Skills', 'Content Creation'],
  'Agricultural worker / farm worker': ['Agriculture & Modern Farming', 'Financial Literacy', 'Selling & Marketing', 'Phone-Based Digital Skills', 'Small Business Management'],
  'Security guard': ['Financial Literacy', 'Phone-Based Digital Skills', 'Communication Skills', 'Problem Solving', 'Confidence Building'],
  'Informal apprentice (any trade)': ['Financial Literacy', 'Small Business Management', 'Communication Skills', 'Phone-Based Digital Skills', 'Confidence Building'],
};

// Skill prerequisites
const skillPrerequisites: Record<string, string[]> = {
  'Online Freelancing Basics': ['Phone-Based Digital Skills', 'Communication Skills'],
  'Content Creation': ['Phone-Based Digital Skills', 'Basic Computer Literacy'],
  'Social Media Management': ['Phone-Based Digital Skills', 'Communication Skills'],
  'Small Business Management': ['Financial Literacy', 'Communication Skills'],
  'Selling & Marketing': ['Communication Skills', 'Financial Literacy'],
  'Tailoring & Fashion Design': [],
  'Hairdressing & Beauty': [],
  'Mechanics & Motorbike Repair': [],
  'Construction Support Skills': [],
  'Agriculture & Modern Farming': [],
  'Market Vending Skills': ['Communication Skills', 'Financial Literacy'],
  'Phone-Based Digital Skills': [],
  'Basic Computer Literacy': [],
  'Financial Literacy': [],
  'Communication Skills': [],
  'Confidence Building': [],
  'Time Management': [],
  'Problem Solving': [],
};

// Category to interest mapping
const categoryToInterestMap: Record<string, string> = {
  'Digital & Online Skills': 'Technology & Digital',
  'Practical Income Skills': 'Business & Trade',
  'Entrepreneurship': 'Business & Trade',
  'Soft Skills': 'Education & Teaching',
};

export function calculateRecommendationScore(
  skill: SkillData,
  userProfile: UserProfile,
  userCurrentSkillNames: string[]
): RecommendationScore {
  // Factor 1: Skill Match (40%) - Does user already have prerequisites?
  const skillMatch = calculateSkillMatch(skill.name, userCurrentSkillNames, skillPrerequisites);

  // Factor 2: Interest Match (25%) - Does skill align with user interests?
  const interestMatch = calculateInterestMatch(skill.category, userProfile.interests);

  // Factor 3: Market Demand (25%) - How much in-demand is this skill in Uganda?
  const marketDemandScore = (skill.market_demand / 10) * 100;

  // Factor 4: Accessibility (10%) - Can user learn this given their time & constraints?
  const accessibilityScore = calculateAccessibility(userProfile, skill);

  // Calculate weighted score
  const totalScore =
    skillMatch * 0.4 + interestMatch * 0.25 + marketDemandScore * 0.25 + accessibilityScore * 0.1;

  // Generate explanation
  const explanation = generateExplanation(
    skill,
    skillMatch,
    interestMatch,
    marketDemandScore,
    accessibilityScore,
    userProfile
  );

  return {
    skill_id: skill.id,
    skill_name: skill.name,
    category: skill.category,
    score: Math.round(totalScore),
    skill_match: Math.round(skillMatch),
    interest_match: Math.round(interestMatch),
    market_demand_score: Math.round(marketDemandScore),
    accessibility_score: Math.round(accessibilityScore),
    explanation,
    required_skills: skillPrerequisites[skill.name] || [],
  };
}

function calculateSkillMatch(
  skillName: string,
  userCurrentSkills: string[],
  prerequisites: Record<string, string[]>
): number {
  const required = prerequisites[skillName] || [];

  // If no prerequisites, full match
  if (required.length === 0) return 100;

  // Check how many prerequisites user already has
  const hasPrerequisites = required.filter((req) => userCurrentSkills.includes(req)).length;
  return (hasPrerequisites / required.length) * 100;
}

function calculateInterestMatch(skillCategory: string, userInterests: string[]): number {
  // Map category to interest
  const relatedInterest = categoryToInterestMap[skillCategory];

  if (!relatedInterest) {
    // Check if any user interest mentions the category
    return userInterests.some((interest) =>
      skillCategory.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(skillCategory.toLowerCase())
    )
      ? 75
      : 25;
  }

  if (userInterests.includes(relatedInterest)) {
    return 100;
  }

  // Partial match
  return userInterests.some((i) => i.toLowerCase().includes(relatedInterest.toLowerCase())) ? 60 : 25;
}

function calculateAccessibility(profile: UserProfile, skill: SkillData): number {
  let score = 50;

  // More time = more accessible
  if (profile.free_time_hours_per_week >= 10) score += 30;
  else if (profile.free_time_hours_per_week >= 5) score += 15;

  // Job-relevant skills are more accessible
  const jobRelevantSkills = jobSkillMap[profile.current_job] || [];
  if (jobRelevantSkills.includes(skill.name)) score += 20;

  // Vulnerability score: more vulnerable = need more accessible skills
  if (profile.vulnerability_score > 15) {
    // Prioritize practical and soft skills
    if (
      ['Practical Income Skills', 'Soft Skills', 'Entrepreneurship'].includes(skill.category)
    ) {
      score += 10;
    }
  }

  return Math.min(score, 100);
}

function generateExplanation(
  skill: SkillData,
  skillMatch: number,
  interestMatch: number,
  marketDemand: number,
  accessibility: number,
  userProfile: UserProfile
): string {
  const reasons: string[] = [];

  // Add reason based on highest factor
  if (marketDemand > 75) {
    reasons.push(`Highly demanded in Uganda's job market`);
  }

  if (interestMatch > 70) {
    reasons.push(`Matches your stated interests`);
  }

  const jobRelevantSkills = jobSkillMap[userProfile.current_job] || [];
  if (jobRelevantSkills.includes(skill.name)) {
    reasons.push(`Directly relevant to your current work as ${userProfile.current_job}`);
  }

  if (skillMatch > 70) {
    reasons.push(`You already have most prerequisites`);
  }

  if (accessibility > 70 && userProfile.free_time_hours_per_week >= 10) {
    reasons.push(`Fits your available study time`);
  }

  if (reasons.length === 0) {
    reasons.push(`Recommended for your skill development`);
  }

  return reasons.slice(0, 2).join('. ') + '.';
}

export function rankRecommendations(scores: RecommendationScore[]): RecommendationScore[] {
  return scores.sort((a, b) => b.score - a.score);
}

export function getTopRecommendations(
  scores: RecommendationScore[],
  count: number = 5
): RecommendationScore[] {
  return rankRecommendations(scores).slice(0, count);
}
