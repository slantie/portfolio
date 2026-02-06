import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Layout from "@/components/layout/layout";
import AnimatedText from "@/components/ui/animated-text";
import { SEO } from "@/components/seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { submitContactMessage } from "@/lib/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitContactMessage(formData);
      if (result) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/kandarpgajjar",
      label: "LinkedIn",
      username: "@kandarpgajjar",
      description: "Let's connect professionally",
      gradient: "from-[#0077B5] to-[#00A0DC]",
    },
    {
      icon: Github,
      href: "https://github.com/slantie",
      label: "GitHub",
      username: "@slantie",
      description: "Check out my code",
      gradient: "from-[#333] to-[#666] dark:from-[#666] dark:to-[#999]",
    },
  ];

  return (
    <Layout>
      <SEO
        title="Connect"
        description="Want to chat, collaborate, or just say hello? Reach out to Slantie - I'd love to hear from you!"
        keywords="contact Slantie, Kandarp Gajjar, email, LinkedIn, GitHub"
      />
      <section className="pt-28 sm:pt-36 md:pt-44 lg:pt-52">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          \n {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedText
                text="Let's Connect!"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                delayMultiplier={0.02}
              />
              <p className="text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                Have a project in mind, want to collaborate, or just want to say
                hello? I'd love to hear from you!
              </p>
            </motion.div>
          </div>
          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="border-2">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Send a Message</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Subject{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Your Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project, idea, or just say hi..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        disabled={isSubmitting}
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-destructive text-sm">{error}</p>
                      </div>
                    )}

                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-300">
                            Message sent!
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            I'll get back to you as soon as possible.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-base font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Email Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <a
                        href="mailto:kandarp_22091@ldrp.ac.in"
                        className="text-muted-foreground hover:text-primary transition-colors text-sm break-all"
                      >
                        {/* Add email from the backend contact */}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Socials
                </h3>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block"
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-all border-2 hover:border-primary/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2.5 rounded-lg bg-gradient-to-br ${social.gradient} text-white`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold">
                                  {social.label}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {social.username}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
