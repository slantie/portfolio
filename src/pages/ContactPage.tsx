import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  ExternalLink
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
      image: "/socials/linkedin.png"
    },
    { 
      icon: Github, 
      href: "https://github.com/slantie", 
      label: "GitHub",
      color: "bg-[#333]/10 text-[#333] dark:text-white hover:bg-[#333] hover:text-white",
      image: "/socials/github.png"
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/whoisslantie/", 
      label: "Instagram",
      color: "bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white",
      image: "/socials/instagram.png"
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "kandarp_22091@ldrp.ac.in",
      href: "mailto:kandarp_22091@ldrp.ac.in",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Ahmedabad, Gujarat, India",
      href: "https://maps.app.goo.gl/Eo1Bnm5Ld2Eo1Bnm5",
      color: "bg-accent/10 text-accent"
    },
  ];

  return (
    <Layout>
      <section className="pt-52">
        <div className="container max-w-[1700px] mx-auto px-6">
          <div className="mb-10 text-center">
            <AnimatedText
              text="Get In Touch"
              className="text-4xl md:text-5xl font-bold mb-6"
              delayMultiplier={0.02}
            />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with me through social media or email. I'd love to hear from you!
            </p>
          </div>

          {/* Social Media Links - Enlarged with Circle Images */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-10 font-display flex items-center border-b pb-4">
              <ExternalLink className="mr-3 h-6 w-6" />
              Connect With Me
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${social.color.includes("bg-[#0077B5]") ? "border-[#0077B5]" : 
                                      social.color.includes("bg-[#333]") ? "border-[#333] dark:border-white" : 
                                      social.color.includes("bg-[#E1306C]") ? "border-[#E1306C]" : "border-primary"} 
                                      mb-4 transition-transform duration-300 hover:scale-110`}>
                      {social.image ? (
                        <img 
                          src={social.image} 
                          alt={social.label} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${social.image ? 'hidden' : ''} ${social.color}`}>
                        <Icon className="h-10 w-10" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">{social.label}</h3>
                    <p className="text-sm text-muted-foreground">{social.href.replace('https://', '')}</p>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-0">
            <h2 className="text-2xl font-bold mb-10 font-display flex items-center border-b pb-4">
              <Mail className="mr-3 h-6 w-6" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`p-4 rounded-full ${item.color} mr-6`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">
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
