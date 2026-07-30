"use client";

import React, { useEffect, useState } from "react";

export default function RegistrationClosed() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#C83DAD] mb-6">
          Registration Closed
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C83DAD] to-[#E055C3] mx-auto mb-8"></div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 sm:p-12 mb-8">
        <p className="text-xl sm:text-2xl text-white/90 mb-6 leading-relaxed">
          Thank you for your interest in the <span className="font-semibold text-[#C83DAD]">SegFault Hackathon</span>!
        </p>
        <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
          Registration for this event has now closed. We appreciate all the applications we received.
        </p>
        
        <div className="bg-[#C83DAD]/20 border border-[#C83DAD]/30 rounded-xl p-6 mb-8">
          <p className="text-base text-[#C83DAD] font-semibold mb-2">
            Redirecting to Home Page
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {countdown} seconds
          </p>
        </div>
        
        <p className="text-sm text-white/60">
          You will be automatically redirected to the home page, or you can click the &quot;Back to Home&quot; button above.
        </p>
      </div>
    </div>
  );
}
