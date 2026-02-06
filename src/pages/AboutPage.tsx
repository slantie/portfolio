import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { SEO } from "@/components/seo";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Users,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOptimalFormatUrl } from "@/lib/cloudinary";
import {
  getExperiences,
  getSkills,
  getEducation,
  getCertifications,
  getLeadership,
  getSetting,
  type Experience,
  type Skill,
  type Education,
  type Certification,
  type Leadership,
} from "@/lib/api";

const AboutPage = () => {
  // API data state
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fallback static data
  const fallbackSkills = [
    "C",
    "C++",
    "HTML5",
    "C",
    "C++",
    "HTML5",
    "CSS",
    "JavaScript",
    "Python",
    "ReactJS",
    "Git",
    "GitHub",
    "Tailwind",
    "GeoJSON",
    "Figma",
    "Canva",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Cloud Computing",
    "Cybersecurity",
    "Ethical Hacking",
    "Computer Networks",
    "IoT",
  ];

  const fallbackExperience = [
    {
      title: "Research Assistant",
      company:
        "M. M. Patel Student Research Projects Cell (MMPSRPC), Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, India",
      period: "Dec 2025 - Present",
      description: "",
    },
    {
      title: "Machine Learning Intern",
      company: "National Technical Research Organization (NTRO), Delhi, India",
      period: "Aug 2025 - Oct 2025",
      description: "",
    },
    {
      title: "Frontend Web Developer",
      company: "Institute for Plasma Research (IPR), Gandhinagar, India",
      period: "Aug 2024 - Nov 2024",
      description:
        "Built an online quiz platform with multilingual support, separate Admin & User portals, and integrated Admin Analytics, ensuring a seamless user experience. Technologies: ReactJS, TailwindCSS, i18Next.",
    },
  ];

  const fallbackLeadership = [
    {
      title: "Chairperson, IEEE Student Branch",
      organization: "LDRP Institute of Technology and Research",
      period: "Dec 2023 - Dec 2024",
      description:
        "Leading the IEEE Student Branch activities and initiatives at the institute.",
    },
    {
      title: "Main Student Event Coordinator",
      organization: "Xenesis'24, LDRP Institute of Technology and Research",
      period: "Feb 2024",
      description:
        "Coordinated and managed the main student technical and cultural fest of the institute.",
    },
  ];

  const fallbackCertifications = [
    {
      image:
        "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825774/gate_jgcdje_bahmdi.avif",
      title: "GATE Qualified - CSE 2025",
      issuer: "GATE",
      period: "Febuary 2025",
    },
    {
      image:
        "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825772/aws_md37xm_qjffnv.avif",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      period: "Jan 2024 - Jan 2026",
    },
    {
      image:
        "https://res.cloudinary.com/dfkccowgw/image/upload/v1744825773/bip-global-cert43_kmowrb_np7hpx.avif",
      title: "Letter of Recommendation",
      issuer: "GlobalCert Pte. Ltd., Singapore",
      period: "October 2024",
    },
  ];

  const researchWork = [
    {
      title: "Personalized Information Retrieval",
      period: "Jun 2024 - Dec 2024",
      role: "AI/ML Developer",
      link: "https://ceur-ws.org/Vol-4054/T5-2.pdf",
      description:
        "Developed personalized user profiles, data preprocessing, and enhanced model outputs with user preferences for the PIRFIRE 2024 Competition. Paper Accepted in the PIRFIRE 2024 Track. Technologies: Python, Pandas, Numpy, PyTorch, spaCy, NLTK, GPT-3, Zenodo, Jupyter.",
    },
    {
      title: "EcoSmart Dustbin with Automated Waste Segregation System",
      period: "Aug 2024 - Present",
      role: "AI/ML Developer",
      description:
        "Developing an innovative automated waste segregation system for educational institutions. Technologies: Python, Numpy, Pandas, Keras, Matplotlib, Scikit-learn, TensorFlow, Raspberry PI, Linux.",
    },
  ];

  const fallbackEducation = [
    {
      degree: "Masters",
      institution: "-",
      period: "2025 - 2027",
      description: "-",
      location: "-",
    },
    {
      degree: "B.E. Computer Engineering",
      institution: "LDRP Institute of Technology and Research",
      period: "2022 - Present",
      description: "CPI: 8.44 (Till Semester 6)",
      location: "Gandhinagar, Gujarat",
    },
    {
      degree: "Class 12th",
      institution: "Hebron Higher Secondary School (GHSEB)",
      period: "2020 - 2022",
      description: "Percentage: 73%",
      location: "Ahmedabad, Gujarat",
    },
    {
      degree: "Class 10th",
      institution: "Hebron Higher Secondary School (GSEB)",
      period: "2019 - 2020",
      description: "Percentage: 72%",
      location: "Ahmedabad, Gujarat",
    },
  ];

  const fallbackResumeUrl =
    "https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing";

  // Load data from API
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [exp, sk, edu, cert, lead, resume] = await Promise.all([
          getExperiences(),
          getSkills(),
          getEducation(),
          getCertifications(),
          getLeadership(),
          getSetting("resume_url"),
        ]);

        // Use API data if available, otherwise keep fallback
        if (exp.length > 0) setExperience(exp);
        if (sk.length > 0) setSkills(sk);
        if (edu.length > 0) setEducation(edu);
        if (cert.length > 0) setCertifications(cert);
        if (lead.length > 0) setLeadership(lead);
        if (resume) setResumeUrl(resume);
      } catch (error) {
        console.error("Error loading about page data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Merge API data with fallback data
  const displayExperience =
    experience.length > 0 ? experience : fallbackExperience;
  const displaySkills =
    skills.length > 0 ? skills.map((s) => s.name) : fallbackSkills;
  const displayEducation = education.length > 0 ? education : fallbackEducation;
  const displayCertifications =
    certifications.length > 0 ? certifications : fallbackCertifications;
  const displayLeadership =
    leadership.length > 0 ? leadership : fallbackLeadership;
  const displayResumeUrl = resumeUrl || fallbackResumeUrl;

  return (
    <Layout>
      <SEO
        title="About"
        description="Get to know the person behind the code! I'm Kandarp - a Computer Engineering student passionate about ML, Web Dev, and Cloud."
        keywords="about Slantie, Kandarp Gajjar, experience, education, skills, certifications"
      />
      <div className="absolute top-16 sm:top-20 md:top-24 right-4 sm:right-6"></div>
      <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52">
        <div className="container max-w-[1700px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-10 sm:mb-16 text-center">
            <AnimatedText
              text="About Me"
              delayMultiplier={0.02}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            />
            <p className="text-sm sm:text-base text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-6 sm:mb-8">
              Computer Engineering student with expertise in Machine Learning,
              Web Development, and Cloud Computing.
            </p>
            <Button className="rounded-full bg-primary/30 hover:bg-primary/70 transition-all duration-300 ">
              <a
                href={displayResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <p className="text-black dark:text-white text-base sm:text-lg p-1 sm:p-2 rounded-full no-underline ">
                  My Resume
                </p>
              </a>
            </Button>
          </div>

          {/* 1. Professional Experience */}
          <div className="mb-16 sm:mb-20 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
              <Briefcase className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Professional Experience
            </h2>
            <div className="space-y-8 sm:space-y-10">
              {displayExperience.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="relative pl-5 sm:pl-8 border-l-4 border-primary/50"
                >
                  <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                    <span className="text-sm sm:text-base text-foreground font-medium">
                      {item.company}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. Leadership */}
          <div className="mb-16 sm:mb-20 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
              <Users className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Leadership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {displayLeadership.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  //   onClick={() => window.open(item.link, "_blank")}
                  viewport={{ once: true }}
                  className="relative bg-card p-4 sm:p-6 rounded-xl border border-border hover:shadow-lg"
                >
                  {item.period && (
                    <div className="hidden sm:block absolute top-3 sm:top-5 right-3 sm:right-5">
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        {item.period}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-bold mb-2 pr-16 sm:pr-0">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {item.organization}
                    </span>
                    {/* Show period in-line for mobile only */}
                    {/* <span className="sm:hidden text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {item.period}
                    </span> */}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3. Certifications */}
          <div className="mb-16 sm:mb-20 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
              <Award className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {displayCertifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="bg-card p-4 sm:p-6 rounded-xl border border-border hover:shadow-lg transition-all"
                >
                  <div>
                    {/* Image */}
                    <img
                      src={getOptimalFormatUrl(cert.image, { width: 400 })}
                      alt={cert.title}
                      loading="lazy"
                      decoding="async"
                      className="mb-3 sm:mb-4 w-full object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {cert.issuer}
                  </p>
                  {cert.period && (
                    <p className="text-xs text-muted-foreground">
                      {cert.period}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 4. Skills */}
          <div className="mb-16 sm:mb-20 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
              <Code className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Skills & Technologies
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-4 sm:p-6 md:p-8 rounded-lg border border-border"
            >
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {displaySkills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.03,
                    }}
                    viewport={{ once: true }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-background rounded-full border border-border text-sm sm:text-md font-medium hover:bg-primary/10 hover:border-primary/30 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 5. Research Work */}
          <div className="mb-16 sm:mb-20 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
              <Lightbulb className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Research Work
            </h2>
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {researchWork.map((research, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  onClick={
                    research.link
                      ? () => window.open(research.link, "_blank")
                      : undefined
                  }
                  viewport={{ once: true }}
                  className="bg-card p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-all cursor-pointer"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {research.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {research.period}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      {research.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    {research.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 6. Book Chapters */}
          {/* <div className="mb-16 sm:mb-20 lg:mb-24">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
                            <BookOpen className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
                            Book Chapters
                        </h2>
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {bookChapters.map((chapter, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    className="bg-card p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-all"
                                >
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                                        {chapter.title}
                                    </h3>
                                    <h3 className="text-md sm:text-md font-bold mb-2">
                                        {chapter.bookName}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                                        <span className="text-xs sm:text-sm text-muted-foreground">
                                            {chapter.period}
                                        </span>
                                        {chapter.authors[0].map(
                                            (author, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                                >
                                                    {author}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                                        {chapter.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div> */}

          {/* 7. Education */}
          <div className="mx-auto mb-16 sm:mb-20 lg:mb-24 px-0 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 lg:mb-12 font-display flex items-center border-b pb-3 sm:pb-4">
              <GraduationCap className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Education
            </h2>

            <div className="relative sm:flex">
              {[...displayEducation]
                .sort((a, b) => {
                  const yearA = parseInt(a.period.split(" - ")[0]);
                  const yearB = parseInt(b.period.split(" - ")[0]);
                  return yearA - yearB;
                })
                .map((item, index, sortedArray) => {
                  // Extract years from period
                  const startYear = item.period.split(" - ")[0];
                  const endYear = item.period.split(" - ")[1] || "Present";

                  return (
                    <motion.div
                      role="listitem"
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.2,
                      }}
                      viewport={{ once: true }}
                      className="relative mb-6 sm:mb-0 flex-1"
                    >
                      {/* Mobile timeline design (vertical) */}
                      <div className="sm:hidden flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full shrink-0 transition-all duration-300 hover:scale-110 hover:bg-primary/30">
                            <GraduationCap className="w-3 h-3 text-primary" />
                          </div>
                          {index < sortedArray.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold mb-1">
                            {item.degree}
                          </h3>
                          <time className="block mb-1 text-xs font-normal leading-none text-muted-foreground">
                            {startYear} - {endYear}
                          </time>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {item.institution}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {item.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.location}
                          </p>
                        </div>
                      </div>

                      {/* Desktop timeline design (horizontal) */}
                      <div className="hidden sm:block">
                        <div className="flex items-center">
                          <div className="z-10 flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full ring-8 ring-white dark:ring-gray-900 shrink-0 transition-all duration-300 hover:scale-110 hover:bg-primary/30">
                            <GraduationCap className="w-4 h-4 text-primary" />
                          </div>
                          {index < sortedArray.length - 1 && (
                            <div className="w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                          )}
                        </div>
                        <div className="mt-3 pr-4 md:pr-8 max-w-xs">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.degree}
                          </h3>
                          <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                            {startYear} - {endYear}
                          </time>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {item.institution}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
