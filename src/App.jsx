import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import { Github, Linkedin, Instagram, Mail, ExternalLink, ChevronRight, Menu, X, ArrowUpRight, Code2, Cpu, Globe, Rocket, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Motion Engine ---
const springConfig = { type: "spring", stiffness: 100, damping: 20 };
const cinematicTransition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

const Magnetic = ({ children }) => {
  const ref = React.useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const CharReveal = ({ text, delay = 0, className = "" }) => {
  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            initial={{ y: "110%", filter: "blur(10px)", opacity: 0 }}
            whileInView={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: delay + i * 0.03 }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const TextReveal = ({ text, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ ...cinematicTransition, delay: delay + i * 0.05 }}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: cinematicTransition
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent pointer-events-none z-[999] hidden md:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? "rgba(255, 176, 0, 0.1)" : "transparent"
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
    />
  );
};

const Noise = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden translate-z-0">
    <div
      className="absolute inset-[-200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] animate-grain will-change-transform"
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
    />
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light');
  };

  const navLinks = ['About', 'Skills', 'Projects', 'Contact'];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-6 px-6 md:px-12",
        scrolled ? "bg-obsidian/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-display font-bold tracking-tighter"
          >
            MANVANTH<span className="text-accent">.</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
            {navLinks.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent transition-colors">
                {item}
              </a>
            ))}
            <button onClick={toggleTheme} className="p-2 glass rounded-full hover:text-accent transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 glass rounded-full hover:text-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-obsidian md:hidden flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-24">
              <span className="text-xl font-display font-bold tracking-tighter">
                MANVANTH<span className="text-accent">.</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 glass rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-display font-bold tracking-tighter hover:text-accent transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto pt-12 border-t border-white/5 space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Contact</p>
                <a href="mailto:appumanu3214@gmail.com" className="text-xl font-medium">appumanu3214@gmail.com</a>
              </div>
              <button onClick={toggleTheme} className="flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em]">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Switch to {isDark ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [coords, setCoords] = useState({ x: "12.9716", y: "77.5946" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCoords({
        x: (12.9 + Math.random() * 0.1).toFixed(4),
        y: (77.5 + Math.random() * 0.1).toFixed(4),
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden bg-obsidian">
      {/* Background Motion Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Cinematic Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />

        {/* Moving Scanner Line */}
        <motion.div
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent z-10 blur-sm"
        />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Frame UI Accents */}
      <div className="absolute inset-4 md:inset-8 pointer-events-none z-30">
        <div className="absolute top-0 left-0 flex flex-col gap-1">
          <div className="w-12 h-[1px] bg-accent/40" />
          <div className="h-12 w-[1px] bg-accent/40" />
        </div>
        <div className="absolute top-0 right-0 flex flex-col items-end gap-1">
          <div className="w-12 h-[1px] bg-accent/40" />
          <div className="h-12 w-[1px] bg-accent/40" />
          <span className="text-[8px] font-mono text-accent/40 tracking-[0.3em] uppercase mt-4 vertical-text">
            MANVANTH_GOWDA_M_SYSTEMS
          </span>
        </div>
        <div className="absolute bottom-0 left-0 flex flex-col justify-end gap-1">
          <div className="h-12 w-[1px] bg-accent/40" />
          <div className="w-12 h-[1px] bg-accent/40" />
        </div>
        <div className="absolute bottom-0 right-0 flex flex-col items-end justify-end gap-1">
          <div className="h-12 w-[1px] bg-accent/40" />
          <div className="w-12 h-[1px] bg-accent/40" />
        </div>
      </div>

      <motion.div style={{ y: y1, opacity }} className="max-w-7xl mx-auto w-full relative z-20">
        <div className="flex flex-col gap-12 lg:gap-24">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-[2px] h-3 bg-accent"
                  />
                ))}
              </div>
              <span className="text-accent font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase">
                Engineering Technical Excellence
              </span>
            </motion.div>

            <h1 className="flex flex-col text-[13vw] md:text-[9vw] lg:text-[7.5vw] font-display font-bold leading-[0.85] tracking-tighter uppercase will-change-transform">
              <span className="relative overflow-hidden inline-block h-[1.1em]">
                <CharReveal text="ARCHITECTING" className="text-white/20 outline-text" />
              </span>
              <span className="relative overflow-hidden inline-block h-[1.1em] mt-[-0.1em]">
                <CharReveal text="DIGITAL" delay={0.2} />
              </span>
              <span className="relative overflow-hidden inline-block h-[1.1em] mt-[-0.1em]">
                <CharReveal text="SYSTEMS" delay={0.4} className="text-chrome" />
                <span className="text-accent">.</span>
              </span>
            </h1>
          </div>

          <div className="grid md:grid-cols-[1fr,auto,1fr] items-start gap-12 border-t border-white/5 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="max-w-md"
            >
              <p className="text-chrome/40 text-base md:text-lg font-light leading-relaxed mb-10">
                Manvanth Gowda M is a Computer Science Engineer crafting high-performance digital environments where technical precision meets creative motion.
              </p>

              <Magnetic>
                <a href="#projects" className="group inline-flex items-center gap-6 py-5 px-10 glass rounded-full hover:bg-white hover:text-obsidian transition-all duration-700 active:scale-95">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Explore System</span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-obsidian transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </a>
              </Magnetic>
            </motion.div>

            <div className="hidden lg:block w-[1px] h-40 bg-white/5" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="grid grid-cols-2 gap-12 font-mono text-[9px] tracking-[0.2em] uppercase text-chrome/30"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-accent/50 font-bold">Node Identity</p>
                  <p className="text-chrome/60">Manvanth Gowda M</p>
                </div>
                <div className="space-y-1">
                  <p className="text-accent/50 font-bold">Coordination</p>
                  <p>LAT: {coords.x}° N</p>
                  <p>LNG: {coords.y}° E</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-accent/50 font-bold">Current Phase</p>
                  <p className="text-chrome/60">v4.0.2 Stable</p>
                </div>
                <div className="space-y-1 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <p>System Online</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Scroll Indicator */}
      <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4 opacity-30 md:hidden">
        <div className="w-12 h-[1px] bg-accent" />
        <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Scroll Down</span>
      </div>
    </section>
  );
};

const About = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 0.3], [5, 0]);

  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tight">
            <TextReveal text="CRAFTING" delay={0.1} /><br />
            <span className="text-accent italic"><TextReveal text="MEANINGFUL" delay={0.2} /></span><br />
            <TextReveal text="CODE." delay={0.3} />
          </h2>
          <div className="space-y-6 text-chrome/70 text-lg font-light leading-relaxed">
            <p>
              I am <span className="text-white font-medium">Manvanth Gowda M</span>, a passionate Computer Science Engineering student with a deep interest in the intersection of technology and creativity.
            </p>
            <p>
              My journey is driven by a curiosity to understand how things work and a desire to build tools that solve real-world problems. Whether it's crafting high-performance backends or designing fluid, interactive interfaces, I aim for excellence in every line of code.
            </p>
            <p>
              Based in India, I'm constantly exploring new technologies and pushing the boundaries of what's possible in software development.
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ scale, rotate }}
          className="relative aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden glass group"
        >
          <motion.img
            initial={{ scale: 1.2, filter: "grayscale(100%)" }}
            whileInView={{ scale: 1, filter: "grayscale(0%)" }}
            transition={{ duration: 1.5, ...cinematicTransition }}
            src="/assets/manvanth.jpg"
            alt="Manvanth Gowda M"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent z-10 opacity-60" />
          <div className="absolute bottom-8 left-8 z-20">
            <span className="text-4xl font-display font-bold">01</span>
            <p className="text-xs tracking-[0.3em] uppercase font-bold text-accent">Manvanth Gowda M</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SkillCard = ({ icon: Icon, title, skills, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative glass p-8 rounded-3xl transition-colors duration-500 group border-white/5 overflow-hidden"
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])},
              rgba(255, 176, 0, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Technical UI Accents */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-20 group-hover:opacity-50 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-accent" />
        <div className="w-4 h-[1px] bg-accent self-center" />
      </div>
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 opacity-10 group-hover:opacity-30 transition-opacity font-mono text-[6px] text-chrome">
        <span>REF_ID_{index}</span>
        <span>AUTH_LEVEL_04</span>
      </div>

      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-500">
          <Icon className="w-7 h-7 text-accent" />
        </div>

        <h3 className="text-2xl font-display font-bold mb-6 tracking-tight uppercase group-hover:text-accent transition-colors">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold tracking-wider text-chrome/60 border border-white/5 group-hover:border-accent/30 group-hover:text-chrome transition-colors"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Skills = () => (
  <section id="skills" className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div {...fadeInUp} className="mb-16">
        <span className="text-accent font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Abilities</span>
        <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">TECHNICAL SPEC.</h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <SkillCard
          index={0}
          icon={Code2}
          title="Languages"
          skills={["JavaScript", "TypeScript", "Python", "Java", "C++"]}
        />
        <SkillCard
          index={1}
          icon={Globe}
          title="Frontend"
          skills={["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"]}
        />
        <SkillCard
          index={2}
          icon={Cpu}
          title="Backend"
          skills={["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase"]}
        />
        <SkillCard
          index={3}
          icon={Rocket}
          title="Tools"
          skills={["Git", "Docker", "VS Code", "Figma", "Postman"]}
        />
      </motion.div>
    </div>
  </section>
);

const ProjectCard = ({ project, idx, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      transition={{ ...cinematicTransition, delay: idx * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="group relative cursor-pointer"
    >
      <div className="glass aspect-[16/9] rounded-3xl overflow-hidden p-8 md:p-12 flex flex-col justify-between group-hover:border-accent/40 transition-all duration-700 relative">
        {/* Project Glare/Spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])},
                rgba(255, 176, 0, 0.1),
                transparent 80%
              )
            `,
          }}
        />

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex justify-between items-start">
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-500 border border-white/5">
            <Code2 className="w-7 h-7 text-accent" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-accent group-hover:text-obsidian transition-all duration-500">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="font-mono text-[8px] tracking-[0.3em] text-accent/40 uppercase">System_Link_v.0{idx + 1}</span>
          </div>
        </div>

        <div style={{ transform: "translateZ(60px)" }} className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-accent/30 group-hover:w-16 transition-all duration-700" />
            <span className="text-accent font-mono text-[10px] tracking-[0.4em] uppercase">Project_{idx + 1}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tighter uppercase group-hover:text-accent transition-colors">
            {project.name}
          </h3>
          <p className="text-chrome/50 line-clamp-2 text-base font-light leading-relaxed max-w-md">
            {project.description}
          </p>
        </div>

        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex justify-between items-center mt-8 pt-8 border-t border-white/5">
          <div className="flex gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80 px-3 py-1.5 glass rounded-lg border border-accent/20">
              {project.tech}
            </span>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-accent/20 group-hover:bg-accent transition-colors" style={{ transitionDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Your perfect projects integrated
  const projects = [
    {
      name: "Reshme Info",
      description: "A comprehensive digital platform providing essential information and resources for the sericulture industry.",
      tech: "React • Node.js",
      link: "https://github.com/Manvanth-Gowda-M/Reshme_Info"
    },
    {
      name: "Prompt Enhancer",
      description: "An intelligent tool designed to refine and optimize AI prompts for better generative results.",
      tech: "Python • OpenAI",
      link: "https://github.com/Manvanth-Gowda-M/Prompt-enhancer"
    },
    {
      name: "Fusion BOT X",
      description: "A high-performance multi-purpose automation bot with advanced integration capabilities.",
      tech: "Node.js • API",
      link: "https://github.com/Manvanth-Gowda-M/FusionbotX-"
    },
    {
      name: "NutriGuide",
      description: "A smart nutrition tracking and guidance application built to promote healthier lifestyle choices.",
      tech: "Flutter • Firebase",
      link: "https://github.com/NextGenXplorer/NutriGuideFLU"
    }
  ];

  return (
    <section id="projects" className="py-32 px-6 md:px-12 bg-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="mb-16">
          <span className="text-accent font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Showcase</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">SELECTED WORKS.</h2>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projects.map((project, idx) => (
              <ProjectCard
                key={idx}
                project={project}
                idx={idx}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-chrome/30 font-display text-xl tracking-widest uppercase">Awaiting your perfect projects...</p>
          </div>
        )}
      </div>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-obsidian/95 backdrop-blur-2xl"
            />

            <motion.div
              layoutId={selectedProject.name}
              className="glass max-w-4xl w-full rounded-[40px] overflow-hidden relative z-10 border border-white/10"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-8 right-8 w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-accent hover:text-obsidian transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-20 relative overflow-hidden">
                {/* Modal Ambient Glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-[1px] bg-accent" />
                    <span className="text-accent font-mono text-[10px] tracking-[0.5em] uppercase">Deployment Success</span>
                  </div>

                  <h2 className="text-5xl md:text-8xl font-display font-bold mb-10 tracking-tighter uppercase leading-[0.9]">
                    {selectedProject.name}<span className="text-accent">.</span>
                  </h2>

                  <div className="grid md:grid-cols-[1fr,200px] gap-12 items-start">
                    <p className="text-chrome/70 text-lg md:text-2xl font-light leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div className="space-y-8 pt-2">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent/50">Technologies</p>
                        <p className="text-chrome/90 text-sm font-medium">{selectedProject.tech}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent/50">Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          <p className="text-chrome/90 text-sm font-medium uppercase tracking-tighter">Live v1.0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mt-16">
                    <Magnetic>
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 px-10 py-5 bg-accent text-obsidian rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all duration-500"
                      >
                        Source Repository <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const CreativePortfolio = () => (
  <section className="py-32 px-6 md:px-12 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <a
        href="https://manvanth.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <motion.div
          {...fadeInUp}
          className="glass p-12 md:p-24 rounded-3xl relative group overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-48 h-48 md:w-64 md:h-64" />
          </div>

          <div className="relative z-10">
            <span className="text-accent font-medium tracking-[0.3em] uppercase text-xs mb-6 block">Extended Work</span>
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tighter leading-none">
              EXPLORE THE<br /><span className="text-accent italic group-hover:pl-4 transition-all duration-700">CREATIVE</span><br />BOOK.
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em]">
              <span>manvanth.vercel.app</span>
              <div className="w-12 h-[1px] bg-white/20 group-hover:w-24 transition-all duration-700" />
            </div>
          </div>
        </motion.div>
      </a>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-32 px-6 md:px-12 relative overflow-hidden">
    <div className="max-w-7xl mx-auto text-center">
      <motion.div {...fadeInUp}>
        <h2 className="text-5xl md:text-8xl font-display font-bold mb-12 tracking-tighter uppercase">
          READY TO <span className="text-accent italic">BUILD</span>?
        </h2>
        <a
          href="mailto:appumanu3214@gmail.com"
          className="inline-flex items-center gap-4 text-2xl md:text-4xl font-display font-bold text-accent hover:text-white transition-colors group"
        >
          appumanu3214@gmail.com
          <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
        </a>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 pt-12 border-t border-white/5">
        {[
          { icon: Github, label: 'GitHub', href: 'https://github.com/Manvanth-Gowda-M' },
          { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/manvanth-gowda-m-50288039b' },
          { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/manvanth.gowda.m/' },
          { icon: Mail, label: 'Email', href: 'mailto:appumanu3214@gmail.com' }
        ].map((item, idx) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-4 group cursor-pointer"
          >
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-obsidian transition-all duration-500">
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-chrome/40 group-hover:text-accent transition-colors">
              {item.label}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);



export default function App() {
  return (
    <SmoothScroll>
      <div className="bg-obsidian min-h-screen text-white selection:bg-accent/30 selection:text-white">
        <CustomCursor />
        <Noise />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <footer className="py-8 text-center text-chrome/30 text-[10px] font-mono tracking-widest uppercase border-t border-white/5">
          <p>© 2024 Manvanth Gowda M • System_Online</p>
        </footer>
      </div>
    </SmoothScroll>
  );
};
