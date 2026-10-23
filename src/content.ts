/**
 * Every piece of text on the site lives here. Edit freely; components only read from this file.
 * Items marked TODO are listed in ASSETS-TODO.md.
 */

export type Link = { label: string; href: string };

export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional short screen-recording loop (mp4/webm). Shown instead of `src` once loaded. */
  video?: string;
};

export type StoryStep = {
  title: string;
  body: string;
  media: Media;
};

export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  stack: string[];
  media: Media;
  links: Link[];
};

export const site = {
  name: "Abdulrhman Hany",
  // TODO: change to the address the site ends up hosted at.
  url: "https://abdulrahman-portfolio-theta.vercel.app",
  title: "Abdulrhman Hany · Cybersecurity student & developer",
  description:
    "Cybersecurity student at Nile University in Giza, Egypt. I build security tooling, IoT systems on the ESP32 and full-stack apps. Open to internships and collaboration.",
  email: "abdohany1221@gmail.com",
  github: "https://github.com/Ahany1440",
  linkedin: "https://www.linkedin.com/in/abdulrhman-hussain-0739a5414/",
  cv: "/cv.pdf",
  /** File name the CV downloads as. */
  cvFileName: "Abdulrhman_Hany_CV.pdf",
};

export const nav = {
  links: [
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ] satisfies Link[],
  cta: { label: "CV", href: "/cv.pdf" },
};

export const hero = {
  /** Drawn by the particle field. Keep it short; each line becomes one row of particles. */
  particleLines: ["ABDULRHMAN", "HANY"],
  statement: "Cybersecurity student in Giza, Egypt. I build security tools, IoT systems and full-stack apps.",
  primary: { label: "See my work", href: "#featured" },
  secondary: { label: "Get in touch", href: "#contact" },
  scrollHint: "Scroll",
};

export const featured = {
  label: "Featured project",
  name: "Threat-Pulse",
  headline: "Every attack on one map.",
  steps: [
    {
      title: "A live map of cyberattacks.",
      body: "A real-time, simulated feed of attacks between countries, drawn as arcs on a world map with a running counter.",
      media: {
        src: "/images/threatpulse-01.jpg",
        alt: "Threat-Pulse dashboard with the world map, live ticker, top attackers and targets, and attack type breakdown",
        width: 1600,
        height: 1000,
      },
    },
    {
      title: "Every event, as it lands.",
      body: "The attack log records each attack with its time, severity, type, origin and target, colour-coded by severity.",
      media: {
        src: "/images/threatpulse-04.jpg",
        alt: "Close-up of the Threat-Pulse attack log listing DDoS, phishing, malware and brute force events",
        width: 1600,
        height: 1000,
      },
    },
    {
      title: "Read the pattern.",
      body: "The intel panel breaks attacks down by severity and rate, with the most targeted countries and the top attacker origins.",
      media: {
        src: "/images/threatpulse-03.jpg",
        alt: "Close-up of the Threat-Pulse intel panel with the severity breakdown, attack rate and most targeted countries",
        width: 1600,
        height: 1000,
      },
    },
    {
      title: "Built to teach.",
      body: "Drag to pan, scroll to zoom, click a country to open its dossier with real historical incidents. Plain HTML and JavaScript, made for threat-intelligence visualization and education.",
      media: {
        src: "/images/threatpulse-02.jpg",
        alt: "Threat-Pulse country dossier for Russia, with its exposure score, threat overview and a historical incident",
        width: 1600,
        height: 1000,
      },
    },
  ] satisfies StoryStep[],
  stack: ["HTML", "JavaScript", "Threat intelligence"],
  links: [{ label: "Visit the live site", href: "https://cyber-attacks-map.vercel.app/" }] satisfies Link[],
};

export const work = {
  headline: "More things I built.",
  intro: "Security tools, hardware and full-stack apps. I like problems where knowing how systems break makes me better at building them.",
  projects: [
    {
      slug: "mindspace",
      name: "MindSpace",
      oneLiner: "A full-stack web app with an AI companion: React on the front, FastAPI behind it, Supabase and Firebase for auth and data.",
      stack: ["React", "FastAPI", "Supabase", "Firebase"],
      media: { src: "/images/mindspace.jpg", alt: "MindSpace app screen with the AI companion", width: 1600, height: 1000 },
      links: [{ label: "GitHub", href: "https://github.com/youssef-110/MindSpace-FullStack-Core" }],
    },
    {
      slug: "esp32-radar",
      name: "ESP32 Cyber Radar",
      oneLiner: "A dual-mode RF tracker for the ESP32 that intercepts Bluetooth Low Energy advertisements and reads proximity signals.",
      stack: ["ESP32", "C++", "BLE / RF"],
      media: { src: "/images/esp32-radar.jpg", alt: "ESP32 Cyber Radar tracking nearby BLE devices", width: 1600, height: 1000 },
      links: [{ label: "GitHub", href: "https://github.com/Ahany1440/ESP32-Cyber-Radar-Interactive-BLE-Proximity-Signal-Tracker" }],
    },
    {
      slug: "directory-scanner",
      name: "Directory Security Scanner",
      oneLiner: "A C++ tool on the Win32 API that scans file metadata and flags hidden executables as indicators of compromise.",
      stack: ["C++", "Win32 API"],
      media: { src: "/images/directory-scanner.jpg", alt: "Directory Security Scanner output flagging a hidden executable", width: 1600, height: 1000 },
      links: [{ label: "GitHub", href: "https://github.com/Ahany1440/Directory-Security-Scanner_cpp" }],
    },
    {
      slug: "port-scanner",
      name: "Network Port Scanner",
      oneLiner: "A Python recon tool that runs TCP three-way handshakes over sockets to map open ports.",
      stack: ["Python", "Sockets", "TCP/IP"],
      media: { src: "/images/port-scanner.jpg", alt: "Network Port Scanner mapping open ports in a terminal", width: 1600, height: 1000 },
      links: [{ label: "GitHub", href: "https://github.com/Ahany1440/Python-Port-Scanner-Python" }],
    },
    {
      slug: "cryptotool",
      name: "CryptoTool CLI",
      oneLiner: "A Kali Linux terminal utility for ROT13, Base64, hex and binary translation in real time.",
      stack: ["Python", "Kali Linux"],
      media: { src: "/images/cryptotool.jpg", alt: "CryptoTool CLI menu running in a Kali Linux terminal", width: 1600, height: 1000 },
      links: [{ label: "GitHub", href: "https://github.com/Ahany1440/cryptotool-cli" }],
    },
  ] satisfies Project[],
  moreLabel: "Also on GitHub",
  /** Smaller projects, listed under the cards. */
  more: [
    { label: "Process Manager · C++ / Win32", href: "https://github.com/Ahany1440/Process-manager-C-" },
    { label: "Crypto & Stock Price Notifier · Python / Binance API", href: "https://github.com/Ahany1440/Automated-Crypto-Stock-Price-Drop-Notifier" },
    { label: "Camera Movement Detection · Python / OpenCV", href: "https://github.com/Ahany1440/python-camera-movement-detection" },
    { label: "3D Donut Renderer · Python", href: "https://github.com/Ahany1440/Donut-python-render" },
    { label: "Exam Portal · Python", href: "https://github.com/Ahany1440/exam-portal" },
  ] satisfies Link[],
};

export const skills = {
  headline: "What I work with.",
  intro: "Grouped by where it sits in the stack. Pick a group to light it up.",
  groups: [
    { name: "Languages", items: ["Python", "C++", "C", "JavaScript", "SQL"] },
    { name: "Security & systems", items: ["Kali Linux", "Linux", "Virtual machines", "Win32 API", "Socket programming", "Network recon"] },
    { name: "Hardware", items: ["ESP32", "BLE / RF", "Microcontrollers"] },
    { name: "Web", items: ["React", "FastAPI", "HTML", "CSS"] },
    { name: "Data & tools", items: ["Supabase", "Firebase", "Git & GitHub", "OpenCV"] },
  ],
};

export const about = {
  headline: "I like knowing how things break.",
  paragraphs: [
    "I'm Abdulrhman, a cybersecurity student at Nile University in Giza, Egypt, with a builder's mindset.",
    "I spend my time where offense-aware engineering meets full-stack development: writing security tooling, wiring up IoT and RF systems on the ESP32, and shipping web apps end to end.",
    "From threat-intelligence dashboards to Win32 utilities that hunt for indicators of compromise, the more I understand how systems fail, the better I get at building them.",
  ],
  stats: [
    { value: 10, suffix: "+", label: "projects built" },
    { value: 4, suffix: "", label: "security tools in C++ and Python" },
    { value: 4, suffix: "", label: "certifications" },
    { value: 2, suffix: "", label: "languages: Arabic (native), English (C1)" },
  ],
  /** Optional line under the paragraphs; leave empty to hide it. */
  languages: "",
  certificatesLabel: "Certifications",
  certificates: [
    "What Is Generative AI? · LinkedIn Learning",
    "Google AI Essentials · Google on Coursera",
    "Scientific Computing with Python · freeCodeCamp",
    "Mint Ambassadors Project · iCareer",
  ],
};

export const contact = {
  headline: "Let's build something.",
  body: "Open to internships, collaboration and interesting problems. Based in Giza, Egypt. Email is the fastest way to reach me.",
  copyHint: "Click to copy",
  copied: "Copied to clipboard",
  links: [
    { label: "GitHub", href: "https://github.com/Ahany1440" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abdulrhman-hussain-0739a5414/" },
  ] satisfies Link[],
  cv: { label: "Download CV", href: "/cv.pdf" },
};

export const footer = {
  line: "Built by Abdulrhman Hany in Giza.",
  colophon: "Next.js · GSAP · Three.js",
};

export const cursorLabels = { project: "View", link: "Open" };
