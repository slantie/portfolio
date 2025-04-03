
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";
import { Button } from "./button";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Achievements", path: "/achievements" },
  { label: "Moments", path: "/moments" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navigation background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation variants for menu items
  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="z-50">
      <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-mono font-regular"
          aria-label="Home"
        >
          {'<s1antie/>'}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 font-medium text-md rounded-full transition-all duration-300 ${
                location.pathname === item.path
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {location.pathname === item.path && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full z-0"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Button
            onClick={toggleMenu}
            className="ml-4 p-2 rounded-full bg-background/50 backdrop-blur-sm"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-card border-l border-border z-50 md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-background/50 backdrop-blur-sm"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                custom={i}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <Link
                  to={item.path}
                  className={`block px-4 py-3 text-lg font-medium rounded-lg transition ${
                    location.pathname === item.path
                      ? "bg-primary/10 dark:bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </header>
    </div>
  );
};

export default Navigation;
