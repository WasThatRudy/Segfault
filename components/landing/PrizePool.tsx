"use client";

import React, { memo } from "react";
import { Trophy, Medal, Award, Users, Target, Briefcase } from "lucide-react";

interface Prize {
  position: string;
  amount: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const prizes: Prize[] = [
  {
    position: "1st Prize",
    amount: "₹75,000",
    description: "Winner takes it all",
    icon: Trophy,
    iconColor: "text-yellow-400"
  },
  {
    position: "2nd Prize", 
    amount: "₹50,000",
    description: "Runner-up excellence",
    icon: Medal,
    iconColor: "text-gray-300"
  },
  {
    position: "3rd Prize",
    amount: "₹25,000", 
    description: "Third place achievement",
    icon: Award,
    iconColor: "text-amber-600"
  }
];

// Professional title component
const ProfessionalTitle = memo(() => {
  return (
    <div className="relative mb-12 md:mb-20">
      <div className="text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#C83DAD] via-[#DE5FB9] to-[#F481C9] bg-clip-text text-transparent font-corsiva italic">
          Prize Pool
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C83DAD] to-[#F481C9] mx-auto rounded-full"></div>
        <p className="mt-6 text-lg text-white/80 max-w-3xl mx-auto">
          Compete for exciting prizes and recognition at the SegFault. The total prize pool of{" "}
          <span className="font-semibold text-[#F481C9]">₹1,50,000</span> awaits the most innovative and impactful projects.
        </p>
      </div>
    </div>
  );
});
ProfessionalTitle.displayName = "ProfessionalTitle";

// Prize card component
const PrizeCard = memo(({ prize, index }: { prize: Prize; index: number }) => {
  return (
    <div
      className={`relative bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg hover:shadow-xl hover:shadow-[#C83DAD]/30 hover:border-[#C83DAD]/60 hover:bg-white/5 transition-all duration-300 p-8 group ${
        index === 0 ? 'md:z-10' : ''
      }`}
    >
      {/* Glow effect for first place */}
      {index === 0 && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#C83DAD]/20 via-[#DE5FB9]/10 to-[#F481C9]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      )}
      
      {/* Prize icon */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
          <prize.icon className={`w-16 h-16 ${prize.iconColor} group-hover:drop-shadow-lg`} />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#F481C9] transition-colors duration-300">
          {prize.position}
        </h3>
      </div>

      {/* Prize amount */}
      <div className="text-center mb-6">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C83DAD] via-[#DE5FB9] to-[#F481C9] bg-clip-text text-transparent mb-2">
          {prize.amount}
        </div>
        <p className="text-white/80 text-lg">{prize.description}</p>
      </div>

      {/* Decorative element */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-[#C83DAD] rounded-full opacity-60"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#F481C9] rounded-full opacity-60"></div>
    </div>
  );
});
PrizeCard.displayName = "PrizeCard";

// Additional perks section
const AdditionalPerks = memo(() => {
  const perks = [
    { icon: Trophy, text: "Recognition and certificates for all participants", color: "text-yellow-400" },
    { icon: Target, text: "Mentorship sessions with industry experts", color: "text-blue-400" }, 
    { icon: Users, text: "Networking opportunities with professionals", color: "text-green-400" },
    { icon: Briefcase, text: "Potential internship and job opportunities", color: "text-pink-400" }
  ];

  return (
    <div className="mt-16 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        Additional Perks & Benefits
      </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {perks.map((perk, index) => (
           <div
             key={index}
             className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300"
           >
             <perk.icon className={`w-5 h-5 ${perk.color} flex-shrink-0`} />
             <span>{perk.text}</span>
           </div>
         ))}
       </div>
    </div>
  );
});
AdditionalPerks.displayName = "AdditionalPerks";

export function PrizePool() {
  return (
    <section className="py-20 bg-black" id="prizes">
      <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfessionalTitle />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {prizes.map((prize, index) => (
            <PrizeCard key={index} prize={prize} index={index} />
          ))}
        </div>

        <AdditionalPerks />
      </div>
    </section>
  );
}

export default PrizePool;
