export type SocialActivity = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  activityDate: string;
  location: string;
  participantCount?: number;
  featuredImage: string;
  system: "smart-farm" | "clean-energy" | "shellac" | "social";
  centerName?: string;
  projectTitle?: string;
  objective?: string;
  process?: string;
  outcome?: string;
  impact?: string;
  photos?: { imageUrl: string; caption?: string }[];
  partners?: string[];
};
