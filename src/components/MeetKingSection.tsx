import React from 'react';
import { Car, ShieldCheck, Award, HeartHandshake, Sparkles, PhoneCall, Users } from 'lucide-react';

export const MeetKingSection: React.FC = () => {
  return (
    <section id="meet-king" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-800">
      <div className="bg-gradient-to-br from-[#10121D] via-[#0D0E17] to-[#0A0B12] border border-[#DFB45E]/30 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
        {/* Subtle Decorative Ambient Radial */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFB45E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#DFB45E] font-medium">
              <Award className="w-4 h-4 text-[#DFB45E]" />
              <span>Your Designated Transport & Guide</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
              Meet King — Your Private Host Across the Western Cape
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Every trip booked through <strong className="text-white">Traveling with King</strong> is privately chauffeured and hosted by King himself in his modern, pristine <strong className="text-[#FCE9B0]">7-seater Suzuki</strong>. Forget crowded 40-person tour buses and rigid schedules. With King at the wheel, your itinerary adapts to the weather, ocean tides, and your personal rhythm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#141624]/90 border border-neutral-800/80">
                <Car className="w-5 h-5 text-[#DFB45E] mb-2" />
                <h4 className="text-sm font-semibold text-white mb-1">7-Seater Suzuki Fleet</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Spacious, air-conditioned 7-seater Suzuki, ideal for couples, families, and travel groups of up to 6 passengers plus King.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141624]/90 border border-neutral-800/80">
                <ShieldCheck className="w-5 h-5 text-[#DFB45E] mb-2" />
                <h4 className="text-sm font-semibold text-white mb-1">Safety & Local Guiding</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Licensed professional driver with passenger liability cover and deep insider knowledge of Cape Town’s safest scenic routes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141624]/90 border border-neutral-800/80">
                <Sparkles className="w-5 h-5 text-[#DFB45E] mb-2" />
                <h4 className="text-sm font-semibold text-white mb-1">VIP Flexibility</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Priority stops at wine estates, reserve bookings at beach restaurants like Die Strandloper, and secluded photo lookouts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141624]/90 border border-neutral-800/80">
                <HeartHandshake className="w-5 h-5 text-[#DFB45E] mb-2" />
                <h4 className="text-sm font-semibold text-white mb-1">Transparent R1,500/day</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Flat day-rate covers the vehicle, fuel, driver time, and private guiding for your entire group throughout the excursion.
                </p>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#151726] border border-[#DFB45E]/40 rounded-3xl p-6 sm:p-8 space-y-6 text-center gold-subtle-glow">
              <div className="w-32 h-32 rounded-2xl mx-auto p-1 bg-gradient-to-r from-[#DFB45E] to-[#BA8936] overflow-hidden shadow-lg">
                <img
                  src="/images/suzuki_king_chauffeur_1791729762164.jpg"
                  alt="King's 7-Seater Suzuki Executive Tour Vehicle"
                  className="w-full h-full object-cover object-center rounded-xl filter contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="text-2xl font-serif-luxury text-white">King</h3>
                <p className="text-xs text-[#DFB45E] font-medium tracking-wider uppercase mt-0.5">
                  Private Driver & Local Western Cape Host
                </p>
                <p className="text-xs text-neutral-400 mt-2 italic max-w-xs mx-auto">
                  "I drive a comfortable 7-seater Suzuki with room for you and your travel companions. Sit back, take in our mountains and ocean, and leave the navigation to me."
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs text-neutral-300 text-left">
                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Designated Vehicle:</span>
                  <span className="text-[#FCE9B0] font-medium">7-Seater Suzuki</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Capacity:</span>
                  <span className="text-white font-medium">Up to 6 Guests + Driver</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Direct Contact:</span>
                  <span className="text-white font-mono font-medium">082 400 7223</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Home Base:</span>
                  <span className="text-white font-medium">Cape Town, South Africa</span>
                </div>
              </div>

              <a
                href="https://wa.me/27824007223"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#090A0F]" />
                <span>WhatsApp King (082 400 7223)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
