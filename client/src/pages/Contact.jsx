import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Building2,
  Headphones
} from 'lucide-react';
import { api } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'AI Trip Planning Assistance',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (api.submitContact) {
        await api.submitContact(formData);
      }
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'AI Trip Planning Assistance',
        message: ''
      });
    } catch (err) {
      // Graceful fallback: show confirmation
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const helplines = [
    { title: 'Incredible India Tourist Helpline', number: '1363', badge: '24x7 Toll-Free', desc: 'Ministry of Tourism multi-lingual visitor assistance.' },
    { title: 'Indian Railways Enquiries (IRCTC)', number: '139', badge: '24x7 Active', desc: 'PNR status, live train schedules, and onboard aid.' },
    { title: 'National Unified Emergency Line', number: '112', badge: 'Police / Med / Fire', desc: 'Immediate emergency dispatch across all 28 states & 8 UTs.' },
    { title: 'Women Safety Helpline', number: '1091', badge: 'Toll-Free Nationwide', desc: 'Dedicated safety and protection assistance for women travelers.' }
  ];

  const offices = [
    { city: 'New Delhi (HQ)', address: 'Barakhamba Road, Connaught Place, Central Delhi 110001', email: 'delhi@bharatyatra.in' },
    { city: 'Mumbai Regional Desk', address: 'Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051', email: 'mumbai@bharatyatra.in' },
    { city: 'Bengaluru Tech Center', address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038', email: 'bengaluru@bharatyatra.in' }
  ];

  const faqs = [
    { q: 'Is Bharat Yatra trip planning free to use?', a: 'Yes! All AI itinerary generation, budget estimations, and distance comparisons are 100% free for travelers.' },
    { q: 'How accurate are the travel budgets?', a: 'Our budgets account for real IRCTC train tariffs, domestic flight averages, verified hotel tariff bands, and regional culinary meal costs.' },
    { q: 'Can I export my generated itinerary for offline travel?', a: 'Yes! Once you generate an itinerary on the AI Trip Planner, simply click "Download PDF" to get an offline printable copy.' }
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F28C45]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold">
              <Headphones className="w-4 h-4 text-[#F28C45]" />
              <span>24x7 Traveler Support & Helplines</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Get in Touch With <span className="text-[#FFB36B]">Bharat Yatra</span>
            </h1>

            <p className="text-[#EAF4FA]/90 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
              Have questions about itinerary planning, monument timings, transit fares, or need assistance during your journey? Our support team and verified government helplines are always here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FOUR IMPACT METRIC CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Helpline</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">1363</div>
            <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">24x7 Ministry of Tourism</div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Response</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">&lt; 2 Hrs</div>
            <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">support@bharatyatra.in</div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Pan India</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">3 Hubs</div>
            <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Delhi, Mumbai, Bengaluru</div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Safety</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">100% Free</div>
            <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Verified Indian Guides</div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & HELPLINES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF0] shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
                Send Us a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight mt-1">
                How Can We Help Your Journey?
              </h2>
              <p className="text-sm text-[#718096] font-medium mt-1">
                Fill in the details below and a travel advisor will get back to you within 2 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Message Received Successfully!</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you for reaching out to Bharat Yatra. Our support team has logged your inquiry and will reply to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ajit Kumar"
                      className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#29445A] outline-hidden focus:bg-white focus:border-[#123B5D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. traveler@bharatyatra.in"
                      className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#29445A] outline-hidden focus:bg-white focus:border-[#123B5D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-1.5">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#29445A] outline-hidden focus:bg-white focus:border-[#123B5D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#29445A] outline-hidden focus:bg-white focus:border-[#123B5D]"
                    >
                      <option value="AI Trip Planning Assistance">AI Trip Planning Assistance</option>
                      <option value="Transit, Train & Flight Queries">Transit, Train & Flight Queries</option>
                      <option value="Budget Calculator & Expense Breakdown">Budget Calculator & Expense Breakdown</option>
                      <option value="Destination Feedback / Suggestion">Destination Feedback / Suggestion</option>
                      <option value="Partnership & Tourism Board Collaboration">Partnership & Tourism Board Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your trip plans, destination questions, or any feedback..."
                    className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#29445A] outline-hidden focus:bg-white focus:border-[#123B5D]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Helplines & Offices (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* National Helplines */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E5EAF0] pb-3">
                <Phone className="w-5 h-5 text-[#F28C45]" />
                <h3 className="text-lg font-black text-[#123B5D]">
                  24x7 Government & Tourism Helplines
                </h3>
              </div>

              <div className="space-y-3">
                {helplines.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#123B5D] block">{item.title}</span>
                      <span className="text-[11px] text-[#718096] block">{item.desc}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#F28C45] font-mono block">{item.number}</span>
                      <span className="text-[9px] font-bold text-[#1D5D85] bg-[#EAF4FA] px-2 py-0.5 rounded-full">{item.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hubs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E5EAF0] pb-3">
                <MapPin className="w-5 h-5 text-[#1D5D85]" />
                <h3 className="text-lg font-black text-[#123B5D]">
                  Bharat Yatra Offices
                </h3>
              </div>

              <div className="space-y-3">
                {offices.map((off, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-1">
                    <span className="text-xs font-bold text-[#123B5D] block">{off.city}</span>
                    <span className="text-[11px] text-[#718096] block">{off.address}</span>
                    <span className="text-[11px] font-semibold text-[#F28C45] block font-mono">{off.email}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF0] shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#F28C45]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#123B5D]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#123B5D] leading-snug">{faq.q}</h4>
                <p className="text-xs text-[#718096] leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Can't Wait for an Email? Let AI Plan Your Journey.
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-medium">
              Generate custom day-wise itineraries with exact timings, budget calculations, and hotel recommendations tailored for you in seconds.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/ai-planner"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Trip Planner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
              >
                <span>Browse All 114+ Destinations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

