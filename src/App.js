import React, { useState, useEffect, useRef } from 'react';
import { 
  CalendarCheck, Phone, MessageCircle, Stethoscope, HeartHandshake, Award, Clock, Menu, X, User, Zap, MapPin, 
  SquareDot, ArrowRight, ShieldCheck, Play, ArrowLeft // ArrowLeft included for carousel navigation
} from 'lucide-react';

// Load Tailwind CSS configuration
// NOTE: Assuming Tailwind CSS is available in the environment

// --- MOCK DATA / CONFIGURATION ---
const navItems = ['About', 'Services', 'Video-T', 'Contact'];

const services = [
  { icon: Stethoscope, title: 'Well-Child Visits', description: 'Comprehensive developmental checks, growth monitoring, and preventative health discussions for all ages.' },
  { icon: Zap, title: 'Pediatric Emergency Care', description: 'Immediate, expert handling of acute illnesses, high fever, injuries, and urgent pediatric conditions.' },
  { icon: HeartHandshake, title: 'Neonatal Care (NICU)', description: 'Dedicated and compassionate care for premature newborns, low birth weight babies, and high-risk deliveries.' },
  { icon: Award, title: 'Childhood Vaccinations', 'description': 'Personalized and up-to-date immunization schedules following national and international guidelines.' },
];

const videoTestimonials = [
  // UPDATED with real YouTube Short IDs
  { title: 'Newborn Care Review', youtubeId: 'JXAYD_-lre8', duration: '1:45' },
  { title: 'Emergency Service Feedback', youtubeId: 'Tv0qw-ejVw0', duration: '3:05' },
  { title: 'Long-Term Patient Success', youtubeId: 'ffXrVT46GCY', duration: '2:10' },
  { title: 'Routine Checkup Experience', youtubeId: 'DnMU0HDjGNM', duration: '1:55' },
  // ADDED the fifth video to the array
  { title: 'Vaccination Advice', youtubeId: '9pJv0Tzov7c', duration: '1:10' },
];

const clinics = [
  { 
    name: 'Jayraj Clinic - Chembur', 
    address: 'Gemini Building, Road No -02, Near Mohan Gas, Pestom Sagar, Chembur West-400089', 
    morning: '10:30 AM - 1:00 PM', 
    evening: '7:00 PM - 9:30 PM',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipPY7W12UT2ZZwVmq6nREyQxKpx6WaP4aXwkg5xW=s1360-w1360-h1020-rw'
  },
  { 
    name: 'Asha Nursing Home - Govandi', 
    address: 'Plot No. 29, L-373, Galsenkar Colony, Near Jafar School, Govandi, Mumbai - 400043', 
    morning: '1:00 PM - 3:00 PM', 
    evening: '4:00 PM - 7:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipPyLt53PQ_zLaTROH5uMdB3aoONnuPa6F0dg8A=w1200-h969-p-k-no'
  },
];

// --- REUSABLE COMPONENTS & LOGIC ---

// Utility function to handle smooth scrolling
const useScrollHandler = () => {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return handleScrollTo;
};

// Animated Counter Component
const AnimatedCounter = ({ endValue, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const numericEndValue = parseInt(endValue.toString().replace(/[^0-9.]/g, ''), 10);
  const isPlus = endValue.toString().includes('+');
  const isPercent = endValue.toString().includes('%');

  useEffect(() => {
    let startTime;
    let frameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const nextValue = Math.floor(numericEndValue * percentage);
      setCount(nextValue);

      if (percentage < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [numericEndValue, duration]);

  return (
    <p className="text-4xl lg:text-5xl font-extrabold font-rubik bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
      {count.toLocaleString()}
      {isPercent ? '%' : ''}
      {isPlus && !isPercent ? '+' : ''}
    </p>
  );
};

// Stat Card Component
const StatCard = ({ value, label, icon: Icon }) => {
  const [hasCounted, setHasCounted] = useState(false);
  const statRef = useRef(null);
  
  const numericPart = value.toString().replace(/[^0-9.]/g, '');
  const isStaticValue = numericPart.length === 0;

  useEffect(() => {
    if (isStaticValue) {
        setHasCounted(true);
        return;
    }

    if (hasCounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasCounted(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => {
      if (statRef.current) {
        observer.unobserve(statRef.current);
      }
    };
  }, [hasCounted, isStaticValue]);

  const defaultDisplay = value.toString().includes('%') ? '0%' : '0+';
  const displayValue = isStaticValue ? value : defaultDisplay;

  return (
    <div ref={statRef} className="stat-card flex flex-col items-center justify-center p-4 md:p-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-3xl transition duration-500 hover:shadow-4xl hover:bg-white/90 border border-white/70 transform hover:scale-[1.03]">
      {Icon && <Icon className="w-8 h-8 text-blue-700 mb-2" />}
      
      <div className="h-10 flex items-center">
        {hasCounted && !isStaticValue ? (
          <AnimatedCounter endValue={value} />
        ) : (
          <p className="text-4xl lg:text-5xl font-extrabold font-rubik bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
            {isStaticValue ? value : displayValue}
          </p>
        )}
      </div>
      <p className="text-sm font-medium text-gray-700 text-center mt-1">{label}</p>
    </div>
  );
};

// Primary Button Component
const PrimaryButton = ({ icon: Icon, label, className = '', onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center space-x-2 px-8 py-3 font-semibold text-white
      bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-xl shadow-blue-500/50
      transition duration-300 transform group
      ${className}
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]'}
    `}
  >
    {Icon && <Icon className="w-5 h-5 transition duration-300 group-hover:translate-x-1" />}
    <span>{label}</span>
  </button>
);

// Secondary Button Component
const SecondaryButton = ({ icon: Icon, label, className = '', onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center space-x-2 px-8 py-3 font-semibold text-blue-600 bg-white/90 rounded-full border border-blue-300 transition duration-300 hover:bg-blue-50 hover:text-blue-700 shadow-md transform hover:scale-[1.01] ${className}`}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span>{label}</span>
  </button>
);

// Clinic Timing Display Component
const ClinicCard = ({ clinic }) => (
  <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl shadow-3xl transition duration-500 hover:shadow-4xl border border-white/30 flex flex-col h-full text-white transform hover:scale-[1.01]">
    
    <img
      src={clinic.imageUrl}
      alt={`${clinic.name} interior view`}
      className="w-full h-40 object-cover rounded-2xl mb-5 shadow-lg border-4 border-white/50"
      loading="lazy"
    />

    <h3 className="text-xl font-extrabold font-rubik mb-2 flex items-center">
      <MapPin className="w-5 h-5 text-red-400 mr-2" />
      {clinic.name}
    </h3>
    <p className="text-sm text-gray-200 mb-4">{clinic.address}</p>

    <div className="flex flex-col space-y-3 mt-auto pt-4 border-t border-white/30">
      <div className="flex items-center justify-between">
        <span className="flex items-center font-medium">
          <Clock className="w-4 h-4 mr-2 text-blue-200" /> Morning Timings:
        </span>
        <span className="font-semibold text-blue-100">{clinic.morning}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center font-medium">
          <Clock className="w-4 h-4 mr-2 text-blue-200" /> Evening Timings:
        </span>
        <span className="font-semibold text-blue-100">{clinic.evening}</span>
      </div>
    </div>
    <p className="mt-4 p-2 bg-yellow-50 text-yellow-800 font-bold text-sm text-center rounded-lg border border-yellow-300">
      **Strictly by Appointment Only**
    </p>
  </div>
);

// Modal Component
const AppointmentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 backdrop" onClick={onClose}>
      <div
        className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-4xl max-w-lg w-full border border-white/50 relative transform scale-100 transition-transform duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition duration-150">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-3xl font-extrabold font-rubik text-blue-800 mb-4">Book Your Consultation</h3>
        <p className="text-gray-600 mb-6">Fill out the form below and we will confirm your slot within 2 hours.</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
            <input type="text" id="modal-name" placeholder="Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white/70 transition duration-300" />
          </div>
          <div>
            <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input type="tel" id="modal-phone" placeholder="+91 98765 43210" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white/70 transition duration-300" />
          </div>
          <div>
            <label htmlFor="modal-reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <textarea id="modal-reason" rows="3" placeholder="Briefly describe the concern..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white/70 transition duration-300"></textarea>
          </div>
          <PrimaryButton icon={CalendarCheck} label="Confirm Appointment" className="w-full mt-6" onClick={() => {
            console.log("Appointment submitted (placeholder)");
            onClose();
          }} />
        </form>
      </div>
    </div>
  );
};

// --- SECTIONAL COMPONENTS ---

// Navigation Component
const Navigation = ({ handleScrollTo, isMenuOpen, setIsMenuOpen, openModal }) => (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl shadow-3xl border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-2xl font-extrabold font-rubik text-blue-700 cursor-pointer transition duration-300 hover:text-cyan-500" onClick={() => handleScrollTo('hero')}>
            Dr. Jay R. Dhadke
          </h1>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace('-', '')}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(item.toLowerCase().replace('-', ''));
              }}
              className="text-gray-700 hover:text-cyan-600 font-medium transition duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r from-blue-500 to-cyan-400 hover:after:w-full after:transition-all after:duration-300"
            >
              {item === 'Video-T' ? 'Video Testimonials' : item}
            </a>
          ))}
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-lg shadow-xl border-t border-gray-100 pb-2">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace('-', '')}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(item.toLowerCase().replace('-', ''));
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150 border-b border-gray-100 last:border-b-0 font-medium"
            >
              {item === 'Video-T' ? 'Video Testimonials' : item}
            </a>
          ))}
          <div className="p-4">
            <PrimaryButton
              icon={CalendarCheck}
              label="Book Appointment"
              className="w-full"
              onClick={() => {
                openModal();
                setIsMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </header>
);

// Hero Section Component
const HeroSection = ({ openModal }) => (
    <section id="hero" className="relative pt-20 pb-32 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        {/* Decorative circles with custom animation for depth */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-300/20 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl opacity-70 pointer-events-none animate-bg-move"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/20 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-3xl opacity-70 pointer-events-none animate-bg-move delay-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Content (Left) */}
            <div className="relative z-10 text-center md:text-left animate-in fade-in slide-in-from-left-8 duration-700">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
                    MD Paediatrics | Neonatology PGP-N (Boston, USA)
                </p>
                <h2 className="text-5xl md:text-7xl font-extrabold font-rubik text-blue-900 leading-tight mb-4">
                    Dr. Jay Dhadke
                </h2>
                <h3 className="text-2xl font-semibold font-rubik text-cyan-700 mb-6">
                    NICU & PICU Child Specialist in Mumbai
                </h3>
                <p className="text-lg text-gray-700 mb-10 max-w-lg md:mx-0 mx-auto">
                    Delivering precise, **evidence-based care** from the NICU to adolescence. Your child's health and future are safe in our hands.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                    <div className="animate-pulse-once">
                        <PrimaryButton icon={CalendarCheck} label="Book Appointment" onClick={openModal} />
                    </div>
                    <SecondaryButton
                        icon={MessageCircle}
                        label="WhatsApp Now"
                        onClick={() => (window.location.href = 'https://wa.me/919920822936')}
                    />
                </div>
            </div>

            {/* Hero Image / Stats (Right) */}
            <div className="relative mt-12 md:mt-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-150 group">
                <div
                    className="doctor-image-placeholder w-full max-w-md h-[400px] lg:h-[500px] mx-auto bg-cover bg-center rounded-3xl shadow-4xl transform rotate-3 scale-90 transition-all duration-700 group-hover:rotate-0 group-hover:scale-100 border-8 border-white/90"
                    style={{
                        backgroundImage: `url\(https://tse4.mm.bing.net/th/id/OIP.d8nIFR5y9Qdkf1mtBDfCQQHaI0?pid=Api&P=0&h=180)`,
                        backgroundPosition: 'top center',
                    }}
                ></div>
            </div>
        </div>
    </section>
);

// Metrics Bar Section (Scroll-Triggered Stats)
const MetricsBarSection = () => (
    <section id="metrics" className="py-12 bg-white/50 backdrop-blur-lg -mt-16 relative z-20 shadow-inner border-t border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard value="20+" label="Yrs Experience" icon={Clock} />
                <StatCard value="2500+" label="Happy Families" icon={User} />
                <StatCard value="30K+" label="Total Consults" icon={Stethoscope} />
                <StatCard value="98%" label="Immunization Rate" icon={ShieldCheck} />
                <StatCard value="Boston" label="Trained PGP-N" icon={Award} /> 
            </div>
        </div>
    </section>
);

// About Section Component
const AboutSection = ({ handleScrollTo }) => (
    <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="inline-block text-sm font-bold text-blue-600 bg-blue-100 px-4 py-1 rounded-full uppercase tracking-widest">
                    Our Commitment
                </span>
                <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold font-rubik text-gray-900">
                    A Trusted Hand in Child Health
                </h2>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-16 items-start">
                <div className="lg:col-span-2 space-y-6 text-lg text-gray-600">
                    <p>
                        Dr. Jay Dhadke is a highly specialized Pediatrician committed to international standards of care. His qualifications include a prestigious **Post Graduate Program in Neonatology (PGP-N) from Boston, USA**, providing a foundation of cutting-edge, evidence-based pediatric practice.
                    </p>
                    <p>
                        His expertise spans the entire childhood spectrum, specializing particularly in the care of newborns and critically ill children. He provides a holistic approach that prioritizes preventative care, developmental support, and compassionate communication with parents.
                    </p>
                    <p className="font-extrabold text-cyan-700 text-xl border-l-4 border-cyan-500 pl-4">
                        "We don't just treat illnesses; we nurture potential. Every child deserves the highest standard of care from their first breath."
                    </p>
                    <PrimaryButton icon={ArrowRight} label="View Full Biography" className="mt-8" onClick={() => handleScrollTo('contact')} />
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-1 p-8 bg-blue-50 rounded-3xl shadow-xl border border-blue-200">
                    <h3 className="text-xl font-bold font-rubik text-blue-800 mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-blue-500" /> Key Credentials</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <SquareDot className="w-5 h-5 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                            <span>MD Paediatrics (Gold Medalist)</span>
                        </li>
                        <li className="flex items-start">
                            <SquareDot className="w-5 h-5 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                            <span>PGP-N Neonatology (Boston, USA)</span>
                        </li>
                        <li className="flex items-start">
                            <SquareDot className="w-5 h-5 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                            <span>FNNF & MNNF Certified Specialist</span>
                        </li>
                        <li className="flex items-start">
                            <SquareDot className="w-5 h-5 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                            <span>Experienced in PICU (Pediatric ICU) Management</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

// Parallax Quote Section Component
const ParallaxQuoteSection = () => (
    <section className="parallax-bg bg-cover bg-center h-96 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-blue-900/70"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <p className="text-3xl md:text-5xl font-extrabold font-rubik text-white leading-snug tracking-wide italic">
                “Caring for a child is like giving wings to the future.”
            </p>
            <p className="mt-6 text-xl text-cyan-300 font-semibold">- Dr. Jay Dhadke's Philosophy</p>
        </div>
    </section>
);

// Services Section Component
const ServicesSection = () => (
    <section id="services" className="py-32 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="inline-block text-sm font-bold text-cyan-700 bg-cyan-100 px-4 py-1 rounded-full uppercase tracking-widest">
                    Specialized Care
                </span>
                <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold font-rubik text-gray-900">
                    Our Signature Pediatric Services
                </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-3xl transition duration-700 ease-in-out hover:shadow-4xl hover:scale-[1.05] hover:bg-white/30 border border-white/50 flex flex-col cursor-pointer group"
                    >
                        <service.icon className="w-10 h-10 text-cyan-600 mb-4 transform group-hover:rotate-6 transition duration-500" />
                        <h3 className="text-xl font-bold font-rubik text-blue-900 mb-3">{service.title}</h3>
                        <p className="text-gray-700 mt-auto">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// Video Player Modal Component
const VideoPlayerModal = ({ youtubeId, onClose }) => {
    if (!youtubeId) return null;

    // Use the specific YouTube embed URL for the iframe
    const videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;

    return (
        <div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 backdrop" 
            onClick={onClose}
        >
            <div
                className="bg-gray-900/90 backdrop-blur-xl p-4 rounded-xl shadow-4xl max-w-4xl w-full relative transform scale-100 transition-transform duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-10 right-0 md:-right-10 text-white hover:text-red-500 transition duration-150 p-2 rounded-full bg-black/50"
                    aria-label="Close video player"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="aspect-video w-full">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src={videoSrc}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

// Video Testimonials Section Component (DYNAMIC CAROUSEL APPLIED)
const VideoTestimonialsSection = () => {
    // State to track the currently active video index
    const [activeIndex, setActiveIndex] = useState(0); 
    // State to track which video is playing (by ID)
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const carouselRef = useRef(null);

    const goToNext = () => {
        // Updated length check to include the new 5th video
        setActiveIndex((prevIndex) => (prevIndex + 1) % videoTestimonials.length);
    };

    const goToPrev = () => {
        // Updated length check to include the new 5th video
        setActiveIndex((prevIndex) => 
            (prevIndex - 1 + videoTestimonials.length) % videoTestimonials.length
        );
    };

    // Function to open the video player
    const openVideo = (youtubeId) => {
        setPlayingVideoId(youtubeId);
    };

    // Function to close the video player
    const closeVideo = () => {
        setPlayingVideoId(null);
    };

    // Effect to translate the carousel container when activeIndex changes
    useEffect(() => {
        if (carouselRef.current) {
            // Define dimensions for responsive translation
            const cardWidthLg = 400; // Corresponds to md:w-[400px]
            const cardWidthSm = 300; // Corresponds to w-[300px]
            const gap = 32; // Corresponds to gap-8 (2rem = 32px)
            
            // Get current screen width (proxy for responsive class)
            // Use clientWidth if available, otherwise assume mobile width for safety.
            const currentCardWidth = carouselRef.current.clientWidth > 767 ? cardWidthLg : cardWidthSm;
            
            // Calculate total offset to shift the carousel track
            const offset = (currentCardWidth + gap) * activeIndex;
            
            carouselRef.current.style.transform = `translateX(-${offset}px)`;
        }
    }, [activeIndex]);

    return (
        <section id="video-t" className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-bold text-red-600 bg-red-100 px-4 py-1 rounded-full uppercase tracking-widest">
                        Real Stories
                    </span>
                    <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold font-rubik text-gray-900">
                        Dynamic Video Success Casserole!
                    </h2>
                </div>

                {/* Carousel Container (Controls the visible window) */}
                <div className="relative overflow-x-hidden py-4"> 
                    
                    {/* Inner Track (Scrollable/Translatable) */}
                    <div 
                        ref={carouselRef}
                        className="flex transition-transform duration-700 ease-in-out gap-8 w-max"
                        style={{ transform: `translateX(0)` }}
                    >
                        {videoTestimonials.map((video, index) => (
                            <div 
                                key={index} 
                                onClick={() => openVideo(video.youtubeId)} // <-- Opens the video modal
                                className={`video-card w-[300px] md:w-[400px] flex-shrink-0 bg-gray-50 p-4 rounded-xl shadow-lg transition duration-500 cursor-pointer group 
                                    ${index === activeIndex ? 'scale-[1.03] shadow-4xl ring-4 ring-blue-500/50 bg-white' : 'opacity-80 hover:scale-[1.01]'}
                                `}
                            >
                                <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                                    
                                    {/* YouTube Thumbnail Link */}
                                    <img 
                                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} // <-- Use YouTube's default thumbnail URL format
                                        alt={`Video thumbnail for ${video.title}`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback for missing video IDs
                                            e.target.onerror = null; 
                                            e.target.src = `https://placehold.co/600x337/111827/F9FAFB?text=Video+ID+${index+1}`;
                                        }}
                                    />

                                    {/* Dark Overlay on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition duration-300 group-hover:bg-black/20">
                                        {/* Custom, prominent Play Button */}
                                        <div className="p-4 bg-white/80 rounded-full shadow-xl text-blue-700 transform transition-transform duration-300 group-hover:scale-110">
                                            <Play className="w-8 h-8 fill-current" />
                                        </div>
                                    </div>

                                    {/* Duration Tag */}
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md">
                                        {video.duration}
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-800 text-center">{video.title}</p>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons (Absolute Positioning) */}
                    <button 
                        onClick={goToPrev} 
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-blue-700/80 hover:bg-blue-700 text-white rounded-full transition-all shadow-xl disabled:opacity-50"
                        aria-label="Previous testimonial"
                        disabled={activeIndex === 0}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    
                    <button 
                        onClick={goToNext} 
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-blue-700/80 hover:bg-blue-700 text-white rounded-full transition-all shadow-xl disabled:opacity-50"
                        aria-label="Next testimonial"
                        disabled={activeIndex === videoTestimonials.length - 1}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    
                </div>
                
                {/* Dots Indicator */}
                <div className="flex justify-center space-x-3 mt-12">
                    {videoTestimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === activeIndex ? 'bg-blue-700 w-8' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>

            </div>
            {/* Video Player Modal */}
            <VideoPlayerModal youtubeId={playingVideoId} onClose={closeVideo} />
        </section>
    );
};

// Contact Section Component
const ContactSection = ({ openModal }) => (
    <section id="contact" className="py-32 bg-blue-800 relative overflow-hidden">
        {/* Decorative circles for depth and movement */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-40 pointer-events-none animate-bg-move"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extrabold font-rubik text-white">
                    Connect With Dr. Dhadke
                </h2>
                <p className="mt-4 text-xl text-blue-200">
                    Book your slot immediately via the appointment form below.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Clinic Timing Cards (Deep Glass Morphism) */}
                <div className="space-y-8">
                    <h3 className="text-2xl font-bold font-rubik text-white mb-4">Clinic Locations & Timings</h3>
                    {clinics.map((clinic, index) => (
                        <ClinicCard key={index} clinic={clinic} />
                    ))}
                </div>

                {/* Contact Form CTA Panel (Glass Morphism) */}
                <div className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-4xl border border-white/50 h-full flex flex-col justify-center">
                    <h3 className="text-3xl font-extrabold font-rubik text-white mb-4">Urgent Appointment?</h3>
                    <p className="text-blue-100 mb-8 text-lg">
                        For non-critical appointments, click below. For emergencies, please call the clinic directly or use WhatsApp.
                    </p>
                    <div className="space-y-4">
                        <PrimaryButton icon={CalendarCheck} label="Open Appointment Form" className="w-full" onClick={openModal} />
                        <SecondaryButton
                            icon={Phone}
                            label="Emergency Call: +91 99208 22936"
                            className="w-full text-red-500 border-red-300 hover:bg-red-50"
                            onClick={() => (window.location.href = 'tel:+919920822936')}
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Mobile Contact Bar Component
const MobileContactBar = ({ openModal }) => (
  <div className="md:hidden fixed bottom-0 left-0 w-full z-40">
    <div className="flex justify-around bg-blue-700/95 backdrop-blur-sm shadow-2xl p-3 border-t-4 border-cyan-400">
      <a
        href="tel:+919920822936"
        className="flex flex-col items-center text-white text-xs font-semibold hover:text-cyan-300 transition duration-300"
      >
        <Phone className="w-6 h-6 mb-1 text-cyan-400" />
        Call Now
      </a>
      <a
        href="https://wa.me/919920822936"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center text-white text-xs font-semibold hover:text-cyan-300 transition duration-300"
      >
        <MessageCircle className="w-6 h-6 mb-1 text-green-400" />
        WhatsApp
      </a>
      <button
        onClick={openModal}
        className="flex flex-col items-center text-white text-xs font-semibold hover:text-cyan-300 transition duration-300"
      >
        <CalendarCheck className="w-6 h-6 mb-1 text-red-400" />
        Appointment
      </button>
    </div>
  </div>
);

// Footer Component
const AppFooter = () => (
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm border-t border-gray-700 pt-8">
            <p>&copy; {new Date().getFullYear()} Dr. Jay Dhadke, MD, PGP-N (Boston). All Rights Reserved.</p>
            <p className="mt-2 text-gray-400">Created By Jay Dhadke - 7058591764</p>
        </div>
    </footer>
);


// --- MAIN APP COMPONENT ---
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModal] = useState(false);
  const handleScrollTo = useScrollHandler();

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased text-gray-800">

      {/* Custom Styles */}
      <style>{`
        /* IMPORTING NEW FONTS: Rubik for Display/Headers, Inter for Body/UI */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
        
        .font-inter { 
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
        .font-rubik { 
          font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .backdrop {
            background-color: rgba(0, 0, 0, 0.4);
        }

        @keyframes pulse-once {
            0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
            100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        .animate-pulse-once {
            animation: pulse-once 1.5s ease-out 1;
        }

        @keyframes background-move {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          50% { transform: translate(-48%, -52%) rotate(5deg) scale(1.05); }
        }
        .animate-bg-move {
          animation: background-move 20s infinite ease-in-out;
        }

        .shadow-3xl {
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.4) inset;
        }
        .shadow-4xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
        }
        
        @media (max-width: 767px) {
            .mobile-padding-bottom {
                /* Extra padding for the fixed mobile contact bar */
                padding-bottom: 70px;
            }
        }

        .parallax-bg {
            background-image: url('https://wallpaperbat.com/img/599339-pediatric-medicine.jpg');
            background-attachment: fixed;
        }
      `}</style>

      {/* Navigation */}
      <Navigation 
        handleScrollTo={handleScrollTo} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        openModal={openModal} 
      />
      
      {/* Main Content Wrapper (with mobile padding) */}
      <div className="mobile-padding-bottom">
        
        {/* Hero Section */}
        <HeroSection openModal={openModal} />

        {/* Metrics Bar Section (Scroll-Triggered Stats) */}
        <MetricsBarSection />

        {/* About Section */}
        <AboutSection handleScrollTo={handleScrollTo} />
        
        {/* Parallax Quote Section */}
        <ParallaxQuoteSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Video Testimonials Section (The Casserole!) */}
        <VideoTestimonialsSection />

        {/* Contact & Timings Section */}
        <ContactSection openModal={openModal} />
      </div>

      {/* Footer */}
      <AppFooter />

      {/* Appointment Modal (renders over everything) */}
      <AppointmentModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Sticky Mobile Contact Bar */}
      <MobileContactBar openModal={openModal} />

    </div>
  );
};

export default App;
