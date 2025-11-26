export interface TeamMember {
  name: string;
  role: string;
  links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    name: "Pradeep Kumar",
    role: "Founder & Engineer",
    links: {
      github: "https://github.com/Pradeeprajpoot434680",
      linkedin: "https://www.linkedin.com/in/pradeep-kumar-25798b2a0",
    },
  },
  {
    name: "Aditya Maurya",
    role: "Freeloader",
    links: {
      github: "https://github.com/idityaGE",
      portfolio: "https://iditya.me",
      twitter: "https://x.com/idityage",
      linkedin: "https://www.linkedin.com/in/idityage",
    },
  },
];

export const contactInfo = {
  phone: "(+91) 8650152081",
  email: "pradeepkumar434680@gmail.com",
};
