/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, FormEvent } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Home, Key, TrendingUp, Wallet, BarChart3, Shield, Zap, MapPin, Users, Award, Star, X, Mail, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface LeadData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  smsConsent: boolean;
}

interface Testimonial {
  id: string;
  author: string;
  content: string;
  type: string;
  year: number;
  source: 'Zillow' | 'Google';
  rating: number;
}

interface Resource {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  target: string;
}

interface CaseStudy {
  id: string;
  label: string;
  title: string;
  summary: string;
  audience: string;
  location: string;
  image?: string;
  imageLabel: string;
  imageHint: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
  challenge: string;
  solution: string;
  results: string[];
  examples?: Array<{
    title: string;
    detail: string;
  }>;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '6',
    author: 'Renee Hibbard',
    content: 'Being a first time home buyer finding a realtor you connect with is very important. From the first moment I spoke to him we connected, he is honest, caring, respectful and very knowledgeable. David went above and beyond from the first meeting especially through COVID with anxiety being at an all time. Buying a home is a family process with different opinions, wants and needs, at the end of the day David always made everyone see the same thing and come together. David is a young man who gives 110% of himself a self starter and go getter. He enters as realtor and leaves as family.',
    type: '650k Buy / Lynn',
    year: 2024,
    source: 'Google',
    rating: 5
  },
  {
    id: '2',
    author: 'John & Marie Denapoli',
    content: 'We just want to say that David was amazing with the sale of our house! He did everything that he said he would and we plan on reaching out to him when we are ready to buy again. David is a respectable young gentleman with a great personality, we are thankful for all his hard work and wish him the best. Thank you again, John and Marie',
    type: '$1.3M Sell / Arlington',
    year: 2024,
    source: 'Zillow',
    rating: 5
  },
  {
    id: '1',
    author: 'Jill Carson',
    content: 'I would highly recommend David Tran- to help guide you through selling your home. He is so professional and supportive throughout the entire process. I found him to be very detail oriented, driven with an amazing work ethic, and also compassionate and a truly nice person. Being physically disabled it was a daunting task for me to get my house staged the way that I envisioned in order to sell it for too dollar. David listened to my concerns and had a wealth of resources available to do all the heavy work that I was unable to do. You truly do get platinum level customer service from him.',
    type: '$430k Sell / Spencer',
    year: 2024,
    source: 'Zillow',
    rating: 5
  },
  {
    id: '3',
    author: 'Rachel Tully',
    content: 'David was always available anytime I called to answer any questions I had or direct me to a team member that would have the answer. David had lots of patience with us during this stressful process and that put me at ease. His team was very helpful and supportive. Highly recommend!',
    type: '$400k Sell $650k Buy / Haverhill',
    year: 2024,
    source: 'Zillow',
    rating: 5
  },
  {
    id: '4',
    author: 'Alessandro Lomagno',
    content: 'Does what he says and says what he does. Always answers the call to answer any questions. Does not Sugar coat what your asking will give you the right answers wither you want to hear it or not.',
    type: '800k Sell / Metheun',
    year: 2024,
    source: 'Zillow',
    rating: 5
  },
  {
    id: '5',
    author: 'Yixin Fang',
    content: 'David is very professional and always available anytime for any questions I have. He knows what we should do to make an aggressive offer that should be accepted at the right time. His team is supportive and makes everything goes smoothly.',
    type: '1.1m Buy / Lynnfield',
    year: 2024,
    source: 'Zillow',
    rating: 5
  }
];

const RESOURCES: Resource[] = [
  {
    id: 'first-time-buyer',
    title: "Don't Buy A Home Until You Read This",
    subtitle: 'The First Time Buyer Playbook',
    description: 'Know what to expect in the process and avoid costly mistakes.',
    target: 'For Buyers'
  },
  {
    id: 'buy-or-pass',
    title: 'Buy or Pass',
    subtitle: 'Rental Deal Analyzer (Cash Flow, ROI & Cap Rate)',
    description: 'Underwrite the deal before you risk capital.',
    target: 'For Investors'
  },
  {
    id: 'walk-away-number',
    title: 'What Will You Actually Walk Away With?',
    subtitle: 'Instant Net Proceeds Calculator',
    description: 'See what you keep after fees, taxes, and payoff.',
    target: 'For Sellers'
  }
];

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'wakefield-lease-up',
    label: 'Developer Partnership',
    title: 'Leasing a 16-unit Wakefield apartment building before certificates of occupancy.',
    summary: 'For developers, lease-up is about more than filling units. It is about protecting the pro forma, compressing downtime, and turning project delivery into stabilized cash flow as quickly as possible.',
    audience: 'Developer client',
    location: 'Wakefield',
    image: '/images/wakefield-16-unit.jpg',
    imageLabel: '16-Unit Wakefield Apartment Building',
    imageHint: 'Wakefield 16-unit project during construction and pre-delivery lease-up.',
    metrics: [
      { value: '100%', label: 'Leased before CO' },
      { value: '$590K', label: 'Annualized rental income' },
      { value: 'No downtime', label: 'CO to cash flow stabilization' },
      { value: '16 Units', label: 'Wakefield asset' },
    ],
    challenge: 'A 16-unit project approaching delivery could not afford a slow lease-up after certificates of occupancy were issued, especially with the certificate of occupancy delayed multiple times. The developer needed demand created before completion, tenant expectations managed clearly, and a plan that reduced the gap between CO issuance and stabilized cash flow.',
    solution: 'We drove leasing activity during active construction, used renderings and in-progress marketing to communicate the vision, coordinated showings before delivery, and managed tenant expectations around timing so signed demand translated into revenue momentum the moment the project was ready.',
    results: [
      '100% of the building was leased before certificates of occupancy were issued.',
      '$590,000 in annualized rental income was committed before project delivery.',
      'There was effectively no downtime between CO issuance and cash flow stabilization, which protected the lease-up curve and reduced vacancy exposure.',
      'Showings during active construction, rendering-led marketing, and proactive timeline management helped keep tenant expectations aligned while the project moved toward completion.',
    ],
  },
  {
    id: 'flip-acquisition-exit',
    label: 'Investor Partnership',
    title: 'Sourcing flip acquisitions and guiding the exit for profit.',
    summary: 'We support investors across the full cycle, from finding the right opportunity to planning the resale strategy that helps protect margin on the way out.',
    audience: 'Acquisition + resale support',
    location: 'Massachusetts',
    imageLabel: 'Investor Flip Property Gallery',
    imageHint: 'Add before-and-after property photos, sold examples, and deal numbers here.',
    metrics: [
      { value: '60% Avg.', label: 'Cash-on-cash return' },
      { value: 'Buy + Sell', label: 'Full-cycle support' },
      { value: 'Investor', label: 'Client type' },
    ],
    challenge: 'Investors need more than a lead on a property. They need acquisitions worth pursuing, underwriting grounded in resale reality, and an exit plan that protects profitability once the renovation is complete.',
    solution: 'We help source flip opportunities on the acquisition side, evaluate the deal through a resale lens, and then bring the same strategic thinking back at exit so the investor is supported from purchase through sale.',
    results: [
      'Average cash-on-cash return of about 60% across the flip examples being highlighted here.',
      'Clients get a tighter full-cycle process by working with one growth-minded partner on both the acquisition and disposition sides.',
      'The section is ready to show purchase price, renovation investment, sale price, and profit story as soon as you add each property example.',
    ],
    examples: [
      {
        title: 'Example Sold Property 01',
        detail: 'Add photo, town, acquisition price, exit price, and profit summary.',
      },
      {
        title: 'Example Sold Property 02',
        detail: 'Add before-and-after visuals plus the return profile for this flip.',
      },
      {
        title: 'Example Sold Property 03',
        detail: 'Add a quick breakdown of timeline, scope, and final investor outcome.',
      },
    ],
  },
  {
    id: 'roslindale-brrrr',
    label: 'BRRRR Strategy',
    title: 'Creating equity and a 110% cash-on-cash return in Roslindale.',
    summary: 'This was more than a purchase. We helped the client acquire the property, shape the renovation strategy, and optimize the rental plan so the deal performed like a true BRRRR execution from start to refinance.',
    audience: 'Acquisition + renovation + rental optimization',
    location: 'Roslindale',
    imageLabel: 'Roslindale BRRRR Property',
    imageHint: 'Add before-and-after renovation photos here, along with refinance or stabilized rent visuals if you want them featured.',
    metrics: [
      { value: '$540K', label: 'Purchase price' },
      { value: '$300K', label: 'Renovation' },
      { value: '$1.1M', label: 'Post-renovation value' },
      { value: '110%', label: 'Cash-on-cash return' },
    ],
    challenge: 'The client needed more than help finding a property. The opportunity had to work as a BRRRR deal, which meant buying well, renovating intelligently, and building a rental strategy strong enough to support long-term value and a successful cash-out refinance.',
    solution: 'We stayed involved across the full strategy, helping the client buy the asset, think through the renovation with the end value in mind, and optimize the rent plan so the property was positioned for both income and equity creation.',
    results: [
      'Purchased for $540,000 and renovated with roughly $300,000 invested into the project.',
      'The property reached an estimated value of about $1.1M, creating meaningful equity after the repositioning.',
      'After cash-out refinancing, the client was sitting at roughly a 110% cash-on-cash return with equity still in the deal.',
    ],
  },
];

const CLIENTELE_CATEGORIES = [
  {
    id: '01',
    label: 'buyers',
    items: [
      { text: 'first time buyers' },
      { text: 'cash buyers' },
      { text: 'move up homeowners' },
      { text: 'corporate relocation' },
      { text: 'executive relocations' },
      { text: 'national transitions' },
      { text: 'second home buyers' },
      { text: 'multi generational families' },
      { text: 'turnkey buyers' },
    ]
  },
  {
    id: '02',
    label: 'sellers',
    items: [
      { text: 'relocation strategy' },
      { text: 'downsizing homeowners' },
      { text: 'estate and inherited properties' },
      { text: 'landlord exits' },
      { text: 'absentee owners' },
      { text: 'property management clients' },
      { text: 'time sensitive sales' },
    ]
  },
  {
    id: '03',
    label: 'investors & developers',
    items: [
      { text: '1031 exchange clients' },
      { text: '1031 replacement buyers' },
      { text: 'off market acquisitions' },
      { text: 'portfolio investors' },
      { text: 'portfolio acquisitions' },
      { text: 'portfolio liquidations' },
      { text: 'development site buyers' },
      { text: 'ground up developers' },
      { text: 'value add repositioning' },
      { text: 'land and development buyers' },
      { text: 'private investment groups' },
      { text: 'seller financed transactions' },
      { text: 'subject to acquisitions' },
      { text: 'brrrr strategy' },
      { text: 'fix and flip' },
      { text: 'long term rentals' },
      { text: 'first time investors' },
      { text: 'house hackers' },
      { text: 'pre market opportunities' },
    ]
  }
];

const SMS_CONSENT_COPY = `I agree to receive text messages from David Tran and Rental Launch LLC about my inquiry and real estate services. Consent is not a condition of purchase. Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. Message and data rates may apply.`;
const CALENDLY_URL = 'https://calendly.com/rentallaunch/30min';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'intro' | 'landing' | 'form' | 'success'>('intro');
  const [leadData, setLeadData] = useState<LeadData>({ name: '', email: '', phone: '', notes: '', smsConsent: false });
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [resourceFormPhase, setResourceFormPhase] = useState<'idle' | 'form' | 'success'>('idle');
  const [resourceFormData, setResourceFormData] = useState({ firstName: '', email: '', segment: '', subscribe: true });
  const [activeCaseStudyId, setActiveCaseStudyId] = useState(CASE_STUDIES[0].id);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [returnToLeadForm, setReturnToLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Disable page scroll while overlays are active.
  useEffect(() => {
    if (phase === 'intro' || phase === 'form' || legalModal || resourceFormPhase !== 'idle') {
      document.body.style.overflow = 'hidden';
      if (phase === 'intro' || phase === 'form' || resourceFormPhase !== 'idle') window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [phase, legalModal, resourceFormPhase]);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const scrollToWorkSection = () => {
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeCaseStudy =
    CASE_STUDIES.find((study) => study.id === activeCaseStudyId) ?? CASE_STUDIES[0];

  useEffect(() => {
    const width = 800;
    const height = 800;
    const sensitivity = 75;

    if (!canvasRef.current) return;

    const canvas = d3.select(canvasRef.current);
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const projection = d3.geoOrthographic()
      .scale(375)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialRotation = projection.rotate();
    const path = d3.geoPath().projection(projection).context(context);

    let world: any;
    let rotation = 0;

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      world = {
        land: topojson.merge(data, data.objects.countries.geometries),
        topology: data
      };
      render();
    });

    function render() {
      if (!context || !world) return;
      context.clearRect(0, 0, width, height);

      // Globe background (subtle depth)
      context.beginPath();
      context.arc(width / 2, height / 2, projection.scale(), 0, 2 * Math.PI);
      context.fillStyle = '#fafafa';
      context.fill();

      // Graticule (very subtle wireframe)
      context.beginPath();
      context.lineWidth = 0.5;
      context.strokeStyle = '#f0f0f0';
      path(d3.geoGraticule()());
      context.stroke();

      // Land silhouette (faint fill, no outline)
      context.beginPath();
      context.fillStyle = '#f2f2f2';
      path(world.land);
      context.fill();

      // Globe border (minimalist)
      context.beginPath();
      context.arc(width / 2, height / 2, projection.scale(), 0, 2 * Math.PI);
      context.lineWidth = 1;
      context.strokeStyle = '#e5e5e5';
      context.stroke();
    }

    // Animation sequence
    const tl = gsap.timeline({ delay: 0 });

    // Initial state: Small and hidden
    gsap.set(canvasRef.current, { scale: 0.1, opacity: 0 });

    tl.to(canvasRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    });

    const animState = { 
      lon: initialRotation[0], 
      lat: initialRotation[1] 
    };

    // Smooth, single cinematic rotation to Boston / East Coast
    tl.to(animState, {
      lon: initialRotation[0] + 360 + 74, // Target 74W so Boston (71W) is prominently featured
      lat: -40,
      duration: 3.0,
      ease: "power3.inOut",
      onUpdate: () => {
        projection.rotate([animState.lon, animState.lat]);
        render();
      }
    }, 0);
    
    // Zoom canvas gracefully over the same 3 seconds
    tl.to(canvasRef.current, {
      scale: 2.5,
      duration: 3.0,
      ease: "power3.inOut"
    }, 0);

    // Phase 2: Transition to Landing
    tl.add(() => {
      setPhase('landing');
    }, 3.0);

    return () => {
      // Cleanup
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Manual Validation
    const newErrors: { [key: string]: string } = {};
    if (!leadData.name.trim()) newErrors.name = 'Name is required';
    if (!leadData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(leadData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    const phoneDigits = leadData.phone.replace(/\D/g, '');
    if (!leadData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Please enter a 10-digit number';
    }
    if (!leadData.smsConsent) {
      newErrors.smsConsent = 'Consent is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please check the highlighted fields.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const serviceId = 'service_db6tyc6';
    const templateId = 'template_okqunbe';
    const publicKey = 'g44ZXFbPVqFe3FUtC';

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: leadData.name,
          from_email: leadData.email,
          phone: leadData.phone,
          notes: leadData.notes,
          lead_type: 'consultation',
          sms_opt_in: leadData.smsConsent ? 'Yes' : 'No',
          message: `New consultation request from website. Notes: ${leadData.notes.trim() || 'None provided'}. SMS consent: ${leadData.smsConsent ? 'Yes' : 'No'}.`,
          to_name: 'David Tran',
        },
        publicKey
      );
      setPhase('success');
    } catch (error) {
      console.error('EmailJS Error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    }

    setIsSubmitting(false);
  };

  const handleResourceSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Manual Validation
    const newErrors: { [key: string]: string } = {};
    if (!resourceFormData.firstName.trim()) newErrors.firstName = 'Name is required';
    if (!resourceFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(resourceFormData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please check your details.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const serviceId = 'service_db6tyc6';
    const templateId = 'template_okqunbe';
    const publicKey = 'g44ZXFbPVqFe3FUtC';

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: resourceFormData.firstName,
          from_email: resourceFormData.email,
          segment: resourceFormData.segment,
          resource_requested: activeResource?.title,
          message: `Resource request for: ${activeResource?.title}`,
          to_name: 'David Tran',
        },
        publicKey
      );
      setResourceFormPhase('success');
    } catch (error) {
      console.error('EmailJS Error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans selection:bg-black selection:text-white">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 32, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] backdrop-blur-xl border ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-green-500/10 border-green-500/20 text-green-600'
              }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-sm font-medium tracking-wide">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="relative w-full h-screen min-h-[100svh] flex justify-center items-center overflow-hidden">
        {/* Globe Canvas Background */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-[1500ms] ease-in-out ${phase !== 'intro' ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative w-[800px] h-[800px] max-w-[150vw] translate-x-0">
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Landing Page Content */}
        <AnimatePresence mode="wait">
          {(phase === 'intro' || phase === 'landing') && (
            <motion.div
              key="landing-content"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="z-20 w-full h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center absolute inset-0 pointer-events-none"
            >
              <div className="max-w-4xl pt-24 md:pt-0" style={{ pointerEvents: phase === 'landing' ? 'auto' : 'none' }}>
                <div className="space-y-6 md:space-y-8 mb-12 md:mb-16 flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-black/50 md:text-black/55 font-semibold"
                  >
                    Boston Based Growth Partner
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.88] md:leading-[0.87] max-w-4xl"
                  >
                    Make decisions that <br />
                    <span className="italic font-serif">compound</span> over time.
                  </motion.h1>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.5, duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center mb-18 md:mb-24"
                >
                  <motion.button
                    onClick={() => setPhase('form')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group px-6 py-3 bg-black text-white rounded-none text-[10px] font-light tracking-[0.25em] uppercase transition-all shadow-2xl shadow-black/40 overflow-hidden border border-white/10"
                  >
                    <span className="relative z-10 group-hover:text-black transition-colors duration-300">Book a Free Consultation</span>

                    {/* Modern Hover Background Inversion */}
                    <motion.div
                      className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                    />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {phase === 'form' && (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.08, ease: "easeOut" }}
              className="fixed inset-0 z-30 flex items-center justify-center p-3 md:p-6 bg-white/70 backdrop-blur-md"
              onClick={() => {
                setPhase('landing');
              }}
            >
              <div
                className="w-full max-w-5xl h-[calc(100svh-1.5rem)] md:h-[calc(100svh-3rem)] bg-white/94 backdrop-blur-3xl border border-black/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6 md:py-5 border-b border-black/8 bg-white/90">
                  <button
                    type="button"
                    onClick={() => {
                      setPhase('landing');
                    }}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-black/45 hover:text-black transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to home
                  </button>

                  <div className="hidden md:block text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-black/35">Real Estate Growth Partner</div>
                    <div className="mt-1 text-sm text-black/55 font-light">Book your free consultation</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-black/45 hover:text-black transition-colors"
                    >
                      Open in new tab
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setPhase('landing');
                      }}
                      className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center text-black/30 hover:text-black transition-colors"
                      aria-label="Close booking modal"
                    >
                      <X className="w-4 h-4 md:w-[18px] md:h-[18px] stroke-[1.5]" />
                    </button>
                  </div>
                </div>

                <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4 bg-[linear-gradient(180deg,rgba(250,250,250,0.96)_0%,rgba(255,255,255,0.92)_100%)] border-b border-black/6">
                  <div className="max-w-3xl space-y-2">
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                      Choose a time that works for you.
                    </h2>
                    <p className="text-sm md:text-base text-black/55 leading-relaxed font-light">
                      We&apos;ll use this call to learn about your real estate goals and come prepared with the right next steps.
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 p-3 md:p-4 bg-black/[0.02]">
                  <div className="h-full rounded-[1.75rem] border border-black/8 bg-white overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
                    <iframe
                      title="Book a free consultation with Rental Launch"
                      src={CALENDLY_URL}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="z-20 text-center space-y-6 px-6"
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-black/5 flex items-center justify-center border border-black/10">
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl font-light tracking-tight">Message Sent</h2>
                <p className="text-black/50 font-light text-xl max-w-sm mx-auto">
                  Thank you, {leadData.name.split(' ')[0]}. I've received your inquiry and will be in touch shortly.
                </p>
              </div>
              <button
                onClick={() => {
                  setPhase('landing');
                  setLeadData({ name: '', email: '', phone: '', notes: '', smsConsent: false });
                }}
                className="text-black/40 hover:text-black text-sm transition-colors border-b border-black/10 pb-1"
              >
                Explore
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Scroll Indicator */}
        {phase === 'landing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black/30 cursor-pointer group z-30"
            onClick={scrollToWorkSection}
          >
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] group-hover:text-black transition-colors font-bold whitespace-nowrap">Scroll to Explore Our Work</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-black/20 to-transparent"
            />
          </motion.div>
        )}
      </section>

      {/* Content Sections */}
      <div className={`transition-opacity duration-75 ${phase === 'intro' || phase === 'form' ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'}`}>

        {/* Case Studies Section */}
        <section id="case-studies" className="py-24 md:py-32 px-6 bg-white border-t border-black/5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_65%)]" />

          <div className="max-w-6xl mx-auto space-y-14 md:space-y-16 relative z-10">
            <div className="max-w-4xl mx-auto space-y-5 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[11px] md:text-[12px] uppercase tracking-[0.45em] md:tracking-[0.6em] text-black/40"
              >
                Case Studies
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[0.95]"
              >
                We deliver more than just <span className="italic font-serif">results.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-black/45 font-light leading-relaxed md:text-lg max-w-3xl mx-auto"
              >
                We create partnerships that drive growth, protect momentum, and turn strategy into measurable outcomes. Click into each case study to see the challenge, the solution, and the results.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {CASE_STUDIES.map((study, index) => {
                const isActive = study.id === activeCaseStudy.id;

                return (
                  <motion.button
                    key={study.id}
                    type="button"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveCaseStudyId(study.id)}
                    className={`rounded-[32px] border p-7 md:p-8 text-center transition-all duration-300 ${isActive
                      ? 'bg-black text-white border-black shadow-[0_24px_80px_rgba(0,0,0,0.16)]'
                      : 'bg-black/[0.02] text-black border-black/8 hover:border-black/20 hover:bg-white hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)]'
                      }`}
                  >
                    <div className="space-y-5">
                      <div className={`text-[10px] uppercase tracking-[0.35em] font-semibold ${isActive ? 'text-white/60' : 'text-black/35'}`}>
                        {study.label}
                      </div>
                      <h3 className="text-2xl md:text-[2rem] font-light tracking-tight leading-tight">
                        {study.title}
                      </h3>
                      <p className={`font-light leading-7 ${isActive ? 'text-white/78' : 'text-black/55'}`}>
                        {study.summary}
                      </p>
                      <div className="flex flex-wrap justify-center gap-3 pt-2">
                        {study.metrics.map((metric) => (
                          <div
                            key={`${study.id}-${metric.label}`}
                            className={`min-w-[120px] rounded-full px-4 py-2 ${isActive ? 'bg-white/10 text-white' : 'bg-white border border-black/8 text-black'}`}
                          >
                            <div className="text-sm font-semibold tracking-tight">{metric.value}</div>
                            <div className={`text-[9px] uppercase tracking-[0.22em] ${isActive ? 'text-white/60' : 'text-black/40'}`}>
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCaseStudy.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-5xl mx-auto rounded-[40px] border border-black/8 bg-[linear-gradient(180deg,rgba(252,252,252,1)_0%,rgba(246,246,246,0.96)_100%)] p-6 md:p-10 lg:p-12 shadow-[0_24px_90px_rgba(0,0,0,0.06)]"
              >
                <div className="space-y-10 md:space-y-12 text-center">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    <div className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-semibold">
                      {activeCaseStudy.label}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.02]">
                      {activeCaseStudy.title}
                    </h3>
                    <p className="text-black/50 font-light leading-relaxed md:text-lg">
                      {activeCaseStudy.audience} | {activeCaseStudy.location}
                    </p>
                  </div>

                  <div className="max-w-4xl mx-auto">
                    {activeCaseStudy.image ? (
                      <img
                        src={activeCaseStudy.image}
                        alt={activeCaseStudy.imageLabel}
                        className="w-full aspect-[16/9] object-cover rounded-[32px] border border-black/8"
                      />
                    ) : (
                      <div className="w-full aspect-[16/9] rounded-[32px] border border-dashed border-black/15 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),rgba(255,255,255,1)_72%)] flex flex-col items-center justify-center px-6 text-center">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-semibold">
                          Photo Placeholder
                        </div>
                        <div className="mt-3 text-2xl md:text-3xl font-light tracking-tight">
                          {activeCaseStudy.imageLabel}
                        </div>
                        <p className="mt-3 max-w-xl text-black/45 font-light leading-relaxed">
                          {activeCaseStudy.imageHint}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {activeCaseStudy.metrics.map((metric) => (
                      <div
                        key={`${activeCaseStudy.id}-detail-${metric.label}`}
                        className="min-w-[140px] rounded-[24px] border border-black/8 bg-white px-5 py-4 text-center"
                      >
                        <div className="text-xl md:text-2xl font-light tracking-tight">{metric.value}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-black/40 font-semibold">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    <div className="rounded-[28px] border border-black/8 bg-white p-6 md:p-7 text-center space-y-4">
                      <div className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-semibold">
                        Challenge
                      </div>
                      <p className="text-black/60 font-light leading-7">
                        {activeCaseStudy.challenge}
                      </p>
                    </div>

                    <div className="rounded-[28px] border border-black/8 bg-white p-6 md:p-7 text-center space-y-4">
                      <div className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-semibold">
                        Solution
                      </div>
                      <p className="text-black/60 font-light leading-7">
                        {activeCaseStudy.solution}
                      </p>
                    </div>

                    <div className="rounded-[28px] border border-black/8 bg-white p-6 md:p-7 text-center space-y-4">
                      <div className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-semibold">
                        Results
                      </div>
                      <div className="space-y-3">
                        {activeCaseStudy.results.map((result) => (
                          <p key={result} className="text-black/60 font-light leading-7">
                            {result}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {activeCaseStudy.examples && activeCaseStudy.examples.length > 0 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-semibold">
                          Sold Property Examples
                        </div>
                        <p className="text-black/45 font-light max-w-2xl mx-auto leading-relaxed">
                          This row is ready for the actual flips you want to feature with address, photos, purchase and exit numbers, and the profit story for each deal.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeCaseStudy.examples.map((example) => (
                          <div
                            key={example.title}
                            className="rounded-[24px] border border-dashed border-black/15 bg-white/80 p-5 md:p-6 text-center space-y-3"
                          >
                            <div className="text-sm uppercase tracking-[0.25em] text-black/35 font-semibold">
                              {example.title}
                            </div>
                            <p className="text-black/50 font-light leading-6">
                              {example.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Retail Clients Section */}
        <section className="py-20 md:py-24 px-6 bg-white border-t border-black/5 relative overflow-hidden">
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-12 text-center">
            <div className="space-y-4 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[11px] md:text-[12px] uppercase tracking-[0.45em] md:tracking-[0.6em] text-black/40"
              >
                Retail Clients
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[0.95]"
              >
                We work with everyday <span className="italic font-serif">clients, too.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-black/50 font-light leading-relaxed md:text-lg"
              >
                Alongside developers and investors, we help buyers, sellers, landlords, and homeowners make confident real estate decisions with clear strategy, strong execution, and hands-on support.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[28px] border border-black/8 bg-black/[0.02] p-6 md:p-7 text-center space-y-4"
              >
                <div className="mx-auto h-12 w-12 rounded-2xl bg-white border border-black/8 flex items-center justify-center">
                  <Home className="w-5 h-5 text-black/75" />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-black/35 font-semibold">Buyers</div>
                  <p className="text-black/55 font-light leading-7">
                    Guidance for first-time buyers, move-up buyers, and families who want a smarter acquisition strategy.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="rounded-[28px] border border-black/8 bg-black/[0.02] p-6 md:p-7 text-center space-y-4"
              >
                <div className="mx-auto h-12 w-12 rounded-2xl bg-white border border-black/8 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-black/75" />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-black/35 font-semibold">Sellers</div>
                  <p className="text-black/55 font-light leading-7">
                    Pricing, positioning, and negotiation support designed to protect value and create a smoother sale.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
                className="rounded-[28px] border border-black/8 bg-black/[0.02] p-6 md:p-7 text-center space-y-4"
              >
                <div className="mx-auto h-12 w-12 rounded-2xl bg-white border border-black/8 flex items-center justify-center">
                  <Users className="w-5 h-5 text-black/75" />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-black/35 font-semibold">Landlords & Homeowners</div>
                  <p className="text-black/55 font-light leading-7">
                    Practical support for leasing, management decisions, and real estate planning across every stage of ownership.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="pt-20 md:pt-28 pb-16 md:pb-20 px-5 md:px-6 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            <div className="space-y-3 md:space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[11px] md:text-[12px] uppercase tracking-[0.45em] md:tracking-[0.6em] text-black/40"
              >
                Client Experiences
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[0.95]"
              >
                What clients <span className="italic font-serif">are saying.</span>
              </motion.h2>
            </div>

            <div className="relative min-h-[360px] md:min-h-[400px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={TESTIMONIALS[testimonialIndex].id}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full p-8 sm:p-10 md:p-16 rounded-[32px] md:rounded-[40px] bg-black/[0.02] border border-black/5 flex flex-col justify-between h-full relative z-10"
                >
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1">
                        {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-black text-black" />
                        ))}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-black/30 font-medium bg-black/5 px-4 py-1.5 rounded-full">
                        {TESTIMONIALS[testimonialIndex].source}
                      </div>
                    </div>

                    <p className="text-[15px] sm:text-base md:text-lg font-light leading-8 md:leading-relaxed text-black/80 italic">
                      "{TESTIMONIALS[testimonialIndex].content}"
                    </p>
                  </div>

                  <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-black/5 flex justify-between items-end">
                    <div>
                      <div className="font-medium text-xl">{TESTIMONIALS[testimonialIndex].author}</div>
                      <div className="text-sm text-black/40 flex flex-wrap items-center gap-2 mt-2">
                        <span className="bg-black/5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-black/60">
                          {TESTIMONIALS[testimonialIndex].type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute -bottom-16 md:-bottom-18 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
                >
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </motion.button>
                <div className="text-[10px] uppercase tracking-widest text-black/20 font-medium w-16 text-center">
                  {testimonialIndex + 1} / {TESTIMONIALS.length}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-12 text-center"
            >
              <p className="text-black/30 text-[10px] uppercase tracking-[0.3em] font-medium">
                Verified reviews from Zillow & Google Business
              </p>
            </motion.div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-32 px-6 bg-white border-t border-black/5 relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-black/[0.01] -skew-x-12 translate-x-1/2" />

          <div className="max-w-5xl mx-auto space-y-20 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-[12px] uppercase tracking-[0.6em] text-black/40"
                >
                  Start here.
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-6xl font-light tracking-tight leading-tight"
                >
                  Resources I use with clients <br />
                  <span className="italic font-serif">to navigate the market with clarity.</span>
                </motion.h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RESOURCES.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group relative p-10 rounded-[40px] border border-black/5 bg-black/[0.01] hover:bg-white hover:border-black/10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 flex flex-col justify-between min-h-[320px]"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500"
                      >
                        {index === 0 ? <Home className="w-5 h-5" /> : index === 1 ? <BarChart3 className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                      </motion.div>
                      <span className="text-[10px] uppercase tracking-widest text-black/30 font-bold">{resource.target}</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-500">{resource.title}</h3>
                      <div className="text-xs font-bold text-black/80 uppercase tracking-widest">{resource.subtitle}</div>
                      <p className="text-black/50 font-light leading-relaxed">{resource.description}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveResource(resource);
                      setResourceFormPhase('form');
                    }}
                    className="mt-8 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 group-hover:text-black transition-colors"
                  >
                    Get it
                    <div className="w-8 h-px bg-black/10 group-hover:w-12 group-hover:bg-black transition-all duration-500" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Clientele Lineup Section */}
        <section id="clientele" className="py-40 px-6 bg-white border-t border-black/5 relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="max-w-7xl mx-auto space-y-32 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-[12px] uppercase tracking-[0.6em] text-black/40"
                >
                  Track Record
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-light tracking-tight leading-tight"
                >
                  500+ clients <br />
                  <span className="italic font-serif">served.</span>
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="max-w-xs text-black/40 font-light leading-relaxed"
              >
                A diverse portfolio of success across buyers, sellers, and strategic investors in <span className="font-bold">Massachusetts</span>.
              </motion.p>
            </div>

            <div className="space-y-20">
              {CLIENTELE_CATEGORIES.map((category, catIdx) => (
                <div key={category.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4"
                    >
                      <span className="text-[10px] font-mono text-black/20">{category.id}</span>
                      <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-black/40">{category.label}</span>
                    </motion.div>
                  </div>
                  <div className="lg:col-span-9">
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05
                          }
                        }
                      }}
                      className="group/lineup flex flex-wrap items-baseline gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6"
                    >
                      {category.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 }
                          }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                          className="flex items-center gap-4 group/item"
                        >
                          <span
                            className={`
                              cursor-default transition-all duration-300 
                              text-black/20 group-hover/lineup:opacity-30
                              hover:!opacity-100 hover:text-black
                              relative font-display lowercase tracking-tight
                              text-xl md:text-2xl font-medium
                            `}
                          >
                            {item.text}
                            <motion.div
                              className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-black origin-left scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300"
                            />
                          </span>
                          {idx < category.items.length - 1 && (
                            <div className="w-1 h-1 rounded-full bg-black/5 group-hover/lineup:opacity-10 transition-opacity" />
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Modal */}
        <AnimatePresence>
          {resourceFormPhase !== 'idle' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-4 md:px-6 md:py-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setResourceFormPhase('idle');
                  setActiveResource(null);
                }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[calc(100svh-1.5rem)] md:max-h-[calc(100svh-3rem)] flex flex-col"
              >
                <button
                  onClick={() => {
                    setResourceFormPhase('idle');
                    setActiveResource(null);
                  }}
                  className="absolute top-4 right-4 md:top-5 md:right-5 h-8 w-8 md:h-9 md:w-9 flex items-center justify-center text-black/30 hover:text-black transition-colors z-50"
                >
                  <X className="w-4 h-4 md:w-[18px] md:h-[18px] stroke-[1.5]" />
                </button>

                <AnimatePresence mode="wait">
                  {resourceFormPhase === 'form' ? (
                    <motion.div
                      key="resource-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5 md:space-y-6 pt-4 md:pt-5"
                    >
                      <div className="space-y-1.5">
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight">Where should I send it?</h2>
                      </div>

                      <form onSubmit={handleResourceSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold ml-1 flex justify-between">
                              First Name
                              {errors.firstName && <span className="text-red-500 lowercase tracking-normal font-normal">*{errors.firstName}</span>}
                            </label>
                            <input
                              type="text"
                              placeholder="Your name"
                              value={resourceFormData.firstName}
                              onChange={(e) => {
                                setResourceFormData({ ...resourceFormData, firstName: e.target.value });
                                if (errors.firstName) setErrors(prev => { const n = { ...prev }; delete n.firstName; return n; });
                              }}
                              className={`w-full bg-black/5 border transition-all rounded-xl px-4 py-3 md:py-3.5 focus:outline-none font-light text-base md:text-lg ${errors.firstName ? 'border-red-500/30 bg-red-500/[0.02] focus:border-red-500/50' : 'border-black/10 focus:border-black/30'
                                }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold ml-1 flex justify-between">
                              Email Address
                              {errors.email && <span className="text-red-500 lowercase tracking-normal font-normal">*{errors.email}</span>}
                            </label>
                            <input
                              type="email"
                              placeholder="email@example.com"
                              value={resourceFormData.email}
                              onChange={(e) => {
                                setResourceFormData({ ...resourceFormData, email: e.target.value });
                                if (errors.email) setErrors(prev => { const n = { ...prev }; delete n.email; return n; });
                              }}
                              className={`w-full bg-black/5 border transition-all rounded-xl px-4 py-3 md:py-3.5 focus:outline-none font-light text-base md:text-lg ${errors.email ? 'border-red-500/30 bg-red-500/[0.02] focus:border-red-500/50' : 'border-black/10 focus:border-black/30'
                                }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-[12px] md:text-sm text-black/50 font-light leading-5 select-none">
                            By clicking "Get it", you'll receive this resource and occasional opportunities.
                          </span>
                        </div>

                        <div className="space-y-3 pt-1">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white font-medium py-4 md:py-[1.125rem] rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 group text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Sending...' : 'Get it'}
                          </button>
                          <p className="text-center text-[10px] uppercase tracking-widest text-black/20">
                            No spam. Unsubscribe anytime.
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="resource-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center space-y-6 pt-10 md:pt-12 pb-2"
                    >
                      <div className="flex justify-center">
                        <div className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-black/5 flex items-center justify-center border border-black/10">
                          <Mail className="w-8 h-8 md:w-9 md:h-9 text-black" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight">Check your inbox.</h2>
                        <p className="text-black/50 font-light text-base md:text-lg">
                          {activeResource?.id === 'first-time-buyer' && "One step closer to your new home"}
                          {activeResource?.id === 'buy-or-pass' && "One step closer to your next investment"}
                          {activeResource?.id === 'walk-away-number' && "One step closer to selling"}
                          {!['first-time-buyer', 'buy-or-pass', 'walk-away-number'].includes(activeResource?.id || '') && "Your resource is on the way."}
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setResourceFormPhase('idle');
                            setActiveResource(null);
                          }}
                          className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase border-b border-black/10 pb-1 hover:border-black transition-all"
                        >
                          Go back
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Legal Modal */}
        <AnimatePresence>
          {legalModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/80 backdrop-blur-xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-black/5 shadow-2xl rounded-[40px] w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
              >
                <div className="p-8 border-b border-black/5 flex justify-between items-center">
                  <h2 className="text-2xl font-light tracking-tight uppercase">
                    {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                  </h2>
                  <button
                    onClick={() => {
                      setLegalModal(null);
                      if (returnToLeadForm) {
                        setPhase('form');
                      }
                      setReturnToLeadForm(false);
                    }}
                    className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center text-black/30 hover:text-black transition-colors"
                  >
                    <X className="w-4 h-4 md:w-[18px] md:h-[18px] stroke-[1.5]" />
                  </button>
                </div>
                <div className="p-8 overflow-y-auto font-light text-black/60 leading-relaxed space-y-6">
                  {legalModal === 'privacy' ? (
                    <>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">Website Operator</h3>
                        <p>This website is operated by Rental Launch LLC. References to &quot;we,&quot; &quot;our,&quot; and &quot;us&quot; on this website refer to Rental Launch LLC and its affiliated real estate services.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">1. Information Collection</h3>
                        <p>We collect information you provide directly to us, such as when you request a resource or fill out a contact form. This may include your name, email address, and phone number.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">2. Use of Information</h3>
                        <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you about real estate opportunities, and to send you requested resources. If you opt in, we may also contact you by call or text message about real estate services.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">3. Data Sharing</h3>
                        <p>We do not sell or rent your personal information to third parties. We may share information with service providers who perform services on our behalf, subject to confidentiality agreements.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">4. Your Choices</h3>
                        <p>You may opt out of receiving promotional communications from us by following the instructions in those communications or by contacting us directly. You may opt out of text messages at any time by replying STOP, and reply HELP for additional assistance.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">5. Mobile Messaging</h3>
                        <p>Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. Message and data rates may apply. Message frequency may vary based on your interaction with our team and services.</p>
                      </section>
                    </>
                  ) : (
                    <>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">Website Operator</h3>
                        <p>This website is operated by Rental Launch LLC. References to &quot;we,&quot; &quot;our,&quot; and &quot;us&quot; in these Terms of Service refer to Rental Launch LLC and its affiliated real estate services.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">1. Acceptance of Terms</h3>
                        <p>By accessing this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">2. Use License</h3>
                        <p>Permission is granted to temporarily view the materials on this website for personal, non-commercial transitory viewing only.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">3. Disclaimer</h3>
                        <p>The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                      </section>
                      <section className="space-y-3">
                        <h3 className="text-black font-medium uppercase text-xs tracking-widest">4. Limitations</h3>
                        <p>In no event shall Rental Launch LLC or its affiliates be liable for any damages arising out of the use or inability to use the materials on this website.</p>
                      </section>
                    </>
                  )}
                </div>
                <div className="p-8 border-t border-black/5 bg-black/[0.01] text-[10px] uppercase tracking-widest text-black/30 text-center">
                  Last Updated: March 2026
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-black/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xl font-light tracking-[0.2em] uppercase">David Tran</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">Operated by Rental Launch LLC</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-black/30">© 2026 All Rights Reserved</div>
            </div>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-black/40">
              <button onClick={() => setLegalModal('privacy')} className="hover:text-black transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => setLegalModal('terms')} className="hover:text-black transition-colors cursor-pointer">Terms of Service</button>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
