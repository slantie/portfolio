import { motion } from "framer-motion";
import {
    Mail,
    MapPin,
    Linkedin,
    Github,
    Instagram,
    ExternalLink,
} from "lucide-react";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";

const ContactPage = () => {
    const socialLinks = [
        {
            icon: Linkedin,
            href: "https://linkedin.com/in/kandarpgajjar",
            label: "LinkedIn",
            color: "bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white",
            image: "/socials/linkedin.png",
        },
        {
            icon: Github,
            href: "https://github.com/slantie",
            label: "GitHub",
            color: "bg-[#333]/10 text-[#333] dark:text-white hover:bg-[#333] hover:text-white",
            image: "/socials/github.png",
        },
        {
            icon: Instagram,
            href: "https://www.instagram.com/whoisslantie/",
            label: "Instagram",
            color: "bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white",
            image: "/socials/instagram.png",
        },
    ];

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            value: "kandarp_22091@ldrp.ac.in",
            href: "mailto:kandarp_22091@ldrp.ac.in",
            color: "bg-primary/10 text-primary",
        },
        {
            icon: MapPin,
            title: "Location",
            value: "Ahmedabad, Gujarat, India",
            href: "https://maps.app.goo.gl/KdThNP9yRUPpf4N39",
            color: "bg-accent/10 text-accent",
        },
    ];

    return (
        <Layout>
            <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52">
                <div className="container max-w-[1700px] mx-auto px-4 sm:px-6">
                    <div className="mb-8 sm:mb-10 text-center">
                        <AnimatedText
                            text="Get In Touch"
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                            delayMultiplier={0.02}
                        />
                        <p className="text-muted-foreground text-sm sm:text-base max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
                            Connect with me through social media or email. I'd
                            love to hear from you!
                        </p>
                    </div>

                    {/* Social Media Links - Enlarged with Circle Images */}
                    <div className="mb-8 sm:mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
                            <ExternalLink className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                            Connect With Me
                        </h2>

                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -10 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}
                                        className="flex flex-col items-center"
                                    >
                                        <div
                                            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 ${
                                                social.color.includes(
                                                    "bg-[#0077B5]"
                                                )
                                                    ? "border-[#0077B5]"
                                                    : social.color.includes(
                                                          "bg-[#333]"
                                                      )
                                                    ? "border-[#333] dark:border-white"
                                                    : social.color.includes(
                                                          "bg-[#E1306C]"
                                                      )
                                                    ? "border-[#E1306C]"
                                                    : "border-primary"
                                            } 
                                      mb-3 sm:mb-4 transition-transform duration-300 hover:scale-110`}
                                        >
                                            {social.image ? (
                                                <img
                                                    src={social.image}
                                                    alt={social.label}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback to icon if image fails to load
                                                        e.currentTarget.style.display =
                                                            "none";
                                                        e.currentTarget.nextElementSibling?.classList.remove(
                                                            "hidden"
                                                        );
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-full h-full flex items-center justify-center ${
                                                    social.image ? "hidden" : ""
                                                } ${social.color}`}
                                            >
                                                <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                                            </div>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold">
                                            {social.label}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground text-center break-all px-2">
                                            {social.href.replace(
                                                "https://",
                                                ""
                                            )}
                                        </p>
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-10 font-display flex items-center border-b pb-3 sm:pb-4">
                            <Mail className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                            Contact Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
                            {contactInfo.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={item.href}
                                        target={
                                            item.href.startsWith("http")
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            item.href.startsWith("http")
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        className="bg-card p-4 sm:p-6 rounded-xl border border-border hover:shadow-lg transition-all flex items-center cursor-none"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div
                                            className={`p-3 sm:p-4 rounded-full ${item.color} mr-4 sm:mr-6`}
                                        >
                                            <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold mb-0.5 sm:mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-muted-foreground break-words">
                                                {item.value}
                                            </p>
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ContactPage;
