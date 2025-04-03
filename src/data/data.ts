export interface galleryImage {
  url: string;
  date?: {
    month: string;
    year: number;
  };
  caption: string;
}

export interface Project {
  id: string;
  isFeatured?: boolean;
  title: string;
  event?: string; // For hackathons or competitions
  description: string;
  longDescription?: string;
  startDate: {
    month: string;
    year: number;
  };
  endDate?: {
    month: string;
    year: number;
  };
  isOngoing?: boolean;
  image: string;
  images?: string[]; // For project detail pages with multiple images
  tags: string[];
  link?: string;
  githubLink?: string;
  liveLink?: string;
  featured: boolean;
  category: ProjectCategory | ProjectCategory[];
  skills: string[];
  achievements?: string[];
  teamSize?: number;
  role?: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
}

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  organization: string;
  description: string;
  date: {
    month: string;
    year: number;
  };
  image: string;
  link?: string;
  tags: string[];
}

export type AchievementType =
  | "award"
  | "certificate"
  | "felicitation"
  | "publication"
  | "recognition";

export type ProjectCategory =
  | "ai-ml"
  | "web-development"
  | "hackathon"
  | "academic"
  | "research"
  | "iot"
  | "cybersecurity"
  | "data-science";

export const galleryImages: galleryImage[] = [
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670150/ieee_award_a75qvx.jpg",
    date: {
      month: "February",
      year: 2025,
    },
    caption: "IEEE Gujarat Section Emerging Student Branch Award 2024",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670163/xen_2024_tvsipp.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "Xenesis 2024 - Digital Committee Member",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670147/avpc_img_jbrn1w.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "State Level Poster Presentation Competition 2024",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670152/sampark2_ziug02.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "IEEE Gujarat Section SAMPARK 2024",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670156/xen_mkiw2w.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "Main Student Event Coordinator for Xenesis 2024",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670164/ssip_2023_img_iwmbli.jpg",
    date: {
      month: "December",
      year: 2023,
    },
    caption: "Felicitated by Gujarat Hackathon SSIP 2023",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670162/sih_2024_img_zgwkeu.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "SIH 2024 - IIT Guwahati",
  },
];

export const mainGalleryImages: galleryImage[] = [
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670225/dir1_zkw6cp.jpg",
    date: {
      month: "Novemeber",
      year: 2024,
    },
    caption: "Just me enjoying the moment at Perth Mint",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670214/dir2_bnxpb1.jpg",
    date: {
      month: "November",
      year: 2024,
    },
    caption: "Ferry to Watson's Bay - A beautiful day out",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670212/dir3_uy2f8s.jpg",
    date: {
      month: "November",
      year: 2024,
    },
    caption: "DIR BIP 2024 Team - Curtin University",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670218/dir4_tetkth.jpg",
    date: {
      month: "November",
      year: 2024,
    },
    caption: "Tried joining the Kangaroo club!",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670218/dir5_tavfjy.jpg",
    date: {
      month: "November",
      year: 2024,
    },
    caption: "St. Mary's Cathedral - Stunning Glass Work",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670236/dir6_kbuveo.jpg",
    date: {
      month: "November",
      year: 2024,
    },
    caption: "Just a normal day in Australia",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670216/dir8_cslsdn.jpg",
    date: {
      month: "November",
      year: 2024,
    },
    caption: "Art Gallery of New South Wales",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670211/gdg_spdvm0.jpg",
    date: {
      month: "June",
      year: 2024,
    },
    caption: "GDG Ahmedabad Creating Tomorrow: Dive into Generative AI!",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670234/iit1_cfsu1u.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "Stepping into IIT Guwahati",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670219/iit2_aunjoy.jpg",
    date: {
      month: "Feburary",
      year: 2025,
    },
    caption: "Hackathon Experience Sharing at VSITR",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670211/reflectify-dev_afcemh.jpg",
    date:{
      month: "January",
      year: 2025,
    },
    caption: "Reflectify - Just Completed the Development Phase",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670213/iit3_fi1puq.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "SIH 2024 Appreciation by Shri Vallabhbhai M. Patel sir, Hon. Chairman, SVKM",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670228/iit4_nziehu.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "SIH 2024 Appreciation by Shri Gargi Rajapara ma'am, Principal, LDRP-ITR",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670234/iit7_pgubsp.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "Airport Diaries - SIH 2024",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670214/ipr2_zgkp6v.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "Institute for Plasma Research Project Completion Certification",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670222/poster1_pfesyr.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "State Level Poster Presentation Competition",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670212/ssip2_ge62nf.jpg",
    date: {
      month: "October",
      year: 2023,
    },
    caption: "SSIP Internal Hackathon Round - IITRAM, Ahmedabad",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670208/ssip3_utxzpv.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "SSIP Namo iHub, Mehsana",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670227/ssip4_fsl0c8.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "Sun Temple - Modhera",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670214/ssip5_so4r1q.jpg",
    date: {
      month: "December",
      year: 2023,
    },
    caption: "SSIP Finale - PDEU, Gandhinagar",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670237/stage1_kxvcdt.jpg",
    date: {
      month: "July",
      year: 2024,
    },
    caption: "Career Compass: Guiding your way forward",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670218/stage2_pbuaxs.jpg",
    date: {
      month: "January",
      year: 2024,
    },
    caption: "IEEE Awareness Drive",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670224/vol_zmvzes.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "Volunteer at Research Orientation Workshop",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670228/vol2_ffp3ax.jpg",
    date: {
      month: "July",
      year: 2024,
    },
    caption: "CareerCompass Volunteer Team",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670230/website1_xmpydu.jpg",
    date: {
      month: "December",
      year: 2024,
    },
    caption: "MMPSRPC Website Appreciation by Shri Gargi Rajapara ma'am, Principal, LDRP-ITR",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670218/xen1_zxfg9n.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "Alumni Meet - Xenesis 2024",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670219/xen2_vkc6sl.jpg",
    date: {
      month: "February",
      year: 2024,
    },
    caption: "Xenesis 2024 Preparations",
  },
  {
    url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670220/xen3_dpihxu.jpg",
    date: {
      month: "Febuary",
      year: 2024,
    },
    caption: "CodeHunt Event Volunteer - Xenesis 2024",
  }
]

export const projects: Project[] = [
  {
    id: "unified-portal-grievance",
    isFeatured: true,
    title: "Unified Portal for Grievance Lodging",
    event: "Smart India Hackathon 2023",
    description:
      "An integrated platform with automated chatbot for grievance lodging that achieved All India Rank 7 in Smart India Hackathon 2023.",
    longDescription:
      "Led a team to develop a unified portal that streamlines the grievance lodging process through an automated chatbot interface. The system uses advanced AI/ML techniques to categorize and route grievances to appropriate departments, significantly reducing processing time and improving user experience.",
    startDate: {
      month: "August",
      year: 2023,
    },
    endDate: {
      month: "December",
      year: 2023,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670168/sih_2023_hlzjb2.jpg",
    tags: ["AI/ML", "Chatbot", "Grievance Management", "Python"],
    featured: true,
    category: ["ai-ml", "hackathon"],
    skills: [
      "Python",
      "Numpy",
      "Pandas",
      "Keras",
      "Matplotlib",
      "Scikit-learn",
      "TensorFlow",
      "Team Leadership",
    ],
    achievements: ["AIR 7 in Smart India Hackathon 2023"],
    teamSize: 6,
    role: "Team Leader & AI/ML Developer",
  },
  {
    id: "customer-grievance-onoc",
    isFeatured: true,
    title: "Customer Grievance Portal for ONOC",
    event: "New India Vibrant Hackathon SSIP 2023",
    description:
      "A citizen grievance platform for One Nation One Challan Policy that won 3rd place in Gujarat Hackathon SSIP 2023.",
    longDescription:
      "Designed and developed a comprehensive grievance management system specifically tailored for the One Nation One Challan Policy. The platform features interactive dashboards with visualization tools to help administrators track and resolve citizen complaints efficiently.",
    startDate: {
      month: "October",
      year: 2023,
    },
    endDate: {
      month: "December",
      year: 2023,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670165/ssip_2023_y8cexe.jpg",
    tags: ["Frontend Development", "UI/UX", "Data Visualization"],
    link: "https://www.linkedin.com/posts/ldrp-itr-gandhinagar-4a7974286_vibrantgujarathackathon-ssip-ksv-activity-7140264165956399104-xweF",
    featured: true,
    category: ["web-development", "hackathon"],
    skills: [
      "Figma",
      "Canva",
      "HTML",
      "CSS",
      "Tailwind",
      "JavaScript",
      "ApexCharts",
      "GeoJSON",
    ],
    achievements: ["3rd place in Gujarat Hackathon SSIP 2023"],
    teamSize: 8,
    role: "Front-End Developer",
  },
  {
    id: "greenvend",
    title: "GreenVend – Waste to Value",
    event: "ROBOFEST 4.0 2024",
    description:
      "An IoT-based waste management system using Raspberry Pi and ML for real-time remote data processing.",
    longDescription:
      "Developed an innovative waste management solution that transforms waste into value through IoT technology. The system uses sensors connected to a Raspberry Pi to detect, categorize, and process waste materials in real-time, enabling efficient recycling and resource recovery.",
    startDate: {
      month: "June",
      year: 2024,
    },
    endDate: {
      month: "July",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670151/robofest_el9i1w.png",
    tags: ["IoT", "Raspberry Pi", "Machine Learning", "Waste Management"],
    // link: "/projects/greenvend",
    // githubLink: "https://github.com/kandarpgajjar/greenvend",
    featured: false,
    category: ["iot", "ai-ml"],
    skills: ["Raspberry PI", "Sensors", "Linux", "Python", "PyTorch"],
    teamSize: 4,
    role: "IoT Developer",
  },
  {
    id: "spectral-classification",
    title: "Spectral Classification of IIRS Data",
    event: "Bharatiya Antariksh Hackathon 2024",
    description:
      "Model development for lunar hyperspectral data classification from Chandrayaan-2 mission for the Bharatiya Antariksh Hackathon 2024.",
    longDescription:
      "Contributed to developing an AI model that classifies lunar hyperspectral data collected by the Chandrayaan-2 mission. The project involved extensive data preprocessing, feature extraction, and model training to accurately identify different lunar surface compositions and structures.",
    startDate: {
      month: "July",
      year: 2024,
    },
    endDate: {
      month: "August",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670148/isro_hack_a9bcop.png",
    tags: ["Data Science", "Space Technology", "GIS", "Machine Learning"],
    // link: "/projects/spectral-classification",
    githubLink: "https://github.com/slantie/isro-hackathon",
    featured: false,
    category: "data-science",
    skills: [
      "Python",
      "Pandas",
      "Numpy",
      "PyTorch",
      "GDAL",
      "GeoJSON",
      "QGIS",
      "Matplotlib",
    ],
    teamSize: 4,
    role: "AI/ML Developer",
  },
  {
    id: "mmpsrp-website",
    title: "M. M. Patel Students Research Project Cell Website",
    event: "M. M. Patel Student Research Project Cell",
    description:
      "A modern, responsive website for the MMPSRP Cell to enhance collaboration and provide an intuitive user interface for students.",
    longDescription:
      "Developed a comprehensive website for the M. M. Patel Students Research Project Cell that serves as a central hub for student research activities. The site features project showcases, resource libraries, collaboration tools, and an intuitive interface to connect students with research opportunities.",
    startDate: {
      month: "August",
      year: 2024,
    },
    endDate: {
      month: "October",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670149/mmpsrpc_website_xossub.jpg",
    tags: ["Web Development", "React", "UI/UX", "Frontend"],
    link: "https://www.linkedin.com/posts/mmpsrpc_innovation-teamwork-mmpsrpc-activity-7275821572966211584-lA0f",
    liveLink: "https://www.mmpsrpc.in/",
    githubLink: "https://github.com/KauraniDivya/MMPSRC",
    featured: false,
    category: "web-development",
    skills: ["ReactJS", "TailwindCSS", "Responsive Design"],
    teamSize: 8,
    role: "Frontend Web Developer",
  },
  {
    id: "personalized-info-retrieval",
    title:
      "Fusing Retrieval Techniques for Enhanced Personalized Community Question Answering",
    event:
      "Personalized Information Retrieval - Forum for Information Retrieval Evaluation 2024",
    description:
      "Research work on developing personalized user profiles and enhancing model outputs with user preferences for the PIRFIRE 2024 Competition.",
    longDescription:
      "Conducted research on advanced information retrieval systems that adapt to individual user preferences and behaviors. The project involved developing personalized user profiles, implementing sophisticated data preprocessing techniques, and enhancing model outputs by incorporating user preference signals.",
    startDate: {
      month: "June",
      year: 2024,
    },
    endDate: {
      month: "December",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670150/pirfire_atavpn.png",
    tags: ["AI/ML", "NLP", "Research", "Information Retrieval"],
    // link: "/projects/personalized-info-retrieval",
    // githubLink: "https://github.com/kandarpgajjar/personalized-info-retrieval",
    featured: false,
    category: ["ai-ml", "research"],
    skills: [
      "Python",
      "Pandas",
      "Numpy",
      "PyTorch",
      "spaCy",
      "NLTK",
      "GPT-3",
      "Zenodo",
      "Jupyter",
    ],
    achievements: ["Paper Accepted in the PIRFIRE 2024 Track"],
    teamSize: 3,
    role: "AI/ML Developer",
  },
  {
    id: "ecosmart-dustbin",
    title: "EcoSmart Dustbin with Automated Waste Segregation System",
    // event: "",
    description:
      "An innovative automated waste segregation system designed specifically for educational institutions.",
    longDescription:
      "Developing a smart waste management solution that automatically segregates different types of waste materials using computer vision and machine learning. The system is specifically tailored for educational institutions to promote sustainable waste management practices and environmental awareness.",
    startDate: {
      month: "August",
      year: 2024,
    },
    isOngoing: true,
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670147/ecosmart_wniqbx.jpg",
    tags: ["IoT", "AI/ML", "Waste Management", "Sustainability"],
    // link: "/projects/ecosmart-dustbin",
    // githubLink: "https://github.com/kandarpgajjar/ecosmart-dustbin",
    featured: false,
    category: ["iot", "ai-ml"],
    skills: [
      "Python",
      "Numpy",
      "Pandas",
      "Keras",
      "Matplotlib",
      "Scikit-learn",
      "TensorFlow",
      "Raspberry PI",
      "Linux",
    ],
    teamSize: 4,
    role: "AI/ML Developer",
  },
  {
    id: "gst-analytics",
    title: "Development of a Predictive Model in GST",
    event: "GST Analytics Hackathon 2024",
    description:
      "Developed a robust Machine Learning model for predicting GST revenue utilizing comprehensive data analysis and preprocessing.",
    longDescription:
      "Created an advanced analytics solution for GST revenue prediction as part of the GST Analytics Hackathon 2024. The project involved extensive data cleaning, feature engineering, and the implementation of predictive models to forecast tax revenues with high accuracy.",
    startDate: {
      month: "August",
      year: 2024,
    },
    endDate: {
      month: "October",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670149/gst_yogbm3.png",
    tags: ["Data Analytics", "Machine Learning", "Finance", "Tax"],
    // link: "/projects/gst-analytics",
    githubLink: "https://github.com/slantie/GSTN_589-Team-Coding-Brigades",
    featured: false,
    category: "data-science",
    skills: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Plotly",
    ],
    teamSize: 5,
    role: "AI/ML Developer",
  },
  {
    id: "vidvigilante",
    isFeatured: true,
    title: "VidVigilante – Unmask the Truth",
    event: "Smart India Hackathon 2024",
    description:
      "A deepfake detection website with an AI model for detecting face swaps, developed for the National Technical Research Organization (NTRO).",
    longDescription:
      "Designed and implemented a comprehensive deepfake detection platform that uses advanced computer vision and deep learning techniques to identify manipulated video content. The system is specifically optimized to detect face swap technologies, helping combat misinformation and digital fraud.",
    startDate: {
      month: "August",
      year: 2024,
    },
    endDate: {
      month: "December",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670155/sih_2024_stage_d23nda.jpg",
    tags: ["AI/ML", "Computer Vision", "Deepfake Detection", "Cybersecurity"],
    link: "https://www.linkedin.com/posts/mmpsrpc_smartindiahackathon2024-teamcodingbrigades-activity-7273613599355420672-j7Un",
    githubLink: "https://github.com/ridh21/VidVigilante",
    featured: true,
    category: ["ai-ml", "cybersecurity"],
    skills: [
      "Python",
      "OpenCV",
      "TensorFlow",
      "Keras",
      "Flask",
      "Deep Learning",
      "MFFC",
      "Librosa",
      "OpenFace",
    ],
    achievements: ["Finalist position in SIH 2024"],
    teamSize: 6,
    role: "AI/ML Developer",
  },
  {
    id: "reflectify",
    title: "Reflectify - Coordinated Feedbacks",
    event: "Curricular Project",
    description:
      "An Anonymous and Synchronized Feedback System for the College Institute to enhance feedback collection and provide data-driven analytics.",
    longDescription:
      "Developed a comprehensive feedback management system that allows students and faculty to provide anonymous feedback while maintaining synchronization across departments. The platform generates meaningful insights through data analysis and visualization, helping the institution make informed decisions for improvement.",
    startDate: {
      month: "January",
      year: 2025,
    },
    endDate: {
      month: "February",
      year: 2025,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670151/reflectify_s5eifl.png",
    tags: ["Full Stack", "Web Development", "Data Analytics", "Education"],
    link: "/projects/reflectify",
    liveLink: "https://reflectify.live/",
    githubLink: "https://github.com/HarshDodiya1/Reflectify",
    featured: false,
    category: ["web-development", "academic"],
    skills: [
      "NextJS",
      "TypeScript",
      "Python",
      "NodeJS",
      "Prisma ORM",
      "Flask",
      "PostgreSQL",
    ],
    teamSize: 3,
    role: "Full Stack Developer",
  },
  {
    id: "ipr-quiz-platform",
    title: "Online Quiz Platform for Institute for Plasma Research",
    event: "Institute for Plasma Research (IPR)",
    description:
      "An online quiz platform with multilingual support, separate Admin & User portals, and integrated Admin Analytics.",
    longDescription:
      "Built a comprehensive online quiz platform for the Institute for Plasma Research that features multilingual support, role-based access control with separate portals for administrators and users, and robust analytics dashboards. The system provides a seamless user experience while allowing administrators to track progress and performance metrics.",
    startDate: {
      month: "August",
      year: 2024,
    },
    endDate: {
      month: "November",
      year: 2024,
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670147/ipr_rujvlz.jpg",
    tags: ["Web Development", "Frontend", "Analytics", "Education"],
    link: "https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7275004782707146753-Mvb9",
    liveLink: "https://quiz-ipr.vercel.app/",
    githubLink: "https://github.com/HarshDodiya1/IPR-Online-Quiz-Platform",
    featured: false,
    category: "web-development",
    skills: ["ReactJS", "TailwindCSS", "i18Next", "Analytics"],
    teamSize: 8,
    role: "Frontend Web Developer",
  },
];

export const achievements: Achievement[] = [
  {
    id: "aws-certification",
    type: "certificate",
    title: "AWS Cloud Practitioner Certification",
    organization: "Amazon Web Services",
    description: "Earned the AWS Cloud Practitioner certification, demonstrating foundational knowledge of AWS cloud services, architecture, security, and pricing models.",
    date: {
      month: "January",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670188/aws_md37xm.jpg",
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    tags: ["AWS", "Cloud Computing", "Certification"]
  },
  {
    id: "bip-curtin",
    type: "certificate",
    title: "Business Innovation Program - Curtin University",
    organization: "Curtin University",
    description: "Completed the Business Innovation Program offered by Curtin University, focusing on entrepreneurship and innovative business solutions.",
    date: {
      month: "November",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670191/bip-curtin_u1l5so.jpg",
    tags: ["Business Innovation", "Entrepreneurship", "International Program"]
  },
  {
    id: "bip-director",
    type: "felicitation",
    title: "Business Innovation Program - Director's Recognition",
    organization: "Curtin University & KSV",
    description: "Received special recognition from the program director for outstanding contributions and innovative ideas during the Business Innovation Program.",
    date: {
      month: "November",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670195/bip-dir_fpheih.jpg",
    tags: ["Leadership", "Innovation", "Recognition"]
  },
  {
    id: "bip-global-certificate",
    type: "certificate",
    title: "Global Business Innovation Certificate",
    organization: "Curtin University",
    description: "Awarded the Global Business Innovation Certificate for successfully completing the international business innovation program and demonstrating cross-cultural business acumen.",
    date: {
      month: "November",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670190/bip-global-cert43_kmowrb.jpg",
    tags: ["Global Business", "Innovation", "International Certification"]
  },
  {
    id: "digicom",
    type: "recognition",
    title: "Digital Committee Member",
    organization: "Xenesis 2024",
    description: "Served as the Digital Committee Member for Xenesis, the flagship technical festival, managing socials, website development, online registration systems, and digital marketing campaigns.",
    date: {
      month: "February",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670199/digicom_lfhfbf.jpg",
    tags: ["Web Development", "Digital Marketing", "Event Management", "Social Media"]
  },
  {
    id: "code-hunt",
    type: "award",
    title: "Code Hunt Competition Winner",
    organization: "Xenesis 2024",
    description: "Secured first place in the Code Hunt competition, demonstrating exceptional problem-solving skills and algorithmic thinking under time constraints.",
    date: {
      month: "February",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670196/code-hunt_nzbpj5.jpg",
    tags: ["Competitive Programming", "Algorithms", "Problem Solving"]
  },
  {
    id: "ipr-project",
    type: "recognition",
    title: "Institute for Plasma Research Project",
    organization: "Institute for Plasma Research",
    description: "Recognized for developing an innovative online quiz platform with multilingual support for the Institute for Plasma Research, enhancing their educational outreach.",
    date: {
      month: "November",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670205/ipr-final_njpfwf.jpg",
    tags: ["Web Development", "Educational Technology", "Government Project"]
  },
  {
    id: "isro-hackathon",
    type: "certificate",
    title: "Bharatiya Antariksh Hackathon Participant",
    organization: "ISRO & Ministry of Education",
    description: "Participated in the Bharatiya Antariksh Hackathon organized by ISRO, developing solutions for lunar hyperspectral data classification from the Chandrayaan-2 mission.",
    date: {
      month: "August",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670196/isro-hack_mc4hdj.png",
    link: "https://www.isro.gov.in/",
    tags: ["Space Technology", "Data Science", "Machine Learning"]
  },
  {
    id: "poster-competition",
    type: "award",
    title: "State Level Poster Presentation Award",
    organization: "Gujarat Technical University",
    description: "Awarded for an innovative technical poster presentation on AI applications in healthcare at the state-level competition organized by GTU.",
    date: {
      month: "Febuary",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670198/poster_zlpwow.jpg",
    link: "https://gtu.ac.in/",
    tags: ["Research", "AI/ML", "Healthcare", "Poster Presentation"]
  },
  {
    id: "sih-2024-finalist",
    type: "felicitation",
    title: "Smart India Hackathon 2024 Finalist",
    organization: "Ministry of Education, Government of India",
    description: "Recognized as a finalist at Smart India Hackathon 2024 held at IIT Guwahati for developing VidVigilante, an innovative deepfake detection solution for NTRO.",
    date: {
      month: "December",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670205/sih-final_l2gaqr.jpg",
    link: "https://www.sih.gov.in/",
    tags: ["Hackathon", "AI/ML", "Cybersecurity", "National Level"]
  },
  {
    id: "sih-mmpsrpc",
    type: "recognition",
    title: "MMPSRPC Recognition for SIH 2024",
    organization: "M. M. Patel Students Research Project Cell",
    description: "Received special recognition from MMPSRPC for representing the institute at Smart India Hackathon 2024 and advancing to the finals with the VidVigilante project.",
    date: {
      month: "October",
      year: 2024
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670202/sih-mmpsrpc_w6zkpv.jpg",
    tags: ["Research Excellence", "Institute Recognition", "Innovation"]
  },
  {
    id: "ssip-regional",
    type: "award",
    title: "SSIP 2023 Winner",
    organization: "Student Startup & Innovation Policy, Gujarat",
    description: "Secured first place in the regional round of the Student Startup & Innovation Policy hackathon with the One Nation One Challan project.",
    date: {
      month: "November",
      year: 2023
    },
    image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1743670199/ssip-conclave_aaik0r.jpg",
    tags: ["Hackathon", "Regional Winner", "Innovation"]
  }
];

// Get all projects
export const getAllProjects = (): Project[] => {
  return projects;
};

// Get featured projects
export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};

// Get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id);
};

// Get projects by category
export const getProjectsByCategory = (category: ProjectCategory): Project[] => {
  return projects.filter((project) => {
    if (Array.isArray(project.category)) {
      return project.category.includes(category);
    }
    return project.category === category;
  });
};

// Get latest projects (most recent first)
export const getLatestProjects = (limit?: number): Project[] => {
  const sortedProjects = [...projects].sort((a, b) => {
    const aYear = a.endDate?.year || a.startDate.year;
    const bYear = b.endDate?.year || b.startDate.year;

    if (aYear !== bYear) return bYear - aYear;

    const aMonth = a.endDate?.month || a.startDate.month;
    const bMonth = b.endDate?.month || b.startDate.month;

    return monthToNumber(bMonth) - monthToNumber(aMonth);
  });

  return limit ? sortedProjects.slice(0, limit) : sortedProjects;
};

// Helper function to convert month name to number for sorting
const monthToNumber = (month: string): number => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(month);
};

export const featuredProjects = projects.filter((project) => project.featured);
export const aiMlProjects = projects.filter(
  (project) =>
    project.category === "ai-ml" ||
    (Array.isArray(project.category) && project.category.includes("ai-ml"))
);
export const webDevProjects = projects.filter(
  (project) =>
    project.category === "web-development" ||
    (Array.isArray(project.category) &&
      project.category.includes("web-development"))
);
export const dataProjects = projects.filter(
  (project) =>
    project.category === "data-science" ||
    (Array.isArray(project.category) &&
      project.category.includes("data-science"))
);
export const iotProjects = projects.filter(
  (project) =>
    project.category === "iot" ||
    (Array.isArray(project.category) && project.category.includes("iot"))
);
export const researchProjects = projects.filter(
  (project) =>
    project.category === "research" ||
    (Array.isArray(project.category) && project.category.includes("research"))
);
export const securityProjects = projects.filter(
  (project) =>
    project.category === "cybersecurity" ||
    (Array.isArray(project.category) &&
      project.category.includes("cybersecurity"))
);

// Get all achievements sorted by date (most recent first)
export const getSortedAchievements = (): Achievement[] => {
  return [...achievements].sort((a, b) => {
    // Compare years first
    if (a.date.year !== b.date.year) {
      return b.date.year - a.date.year;
    }
    
    // If years are the same, compare months
    return monthToNumber(b.date.month) - monthToNumber(a.date.month);
  });
};

// Get achievements by type, sorted by date
export const getSortedAchievementsByType = (type: AchievementType): Achievement[] => {
  return achievements
    .filter(achievement => achievement.type === type)
    .sort((a, b) => {
      if (a.date.year !== b.date.year) {
        return b.date.year - a.date.year;
      }
      return monthToNumber(b.date.month) - monthToNumber(a.date.month);
    });
};

// Get achievements from a specific year, sorted by month
export const getSortedAchievementsByYear = (year: number): Achievement[] => {
  return achievements
    .filter(achievement => achievement.date.year === year)
    .sort((a, b) => monthToNumber(b.date.month) - monthToNumber(a.date.month));
};

// Define category labels for achievements
export const achievementCategoryLabels: Record<AchievementType, string> = {
  award: "Award",
  certificate: "Certificate",
  felicitation: "Felicitation",
  publication: "Publication",
  recognition: "Recognition",
};
