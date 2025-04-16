import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Users,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const skills = [
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

  const experience = [
    {
      title: "Frontend Web Developer",
      company: "Institute for Plasma Research (IPR)",
      period: "Aug 2024 - Nov 2024",
      description:
        "Built an online quiz platform with multilingual support, separate Admin & User portals, and integrated Admin Analytics, ensuring a seamless user experience. Technologies: ReactJS, TailwindCSS, i18Next.",
    },
    {
      title: "Intern & Student Mentor",
      company: "Business & Innovation Program (BIP), Australia",
      period: "Oct 2024 - Nov 2024",
      description:
        "Gained skills in Business Communication, Sustainable Digital Entrepreneurship, and Business Psychology through training by Curtin University, Perth, Australia.",
    },
  ];

  const leadership = [
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

  const certifications = [
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

  const education = [
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
      description: "CPI: 8.42 (Till Semester 5)",
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

  const resume_Url =
    "https://drive.google.com/file/d/1pzHUDvUTq3bWBnwSoHo5F_1At9rhIuqs/view?usp=sharing";

  return (
    <Layout>
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
            <Button className="rounded-full bg-primary/30 hover:bg-primary/70 transition-all duration-300">
              <a
                href={resume_Url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <p className="text-black dark:text-white text-base sm:text-lg p-1 sm:p-2 rounded-full no-underline">
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
              {experience.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
              {leadership.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-card p-4 sm:p-6 rounded-xl border border-border hover:shadow-lg"
                >
                  {item.period && (
                    <div className="hidden sm:block absolute top-3 sm:top-5 right-3 sm:right-5">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
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
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-4 sm:p-6 rounded-xl border border-border hover:shadow-lg transition-all"
                >
                  <div>
                    {/* Image */}
                    <img
                      src={cert.image}
                      alt={cert.title}
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
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {research.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {research.period}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
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

          {/* 6. Education */}
          <div className="mx-auto mb-16 sm:mb-20 lg:mb-24 px-0 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 lg:mb-12 font-display flex items-center border-b pb-3 sm:pb-4">
              <GraduationCap className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7" />
              Education
            </h2>

            <ol className="relative sm:flex">
              {[...education]
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
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
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
                    </motion.li>
                  );
                })}
            </ol>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
