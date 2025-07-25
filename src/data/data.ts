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
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825814/ieee_award_a75qvx_e0dw3b.avif",
        date: {
            month: "February",
            year: 2025,
        },
        caption: "IEEE Gujarat Section Emerging Student Branch Award 2024",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825823/xen_2024_tvsipp_bf3z5i.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "Xenesis 2024 - Digital Committee Member",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825816/avpc_img_jbrn1w_tdbzx9.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "State Level Poster Presentation Competition 2024",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825815/sampark2_ziug02_uab57x.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "IEEE Gujarat Section SAMPARK 2024",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825819/xen_mkiw2w_sqajlw.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "Main Student Event Coordinator for Xenesis 2024",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825822/ssip_2023_img_iwmbli_nprbpz.avif",
        date: {
            month: "December",
            year: 2023,
        },
        caption: "Felicitated by Gujarat Hackathon SSIP 2023",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825820/sih_2024_img_zgwkeu_a5vncp.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption: "SIH 2024 - IIT Guwahati",
    },
];

export const mainGalleryImages: galleryImage[] = [
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825793/dir1_zkw6cp_txqoyg.avif",
        date: {
            month: "Novemeber",
            year: 2024,
        },
        caption: "Just me enjoying the moment at Perth Mint",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825785/dir2_bnxpb1_xe0ifz.avif",
        date: {
            month: "November",
            year: 2024,
        },
        caption: "Ferry to Watson's Bay - A beautiful day out",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825787/dir3_uy2f8s_cn8kvn.avif",
        date: {
            month: "November",
            year: 2024,
        },
        caption: "DIR BIP 2024 Team - Curtin University",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825791/dir4_tetkth_djvdwx.avif",
        date: {
            month: "November",
            year: 2024,
        },
        caption: "Tried joining the Kangaroo club!",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744829588/dir5_tavfjy_m0ox4b.avif",
        date: {
            month: "November",
            year: 2024,
        },
        caption: "St. Mary's Cathedral - Stunning Glass Work",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744829589/dir6_kbuveo_iocogd.avif",
        date: {
            month: "November",
            year: 2024,
        },
        caption: "Just a normal day in Australia",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825791/dir8_cslsdn_cesbgh.avif",
        date: {
            month: "November",
            year: 2024,
        },
        caption: "Art Gallery of New South Wales",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825784/gdg_spdvm0_zsmf5u.avif",
        date: {
            month: "June",
            year: 2024,
        },
        caption: "GDG Ahmedabad Creating Tomorrow: Dive into Generative AI!",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825806/iit1_cfsu1u_dmqow4.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption: "Stepping into IIT Guwahati",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825791/iit2_aunjoy_hc3p0l.avif",
        date: {
            month: "Feburary",
            year: 2025,
        },
        caption: "Hackathon Experience Sharing at VSITR",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744829587/reflectify-dev_afcemh_fq6qef.avif",
        date: {
            month: "January",
            year: 2025,
        },
        caption: "Reflectify - Just Completed the Development Phase",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825794/iit3_fi1puq_xmxi9l.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption:
            "SIH 2024 Appreciation by Shri Vallabhbhai M. Patel sir, Hon. Chairman, SVKM",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825803/iit4_nziehu_cqwqy1.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption:
            "SIH 2024 Appreciation by Shri Gargi Rajapara ma'am, Principal, LDRP-ITR",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825796/iit7_pgubsp_duknzc.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption: "Airport Diaries - SIH 2024",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825793/ipr2_zgkp6v_xlpcpv.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption:
            "Institute for Plasma Research Project Completion Certification",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825808/poster1_pfesyr_disqy8.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "State Level Poster Presentation Competition",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825793/ssip2_ge62nf_zs0u7z.avif",
        date: {
            month: "October",
            year: 2023,
        },
        caption: "SSIP Internal Hackathon Round - IITRAM, Ahmedabad",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825784/ssip3_utxzpv_ie4kaw.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption: "SSIP Namo iHub, Mehsana",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825807/ssip4_fsl0c8_hh05rz.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption: "Sun Temple - Modhera",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825795/ssip5_so4r1q_wiuzxw.avif",
        date: {
            month: "December",
            year: 2023,
        },
        caption: "SSIP Finale - PDEU, Gandhinagar",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825792/stage1_kxvcdt_socbto.avif",
        date: {
            month: "July",
            year: 2024,
        },
        caption: "Career Compass: Guiding your way forward",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825790/stage2_pbuaxs_lxwanv.avif",
        date: {
            month: "January",
            year: 2024,
        },
        caption: "IEEE Awareness Drive",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825803/vol_zmvzes_lxvry7.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption: "Volunteer at Research Orientation Workshop",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825801/vol2_ffp3ax_mgivbc.avif",
        date: {
            month: "July",
            year: 2024,
        },
        caption: "CareerCompass Volunteer Team",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825803/website1_xmpydu_pohxrz.avif",
        date: {
            month: "December",
            year: 2024,
        },
        caption:
            "MMPSRPC Website Appreciation by Shri Gargi Rajapara ma'am, Principal, LDRP-ITR",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825803/xen1_zxfg9n_hflo2y.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "Alumni Meet - Xenesis 2024",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825804/xen2_vkc6sl_tbfzpi.avif",
        date: {
            month: "February",
            year: 2024,
        },
        caption: "Xenesis 2024 Preparations",
    },
    {
        url: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825804/xen3_dpihxu_hjhrki.avif",
        date: {
            month: "Febuary",
            year: 2024,
        },
        caption: "CodeHunt Event Volunteer - Xenesis 2024",
    },
];

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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825819/sih_2023_hlzjb2_nrcqsf.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825824/ssip_2023_y8cexe_qxiosq.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825814/robofest_el9i1w_qzkgqv.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825812/isro_hack_a9bcop_sdtc2j.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825816/mmpsrpc_website_xossub_pla1e1.avif",
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
        title: "Fusing Retrieval Techniques for Enhanced Personalized Community Question Answering",
        event: "Personalized Information Retrieval - Forum for Information Retrieval Evaluation 2024",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825818/pirfire_atavpn_ywfjab.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825813/ecosmart_wniqbx_rfeak9.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825813/ecosmart_wniqbx_rfeak9.avif",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825817/sih_2024_stage_d23nda_igwjzq.avif",
        tags: [
            "AI/ML",
            "Computer Vision",
            "Deepfake Detection",
            "Cybersecurity",
        ],
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825814/reflectify_s5eifl_x1mged.avif",
        tags: ["Full Stack", "Web Development", "Data Analytics", "Education"],
        // link: "/projects/reflectify",
        liveLink: "https://reflectify-delta.vercel.app/",
        githubLink: "https://github.com/slantie/reflectify-frontend",
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
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825816/ipr_rujvlz_gjdiwe.avif",
        tags: ["Web Development", "Frontend", "Analytics", "Education"],
        link: "https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7275004782707146753-Mvb9",
        // liveLink: "https://quiz-ipr.vercel.app/",
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
        id: "hasoc-fire-certification",
        type: "certificate",
        title: "HASOC-FIRE 2025 Annotation Certification",
        organization: "HASOC-FIRE - IIT Kharagpur & University of Hildesheim",
        description:
            "Received the HASOC-FIRE 2025 Annotation Certification, demonstrating expertise in annotating hate speech and offensive content.",
        date: {
            month: "May",
            year: 2025,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1753423217/HASOC_Annotation_Certificate_b99tnk.avif",
        link: "https://hasocfire.github.io/hasoc/2025/index.html",
        tags: ["Hate Speech", "Offensive Content", "Annotation"],
    },
    {
        id: "mmpsrpc-funding",
        type: "award",
        title: "EcoSmart Dustbin Project Grant",
        organization: "M. M. Patel Students Research Project Cell, KSV",
        description:
            "Received the MMPSRPC Project Grant for outstanding contributions to the EcoSmart Dustbin project.",
        date: {
            month: "April",
            year: 2025,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1753426261/MMPSRPC-Project-Grant_tewg0z.avif",
        link: "https://www.mmpsrpc.in/",
        tags: ["Project Funding", "EcoSmart Dustbin", "Innovation"],
    },
    {
        id: "aws-certification",
        type: "certificate",
        title: "AWS Cloud Practitioner Certification",
        organization: "Amazon Web Services",
        description:
            "Earned the AWS Cloud Practitioner certification, demonstrating foundational knowledge of AWS cloud services, architecture, security, and pricing models.",
        date: {
            month: "January",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825772/aws_md37xm_qjffnv.avif",
        link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        tags: ["AWS", "Cloud Computing", "Certification"],
    },
    {
        id: "bip-curtin",
        type: "certificate",
        title: "Business Innovation Program - Curtin University",
        organization: "Curtin University",
        description:
            "Completed the Business Innovation Program offered by Curtin University, focusing on entrepreneurship and innovative business solutions.",
        date: {
            month: "November",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825773/bip-curtin_u1l5so_exmswq.avif",
        tags: [
            "Business Innovation",
            "Entrepreneurship",
            "International Program",
        ],
    },
    {
        id: "bip-director",
        type: "felicitation",
        title: "Business Innovation Program - Director's Recognition",
        organization: "Curtin University & KSV",
        description:
            "Received special recognition from the program director for outstanding contributions and innovative ideas during the Business Innovation Program.",
        date: {
            month: "November",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825774/bip-dir_fpheih_m1y3bg.avif",
        tags: ["Leadership", "Innovation", "Recognition"],
    },
    {
        id: "bip-global-certificate",
        type: "certificate",
        title: "Global Business Innovation Certificate",
        organization: "Curtin University",
        description:
            "Awarded the Global Business Innovation Certificate for successfully completing the international business innovation program and demonstrating cross-cultural business acumen.",
        date: {
            month: "November",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825773/bip-global-cert43_kmowrb_np7hpx.avif",
        tags: ["Global Business", "Innovation", "International Certification"],
    },
    {
        id: "digicom",
        type: "recognition",
        title: "Digital Committee Member",
        organization: "Xenesis 2024",
        description:
            "Served as the Digital Committee Member for Xenesis, the flagship technical festival, managing socials, website development, online registration systems, and digital marketing campaigns.",
        date: {
            month: "February",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744830637/digicom_lfhfbf_qwaipv.avif",
        tags: [
            "Web Development",
            "Digital Marketing",
            "Event Management",
            "Social Media",
        ],
    },
    {
        id: "code-hunt",
        type: "award",
        title: "Code Hunt Competition Winner",
        organization: "Xenesis 2024",
        description:
            "Secured first place in the Code Hunt competition, demonstrating exceptional problem-solving skills and algorithmic thinking under time constraints.",
        date: {
            month: "February",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744830636/code-hunt_nzbpj5_gywguu.avif",
        tags: ["Competitive Programming", "Algorithms", "Problem Solving"],
    },
    {
        id: "ipr-project",
        type: "recognition",
        title: "Institute for Plasma Research Project",
        organization: "Institute for Plasma Research",
        description:
            "Recognized for developing an innovative online quiz platform with multilingual support for the Institute for Plasma Research, enhancing their educational outreach.",
        date: {
            month: "November",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744830639/ipr-final_njpfwf_w8ek38.avif",
        tags: [
            "Web Development",
            "Educational Technology",
            "Government Project",
        ],
    },
    {
        id: "isro-hackathon",
        type: "certificate",
        title: "Bharatiya Antariksh Hackathon Participant",
        organization: "ISRO & Ministry of Education",
        description:
            "Participated in the Bharatiya Antariksh Hackathon organized by ISRO, developing solutions for lunar hyperspectral data classification from the Chandrayaan-2 mission.",
        date: {
            month: "August",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825775/isro-hack_mc4hdj_b8r4tu.avif",
        link: "https://www.isro.gov.in/",
        tags: ["Space Technology", "Data Science", "Machine Learning"],
    },
    {
        id: "poster-competition",
        type: "award",
        title: "State Level Poster Presentation Award",
        organization: "Gujarat Technical University",
        description:
            "Awarded for an innovative technical poster presentation on AI applications in healthcare at the state-level competition organized by GTU.",
        date: {
            month: "Febuary",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744830638/poster_zlpwow_umqkwc.avif",
        link: "https://gtu.ac.in/",
        tags: ["Research", "AI/ML", "Healthcare", "Poster Presentation"],
    },
    {
        id: "sih-2024-finalist",
        type: "felicitation",
        title: "Smart India Hackathon 2024 Finalist",
        organization: "Ministry of Education, Government of India",
        description:
            "Recognized as a finalist at Smart India Hackathon 2024 held at IIT Guwahati for developing VidVigilante, an innovative deepfake detection solution for NTRO.",
        date: {
            month: "December",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744830640/sih-final_l2gaqr_ybf4mi.avif",
        link: "https://www.sih.gov.in/",
        tags: ["Hackathon", "AI/ML", "Cybersecurity", "National Level"],
    },
    {
        id: "sih-mmpsrpc",
        type: "recognition",
        title: "MMPSRPC Recognition for SIH 2024",
        organization: "M. M. Patel Students Research Project Cell",
        description:
            "Received special recognition from MMPSRPC for representing the institute at Smart India Hackathon 2024 and advancing to the finals with the VidVigilante project.",
        date: {
            month: "October",
            year: 2024,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825778/sih-mmpsrpc_w6zkpv_wkbv2v.avif",
        tags: ["Research Excellence", "Institute Recognition", "Innovation"],
    },
    {
        id: "ssip-regional",
        type: "award",
        title: "SSIP 2023 Winner",
        organization: "Student Startup & Innovation Policy, Gujarat",
        description:
            "Secured first place in the regional round of the Student Startup & Innovation Policy hackathon with the One Nation One Challan project.",
        date: {
            month: "November",
            year: 2023,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825778/ssip-conclave_aaik0r_ojddby.avif",
        tags: ["Hackathon", "Regional Winner", "Innovation"],
    },
    {
        id: "pfds-nptel",
        type: "certificate",
        title: "NPTEL Certification in Python for Data Science",
        organization: "NPTEL - IIT Madras",
        description:
            "Secured position in top the 5% with a score of 83% in the NPTEL course on Python for Data Science. Elite + Silver Medalist.",
        date: {
            month: "April",
            year: 2025,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825777/pfds-nptel_jrskwx_uwwk49.avif",
        tags: ["Data Science", "Top 5%", "Elite + Silver Medalist"],
    },
    {
        id: "tcs-codevita",
        type: "certificate",
        title: "TCS CodeVita Season 12 - Rank 3300",
        organization: "Tata Consultancy Services",
        description:
            "Ranked 3300 in the world in TCS CodeVita Season 12, a prestigious coding competition.",
        date: {
            month: "April",
            year: 2025,
        },
        image: "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825781/tcs-codevita_m3ucck_pfrfhe.avif",
        link: "https://codevita.tcsapps.com/",
        tags: ["TCS", "CodeVita", "Competitive Coding"],
    },
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
        (Array.isArray(project.category) &&
            project.category.includes("research"))
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
export const getSortedAchievementsByType = (
    type: AchievementType
): Achievement[] => {
    return achievements
        .filter((achievement) => achievement.type === type)
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
        .filter((achievement) => achievement.date.year === year)
        .sort(
            (a, b) => monthToNumber(b.date.month) - monthToNumber(a.date.month)
        );
};

// Define category labels for achievements
export const achievementCategoryLabels: Record<AchievementType, string> = {
    award: "Award",
    certificate: "Certificate",
    felicitation: "Felicitation",
    publication: "Publication",
    recognition: "Recognition",
};
