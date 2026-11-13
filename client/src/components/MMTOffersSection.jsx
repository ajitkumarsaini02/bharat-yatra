import React, { useState } from 'react';
import { Tag, Check, Copy, Sparkles, Plane, Building2, Train, Car, CreditCard, ShieldCheck } from 'lucide-react';

const OFFERS_DATA = [
  {
    id: 'off-1',
    category: 'flights',
    title: 'Domestic Flight Bonanza',
    code: 'YATRAFLIGHT',
    discount: 'FLAT ₹1,500 OFF',
    description: 'Get flat ₹1,500 instant discount on all domestic flights across India.',
    validTill: 'Limited Period',
    terms: 'Valid on minimum booking of ₹4,000.',
    badge: 'Trending',
    gradient: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'off-2',
    category: 'hotels',
    title: 'Heritage Stays & Resorts',
    code: 'ROYALSTAY',
    discount: 'UP TO 40% OFF',
    description: 'Special discounts on 500+ heritage palaces, royal havelis & luxury beach resorts.',
    validTill: 'Valid till 31 Dec',
    terms: 'Applicable on bookings of 2+ nights.',
    badge: 'Popular',
    gradient: 'from-amber-600 to-orange-700'
  },
  {
    id: 'off-3',
    category: 'trains',
    title: 'Zero Gateway Fee on IRCTC',
    code: 'ZEROCHARGE',
    discount: 'ZERO FEE',
    description: 'Pay zero payment gateway and service charges on all Vande Bharat & Express trains.',
    validTill: 'Festive Special',
    terms: 'Valid on UPI & RuPay card payments.',
    badge: 'IRCTC Verified',
    gradient: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'off-4',
    category: 'cabs',
    title: 'Outstation Highway Cabs',
    code: 'MEGACAB',
    discount: 'FLAT 20% OFF',
    description: 'Doorstep pickup AC sedan or SUV for intercity outstation routes.',
    validTill: 'Weekend Special',
    terms: 'No hidden toll charges, driver allowance included.',
    badge: 'Best Value',
    gradient: 'from-rose-600 to-pink-700'
  },
  {
    id: 'off-5',
    category: 'bank',
    title: 'HDFC / ICICI Bank Card Yatra',
    code: 'BANKYATRA',
    discount: 'EXTRA 15% OFF',
    description: 'Instant discount on credit and debit cards across Flights, Trains and Hotels.',
    validTill: 'Every Tuesday & Friday',
    terms: 'Valid once per card per month.',
    badge: 'Bank Offer',
    gradient: 'from-purple-600 to-violet-800'
  },
  {
    id: 'off-6',
    category: 'flights',
    title: 'Student & Defense Special',
    code: 'SPECIALPASS',
    discount: 'EXTRA 10KG BAGGAGE',
    description: 'Special subsidized fares + additional 10kg checked luggage for students & armed forces.',
    validTill: 'Round the Year',
    terms: 'Valid student ID or defense service card required.',
    badge: 'Special Tariff',
    gradient: 'from-cyan-600 to-blue-700'
  }
];

export default function MMTOffersSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Offers', icon: Tag },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'cabs', label: 'Cabs', icon: Car },
    { id: 'bank', label: 'Bank Deals', icon: CreditCard }
  ];

  const filteredOffers = activeTab === 'all' 
    ? OFFERS_DATA 
    : OFFERS_DATA.filter(o => o.category === activeTab);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FA] text-[#123B5D] text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F28C45]" />
            <span>Exclusive Travel Deals</span>
          </div>
          <h3 className="text-2xl font-black text-[#123B5D] tracking-tight">
            Offers & Promo Codes for You
          </h3>
          <p className="text-xs text-[#718096] mt-0.5">
            Save big on your next journey with verified partner coupons and zero-convenience discounts.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#123B5D] text-white shadow-sm'
                    : 'bg-[#F7F9FC] text-[#718096] hover:bg-[#EAF4FA] hover:text-[#123B5D] border border-[#E5EAF0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-[#E5EAF0] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Accent Gradient Bar */}
              <div className={`h-2 w-full absolute top-0 left-0 bg-gradient-to-r ${offer.gradient}`} />

              <div className="space-y-3 pt-1">
                {/* Badge & Discount */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-[#EAF4FA] text-[#123B5D]">
                    {offer.badge}
                  </span>
                  <span className="text-xs font-black text-[#F28C45]">
                    {offer.discount}
                  </span>
                </div>

                {/* Offer Title & Description */}
                <div>
                  <h4 className="text-base font-extrabold text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </div>

              {/* Coupon Code Block & Copy Button */}
              <div className="mt-5 pt-3 border-t border-dashed border-[#E5EAF0] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#718096] block uppercase font-bold">Use Coupon Code</span>
                    <span className="text-sm font-mono font-black text-[#123B5D] tracking-wider">
                      {offer.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(offer.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#EAF4FA] hover:bg-[#d6e9f5] text-[#123B5D] border border-[#E5EAF0]'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#718096]">
                  <span>{offer.terms}</span>
                  <span className="font-semibold text-[#F28C45]">{offer.validTill}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

