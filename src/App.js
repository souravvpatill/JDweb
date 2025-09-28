import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Stethoscope, GraduationCap, Clock, Phone, MapPin, CheckCircle,
  Users, Baby, HeartPulse, ShieldCheck, TrendingUp, HeartHandshake, Mail, Calendar, X, Youtube
} from 'lucide-react';

// --- Configuration and Data (Color Theory: Light Blue/White for Trust/Purity) ---

const PRIMARY_COLOR = '#0D6EFD'; // Strong, professional Blue
const ACCENT_COLOR = '#28A745'; // Vitality, Health Green
const NEUTRAL_LIGHT_BG = '#F0F8FF'; // Very light background blue

// Placeholder Assets 
const ASSETS = {
    // Note: Doctor image placeholder updated to reflect the style in the screenshot (doctor with stethoscope)
    DOCTOR_IMAGE: `https://images.unsplash.com/photo-1550186196-805177e68407?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
    // Clinic image placeholders remain consistent with the professional theme
    CHEMBUR_CLINIC_IMAGE: `https://placehold.co/600x400/${NEUTRAL_LIGHT_BG.substring(1)}/${PRIMARY_COLOR.substring(1)}?text=Jayraj+Clinic%0AProfessional+Facade`,
    GOVANDI_CLINIC_IMAGE: `https://placehold.co/600x400/${NEUTRAL_LIGHT_BG.substring(1)}/${PRIMARY_COLOR.substring(1)}?text=Asha+Nursing+Home%0AInterior+View`,
    VIDEO_ID_1: 'dQw4w9WgXcQ', // Placeholder YouTube ID
    VIDEO_ID_2: 'F9v9_n25Hh8', // Placeholder YouTube ID
};


// Define data for the page (Text Curated)
const services = [
  { title: "Precision Vaccination & Immunisation", description: "Beyond routine shots: personalized, evidence-based catch-up schedules ensuring maximum protection for your child's future.", icon: ShieldCheck },
  { title: "Specialized NICU Care", description: "Expert management and intensive care for premature babies, critically ill newborns, and high-risk deliveries.", icon: Baby },
  { title: "Pediatric Critical Care (PICU)", description: "Dedicated pediatric intensive care for complex illnesses and post-operative recovery, focusing on stability and rapid healing.", icon: HeartPulse },
  { title: "Adolescent Health & Wellness", description: "Confidential and comprehensive care addressing puberty, nutrition, mental health, and complex developmental milestones (10-18 yrs).", icon: TrendingUp },
  { title: "Holistic Growth & Development Tracking", description: "Detailed, milestone-by-milestone assessments and personalized nutrition plans that fuel potential from infancy to adolescence.", icon: Users },
  { title: "Evidence-Based Breastfeeding Support", description: "Practical, one-on-one counselling to help mothers overcome feeding challenges and establish successful, nourishing routines.", icon: HeartHandshake },
  { title: "General Child Health (OPD)", description: "Proactive management of common illnesses, regular wellness checks, and timely intervention for acute paediatric conditions.", icon: Stethoscope },
];

const clinics = [
  {
    name: "Jayraj Clinic — Chembur",
    image: ASSETS.CHEMBUR_CLINIC_IMAGE,
    timings: [
      { day: "Morning", time: "10:30 AM – 1:00 PM" },
      { day: "Evening", time: "7:00 PM – 9:30 PM" },
    ],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.930432320794!2d72.8808569!3d19.07598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sChembur%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1678890000000&zoom=14",
  },
  {
    name: "Asha Nursing Home — Govandi",
    image: ASSETS.GOVANDI_CLINIC_IMAGE,
    timings: [
      { day: "Afternoon", time: "1:00 PM – 3:00 PM" },
      { day: "Evening", time: "4:00 PM – 7:00 PM" },
    ],
    address: "Plot No. 29 – L – 2/3, Gajanan Colony, Near Jafari School, Govandi, Mumbai – 400043",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15084.286940861113!2d72.90382375!3d19.05739675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3905e94b155%3A0x5d988880e6c694a1!2sGovandi%2C%20Mumbai%2C%20Maharashtra%20400043!5e0!3m2!1sen!2sin!4v1678890000000&zoom=14",
  }
];

// Achievements for the Hero Section Stats
const achievements = [
    { title: "Years Experience", value: 8, suffix: '+' },
    { title: "FNNF Certified", value: 100, suffix: '%' },
    { title: "PGPN Boston", value: 1, suffix: 'st' },
    { title: "Emergency Care", value: 24, suffix: '/7' },
];

// --- Custom Hooks for UI/Animation ---

// Hook for scroll-based fade-in effect (Enhanced for better initial transition)
const useInView = (options) => {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Apply initial hidden state using style attribute
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 700ms ease-out, transform 700ms ease-out';
    element.style.transitionDelay = `${(Math.random() * 200).toFixed(0)}ms`; // Staggered delay for elements

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);
  return ref;
};

// Hook for numerical counter animation
const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const startTime = performance.now();
        const step = (currentTime) => {
          const progress = Math.min(1, (currentTime - startTime) / duration);
          // Special handling for 24/7 stat which should just display 24
          let currentTarget = target === 24 ? 24 : target;
          setCount(Math.floor(progress * currentTarget));
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
        observer.unobserve(element);
      }
    }, { threshold: 0.8 });

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [target, duration]);

  return [count, ref];
};

// --- Helper Components ---

const NavLink = ({ children, sectionId, activeSection, scrollToSection }) => {
  const isActive = activeSection === sectionId;
  return (
    <a
      href={`#${sectionId}`}
      onClick={(e) => { e.preventDefault(); scrollToSection(sectionId); }}
      className={`relative py-2 px-3 text-sm font-medium transition-colors duration-300 hover:text-[${PRIMARY_COLOR}] group
        ${isActive ? `text-[${PRIMARY_COLOR}] font-bold` : 'text-gray-700'}
      `}
    >
      {children}
      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-0 bg-[${PRIMARY_COLOR}] transition-all duration-300 ${isActive ? 'w-full' : 'group-hover:w-1/2'}`}></span>
    </a>
  );
};

const SectionTitle = ({ children, subtitle }) => {
  const ref = useInView({ threshold: 0.1 });
  return (
    <div ref={ref} className="text-center mb-12">
      <h2 className="text-4xl font-extrabold text-slate-900 mb-3 md:text-5xl font-['Montserrat']">
        {children}
      </h2>
      <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
};

const CTAButton = ({ icon: Icon, children, style = 'primary', onClick, isLink = false, href = "#" }) => {
  const baseClasses = "flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform shadow-lg hover:shadow-xl text-center min-w-[120px]";
  let colorClasses = '';

  if (style === 'primary') {
    colorClasses = `bg-[${PRIMARY_COLOR}] text-white hover:bg-opacity-90 active:scale-[0.98]`;
  } else if (style === 'secondary') {
    colorClasses = `bg-white text-[${PRIMARY_COLOR}] border border-gray-200 hover:bg-gray-50 active:scale-[0.98]`;
  } else if (style === 'whatsapp') {
    colorClasses = `bg-[#25D366] text-white hover:bg-opacity-90 active:scale-[0.98]`;
  } else if (style === 'accent') {
    colorClasses = `bg-[${ACCENT_COLOR}] text-white hover:bg-opacity-90 active:scale-[0.98]`;
  }

  const Tag = isLink ? 'a' : 'button';

  return (
    <Tag 
        onClick={isLink ? undefined : onClick} // Only use onClick for buttons
        href={isLink ? href : undefined} // Only use href for links
        target={isLink && href.startsWith('http') ? '_blank' : undefined}
        rel={isLink && href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${colorClasses}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </Tag>
  );
};

// --- Main Components ---

const Header = ({ activeSection, scrollToSection }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'about', name: 'About' },
    { id: 'services', name: 'Services' },
    { id: 'testimonials', name: 'Testimonials' },
    { id: 'contact', name: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md font-['Montserrat']
      ${isSticky ? `py-3 bg-white` : 'py-5 bg-white/90 backdrop-blur-sm'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className={`text-2xl font-bold text-[${PRIMARY_COLOR}] transition-all duration-300`}>
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            Dr. Jay R. Dhadke
          </a>
        </h1>

        <nav className="hidden md:flex space-x-6">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              sectionId={item.id}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}] text-gray-800`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden bg-white pt-4 pb-2 transition-all duration-300 ease-in-out border-t border-gray-100`}>
          <nav className="flex flex-col space-y-2 px-4">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.id); setIsOpen(false); }}
                className={`py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300
                  ${activeSection === item.id ? `font-bold text-[${PRIMARY_COLOR}] bg-gray-50` : ''}
                `}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const StatCard = ({ title, value, suffix, counterHook }) => {
    const [count, ref] = counterHook;
    
    // Custom logic for 24/7 display
    const displayValue = title === "Emergency Care" ? '24' : count;
    const displaySuffix = title === "Emergency Care" ? suffix : (count === 0 ? '' : suffix);

    return (
        <div ref={ref} className="stat-card p-4 md:p-6 bg-white/80 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300 hover:shadow-xl backdrop-blur-md">
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 font-['Poppins']">
                <span className={`text-[${PRIMARY_COLOR}]`}>{displayValue}</span>
                <span className="text-2xl font-bold align-top">{displaySuffix}</span>
            </p>
            <p className="text-sm md:text-md text-gray-600 font-semibold mt-1">{title}</p>
        </div>
    );
}


const HeroSection = ({ openModal, scrollToSection }) => {
  const ref = useInView({ threshold: 0.1 });
  
  // Use hooks for the counter animations
  const yearsCounter = useCounter(achievements[0].value);
  const percentCounter = useCounter(achievements[1].value);
  const pgpnCounter = useCounter(achievements[2].value);
  const emergencyCounter = useCounter(achievements[3].value);

  const counterHooks = [yearsCounter, percentCounter, pgpnCounter, emergencyCounter];


  return (
    <section id="hero" className="bg-white pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden hero-soft-bg min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative text-center">
        
        {/* Credentials and Tagline (Matching Screenshot Layout) */}
        <div ref={ref} className="max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl mb-2 font-medium text-gray-700">
            MD Paediatrics, FNNF, MNNF (Neonatology, Mumbai)
            <br className="sm:hidden"/> MBBS (K.E.M. Hospital, Mumbai), PGPN (Boston, USA)
          </p>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight font-['Poppins'] text-slate-900">
            Dr. Jay R. Dhadke
          </h1>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-[${PRIMARY_COLOR}] tracking-tight`}>
            Pediatrician | NICU & PICU Child Specialist
          </h2>
          
          <p className="text-lg md:text-xl mb-12 font-light text-gray-600 max-w-3xl mx-auto">
            Compassionate, **Evidence-based Care** for Newborns & Children. Your child's health is our commitment.
          </p>
          
          {/* CTA Buttons (Matching Screenshot Layout) */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <CTAButton icon={Calendar} style="primary" onClick={openModal}>
              Book Appointment
            </CTAButton>
            {/* FIX: Removed external <a> tags to prevent nesting error: <a><a> */}
            <CTAButton icon={Phone} style="secondary" isLink={true} href="tel:+918692072736">
                Call Now
            </CTAButton>
            <CTAButton icon={Stethoscope} style="whatsapp" isLink={true} href="https://wa.me/918692072736">
                WhatsApp
            </CTAButton>
          </div>
        </div>

        {/* Stat Cards Section (Matching Screenshot) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto -mb-12">
            {achievements.map((item, index) => (
                <StatCard 
                    key={index}
                    title={item.title}
                    value={item.value}
                    suffix={item.suffix}
                    counterHook={counterHooks[index]}
                />
            ))}
        </div>

        {/* Doctor Image Placeholder (Integrated into the background style) */}
        <div className="max-w-4xl mx-auto mt-16 md:mt-24">
            <div className="w-full h-[300px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-2xl doctor-image-placeholder">
                <img 
                    src={ASSETS.DOCTOR_IMAGE} 
                    alt="Dr. Jay R. Dhadke - Pediatrician & Neonatologist" 
                    className="w-full h-full object-cover object-top filter contrast-125 transition-all duration-700" 
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x500/E0F7FF/0D6EFD?text=Dr.+Dhadke%0APortrait+Image"; }}
                />
                 {/* Emergency Care Badge (Matches Screenshot) */}
                <div className="absolute right-6 bottom-6 p-4 rounded-xl shadow-2xl bg-[${PRIMARY_COLOR}] text-white font-bold text-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05] w-28 h-28">
                    <span>24/7</span>
                    <span className="text-sm font-medium opacity-80 mt-1">Emergency Care</span>
                </div>
            </div>
        </div>


      </div>
    </section>
  );
};

const AboutSection = () => {
  
  const bioRef = useInView({ threshold: 0.1 });
  const highlightsRef = useInView({ threshold: 0.1 });

  return (
    <section id="about" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title matches the style in the screenshot */}
        <SectionTitle subtitle="Dedicated to providing compassionate, evidence-based pediatric and neonatal care">
            About Dr. Jay R. Dhadke
        </SectionTitle>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          <div ref={bioRef} className="space-y-6 text-lg text-gray-700">
            <p className="font-['Inter']">
              Dr. Jay R. Dhadke is a highly dedicated Pediatrician and Neonatologist serving the Mumbai community, bringing **over eight years of specialized experience** to his practice. His foundational training includes an **MBBS from the prestigious K.E.M. Hospital, Mumbai**, followed by an MD in Paediatrics.
            </p>
            <p className="font-['Inter']">
              His commitment to the most vulnerable patients led him to complete a **Fellowship in Neonatology (FNNF, MNNF)** at Sion Lokmanya Tilak Municipal Medical College & Hospital, Mumbai. Furthermore, he cemented his expertise in child nutrition by earning the **Post Graduate Program in Paediatric Nutrition (PGPN) from Boston, USA**, ensuring a holistic approach to child wellness.
            </p>
            <p className={`font-semibold text-slate-800 font-['Inter'] border-l-4 border-[${ACCENT_COLOR}] pl-4 italic bg-white p-3 rounded-lg`}>
              After serving as a Postgraduate Medical Officer at Shatabdi Hospital, Dr. Dhadke established his own centers. He currently offers comprehensive, high-quality care at **Jayraj Clinic (Chembur)** and **Asha Nursing Home (Govandi)**.
            </p>
          </div>
          
          {/* Detailed Credentials List */}
          <div ref={highlightsRef} className="p-8 rounded-2xl shadow-2xl bg-white border border-gray-100 h-full space-y-4">
            <h3 className={`text-xl font-bold text-[${PRIMARY_COLOR}] mb-4 flex items-center`}>
                <GraduationCap className='w-6 h-6 mr-3 text-gray-600' /> Professional Credentials
            </h3>
            <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                    <CheckCircle className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 text-[${ACCENT_COLOR}]`} />
                    <span className='font-medium'>**MD Paediatrics:** Comprehensive specialization in child health.</span>
                </li>
                <li className="flex items-start">
                    <CheckCircle className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 text-[${ACCENT_COLOR}]`} />
                    <span className='font-medium'>**FNNF, MNNF:** Fellowship and Membership in Neonatology (Sion Hospital, Mumbai).</span>
                </li>
                <li className="flex items-start">
                    <CheckCircle className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 text-[${ACCENT_COLOR}]`} />
                    <span className='font-medium'>**PGPN (Boston, USA):** Specialized training in Pediatric Nutrition.</span>
                </li>
                <li className="flex items-start">
                    <CheckCircle className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 text-[${ACCENT_COLOR}]`} />
                    <span className='font-medium'>**MBBS (K.E.M. Hospital, Mumbai):** Strong academic foundation from a top institution.</span>
                </li>
                <li className="flex items-start">
                    <CheckCircle className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 text-[${ACCENT_COLOR}]`} />
                    <span className='font-medium'>**Expertise in PICU:** Dedicated Pediatric Intensive Care Unit management.</span>
                </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service }) => {
    const ref = useInView({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    return (
        <div
            ref={ref}
            className={`p-6 bg-white rounded-xl shadow-lg border-t-4 border-[${PRIMARY_COLOR}] 
              transition-all duration-500 ease-in-out 
              hover:shadow-2xl hover:translate-y-[-8px] hover:scale-[1.02]
              transform origin-center`}
        >
            <service.icon className={`w-10 h-10 text-white p-2 rounded-lg mb-4 bg-[${ACCENT_COLOR}]`} />
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Poppins']">{service.title}</h3>
            <p className="text-gray-600 font-['Inter']">{service.description}</p>
        </div>
    );
}

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="From Newborn Care to Adolescent Wellness: Our Core Areas of Expertise">Signature Services</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoTestimonialCard = ({ videoId, title, patient }) => {
    const ref = useInView({ threshold: 0.1 });
    return (
        <div ref={ref} className="bg-gray-50 rounded-xl shadow-2xl p-4 transition-all duration-500 hover:shadow-3xl hover:translate-y-[-4px] border border-gray-100 transform hover:scale-[1.01]">
            <div className="aspect-video mb-4 rounded-lg overflow-hidden relative">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1 flex items-center">
                <Youtube className="w-5 h-5 mr-2 text-red-600" /> {title}
            </h3>
            <p className="text-gray-600 text-sm italic">— {patient}</p>
        </div>
    );
}

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="See and Hear directly from the families we’ve helped heal and grow">Video Testimonials</SectionTitle>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <VideoTestimonialCard 
                videoId={ASSETS.VIDEO_ID_1} 
                title="A Mother's Gratitude: Quick Recovery Story" 
                patient="Priya S." 
            />
            <VideoTestimonialCard 
                videoId={ASSETS.VIDEO_ID_2} 
                title="NICU Success: Caring for Our Premature Baby" 
                patient="The Sharma Family" 
            />
        </div>
      </div>
    </section>
  );
};

const AppointmentModal = ({ isOpen, closeModal }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', reason: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.phone || !form.reason) {
      setError('Please fill in Name, Phone, and Reason for Visit.');
      return false;
    }
    const phoneRegex = /^\+?(\d[\d\s-]{8,}\d)$/; // Basic international/local phone regex
    if (!phoneRegex.test(form.phone)) {
      setError('Please enter a valid phone number.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const whatsappText = `Hello Dr. Dhadke's Clinic,\n\n*APPOINTMENT REQUEST*\nName: ${form.name}\nPhone: ${form.phone}\nReason: ${form.reason}${form.email ? `\nEmail: ${form.email}` : ''}\n\nI request confirmation for the earliest availability.`;
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/918692072736?text=${encodedText}`; 
      
      setIsSubmitted(true);
      window.open(whatsappUrl, '_blank'); 
      
      setTimeout(() => {
        closeModal();
        setForm({ name: '', phone: '', email: '', reason: '' });
        setIsSubmitted(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-60 flex justify-center items-center p-4 backdrop-blur-sm" onClick={closeModal}>
      {/* Retaining Glassmorphism on the Modal for a premium, clean look */}
      <div className="glass-morphism-modal w-full max-w-lg p-6 md:p-8 shadow-2xl transform transition-all duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4 border-b border-white/20 pb-3">
          <h3 className={`text-2xl font-bold text-white flex items-center font-['Poppins']`}>
            <Calendar className="w-6 h-6 mr-3 text-[${ACCENT_COLOR}]" /> Book Appointment
          </h3>
          <button onClick={closeModal} className="p-1 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center p-8">
            <CheckCircle className={`w-16 h-16 mx-auto text-[${ACCENT_COLOR}] mb-4`} />
            <h4 className="text-xl font-semibold mb-2 text-white">Request Sent! Please Check WhatsApp.</h4>
            <p className="text-white/80">A new tab has opened to help you confirm the appointment details with the clinic team.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-center text-white/80 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                We use WhatsApp for faster confirmation.
            </p>
            {error && <div className="p-3 bg-red-800 text-white rounded-lg text-sm">{error}</div>}

            {['name', 'phone', 'email', 'reason'].map((field) => (
              <div>
                <label htmlFor={field} className="block text-sm font-medium text-white capitalize">
                  {field.replace('phone', 'Phone Number')} {field !== 'email' && <span className="text-red-300">*</span>}
                </label>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'reason' ? 'Brief reason for visit (e.g., Fever, Vaccination)' : `Enter your ${field}`}
                  required={field !== 'email'}
                  className="mt-1 block w-full px-4 py-2 border border-white/30 rounded-lg shadow-sm focus:ring-white focus:border-white bg-white/20 text-white placeholder-white/50"
                />
              </div>
            ))}
            
            <button
              type="submit"
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform shadow-lg bg-[${ACCENT_COLOR}] text-white hover:bg-opacity-90 active:scale-[0.98] mt-6`}
            >
              Confirm & Proceed to WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const ClinicTimingCard = ({ clinic }) => {
  const ref = useInView({ threshold: 0.1 });
  // Used glass-morphism-card class
  return (
    <div ref={ref} className="glass-morphism-card p-6 rounded-2xl shadow-lg border-t-4 border-[${ACCENT_COLOR}] transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px]">
      <h3 className={`text-2xl font-bold mb-4 text-[${PRIMARY_COLOR}] font-['Poppins']`}>
        {clinic.name}
      </h3>
      
      {clinic.address && (
        <p className="flex items-start text-gray-700 mb-4 text-sm">
          <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-gray-500" />
          {clinic.address}
        </p>
      )}

      {/* Clinic Image Placeholder (Themed) */}
      <img 
          src={clinic.image} 
          alt={`${clinic.name} Facade`} 
          className="w-full h-auto object-cover rounded-lg mb-4 shadow-md transition-all duration-300 hover:scale-[1.01]" 
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x200/F7FAFF/0D6EFD?text=Clinic+Image"; }}
      />


      <div className="space-y-3">
        {clinic.timings.map((timing, index) => (
          <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/80 border border-gray-100 backdrop-blur-sm">
            <span className="font-semibold text-gray-800 flex items-center">
              <Clock className={`w-5 h-5 mr-2 text-[${ACCENT_COLOR}]`} />
              {timing.day} Timings:
            </span>
            <span className="font-bold text-slate-900">{timing.time}</span>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-red-600 font-semibold mt-4 text-center p-2 rounded-lg bg-red-50/70 border border-red-100">
        **Strictly by Appointment Only - Please Book Ahead**
      </p>
    </div>
  );
};

const ContactSection = ({ openModal }) => {
  const refGovandi = useInView({ threshold: 0.1 });
  const refChembur = useInView({ threshold: 0.1 });

  return (
    <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Direct Contact, Clinic Details, and Appointment Booking">Connect With Us</SectionTitle>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            {/* Clinic Timings & Images */}
            <div className="grid md:grid-cols-2 gap-6">
              {clinics.map((clinic, index) => (
                // Applying glass morphism here
                <ClinicTimingCard key={index} clinic={clinic} />
              ))}
            </div>

            {/* Main Contact Details */}
            <div className={`bg-gray-50 p-6 rounded-2xl shadow-lg border-l-4 border-[${PRIMARY_COLOR}] transition-shadow duration-300 hover:shadow-xl`}>
              <h3 className={`text-xl font-bold text-slate-900 mb-3 flex items-center`}>
                <Phone className={`w-6 h-6 mr-3 text-[${PRIMARY_COLOR}]`} /> Get in Touch Directly
              </h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 text-lg font-medium">
                <a href="tel:+918692072736" className={`text-gray-700 hover:text-[${PRIMARY_COLOR}] transition-colors duration-300`}>+91 86920 72736 (Primary)</a>
                <a href="tel:+917304837528" className={`text-gray-700 hover:text-[${PRIMARY_COLOR}] transition-colors duration-300`}>+91 73048 37528 (Secondary)</a>
              </div>
            </div>

          </div>

          {/* Appointment/Form Sidebar */}
          <div className={`lg:col-span-1 p-6 bg-[${PRIMARY_COLOR}] rounded-2xl shadow-2xl text-white h-full flex flex-col justify-between transition-shadow duration-300 hover:shadow-3xl`}>
            <div>
              <h3 className="text-2xl font-bold mb-4 font-['Poppins']">Need Quick Assistance?</h3>
              <p className="text-gray-200 mb-6">For urgent queries or quick confirmations, WhatsApp is the fastest way to reach us.</p>
            </div>
            <div className="space-y-4">
                <CTAButton icon={Calendar} style="accent" onClick={openModal}>
                    Request Appointment
                </CTAButton>
                <CTAButton icon={Stethoscope} style="secondary" isLink={true} href="https://wa.me/918692072736" className="!bg-white !text-gray-800">
                    Message on WhatsApp
                </CTAButton>
                <CTAButton icon={Mail} style="secondary" isLink={true} href="mailto:drjaydhadke@example.com?subject=Inquiry%20from%20Website" className="!bg-white !text-gray-800">
                    Send an Email
                </CTAButton>
            </div>
          </div>
        </div>

        {/* Google Maps Embeds */}
        <h3 className="text-2xl font-bold text-slate-900 mb-6 pt-8 border-t border-gray-200 font-['Poppins']">
          Locate Our Clinics
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chembur Map */}
          <div ref={refChembur} className="rounded-xl overflow-hidden shadow-xl border-4 border-white transition-shadow duration-300 hover:shadow-2xl">
            <h4 className="p-3 bg-slate-800 text-white font-semibold">Jayraj Clinic — Chembur Location</h4>
            <iframe
              title="Chembur Clinic Map"
              src={clinics[0].mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Govandi Map */}
          <div ref={refGovandi} className="rounded-xl overflow-hidden shadow-xl border-4 border-white transition-shadow duration-300 hover:shadow-2xl">
            <h4 className="p-3 bg-slate-800 text-white font-semibold">Asha Nursing Home — Govandi Location</h4>
            <iframe
              title="Govandi Clinic Map"
              src={clinics[1].mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};


// --- Floating Elements ---

const FloatingButtons = ({ openModal }) => {
    // Check if device is likely mobile for the Call button
    const isMobile = window.innerWidth < 768;

    return (
        <>
            {/* Floating WhatsApp Button (Bottom Right) - Matches Screenshot Icon */}
            <a
                href="https://wa.me/918692072736"
                target="_blank"
                rel="noopener noreferrer"
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[${ACCENT_COLOR}] text-white shadow-2xl transition-all duration-300 hover:scale-105 transform active:scale-95`}
                aria-label="WhatsApp Dr. Dhadke"
            >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.04 2C6.58 2 2.16 6.31 2 11.66 2.16 17 6.58 21.31 12.04 21.47l.03-.01V24h-.23c-5.5 0-9.98-4.43-10-9.87.02-5.46 4.5-9.87 10-9.87h.26v2.17H12.04C7.88 6.43 4.5 9.8 4.34 13.97c0 4.2 3.38 7.57 7.58 7.57h.03v-2.17H12.04c-3.1 0-5.63-2.48-5.63-5.5 0-3.03 2.53-5.51 5.63-5.51 3.1 0 5.63 2.48 5.63 5.5v.03h2.17v-.03c0-4.2-3.38-7.57-7.58-7.57zM17.76 13.7l-1.07-.63c-.15-.1-.3-.12-.47-.07-.15.06-.23.23-.23.36v.44c-.65.23-1.46.33-2.3.33-.84 0-1.65-.1-2.3-.33v-.44c0-.13-.08-.3-.23-.36-.17-.05-.32-.03-.47.07l-1.07.63c-.34.2-.4.65-.1.97.24.26.54.43.86.53 1.05.34 2.1.34 3.16 0 .32-.1.62-.27.86-.53.3-.32.24-.77-.1-.97z"/>
                </svg>
            </a>
        </>
    );
};

// --- Footer Component ---

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-8 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                <div className="grid md:grid-cols-4 gap-8 border-b border-slate-800 pb-6 mb-6">
                    <div>
                        <h4 className={`text-xl font-bold mb-3 text-[${ACCENT_COLOR}]`}>Dr. Jay R. Dhadke</h4>
                        <p className="text-sm text-gray-400">
                            Pediatrician | Neonatologist. Providing specialized, compassionate, evidence-based care in Mumbai.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {['About', 'Services', 'Testimonials', 'Contact'].map(item => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Contact</h4>
                        <p className="text-sm text-gray-400 space-y-2">
                            <a href="tel:+918692072736" className="block hover:text-white flex items-center"><Phone className="w-4 h-4 mr-2 inline" /> +91 86920 72736</a>
                            <a href="mailto:drjaydhadke@example.com" className="block hover:text-white flex items-center"><Mail className="w-4 h-4 mr-2 inline" /> drjaydhadke@example.com</a>
                            <span className="block pt-2">Mumbai, India</span>
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Clinic Timings</h4>
                        <p className="text-sm text-gray-400">
                            **Chembur:** 10:30 AM – 1:00 PM & 7:00 PM – 9:30 PM<br/>
                            **Govandi:** 1:00 PM – 3:00 PM & 4:00 PM – 7:00 PM
                        </p>
                        <p className="text-xs text-red-400 mt-2">Strictly by Appointment</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500 pt-4">
                    &copy; {new Date().getFullYear()} Dr. Jay R. Dhadke. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};


// --- Main App Component ---

const App = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionsRef = useRef({});

  // Function to smoothly scroll to any section
  const scrollToSection = useCallback((id) => {
    const element = sectionsRef.current[id];
    if (element) {
      // Calculate offset for sticky header
      const headerHeight = 70; // Approximation of header height
      const y = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  }, []);

  // Intersection Observer for highlighting the active section in the sticky header
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', 
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    Object.values(sectionsRef.current).forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionsRef.current).forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Set the global font styles
  useEffect(() => {
    document.body.style.fontFamily = 'Inter, sans-serif';
  }, []);


  return (
    <div className={`min-h-screen bg-white`}> 
      {/* Tailwind configuration and Custom CSS for Dynamism and Glassmorphism */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Montserrat:wght@400;700;800&family=Inter:wght@300;400;600;700&display=swap');
          html {
            scroll-behavior: smooth;
          }
          .font-['Poppins'] { font-family: 'Poppins', sans-serif; }
          .font-['Montserrat'] { font-family: 'Montserrat', sans-serif; }
          .font-['Inter'] { font-family: 'Inter', sans-serif; }
          
          /* --- Soft, Dynamic Hero Gradient Background (Matching Image) --- */
          .hero-soft-bg {
            /* Very light blue gradient for the soft, airy look */
            background: linear-gradient(135deg, ${NEUTRAL_LIGHT_BG}, #E0F7FF, #FFFFFF);
            background-size: 300% 300%;
            animation: light-shift 12s ease infinite;
            position: relative;
            z-index: 1; /* Ensure content is above the subtle pattern */
          }
          @keyframes light-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Stethoscope pattern overlay for texture - a common medical web design element */
          .hero-soft-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 10L10 20L0 10zM50 0L60 10L50 20L40 10zM90 0L100 10L90 20L80 10zM10 40L20 50L10 60L0 50zM50 40L60 50L50 60L40 50zM90 40L100 50L90 60L80 50zM10 80L20 90L10 100L0 90zM50 80L60 90L50 100L40 90zM90 80L100 90L90 100L80 90z' fill='${PRIMARY_COLOR.replace('#', '%23')}' opacity='0.05'/%3E%3C/svg%3E");
            opacity: 0.5;
            z-index: 0;
            pointer-events: none;
          }

          /* --- Glassmorphism Styles (Fluidity & Modern Aesthetic) --- */
          .glass-morphism-modal {
            background: rgba(13, 110, 253, 0.75); /* Primary color with transparency */
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.18);
          }

          .glass-morphism-card {
            background: rgba(255, 255, 255, 0.85); /* Very light background for contrast */
            box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            border-radius: 18px;
            transition: all 0.3s ease-in-out;
          }

          .glass-morphism-card:hover {
              background: rgba(255, 255, 255, 1);
              box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.12);
          }
          
          .stat-card:hover {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px) scale(1.02);
          }
          
          .doctor-image-placeholder {
            border: 8px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>

      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        {/* Helper function to assign ref for IntersectionObserver */}
        <div ref={el => sectionsRef.current.hero = el}><HeroSection openModal={openModal} scrollToSection={scrollToSection} /></div>
        <div ref={el => sectionsRef.current.about = el}><AboutSection /></div>
        <div ref={el => sectionsRef.current.services = el}><ServicesSection /></div>
        <div ref={el => sectionsRef.current.testimonials = el}><TestimonialsSection /></div>
        <div ref={el => sectionsRef.current.contact = el}><ContactSection openModal={openModal} /></div>
      </main>

      <Footer />
      <FloatingButtons openModal={openModal} />
      <AppointmentModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default App;
