// src/pages/LandingPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth } from "../auth/firebase";
import { fmt } from "../utils/formatters";

// ── Static data ────────────────────────────────────────────────────────────
const STATS = [
  { value: "50K+", label: "Active Members" },
  { value: "98%", label: "Authenticity Rate" },
  { value: "200+", label: "Curated Products" },
  { value: "4.9★", label: "Avg. Rating" },
];

const CATEGORIES = [
  {
    title: "Home Gym Hardware",
    desc: "Professional-grade equipment, curated for your space.",
    tag: "EQUIPMENT",
    bg: "bg-stone-900", text: "text-white", sub: "text-stone-400",
    btn: "border-stone-600 text-stone-300 hover:bg-stone-800",
    filter: "Equipment",
  },
  {
    title: "Certified Nutrition",
    desc: "100% authenticated supplements, sourced direct.",
    tag: "NUTRITION",
    bg: "bg-stone-100", text: "text-stone-900", sub: "text-stone-500",
    btn: "border-stone-300 text-stone-700 hover:bg-stone-200",
    filter: "Nutrition",
  },
  {
    title: "Digital Coaching",
    desc: "Personalized plans built around your goals.",
    tag: "PROGRAMS",
    bg: "bg-stone-200", text: "text-stone-900", sub: "text-stone-500",
    btn: "border-stone-400 text-stone-700 hover:bg-stone-300",
    filter: "Programs",
  },
];

const PROGRAMS = [
  { name: "Weight Loss", duration: "12 Weeks", desc: "Caloric-deficit nutrition + cardio-focused programming", level: "Beginner to Intermediate" },
  { name: "Muscle Building", duration: "16 Weeks", desc: "Progressive overload training + protein-optimized meal plans", level: "Intermediate to Advanced" },
  { name: "Mobility & Recovery", duration: "8 Weeks", desc: "Flexibility-first programming, ideal for desk workers", level: "All Levels" },
];

const TESTIMONIALS = [
  { quote: "FitMart replaced three different subscriptions for me. Equipment, nutrition and coaching — finally in one place.", name: "Arjun M.", role: "Software Engineer, Powai" },
  { quote: "The authenticity guarantee is real. I've never doubted a single supplement I've ordered here.", name: "Priya S.", role: "Fitness Coach, Bandra" },
  { quote: "Set up a complete home gym through FitMart. The setup guide that came with it was genuinely useful.", name: "Rohan K.", role: "Architect, Andheri" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visible, setVisible] = useState(false);

  const categoriesRef = useRef(null);
  const programsRef = useRef(null);
  const aboutRef = useRef(null);

  // custom titles for landing page
  useEffect(() => {
    document.title = "FitMart - Fitness & Nutrition Store";
  }, []);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const navOpaque = scrollY > 60;

  return (
    <div className="min-h-screen bg-white font-['DM_Sans',sans-serif] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        .fade-up { opacity:0; transform:translateY(28px); transition:opacity .7s ease,transform .7s ease; }
        .fade-up.visible { opacity:1; transform:translateY(0); }
        .delay-1 { transition-delay:.1s; }
        .delay-2 { transition-delay:.25s; }
        .delay-3 { transition-delay:.4s; }
        .delay-4 { transition-delay:.55s; }
        .hero-line { overflow:hidden; }
        .slide-up { display:inline-block; transform:translateY(100%); transition:transform .8s cubic-bezier(.16,1,.3,1); }
        .slide-up.visible { transform:translateY(0); }
        .cat-card { transition:transform .35s ease,box-shadow .35s ease; }
        .cat-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,.1); }
        .testimonial-enter { animation:tFadeIn .6s ease forwards; }
        @keyframes tFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      {/* No links, no onSearchToggle, no onCartOpen — pure landing variant */}
      <Navbar
        variant="landing"
        navOpaque={navOpaque}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center pt-16 bg-stone-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 relative z-10">
          <div className="max-w-4xl">
            <div className={`fade-up ${visible ? "visible" : ""} delay-1 mb-6`}>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase
                               text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
                Mumbai's Fitness Marketplace
              </span>
            </div>

            <h1 className="font-['DM_Serif_Display'] text-5xl md:text-7xl lg:text-8xl text-stone-900
                           leading-[1.05] mb-6 tracking-tight">
              <div className="hero-line">
                <span className={`slide-up ${visible ? "visible" : ""} delay-1`}>
                  Everything fitness.
                </span>
              </div>
              <div className="hero-line">
                <span className={`slide-up ${visible ? "visible" : ""} delay-2`}>
                  Nothing <em className="not-italic text-stone-400">extra.</em>
                </span>
              </div>
            </h1>

            <p className={`fade-up ${visible ? "visible" : ""} delay-3 text-lg text-stone-500
                           max-w-xl leading-relaxed mb-10`}>
              Curated equipment, verified nutrition, and digital coaching — built for people
              who take their health seriously.
            </p>

            <div className={`fade-up ${visible ? "visible" : ""} delay-4 flex flex-wrap gap-3`}>
              <button
                onClick={() => navigate(auth.currentUser ? "/home" : "/auth")}
                className="bg-stone-900 text-white text-sm px-8 py-3.5 rounded-full
                           hover:bg-stone-700 transition-colors"
              >
                Start Shopping
              </button>
              <button
                onClick={() => categoriesRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-stone-700 px-8 py-3.5 rounded-full border border-stone-300
                           hover:bg-stone-100 transition-colors"
              >
                Explore Categories
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="font-['DM_Serif_Display'] text-2xl md:text-3xl text-stone-900">{s.value}</div>
                <div className="text-xs text-stone-500 mt-0.5 tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <section ref={categoriesRef} className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">What We Offer</p>
            <h2 className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-stone-900">
              Shop by category
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {CATEGORIES.map((c, i) => (
              <div
                key={i}
                className={`cat-card rounded-2xl p-8 md:p-10 flex flex-col justify-between
                            min-h-72 cursor-pointer ${c.bg}`}
                onClick={() => navigate("/home", { state: { category: c.filter } })}
              >
                <div>
                  <span className={`text-[10px] tracking-[0.2em] uppercase font-medium ${c.sub} mb-4 block`}>
                    {c.tag}
                  </span>
                  <h3 className={`font-['DM_Serif_Display'] text-2xl md:text-3xl ${c.text} leading-snug mb-3`}>
                    {c.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${c.sub}`}>{c.desc}</p>
                </div>
                <button
                  className={`mt-8 self-start text-xs border px-5 py-2.5 rounded-full
                              transition-colors ${c.btn}`}
                  onClick={e => { e.stopPropagation(); navigate("/home", { state: { category: c.filter } }); }}
                >
                  Browse →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ────────────────────────────────────────────────────── */}
      <section ref={programsRef} className="py-24 bg-stone-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">Digital Coaching</p>
            <h2 className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-stone-900">Our programs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAMS.map((program, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-stone-200 hover:shadow-lg
                           transition-all cursor-pointer"
                onClick={() => navigate(auth.currentUser ? "/home" : "/auth")}
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3 block">
                  {program.level}
                </span>
                <h3 className="font-['DM_Serif_Display'] text-2xl text-stone-900 mb-2">{program.name}</h3>
                <p className="text-sm text-stone-500 mb-4">{program.duration}</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">{program.desc}</p>
                <button className="text-xs border border-stone-300 text-stone-700 px-5 py-2.5
                                   rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900
                                   transition-all">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE STRIP ───────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: "✓", title: "100% Authenticity", desc: "Every supplement sourced direct from manufacturer with QR batch verification." },
              { icon: "⚡︎", title: "Mumbai-Speed Delivery", desc: "24-hour fulfillment within MMR. Real-time tracking via WhatsApp and email." },
              { icon: "◎", title: "Fitness-as-a-Service", desc: "Buy a product, unlock a plan. Equipment and coaching aren't separate here." },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-stone-400 text-lg">{f.icon}</span>
                <h3 className="font-['DM_Serif_Display'] text-xl">{f.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────────────── */}
      <section ref={aboutRef} className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">About FitMart</p>
            <h2 className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-stone-900 mb-8">
              Built for Mumbai's fitness community
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-12">
              We started FitMart because we believe fitness shouldn't be complicated.
              By bringing together equipment, nutrition, and coaching under one roof,
              we've created Mumbai's first integrated fitness ecosystem.
            </p>
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="font-['DM_Serif_Display'] text-3xl text-stone-900">2024</div>
                <p className="text-xs text-stone-500">Founded</p>
              </div>
              <div className="text-center">
                <div className="font-['DM_Serif_Display'] text-3xl text-stone-900">1000+</div>
                <p className="text-xs text-stone-500">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-10">From the Community</p>
            <div key={activeTestimonial} className="testimonial-enter">
              <blockquote className="font-['DM_Serif_Display'] text-2xl md:text-3xl text-stone-800
                                     leading-relaxed mb-8">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </blockquote>
              <p className="text-sm font-medium text-stone-900">{TESTIMONIALS[activeTestimonial].name}</p>
              <p className="text-xs text-stone-400 mt-1">{TESTIMONIALS[activeTestimonial].role}</p>
            </div>
            <div className="flex justify-center gap-2 mt-10">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeTestimonial ? "bg-stone-900 w-5" : "bg-stone-200 w-1.5"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS TEASER ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">Membership Plans</p>
            <h2 className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-stone-900">Choose your level</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Freemium", price: 0, perks: ["Store access", "Public workout blogs", "Product reviews"], cta: "Start Free" },
              { name: "Pro", price: 499, perks: ["Personalized nutrition plans", "5% discount on all products", "Priority support"], cta: "Go Pro", highlight: true },
              { name: "Elite", price: 1499, perks: ["1-on-1 digital coaching", "Early access to drops", "Biometric data sync"], cta: "Go Elite" },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 flex flex-col gap-5 cursor-pointer transition-all hover:shadow-lg ${plan.highlight
                  ? "bg-stone-900 text-white hover:bg-stone-800"
                  : "bg-white border border-stone-200 hover:border-stone-300"
                  }`}
                onClick={() => navigate(auth.currentUser ? "/home" : "/auth")}
              >
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-400">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className={`font-['DM_Serif_Display'] text-4xl ${plan.highlight ? "text-white" : "text-stone-900"}`}>
                      {fmt(plan.price)}
                    </span>
                    {plan.price !== 0 && (
                      <span className="text-xs text-stone-400">/mo</span>
                    )}
                  </div>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.perks.map((p, j) => (
                    <li key={j} className={`text-sm flex items-start gap-2 ${plan.highlight ? "text-stone-300" : "text-stone-600"}`}>
                      <span className="mt-0.5 text-stone-400">─</span>{p}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={e => { e.stopPropagation(); navigate(auth.currentUser ? "/home" : "/auth"); }}
                  className={`text-sm py-2.5 rounded-full transition-colors ${plan.highlight
                    ? "bg-white text-stone-900 hover:bg-stone-100"
                    : "border border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-32 bg-stone-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-5">Get Started Today</p>
          <h2 className="font-['DM_Serif_Display'] text-4xl md:text-6xl text-white max-w-2xl mx-auto leading-tight mb-8">
            Your fitness journey starts with one decision.
          </h2>
          <button
            onClick={() => navigate(auth.currentUser ? "/home" : "/auth")}
            className="bg-white text-stone-900 text-sm px-10 py-4 rounded-full hover:bg-stone-100 transition-colors"
          >
            Create your account →
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row
                        justify-between items-center gap-4">
          <span className="font-['DM_Serif_Display'] text-white text-lg">FitMart</span>
          <p className="text-xs text-stone-600">© 2026 FitMart. Built at VESIT, Mumbai.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map(l => (
              <button
                key={l}
                className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
                onClick={() => l === "Contact" && aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}